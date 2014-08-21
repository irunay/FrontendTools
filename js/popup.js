(function($){

    var ruleTemplate = '\
        <div class="checkbox">\
          <label>\
            <input name="rule" type="checkbox" value="<%=id%>" <%=enabled?"checked":""%> />\
            <%=name%> - <%=proxyName%>\
          </label>\
        </div>\
    ';

    $(function(){
        renderList();
        $("body").on("click", "input[name='rule']", function(e){
            var data = {};
            var id = $(this).val();

            if($(this).is(":checked")){
                data.enabled = true;
            }else{
                data.enabled = false;
            }

            saveItem('rule', id, data);
        });
    });

    function renderList(){
        chrome.storage.local.get(['rule','proxy'], function(o){
            var container = $(".pop-conent");
            container.empty();
            _.each(o.rule, function(oo){
                oo.proxyName = o.proxy[oo.proxy].name;
                container.append(_.template(ruleTemplate, oo));
            });
        });
    }    

})(jQuery);