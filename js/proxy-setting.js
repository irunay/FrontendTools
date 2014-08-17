(function($){

	var proxyListTemplate = '\
			<tr>
                <td><%=id%></td>
                <td><%=name%></td>
                <td><%=type%></td>
                <td><%=host%></td>
                <td><%=port%></td>
            </tr>
	';
	
	$(function(){

		$("#setting_dialog").on("show.bs.modal", function(e){
			var data = {};
			var target = $(e.relatedTarget);
			data.title = target.attr('data-title');
			data.data = {};
			var template = target.attr("data-template");
			var html =  _.template($("#"+template).html(), data);
			$(this).find(".modal-content").html(html);
		});

		saveRule();
		saveProxy();
		renderPage();
	
	});

	function renderPage(){
		chrome.storage.local.get(['fet_proxy', 'fet_rule'], function(o){
			if (o.fet_proxy) {
				renderList(o.fet_proxy);
			}
			if (o.fet_rule) {
				renderList(o.fet_rule);
			}
		});
	}

	function renderList(data, template){
		$.each(data, function(i, rule){

		});
	}

	function loadProxy(){
		chrome.storage.local.get(['hhhkey','hhhkey1'], function(o){
			console.log(o);
		})
	}

	function loadRule(){
		chrome.storage.local.get(['hhhkey','hhhkey1'], function(o){
			console.log(o);
		})
	}

	function saveProxy(){
		chrome.storage.local.set({'fet_proxy': []},function(){
			console.log('save proxy ok');
		})
	}

	function saveRule(){
		chrome.storage.local.set({'fet_rule': []},function(){
			console.log('save rule ok');
		})
	}

})(jQuery);