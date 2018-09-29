// / <reference path="./module/hokprotobuf.d.ts" />
declare module 'pmx';

interface ServerConfig {
    host?: string;
    port?: number;
}

interface DBConfig {
    user: string;
    password: string;
    database: string;
}

interface MysqlConfig extends ServerConfig, DBConfig {
    connectionLimit?: number;
}

interface ServerInfo {
    ServerName: string;
    ServerAddr: string;
    ServerPort: number
}

interface Message {
    length: number;
    msgtype: number;
    msg: Buffer;
}