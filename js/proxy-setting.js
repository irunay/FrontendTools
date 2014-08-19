(function($){

	var templateConfig = {
		'proxy': {
			'container': '.proxy-list',
			'template': '\
				<tr>\
		            <td><%=id%></td>\
		            <td><%=name%></td>\
		            <td><%=type%></td>\
		            <td><%=host%></td>\
		            <td><%=port%></td>\
		            <td align="right"><a href="#" data-toggle="modal" data-target="#setting_dialog" data-type="proxy" data-title="修改代理" data-id="<%=id%>">修改</a></td>\
		        </tr>\
			'
		},
		'rule': {
			'container': '.rule-list',
			'template': '\
				<tr>\
                    <td><%=id%></td>\
                    <td><%=name%></td>\
                    <td><%=proxyName%></td>\
                    <td><pre><%=content%></pre></td>\
		            <td align="right"><a href="#" data-toggle="modal" data-target="#setting_dialog" data-type="rule" data-title="修改规则" data-id="<%=id%>">修改</a></td>\
		        </tr>\
			'
		}
	};
	
	$(function(){

		$("#setting_dialog").on("show.bs.modal", function(e){

			var dialog = $(this);

			chrome.storage.local.get(['proxy', 'rule'], function(o){

				if(!o.proxy){
					o.proxy = [];
				}
				if(!o.rule){
					o.rule = [];
				}

				var data = {};
				var target = $(e.relatedTarget);
				var id = target.attr('data-id');
				var type = target.attr('data-type');
				data.data = {};
				if(id && /^\d+$/.test(id)){
					id = parseInt(id);
					if(type == 'proxy'){
						data.data = o.proxy[id];
					}else if(type == 'rule'){
						data.data = o.rule[id];
					}					
				}
				data.data.proxies = o.proxy;
				data.title = target.attr('data-title');

				var template = type+"_setting_view";
				var html =  _.template($("#"+template).html(), data);
				dialog.find(".modal-content").html(html);

			});

		});

		$("body").on("click", ".btn-save-proxy", function(e){
			$(".form-proxy").trigger('submit');
		});
		$("body").on("submit", ".form-proxy", function(e){
			
			e.preventDefault();

			var proxyId = $.trim($("input[name='proxyId']").val()),
			proxyName = $.trim($("input[name='proxyName']").val()),
			proxyType = $.trim($("input[name='proxyType']:checked").val()),
			proxyHost = $.trim($("input[name='proxyHost']").val()),
			proxyPort = $.trim($("input[name='proxyPort']").val());

			if(proxyName && proxyType && proxyHost && proxyPort){
				save('proxy', proxyId, {
					'name':proxyName,
					'type':proxyType,
					'host':proxyHost,
					'port':proxyPort
				}, renderList);
				$('#setting_dialog').modal('hide');
			}else{
				alert("请填写所有选项");
			}

		});

		$("body").on("click", ".btn-save-rule", function(e){
			$(".form-rule").trigger('submit');
		});
		$("body").on("submit", ".form-rule", function(e){
			
			e.preventDefault();

			var ruleId = $.trim($("input[name='ruleId']").val()),
			ruleName = $.trim($("input[name='ruleName']").val()),
			ruleUrl = $.trim($("input[name='ruleUrl']").val()),
			ruleContent = $.trim($("textarea[name='ruleContent']").val()),
			ruleProxy = $.trim($("select[name='ruleProxy']").val());

			if(ruleName && (ruleUrl || ruleContent) && ruleProxy){
				save('rule', ruleId, {
					'name':ruleName,
					'url':ruleUrl,
					'content':ruleContent,
					'proxy':parseInt(ruleProxy),
					'enabled':false
				}, renderList);
				$('#setting_dialog').modal('hide');
			}else{
				alert("请填写所有选项");
			}

		});

		renderList();
	
	});

	function renderList(){
		chrome.storage.local.get(['proxy', 'rule'], function(o){
			$.each(o, function(key, data){
				var container = $(templateConfig[key].container);
				container.empty();
				if(key=='rule'){
					var proxies = o.proxy;
				}
				$.each(data, function(i, oo){
					if(key=='rule'){
						oo.proxyName = proxies[oo.proxy].name;
					}
					container.append(_.template(templateConfig[key].template, oo));
				});
			});
		});
	}

})(jQuery);