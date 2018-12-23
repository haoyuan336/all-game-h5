class State{
    constructor(){
        this._state = 'invalide';
        this._register = {};
    }
    setState(state){
        if (state == this._state){
            return;
        }
        this._state = state;
        console.log('change state =' + this._state);
        if (this._register[state]){
            let handlerList = this._register[state];
            for (let i = 0 ; i < handlerList.length ; i ++){
                let handler = handlerList[i];
                handler.call(null);
            }
        }
    }
    addState(state, cb){
        if (this._register[state]){
            this._register[state].push(cb)
        }else{
            this._register[state] = [cb];
        }
    }
    getState(){
        return this._state;
    }

}
module.exports = State;