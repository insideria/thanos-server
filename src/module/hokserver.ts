import ServerBase from '../common/serverbase';
import { HOKClient } from './hokclient';
import * as TCP from 'net';
import { myLogger } from '../common/mylogger';
import { ClientEvent } from '../common/const';
import { DBManager } from './dbManager';
import { ProtoManager } from './protomanager';
import { ConfigManager } from './configmanager';

export class HOKServer extends ServerBase {
    private _socketClientMap:Map<TCP.Socket, HOKClient>;
    private _idClientMap:Map<number, HOKClient>;
    private _gClientId:number;
    private _usePB: boolean;

    private static _instance:HOKServer;
    public static getInstance() {
        return this._instance;
    }
    
    constructor(name: string) {
        super(name);
        HOKServer._instance = this;
        this._socketClientMap = new Map<TCP.Socket, HOKClient>();
        this._idClientMap = new Map<number, HOKClient>();
        this._gClientId = 1;
        this._usePB = false;
    }

    public async initialize(serverConfig: any) {
        super.initialize(serverConfig);
        if (serverConfig.mysql && serverConfig.mysql.use) {
            DBManager.getInstance().initialize(<DBConfig>serverConfig.mysql);
        }

        if (serverConfig.protobuf && serverConfig.protobuf.use) {
            this._usePB = true;
            await ProtoManager.getInstance().initialize(serverConfig.protobuf.proto);
            await ProtoManager.getInstance().handlerRequests(serverConfig.protobuf.handler);
        }

        //初始化conf/*.xml类型的配置文件，读取相关内容
        ConfigManager.getInstance().initialize();

        super.listen(function(err:Error) {
            if (err) {
                myLogger.error(err);
                process.exit(1);
            }
        });        
    }

    private closeSocket(socket:TCP.Socket) {
        if (this._socketClientMap.has(socket)) {
            let client:HOKClient = <HOKClient>this._socketClientMap.get(socket);
            if (client) {
                myLogger.info(`close socket id: ${client.getClientId()}`);
                this._idClientMap.delete(client.getClientId());
                this._socketClientMap.delete(socket);
                if (this._usePB) {
                    ProtoManager.getInstance().closeClient(client);
                }
                client.close();                
            }
        }
    }

    protected onConnection(socket: TCP.Socket):void {
        myLogger.debug(`onConnect call: a socket connect to me. ${socket}`);
        socket.pause();
        let client:HOKClient = new HOKClient(socket);
        if (client) {
            let clientId = this._gClientId++;
            client.initialize(clientId);
            this._idClientMap.set(clientId, client);
            this._socketClientMap.set(socket, client);
            socket.resume();
        }

        client.on(ClientEvent.END, ()=>{
            myLogger.warn(`socket receive end by peer ${socket}`);
            this.closeSocket(socket);
        });

        client.on(ClientEvent.MSG, (msg:Message)=>{
            if (this._usePB) {
                ProtoManager.getInstance().processMessage(msg, client);
            }
        });
    
        client.on(ClientEvent.ERROR, (e)=>{
            myLogger.error(`client have some error ${client.getClientId()} : ${client.getSocket()}`);
            this.closeSocket(client.getSocket());
        });
    
        client.on(ClientEvent.SCHEDULE, ()=>{
            myLogger.info('receive a schedule message');
        });        
    }

    public getClient(uid: number):HOKClient|undefined {
        for (let client of this._socketClientMap.values()) {
            if (client.getuId()==uid) {
                return client;
            }
        } 
        return undefined;
    }
}