import { MysqlPool } from '../common/mysqlpool';
import { myLogger } from '../common/mylogger';

export class DBManager {
    private _mysql: MysqlPool;
    private static _instance: DBManager;
    public static getInstance(): DBManager {
        if (!this._instance) {
            this._instance = new DBManager();
        }
        return this._instance;
    }    

    private constructor () {
        this._mysql = <MysqlPool>{};
    }

    public initialize(confFile:DBConfig) {
        this._mysql = new MysqlPool(confFile);
        myLogger.log('DBManager initialize finished ...');
    }

    executeSQL(sqlStr:string, sqlParam = []): Promise<any> {
        return this._mysql.query(sqlStr, sqlParam);
    }
}
