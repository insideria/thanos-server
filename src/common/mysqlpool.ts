import * as Mysql from 'mysql';
import { myLogger } from './mylogger';

export class MysqlPool {
    private _mysqlPool: any;
    private _config: MysqlConfig;

    constructor(config: DBConfig) {
        this._mysqlPool = null;
        this._config = <MysqlConfig>{};
        this.initialize(config);
    }

    private initialize(config:DBConfig): boolean {
        this._config = config;
        if (this._config.database==undefined) {
            myLogger.log('no config parse to json right.');
            return false;
        }

        if (!this._config.host) {
            this._config.host = '127.0.0.1';
        }

        if (!this._config.port) {
            this._config.port = 3306;
        }

        if (!this._config.connectionLimit) {
            this._config.connectionLimit = 10;
        }

        this._mysqlPool  = Mysql.createPool(this._config);
        return true;
    }

    public getPool(): any {
        return this._mysqlPool;
    }

    public query(querystr: string, queryparams:any) {
        // 返回一个 Promise
        return new Promise((resolve, reject)=>{
            this._mysqlPool.getConnection((err:Error, connection:any)=>{
                if (err) {
                    reject(err);
                } else {
                    connection.query(querystr, queryparams, (err:Error, rows: any)=>{
                        connection.release();
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                }
            });
        });
    }

    public cbquery(querystr: string, queryparam:any, cb:any):void {
        this._mysqlPool.getConnection((err:Error, connection:any) => {
            if (!err) {
                var sql = querystr;
                connection.query(querystr, queryparam, (err: Error, rows:any)=> {
                    connection.release();
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, rows);
                    }
                });
            } else {
                cb(err);
            }
        });
    }    
}