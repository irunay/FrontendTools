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
		        </tr>\
			'
		},
		'rule': {
			'container': '.rule-list',
			'template': '\
				<tr>\
                    <td><%=id%></td>\
                    <td><%=name%></td>\
                    <td><%=proxy%></td>\
                    <td><%=url%><br><%=content%></td>\
		        </tr>\
			'
		}
	}
	
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
				data.title = target.attr('data-title');
				data.data = {};
				data.data.proxies = o.proxy;
				var template = target.attr("data-template");
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
				});
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

			console.log({
					'name':ruleName,
					'url':ruleUrl,
					'content':ruleContent,
					'proxy':ruleProxy
				});

			if(ruleName && (ruleUrl || ruleContent) && ruleProxy){
				save('rule', ruleId, {
					'name':ruleName,
					'url':ruleUrl,
					'content':ruleContent,
					'proxy':ruleProxy
				});
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
				$.each(data, function(i, o){
					container.append(_.template(templateConfig[key].template, o));
				});
			});
		});
	}

	function save(type, id, data){
		chrome.storage.local.get(type, function(detail){

			if(!detail[type]){
				detail[type] = [];
			}

			if(/^\d+$/.test(id) && parseInt(id)<detail[type].length){
				data.id = parseInt(id);
				detail[type][parseInt(id)] = data;
			}else{
				data.id = detail[type].length;
				detail[type].push(data);
			}

			var o = {};
			o[type] = detail[type];

			chrome.storage.local.set(o, function(){
				renderList();
			});		

		});
	}

})(jQuery);