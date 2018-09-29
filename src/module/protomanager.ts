import * as ProtoBuf from 'protobufjs';
import { HOKClient } from './hokclient';
import { HOKServer } from './hokserver';
import { myLogger } from '../common/mylogger';

export class ProtoManager {
    private _mapRequestMessage: Map<string, Function>;    
    private _mapType2Proto: Map<string, ProtoBuf.Type>;
    private _mapID2Types: Map<number, Array<string>>;
    private _mapType2ID: Map<string, number>;

    private static _instance: ProtoManager;
    static getInstance(): ProtoManager {
        if (!this._instance) {
            this._instance = new ProtoManager();
        }
        return this._instance;
    }

    private constructor() {
        this._mapType2Proto = new Map<string, ProtoBuf.Type>();
        this._mapID2Types = new Map<number, Array<string>>();
        this._mapType2ID = new Map<string, number>();
        this._mapRequestMessage = new Map<string, Function>();
    }

    async initProtoBuf(pbFile:string):Promise<ProtoBuf.Root> {
        return await ProtoBuf.load(pbFile);
    }    

    async initialize(protoFiles: Array<string>) {
        if(!protoFiles || protoFiles.length==0) {
            return;
        }
        const roots = await protoFiles.map(async file =>{
            const root = this.initProtoBuf(`./proto/${file}.proto`);
            return root;
        });
        let fileId = 0;
        for (const root of roots) {
           this.onLoadFile(await root, protoFiles[fileId++]);
        }
        myLogger.log('protobuf files initialize finished ...', protoFiles);
    }

    async handlerRequests(handlerFiles: Array<string>) {
        await handlerFiles.map(async className =>{
            let xProtocol = `./proto/${className.toLowerCase()}`;
            let protoRequests = await import(xProtocol);
            await ProtoManager.getInstance().suckRequestFuncion(protoRequests[className]);
            return xProtocol;
        });
    }

    private suckRequestFuncion<T>(c : {new(): T}): void {
        let instance = new c;
        for (let funcName of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
            if (funcName.indexOf('on$$')==0) {
                let messageName = funcName.replace('on$$', '');
                if (this._mapRequestMessage.get(messageName)) {
                    myLogger.error(`${messageName} 已经在不同的模块存在了`);
                }
                this._mapRequestMessage.set(messageName, (message, client): number => {
                    return instance[funcName](message, client);
                });
            }
        }
    }

    private getMessage(messageType: string): ProtoBuf.Type {
        return <ProtoBuf.Type>this._mapType2Proto.get(messageType);
    }

    getMessageTypeById(messageId: number) {
        let protoTypes = this._mapID2Types.get(messageId);
        if (protoTypes.length>0) {
            return protoTypes[protoTypes.length-1];
        }
        return protoTypes[0];
    }

    getMessageById(messageId: number): ProtoBuf.Type {
        let protoTypes = this._mapID2Types.get(messageId);
        if (protoTypes.length>0) {
            // myLogger.log(`message type: ${protoTypes[protoTypes.length-1]}`);
            return this.getMessage(protoTypes[protoTypes.length-1]);
        }
        myLogger.log(`message type: ${protoTypes[0]}`);
        return this.getMessage(protoTypes[0]);
    }

    private suckMessageAndEnum(root: ProtoBuf.Root, name: string): void {
        let node: ProtoBuf.NamespaceBase = <ProtoBuf.NamespaceBase>root.get(name);
        if (node) {
            let keywords = ['msgid'];
            let typeArray = node.nestedArray;
            let typeItems: Array<ProtoBuf.NamespaceBase> = new Array<ProtoBuf.NamespaceBase>();
            typeArray.forEach(typeItem => {
                let item: any = typeItem;
                if (item.fields) { //Type
                    typeItems.push(<ProtoBuf.NamespaceBase>typeItem);
                } else if (item.values) { //Enum
                    if (keywords.indexOf(item.name.toLowerCase()) >= 0) {
                        let msgNumKeys = Object.keys(item.values);
                        if (msgNumKeys) {
                            msgNumKeys.forEach(value => {
                                let msgId = item.values[value];
                                this._mapType2ID.set(value, msgId);
                                let typesData = this._mapID2Types.get(msgId);
                                if (!typesData) {
                                    this._mapID2Types.set(msgId, new Array<string>(value));
                                } else {
                                    typesData.push(value);
                                }
                            });
                        }
                    }
                }
            }, this);

            typeItems.forEach(element => {
                let item: any = element;
                let itemArray: Array<any> = <Array<any>>item.fieldsArray;
                for (let index = 0; index < itemArray.length; index++) {
                    let field = itemArray[index];
                    if (keywords.indexOf(field.name.toLowerCase()) >= 0) {
                        if (field.options) {
                            // myLogger.error(field.options);
                            this._mapType2Proto.set(field.options.default, item);
                            myLogger.debug(item.name, field.options.default, this._mapType2ID.get(field.options.default), name);
                            break;
                        }
                    }
                }
            });
        }
    }

