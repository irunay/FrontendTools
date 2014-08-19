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
                    <td><%=proxy%></td>\
                    <td><%=content%></td>\
		            <td align="right"><a href="#" data-toggle="modal" data-target="#setting_dialog" data-type="rule" data-title="修改规则" data-id="<%=id%>">修改</a></td>\
		        </tr>\
			'
		}
	},
	pacTemplate = '\
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

				console.log(data);

				var template = type+"_setting_view";
				console.log(template);
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

		chrome.storage.onChanged.addListener(function(changes, areaName){
			if(changes.proxy || changes.rule){
				refreshProxySetting();
			}
		});

		refreshProxySetting();
	
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

	function refreshProxySetting(){

		chrome.storage.local.get(['proxy', 'rule'], function(o){

			var data = [];

			if(!o.proxy){
				o.proxy = [];
			}
			if(!o.rule){
				o.rule = [];
			}

			_.each(o.rule, function(e,i){

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

		console.log(data);

		var pacScriptContent = _.template(pacTemplate, {'data':data});

		console.log(pacScriptContent);

		var config = {
			mode: "pac_script",
			pacScript: {
				data: pacScriptContent
			}
		};

		chrome.proxy.settings.set({value: config, scope: 'regular'},function(){
			console.log('haha');
		});

	}

})(jQuery);