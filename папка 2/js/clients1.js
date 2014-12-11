$(document).ready(function(){
	$(".button_send").click(function(){
		if ((!$(".send_now").is(":checked")) && (!$(".send_date").is(":checked"))){
			sweetAlert("Ошибка","Вы не выбрали время доставки", "error");
			return;
		}

		if (($("#send_sms").attr("checked")!=="checked") && ($("#send_email").attr("checked")!=="checked")){
			sweetAlert("Ошибка","Вы не выбрали способ доставки", "error");
			return;
		}

		if ($("#send_sms").attr("checked")==="checked") {
			var text1 = $(".sms_uv").val();
			if (text1.search('%@')== -1){
				sweetAlert("Ошибка","В тексте рассылки по смс отсутствует параметр %@", "error");
				return;
			}
		}
		if ($("#send_email").attr("checked")==="checked") {
			var text2 = $(".email_uv").val();
			if (text2.search('%@')== -1){
				sweetAlert("Ошибка","В тексте рассылке по email отсутствует параметр %@", "error");
				return;
			}
		}

		sweetAlert("Успешно","Рассылка началась", "success");
	});

	jQuery('.date_picker').datetimepicker({
	  format:'d.m.Y H:i',
	  lang:'ru',
	  minDate: 0,
	  minTime: 0
	});

	$(".date").keypress(function(event){
		event.preventDefault();
	});
});