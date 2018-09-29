import * as PMX from 'pmx';

export abstract class ActionBase {
    public addAction(event:string, action:Function) {
        PMX.action(event, (params:any, reply:Function)=>{
            action(params, reply);
        });  
    }
}