export class ResourceManager{
    constructor(){
        this.resources = {};
    }
    load(resUrl, cb){
        let loader = new PIXI.loader.Loader();
        loader.add(resUrl, resUrl);
        loader.load((loader, resources)=>{
            if (cb){
                cb();
            }
        })
    }
    loadList(resList, cb, preCb){
        let loadCount = 0;
        let loadTotalCount = resList.length;
        const loadCb = function(){
            loadCount ++;
            if (preCb){
                preCb(loadCount)
            }
            if (loadCount === loadTotalCount){
                if(cb){
                    cb();
                }
            }
        }.bind(this);
        for (let i = 0 ; i < resList.length; i ++){
            this.load(resList[i], loadCb);
        }
    }
}