    onLoadFile(root: ProtoBuf.Root, protoFile: string) {
        this.suckMessageAndEnum(root, protoFile);
    }

    processMessage(message: Message, client: HOKClient) {
        let reqMessage = this.getMessageById(message.msgtype);
        try {
            let messageData = reqMessage.decode(message.msg);
            myLogger.trace(`recv: ${reqMessage.fullName}, ${reqMessage.name}`);
            myLogger.log(messageData);

            const requestFun = this._mapRequestMessage.get(reqMessage.name);
            if (requestFun) {
                let ret = requestFun(messageData, client);
                if (ret && ret!=0) {
                    if (Number.isInteger(ret)) {
                        this.askReturn(client, message.msgtype, ret);
                    }
                }    
            } else {
                myLogger.error(`no process message ${reqMessage.name} : ${message.msgtype}`);
            }
        } catch (e) {
            myLogger.error(e.message);
        }
    }

    /**
     * 通过明确的消息类型以及相关内容来发送消息
     * @param {number} uid 用户ID
     * @param {*} payLoad 用户的消息封装
     * @param {*} messageFactory 消息类型message
     * @memberof ProtoManager
     */
    postDirectMessage(uid: number, payLoad:any, messageFactory:any=null) {
        let client = HOKServer.getInstance().getClient(uid);
        if (client) {
            this.postClientDirectMessage(client, payLoad, messageFactory);
        } else {
            myLogger.error(`no found client for id : ${uid}`);
        }        
    }
    
    postClientDirectMessage(client: HOKClient, payLoad:any, messageFactory: any=null): void {
        try {
            if (!messageFactory) {
                messageFactory = this.getMessageById(payLoad.msgid);
            }
            let errMsg = messageFactory.verify(payLoad);
            if (errMsg) {
                throw Error(errMsg);
            }
            let buffer = messageFactory.encode(payLoad).finish();
            let msg = <Message>{
                length: buffer.length,
                msgtype: payLoad.msgid,
                msg: buffer
            };
            myLogger.trace(JSON.stringify(payLoad));            
            // myLogger.trace(Utils.toHexString(buffer.buffer, ','));
            myLogger.log(`====`.repeat(15));
            client.send(msg);
        } catch (e) {
            myLogger.error(e.message);
        }
    } 

    postMessage(uid:number, messageType:string, payload:any): void {
        let client = HOKServer.getInstance().getClient(uid);
        if (client) {
            this.responseMessage(client, payload, messageType);
        } else {
            myLogger.error(`no found client for id : ${uid}`);
        }
    }

    postMessageById(uid:number, messageId:number, payload:any): void {
        let client = HOKServer.getInstance().getClient(uid);
        if (client) {
            let messageType = this.getMessageTypeById(messageId);
            this.responseMessage(client, payload, messageType);
        } else {
            myLogger.error(`no found client for id : ${uid}`);
        }
    }

    private packJsonMessage(messageType: string, payload: any): Message {
        let messageFactory = this.getMessage(messageType);
        let errMsg = messageFactory.verify(payload);
        if (errMsg) {
            throw Error(errMsg);
        }
        let body = messageFactory.create(payload);
        let buffer = messageFactory.encode(body).finish();
        let msg = <Message>{
            length: buffer.length,
            msgtype: this._mapType2ID.get(messageType),
            msg: buffer
        };
        // myLogger.trace(Utils.toHexString(buffer.buffer, ','));
        myLogger.warn(messageFactory.decode(buffer));
        return msg;
    }

    responseMessage(client: HOKClient, payload: any, messageType: string): void {
        try {
            myLogger.trace(payload);
            myLogger.log(`====`.repeat(15));
            client.send(this.packJsonMessage(messageType, payload));
        } catch (e) {
            myLogger.error(e.message);
        }
    }

    askReturn(client: HOKClient, messageId: number, errorCode: number) {
        // let msg = GSToGC.AskRet.create();
        // msg.askid = messageId;
        // msg.errorcode = errorCode;
        // this.postClientDirectMessage(client, msg);
    }

    closeClient(client: HOKClient) {
    }
}