export enum SocketEvent {
    DATA = 'data',
    ERROR = 'error',
    MSG = 'msg',
    END = 'end'
};

export enum ServerEvent {
    ERROR = 'error'
}

export enum ClientEvent {
    DATA = 'data',
    ERROR = 'error',
    MSG = 'msg',
    END = 'end',
    SCHEDULE = 'schedule'
};

export enum ProcessEvent {
    SIGINT = 'SIGINT',
    MESSAGE = 'message'
};

export enum ProcessMessageCmd {
    SHUTDOWN = 'shutdown'
}