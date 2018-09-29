import * as log4js from 'log4js';
import { Logger, Configuration } from 'log4js';

enum LoggerInitedType {
    CONSOLE = 1,
    NORMAL
}

class MyLogger {
    private initedType?: LoggerInitedType;
    private mainLogger: Logger;
    private static _instance: MyLogger;
    static getInstance(): MyLogger {
        if (!this._instance) {
            this._instance = new MyLogger();
            this._instance.initConsole();
        }
        return this._instance;
    }

    private constructor() {
        this.mainLogger = <Logger>{};
    }

    initialize(config: Configuration) {
        if (this.initedType == LoggerInitedType.NORMAL) {
            return;
        }
        this.initedType = LoggerInitedType.NORMAL;
        log4js.configure(config);
        this.mainLogger = log4js.getLogger();
    }

    private initConsole() {
        let config: Configuration = {
            appenders: {
                out: {
                    type: 'console'
                }
            },
            categories: {
                default: {
                    appenders: ['out'],
                    level: 'all'
                }
            }
        };
        log4js.configure(config);
        this.mainLogger = log4js.getLogger();
        this.initedType = LoggerInitedType.CONSOLE;
    }

    public warn(...args: any[]): void {
        if (!this.mainLogger.isWarnEnabled()) {
            return;
        }
        this.mainLogger.warn(this.writeLog(args));
    }

    public trace(...args: any[]): void {
        if (!this.mainLogger.isTraceEnabled()) {
            return;
        }
        this.mainLogger.trace(this.writeLog(args));
    }

    public log(...args: any[]): void {
        this.info(...args);
    }

    public fatal(...args: any[]): void {
        if (!this.mainLogger.isFatalEnabled()) {
            return;
        }
        this.mainLogger.fatal(this.writeLog(args));
    }

    public error(...args: any[]): void {
        if (!this.mainLogger.isErrorEnabled()) {
            return;
        }
        this.mainLogger.error(this.writeLog(args));
    }

    public info(...args: any[]): void {
        if (!this.mainLogger.isInfoEnabled()) {
            return;
        }
        this.mainLogger.info(this.writeLog(args));
    }

    public debug(...args: any[]): void {
        if (!this.mainLogger.isDebugEnabled()) {
            return;
        }
        this.mainLogger.debug(this.writeLog(args));
    }

    private writeLog(...args: any[]): string {
        if (!this.initedType) {
            console.log('error: ', 'logger is not inited');
        }

        let str: string = '';

        for (let i = 0; i < args.length; i++) {
            let arg: any = args[i];
            if (i > 0) {
                str += ' ';
                if (typeof arg == 'object') {
                    str += JSON.stringify(arg);
                } else {
                    str += arg;
                }
            } else {
                if (typeof arg == 'object') {
                    str = JSON.stringify(arg);
                } else {
                    str = arg;
                }
            }
        }

        return str;
    }
}

let myLogger = MyLogger.getInstance();

export { myLogger };

