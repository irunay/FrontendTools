        chrome.proxy.settings.get({incognito: true}, function(d){
            console.log(d);
        });