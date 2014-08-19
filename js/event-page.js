chrome.storage.onChanged.addListener(function(changes, areaName){
    if(changes.proxy || changes.rule){
        refreshProxySetting();
    }
});

function refreshProxySetting(){

    chrome.storage.local.get(['proxy', 'rule'], function(o){

        var data = [];

        if(!o.proxy){
            o.proxy = [];
        }
        if(!o.rule){
            o.rule = [];
        }

        console.log(o);

        _.each(o.rule, function(e,i){

            if(!e.enabled){
                return;
            }

            if(/^\d+$/.test(e.proxy) && parseInt(e.proxy)<o.proxy.length){
                e.proxy = o.proxy[parseInt(e.proxy)];
                e.content = e.content.split("\n");
                data.push(e);
            }

        });

        setPacScript(data);

    }); 

}

function setPacScript(data) {

    var  pacTemplate = '\
        function FindProxyForURL(url, host) {\
            <%_.each(data, function(r){%>\
            <%_.each(r.content, function(c){%>\
            if(shExpMatch(url,"<%=c%>")){\
                return "<%=r.proxy.type%> <%=r.proxy.host%>:<%=r.proxy.port%>";\
            }\
            <%})%>\
            <%})%>\
            return "DIRECT";\
        }\
    ';

    var pacScriptContent = _.template(pacTemplate, {'data':data});

    var config = {
        mode: "pac_script",
        pacScript: {
            data: pacScriptContent
        }
    };

    chrome.proxy.settings.set({value: config, scope: 'regular'},function(){
        console.log('update pacScript');
    });

}