function saveItem(type, id, data, callback){
    chrome.storage.local.get(type, function(detail){

        if(!detail[type]){
            detail[type] = {};
        }

        if(id && detail[type][id]){
            _.each(data, function(v, k){
                detail[type][id][k] = v;
            });
        }else{
            id = getUID(type);
            data.id = id;
            detail[type][id] = data;
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

function deleteItem(type, id, callback){
    chrome.storage.local.get(type, function(detail){

        if(!detail[type]){
            detail[type] = {};
        }

        if(id && detail[type][id]){
            delete detail[type][id];
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


function getUID(prefix){
    prefix = prefix?prefix+'_':'id_';
    return prefix + (new Date()).getTime() + _.uniqueId();
}