import ServerBase from './serverbase';
import Utils from './utils';
import { ProcessEvent, ProcessMessageCmd } from './const';

class ServerBuilder {
    private _config: any;
    constructor(name:string) {
        this._config = this.initConfig(name);
        process.chdir(this._config.path);
    }

    public startup(server:ServerBase):boolean {
        if (!server || !this._config) {
            console.log('server object or config file has not created!');
            return false;
        }
        server.initialize(this._config.content);//创建连接，调用serverBase

        let exitAction:Function = ()=>{
            server.dispose();
            process.exit(0);     
        };

        //当服务要重启的时候需要处理结束前收尾的事情
        process.on(ProcessEvent.SIGINT, ()=>{
            exitAction();
        });

        //windows graceful stop
        process.on(ProcessEvent.MESSAGE, (msg:string)=>{
            if (msg===ProcessMessageCmd.SHUTDOWN) {
                exitAction();
            }
        });

        return true;
    }
    
    private initConfig(name: string) {
        let config = {
            path: '.',
            content: ''
        };

        let conFile = Utils.readConfig(name);
        if (!conFile) {
            console.log('no config file');
            process.exit(1);
        }
        config.content = conFile;
        return config;
    }    
}

export default ServerBuilder;