function save(type, id, data, callback){
    chrome.storage.local.get(type, function(detail){

        if(!detail[type]){
            detail[type] = [];
        }

        if(/^\d+$/.test(id) && parseInt(id)<detail[type].length){
            data.id = parseInt(id);
            _.each(data, function(v, k){
                detail[type][parseInt(id)][k] = v;
            });
        }else{
            data.id = detail[type].length;
            detail[type].push(data);
        }

        var o = {};
        o[type] = detail[type];

        chrome.storage.local.set(o, function(){
            if(typeof callback == 'function'){
                callback();
            }
        });

    });
}