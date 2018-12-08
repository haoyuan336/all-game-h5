class EventListener{
    constructor(){
        this._register = {};
    }
    on(type, method){
        if (this._register[type]){
            this._register[type].push(method);
        }else{
            this._register[type] = [method];
        }
    }
    fire(type){
        if (this._register[type]){
            let handlerList = this._register[type];
            for (let i = 0 ; i < handlerList.length; i ++){
                let handler = handlerList[i];
                let argv = [];
                for (let j = 1 ; j < arguments.length ; j ++ ){
                    argv.push(arguments[j]);
                }
                handler.apply(this, argv);
            }
        }
    }
    off(type , method){
        if (this._register[type]){
            let handlerList = this._register[type];
            for (let i = 0 ; i < handlerList.length ;i ++){
                if (handlerList[i] == method){
                    handlerList.splice(i, 1);
                    console.log('off', type);
                }
            }
        }
    }
    offAll(){
        this._register = {};
    }
}
export default EventListener;