$(document).ready(function(){
	$(".checkes").on('click',function(){
		$(this).parent().find("input").click();
	});
	jQuery('.date_picker').datetimepicker({
	  format:'d.m.Y H:i',
	  lang:'ru'
	});
});
