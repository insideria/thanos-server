import * as TCP from 'net';
import { EventEmitter } from 'events';
import { SocketEvent } from './const';
import { ConstMaxMsgLen } from '../module/gameconst';

abstract class ClientBase extends EventEmitter {
    protected _socket: TCP.Socket;
    protected _lastActive: number;
    protected _checkActiveIntervalId: NodeJS.Timer;
    protected _lostHeartbeat: boolean;
    protected _clientId:number = 0;
    private _buffer: any;
    
    protected constructor(s: TCP.Socket) {
        super();
        this._socket = s;
        this._buffer = null;
        this._lastActive = Date.now();
        this._lostHeartbeat = false;

        this._checkActiveIntervalId = setInterval(()=>{
            let now = Date.now();
            if (now - this._lastActive > 1000 * 60 * 10) {
                this.onError('lost heartbeat.');
                this._lostHeartbeat = true;
            } else {
                this.onSchedule();
            }
        }, 1000 * 5 * 12);
    }

    public initialize(clientId:number):void {
        this._clientId = clientId;

        this._socket.on(SocketEvent.ERROR, (e:Error)=>{
            this.onError(`error ${e}`);
        });

        this._socket.on(SocketEvent.END, ()=>{
            this.onEnd();
        });        

        this._socket.on(SocketEvent.DATA, (data:any)=>{
            if (this._buffer) {
                let buf = Buffer.alloc(this._buffer.length + data.length);
                this._buffer.copy(buf, 0, 0, this._buffer.length);
                data.copy(buf, this._buffer.length, 0, data.length);
    
                this._buffer = buf;
            } else {
                this._buffer = data;
            }
    
            while (this._buffer && this._buffer.length >= 8) {
                let len = <number>this._buffer.readInt32LE(0);
                if (len > ConstMaxMsgLen || len < 0) {
                    this._buffer = null;
                    this.onError(`invalid msg length: ${len}`);
                    break;
                }
                
                if (len > this._buffer.length){
                    break;
                }
                let inMessage = <Message>{};
                inMessage.length = len;
                inMessage.msgtype = <number>this._buffer.readInt32LE(4);    
                if (len > 0) {
                    inMessage.msg = Buffer.alloc(len-8);
                    this._buffer.copy(inMessage.msg, 0, 8, len);
                }
                this.onMessage(inMessage);
    
                if (this._buffer.length > len) {
                    this._buffer = this._buffer.slice(len);
                } else {
                    this._buffer = null;
                }
            }
        });        
    }

    public getClientId() {
        return this._clientId;
    }

    public getSocket() {
        return this._socket;
    }

	public close():void {
		this._socket.destroy();
        clearInterval(this._checkActiveIntervalId);
    }

    protected setActive():void {
        this._lastActive = Date.now();        
    }

	protected send(message: any):any {
        this.setActive();
    }
    
    protected abstract onError(err:string):void;
    protected abstract onMessage(message: Message):void;
    protected abstract onSchedule():void;
    protected abstract onEnd():void;    
}

export default ClientBase;