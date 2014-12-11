$(document).ready(function(){
	
	$(".checkes").on('click',function(){
		$(this).parent().find("input").click();
	});



	$(".submit.form").click(function(event){
		if ((($(".phone").val()==="") && ($(".mail").val()==="")) || ($(".fam").val()==="") || ($(".name").val()==="") || ($(".card").val()==="") || ($(".date").val()==="") || ($(".sex").val()==="")) {
			event.preventDefault();	
			if ($(".fam").val()==="") {sweetAlert("Ошибка","Вы не заполнили поле фамилии", "error"); return;}
			if ($(".name").val()==="") {sweetAlert("Ошибка","Вы не заполнили поле имени", "error"); return;}
			if ($(".card").val()==="") {sweetAlert("Ошибка","Вы не заполнили номер карты", "error"); return;}
			if (($(".phone").val()==="") && ($(".mail").val()==="")) {sweetAlert("Ошибка","Вы не заполнили поле телефона или email", "error"); return;}
		} 	
			testingmail($(".mail"));             
	});

	$("input").focus(function(){
		$("input").removeClass("incorrect");
	});

	$(".date").keypress(function(event){
		event.preventDefault();
	});	

	jQuery(function($){
   $(".phone").mask("+7 (999) 999-99-99");
});

jQuery('.date').datetimepicker({
	  format:'d.m.Y H:i',
	  lang:'ru'
});

$('select').chosen({disable_search: true});

})



function testingmail(item) {

if (item.val()!==""){
	var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
	if(!pattern.test(item.val())){	
       item.addClass("incorrect");
    }
}
}

