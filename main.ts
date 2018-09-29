import ServerBuilder from './src/common/serverbuilder';
import { HOKServer } from './src/module/hokserver';
import { myLogger } from './src/common/mylogger';

class Main {
    static main(name: string): number {
        let builder = new ServerBuilder(name);
        if (builder && builder.startup(new HOKServer(name))) {
            myLogger.debug('builder initialized finished ...');
        }
        return 0;
    }
}

Main.main('hok');