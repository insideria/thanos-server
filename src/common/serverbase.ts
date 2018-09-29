import * as TCP from 'net';
import * as ProtoBuf from 'protobufjs';
import { myLogger } from './mylogger';
import { ServerEvent } from './const';

abstract class ServerBase {
    protected _host : string;
    protected _port : number;
    protected _name : string;
    protected _server: TCP.Server;

    protected constructor(name: string) {
        this._host = '';
        this._name = name;
        this._port = 0;
        this._server = <TCP.Server>{};
    }

    public initialize(serverConfig: any):void {
        if (serverConfig.serverInfo!=undefined) {
            this._host = serverConfig.serverInfo.host;
            this._port = serverConfig.serverInfo.port;
        }

        if (serverConfig.logger) {
            myLogger.initialize(serverConfig.logger);            
        }
    }

    //系统process.on('SIGINT')后需要处理收尾的事情。builder处理，不要手动调用
    public dispose():void {
        myLogger.info('server will dispose ...')
        if (this._server.listening) {
            this._server.close();
        }
    }

    protected async initProtoBuf(pbFile:string):Promise<ProtoBuf.Root> {
        return await ProtoBuf.load(pbFile);
    }

    protected listen(cb:any) {
        this._server = TCP.createServer((socket: TCP.Socket) => {
            this.onConnection(socket);
        });

        if (this._server) {
            this._server.on(ServerEvent.ERROR, (e:Error)=>{
                myLogger.error('tcp server error: ', e);
                process.exit(1);
            });
                        
            this._server.listen(this._port, this._host, cb);
            myLogger.log('server is starting...')
        }
    }

    protected abstract onConnection(socket:TCP.Socket): void;
}

export default ServerBase;