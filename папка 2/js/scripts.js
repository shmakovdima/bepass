

$(document).ready(function(){
	
	$("table").tablesorter({
		headers: { 0: { sorter: false}}
	});

	$(".checkes").click(function(){
		$(this).parent().find("input").click();
	});

	$(".step2.next_button.push_button").click(function(event){
		event.preventDefault();
		if ($(".push_text").val()===""){
			sweetAlert("Ошибка","Вы не ввели текст уведомления", "error");
			return;
		}
	});

	$(".date").keypress(function(event){
		event.preventDefault();
	});	

	$("input").focus(function(){
		$("input").removeClass("incorrect");
	});

	$(".control").click(function(){
		if ($(this).find(".select_pages").hasClass("active")){
			$(this).find("select_pages").removeClass("active");
		}else{
			$(this).find(".select_pages").addClass("active")
		}
	});
 


 	$(".header_table-start").click(function(event){
 		event.preventDefault();
 		if ($(this).find("span").hasClass("active")) {
 			$(this).find("span").removeClass("active");
 			$(this).parent().parent().parent().find("input[type='checkbox']").removeAttr("checked");
 		}else{
 			$(this).find("span").addClass("active");
 			$(this).parent().parent().parent().find("input[type='checkbox']").attr("checked","checked");
 			
 		}
 	});
});



$(function(){
  $(document).click(function(event) {
    if ($(event.target).closest(".control").length ) return;
    $(".select_pages").removeClass("active");
    event.stopPropagation();
  });
});