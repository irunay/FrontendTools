(function($){
	
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
	
	});

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
		chrome.storage.local.set({'hhhkey1':'hello'},function(){
			console.log('save ok');
		})
	}

	function saveRule(){
		chrome.storage.local.set({'hhhkey1':'hello'},function(){
			console.log('save ok');
		})
	}

})(jQuery);