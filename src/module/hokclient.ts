import ClientBase from '../common/clientbase'
import * as TCP from 'net';
import { ClientEvent } from '../common/const';
// import { Battle } from './battle/battle';

class HOKClient extends ClientBase {
    private _uId: number;
    // private _battle: Battle;

    constructor(s: TCP.Socket) {
        super(s);
        this._uId = -1;
        // this._battle = null;
    }

    public getuId(): number {
        return this._uId;
    }

    public setuId(userId : number){
        this._uId = userId;
    }

    // public isInBattle(): boolean {
    //     return this._battle!=null;
    // }

    // public setBattle(battle: Battle): void {
    //     this._battle = battle;
    // }

    // public getBattle(): Battle {
    //     return this._battle;
    // }    

	public send(message: Message):any {
        super.send(message);
        
        let buf = Buffer.alloc(message.length + 8);
        buf.writeInt32LE(message.length+8, 0);
        buf.writeInt32LE(message.msgtype, 4);
        message.msg.copy(buf, 8, 0, message.length);
        this._socket.write(buf);
    }    

    protected onError(error:string):void {
        this.emit(ClientEvent.ERROR, error);
    }

    protected onSchedule():void {
        this.emit(ClientEvent.SCHEDULE);
    }

    protected onMessage(message: Message):void {
        this.setActive();
        this.emit(ClientEvent.MSG, message);
    }

    protected onEnd():void {
        this.emit(ClientEvent.END);
    }
}

export { HOKClient };