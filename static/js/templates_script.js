var metas = document.getElementsByTagName('meta');
var i;
var itemzap = 0;

jQuery(function ($) {
    $(".phone").mask("+7 (999) 999-99-99");
});

if (navigator.userAgent.match(/iPhone/i)) {
    for (i = 0; i < metas.length; i++) {
        if (metas[i].name == "viewport") {
            metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
        }
    }
    document.addEventListener("gesturestart", gestureStart, false);
}

function gestureStart() {
    for (i = 0; i < metas.length; i++) {
        if (metas[i].name == "viewport") {
            metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
        }
    }
}


var card = {
    'template_id': '',
    'card_type': 'store',
    'bg_color': '',
    'text_color': '',
    'head_color': '',

    'logo': '/static/css/img/logo_2.png',
    'strip': '/static/css/img/strip.png',
    'notifications_icon': '',

    'barcode_type': 'PKBarcodeFormatPDF417',

    'name': '',
    'conditions': '',
    'contacts': '',
    'iconbar': '',

    'date': '',
    'discount': '',
    'description': '',

    'places': [{
        'title': '',
        'lat': 0,
        'lng': 0,
        'legend': ''
    }],

    'confirm': false,

    applyChanges: function (key) {
        $('.bind-bg-color').css({'background-color': this.bg_color});
        $('.bind-head-color').css({'color': this.head_color});
        $('.bind-text-color').css({'color': this.text_color});

        $('.bind-name').html(this.name);
        (this.date) ? $('.bind-date').html(this.date.split(' ')[0]) : $('.bind-date').html('');
        $('.bind-discount').html(this.discount);
        $('.bind-description').html(this.description);

        $('.bind-contacts').html(this.contacts.replace(/\n/gi, '<br>'));
        $('.bind-conditions').html(this.conditions.replace(/\n/gi, '<br>'));

        if ($('.bind-logo img').attr('src') != this.logo &&
            $('.bind-logo img').css('background-image') != 'url("' + this.logo + '")') {

            $('.bind-logo').html('<img src = "' + this.logo + '" >');
            $('.bind-logo img').css({'background-image': 'url("' + this.logo + '")'});

			$(".inner_head .image_wrapper img").bindImageLoad(function () {
				setTimeout(function () {
					var curh = $(".inner_head .image_wrapper img").height();
				
					$(".inner_head .image_wrapper img").css("margin-top",((50-curh)/2)+"px");
					$(".logo_wrapper .image_wrapper img").css("margin-top",((56-curh)/2)+"px");					
				}, 200); // значение паузы взял из головы 		
    		});
        }

        if ($('.bind-strip img').attr('src') != this.strip &&
            $('.bind-strip img').css('background-image') != 'url("' + this.strip + '")') {
            $(".bind-strip").find("img").remove();
            $('.bind-strip').append('<img src = "' + this.strip + '" >');
            $('.bind-strip img').css({'background-image': 'url("' + this.strip + '")'});
        }

        if ($('.bind-notifications-icon img').attr('src') != this.notifications_icon &&
            $('.bind-notifications-icon img').css('background-image') != 'url("' + this.notifications_icon + '")') {

            $('.bind-notifications-icon').html('<img src = "' + this.notifications_icon + '" >');
            $('.bind-notifications-icon img').css({'background-image': 'url("' + this.notifications_icon + '")'});
			
			$('.bind-notifications-icon img').bindImageLoad(function () {
				setTimeout(function () {
					var curh = $('.bind-notifications-icon img').height();
					$('.bind-notifications-icon img').css("margin-top",((56-curh)/2)+"px");
				}, 200); // значение паузы взял из головы
				
			});
		
        }
        (this.confirm) ? $('.bind-confirm').show() : $('.bind-confirm').hide();
    },
    set: function (key, value) {
        this[key] = value;
        this.applyChanges(key);
        return this;
    },
    isValidPlace: function () {
        var place = this.places[this.places.length - 1];
        console.log(place.title.length * place.lat * place.lng);
        return (place.title.length * place.lat * place.lng !== 0)
    },
    setPlace: function (place) {
        for (var k in place)
            this.places[this.places.length - 1][k] = place[k]
    },
    addPlace: function () {
        this.places.push({
            'title': '',
            'lat': '',
            'lng': '',
            'legend': ''
        });
    },
    removePlace: function (lat, lng) {
        var res = [];
        for (var i = 0, l = this.places.length; i < l; i++)
            if ((this.places[i].lat !== lat) || (this.places[i].lng !== lng)) res.push(this.places[i]);
        this.places = res;
    },

    getPlaces: function () {
        return this.places;
    }
}
function handleFileSelect(field) {
    return function (evt) {
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    card.set(field, e.target.result);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }
}
function handlerAutocompleteMap(field) {
    function drawItem(model) {
        var parent = field.parent().find('.holder');
        $('<div class="holder_item">' + model.title + '</div>').appendTo(parent).click(function () {
            field.val(model.title);
            handler();
        });
    }

    var handler = function () {
        field.parent().find('.holder').empty();
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json', {
            'language': 'ru',
            'sensor': true,
            'address': field.val()
        }, function (data) {
            var types = ['street_address', 'route', 'intersection'], pushModel = [];

            for (var i = 0, l = data.results.length; i < l; i++) {
                var obj = data.results[i], model = {};
                if ((obj.types.indexOf('street_address') !== -1) || (obj.types.indexOf('route') !== -1) || (obj.types.indexOf('intersection') !== -1) || (obj.types.indexOf('locality') !== -1)) {
                    model.title = obj.formatted_address;
                    model.lat = Math.round(obj.geometry.location.lat * 1000000) / 1000000;
                    model.lng = Math.round(obj.geometry.location.lng * 1000000) / 1000000;
                    pushModel.push(model);
                }
            }

            if (pushModel.length === 1) {
                field.val(pushModel[0].title + ' (' + pushModel[0].lat + ', ' + pushModel[0].lng + ')');
                card.setPlace({
                    'title': pushModel[0].title,
                    'lat': pushModel[0].lat,
                    'lng': pushModel[0].lng
                });
            } else for (var i = 0, l = pushModel.length; i < l; i++)
                drawItem(pushModel[i]);
        });
    }
    return handler;
}

function formReset() {

    if (!$("body").hasClass("redshab")) {
        $('.t1 #name_input').val('');
        $('.t2 #name_input').val('');
        $('.t3 #name_input').val('');
    }

}

function initNullStep() {
    $('.menu_li').removeClass('active');
    $('.type_li').addClass('active');
    $('.addition_to_phone.step_1').hide();
    $('.addition_to_phone.step_2').hide();
    $('.step_form').hide();
    $('.step_form.zero').show();
    $('.back_mob').hide();
    $('.front_mob').hide();
    $('.preview_mob').show();
    $('.next_button').off('click').on('click', initFirstStep).show();
    $('.prev_button').hide().off('click');
    $('.finish_button').hide();

    $('.type_2_btn').click(function () {
		$("#text_color_input").removeClass("disactive");
        $('body').removeClass('t3').removeClass('t1').addClass('t2');
        $('.type_btn').removeClass('active');
        $('.type_2_btn').addClass('active');
        if (!card.template_id) {
            $('.mob_preview')[0].src = '/static/css/img/card_2.png';
            $('#bg_color_input').val('#33e07b');
			card.set('bg_color', $('#bg_color_input').val());
			card.set('text_color', $('#text_color_input').val());
			card.set('head_color', $('#head_color_input').val());
        }
        card.logo = '/static/css/img/logo_black.png';
		
		
        card.strip = '/static/css/img/strip_2.png';
        card.name = '';
        card.description = '';
        card.discount = '';
        card.date = '01.12.2014';
        card.card_type = 'coupon';
        formReset();
		
    });
    $('.type_1_btn').click(function () {
        $('body').removeClass('t3').removeClass('t2').addClass('t1');
        $('.type_btn').removeClass('active');
		
        $('.type_1_btn').addClass('active');
        if (!card.template_id) {
            $('.mob_preview')[0].src = '/static/css/img/card_1.png';
            $('#bg_color_input').val('#3caffc');
			card.set('bg_color', $('#bg_color_input').val());
			card.set('text_color', $('#text_color_input').val());
			card.set('head_color', $('#head_color_input').val());
        }
		$("#text_color_input").addClass("disactive");
        card.logo = '/static/css/img/logo_black.png';
	
        card.strip = '/static/css/img/strip.png';
        card.name = '';
        card.card_type = 'store';
        formReset();
    });
    $('.type_3_btn').click(function () {
		$("#text_color_input").removeClass("disactive");
        $('body').removeClass('t1').removeClass('t2').addClass('t3');
        $('.type_btn').removeClass('active');
        $('.type_3_btn').addClass('active');
        if (!card.template_id) {
            $('.mob_preview')[0].src = '/static/css/img/card_3.png';
            $('#bg_color_input').val('#fc5441');
			card.set('bg_color', $('#bg_color_input').val());
			card.set('text_color', $('#text_color_input').val());
			card.set('head_color', $('#head_color_input').val());
        }
        card.logo = '/static/css/img/logo_black.png';
		
        card.strip = '/static/css/img/strip_3.png';
        card.name = '';
        card.description = '';
        card.date = '01.12.2014';
        card.card_type = 'event';
        formReset();
    });
    $('.type_1_btn').click();
}
function initSecondStep() {
	
		
    if (($(".name_company").val() === "")) {
        sweetAlert("Ошибка", "Вы не заполнили поле: Название бренда", "error");
        $(".name_company").addClass("incorrect");
        initFirstStep();
        return;
    }
	
    
        if ($(".text_logo").val() === "") {
            sweetAlert("Ошибка", "Вы не ввели текст рядом с логотипом", "error");
            $(".text_logo").addClass("incorrect");
            initFirstStep();
            return;
        }

        if ($(".contact_firm").val() === "") {
            sweetAlert("Ошибка", "Вы не ввели контактные данные вашей организации", "error");
            $(".contact_firm").addClass("incorrect");
            initFirstStep();
            return;
        }

   

/*
    if (($(".address_input").val() !== "") || ($(".address_legend_input").val() !== "") || ($(".notifications_icon_wrapper.bind-notifications-icon img").attr("src") !== "")) {
        if (($(".notifications_icon_wrapper.bind-notifications-icon img").attr("src") === "")) {
            sweetAlert("Ошибка", "Вы не добавили иконку для уведомления", "error");
            initFirstStep();
            return;
        }
    }
	*/

	
	
    $('.step_form').hide();
    $('.step_form.first').show();
    $('.back_mob').hide();
    $('.front_mob').show();
    $('.preview_mob').hide();
    $('.addition_to_phone.step_1').show();
    $('.addition_to_phone.step_2').hide();
    $('.next_button').off('click').on('click', initFinishStep).show();
    $('.prev_button').show().off('click').on('click', initFirstStep);
    $('.finish_button').hide();

    $('.menu_li').removeClass('active');
    $('.design_li').addClass('active');
	

		
  
    card.set('bg_color', $('#bg_color_input').val());
	
	
    card.set('head_color', $('#head_color_input').val());
	

    card.set('text_color', $('#text_color_input').val());

    $('.logo_input').change(handleFileSelect('logo'));
    $('.strip_input').change(handleFileSelect('strip'));
	
	
	$(".inner_head .image_wrapper img").bindImageLoad(function () {
		setTimeout(function () {
			var curh = $(".inner_head .image_wrapper img").height();	
			$(".inner_head .image_wrapper img").css("margin-top",((50-curh)/2)+"px");
			$(".logo_wrapper .image_wrapper img").css("margin-top",((56-curh)/2)+"px");		
		}, 200); // значение паузы взял из головы
		
		
	});
	
}

function removezap(lat, lng, item) {
    $("#" + item).parent().remove();
    card.removePlace(lat, lng);
    if (card.getPlaces().length < 10) {
        $(".send .address_add_btn.add_point").fadeIn();
	
    }
}


function initFirstStep() {

    $('.menu_li').removeClass('active');
    $('.text_li').addClass('active');
    $('.addition_to_phone.step_1').hide();
    $('.addition_to_phone.step_2').show();
    $('.step_form').hide();
    $('.step_form.second').show();
    $('.back_mob').show();
    $('.front_mob').show();
    $('.preview_mob').hide();
    $('.next_button').off('click').on('click', initSecondStep).show();
    $('.prev_button').show().off('click').on('click', initNullStep);
    $('.finish_button').hide();


    $('#name_input').bind('input', function () {
        card.set('name', $('#name_input').val());
    });

    card.set('name', $('#name_input').val());

    $('#contacts_input').bind('input', function () {
        card.set('contacts', $('#contacts_input').val());
    });
    card.set('contacts', $('#contacts_input').val());

    $('#conditions_input').bind('input', function () {

        card.set('conditions', $('#conditions_input').val());

    });
    card.set('conditions', $('#conditions_input').val());

    $('.notifications_icon_input').change(handleFileSelect('notifications_icon'));
    $(".notifications_icon_input").change(function () {
        $(".delcur").fadeIn();
    });

    $('.address_search_btn').click(handlerAutocompleteMap($('.address_input')));

    $('.address_legend_input').change(function () {
        setTimeout(function () {
            card.setPlace({'legend': $('.address_legend_input').val().substr(0, 20)});
        }, 0);
    });

    jQuery('#discount_date_input').datetimepicker({
        format: 'd.m.Y H:i',
        lang: 'ru',
        minDate: 0,
        minTime: 0
    });
    $('#discount_date_input').change(function () {
        setTimeout(function () {
            card.set('date', $('#discount_date_input').val());
        }, 0);
    });
    jQuery('#event_date_input').datetimepicker({
        format: 'd.m.Y',
        lang: 'ru'
    });
    $('#event_date_input').change(function () {
        setTimeout(function () {
            card.set('date', $('#event_date_input').val());
        }, 0);
    });
    card.set('date', $('#discount_date_input:visible').val() || $('#event_date_input:visible').val());

    $('#discount_input').bind('input', function () {

        card.set('discount', $('#discount_input').val());

    });
    card.set('discount', $('#discount_input').val());

    $('#discount_description_input').bind('input', function () {

        card.set('description', $('#discount_description_input').val());

    });
    $('#event_description_input').bind('input', function () {

        card.set('description', $('#event_description_input').val());

    });
    card.set('description', $('#discount_description_input:visible').val() || $('#event_description_input:visible').val());

    $('#confirm_input').change(function () {
        setTimeout(function () {
            card.set('confirm', $('#confirm_input').prop('checked'));
        }, 0);
    });
	$(".inner_head .image_wrapper img").bindImageLoad(function () {
		setTimeout(function () {
				var curh = $(".inner_head .image_wrapper img").height();						
				$(".inner_head .image_wrapper img").css("margin-top",((50-curh)/2)+"px");
				$(".logo_wrapper .image_wrapper img").css("margin-top",((56-curh)/2)+"px");		
		}, 200); // значение паузы взял из головы
		
		
				
			
	});
}
function initFinishStep() {


    if (($(".name_company").val() === "")) {
        sweetAlert("Ошибка", "Вы не заполнили поле: Название бренда", "error");
        $(".name_company").addClass("incorrect");
        initFirstStep();
        return;
    }
	
	     if ($(".text_logo").val() === "") {
            sweetAlert("Ошибка", "Вы не ввели заголовок карты", "error");
            $(".text_logo").addClass("incorrect");
            initFirstStep();
            return;
        }

        if ($(".contact_firm").val() === "") {
            sweetAlert("Ошибка", "Вы не ввели контактные данные вашей организации", "error");
            $(".contact_firm").addClass("incorrect");
            initFirstStep();
            return;
        }

	
    $('.menu_li').removeClass('active');
    $('.send_li').addClass('active');
    $('.addition_to_phone.step_1').hide();
    $('.addition_to_phone.step_2').hide();
    $('.step_form').hide();
    $('.step_form.finish').show();
    $('.back_mob').show();
    $('.front_mob').show();
    $('.preview_mob').hide();
    $('.next_button').off('click').hide();
    $('.prev_button').show().off('click').on('click', initSecondStep);
    $('.finish_button').show();
}





$(window).load(function () {
	
			
	
		$('#bg_color_input').iris({
        width: 132,
        hide: false,
        border: false,
        target: $('.color_scheme.bg_color')[0],
        change: function () {
            setTimeout(function () {
                card.set('bg_color', $('#bg_color_input').val());
            }, 0);
        }
    });

    $('#head_color_input').iris({
        width: 132,
        hide: false,
        border: false,
        target: $('.color_scheme.head_color')[0],
        change: function () {
            setTimeout(function () {
                card.set('head_color', $('#head_color_input').val());
            }, 0);
        }
    });
	
    $('#text_color_input').iris({
        width: 132,
        hide: false,
        border: false,
        target: $('.color_scheme.text_color')[0],
        change: function () {

			if (!$("#text_color_input").hasClass("disactive")) {
				setTimeout(function () {
                	card.set('text_color', $('#text_color_input').val());
            	}, 0);
			}
			
        }
    });

    initNullStep();
    if ($("body").hasClass("redshab")) {
        initFirstStep();
    }

    $('.type_li').click(initNullStep);
    $('.design_li').click(initSecondStep);
    $('.text_li').click(initFirstStep);
    $('.send_li').click(initFinishStep);


    $("input, textarea").focus(function () {
        $("input, textarea").removeClass("incorrect");
    });

    $(".date, .disactive").keypress(function (event) {
        event.preventDefault();
    });

    $(".disactive").keydown(function (event) {
        event.preventDefault();
    });
	$(".disactive").change(function (event) {
        event.preventDefault();
    });

    $(".send.address_search_btn.email").on("click", function (event) {
        event.preventDefault();
        testingmail($(".mail"));
    });

    $(".send.address_search_btn.send_phone").on("click", function (event) {
        event.preventDefault();
        if ($(".phone").val() !== "") {
            send_link('sms');
        } else {
            sweetAlert("Ошибка", "Вы не ввели номер телефона для отправки", "error");

            $(".phone").addClass("incorrect");
        }
    });

	
	$(".send.save_point").on("click", function (event) {
		   event.preventDefault();
		if (($(".notifications_icon_wrapper.bind-notifications-icon img").attr("src") === "")) {
            sweetAlert("Ошибка", "Вы не добавили иконку для уведомления", "error");
            return;
        }

        if ($(".address_input").val() === "") {
            sweetAlert("Ошибка", "Вы не ввели адрес", "error");
            $(".address_input").addClass("incorrect");
            return;
        }

        if ($(".address_legend_input").val() === "") {
            sweetAlert("Ошибка", "Вы не ввели текст уведомления", "error");
            $(".address_legend_input").addClass("incorrect");
            return;
        }
		
		if ((card.isValidPlace()) && (card.getPlaces().length < 10)) {
            card.addPlace();
            itemzap++;
            $('<div><span class="h3_alter">Адрес</span><span class="no_width">' + $('.address_input').val() + '</span><span class="h3_alter">Текстовое уведомление</span><span class="no_width">' + $('.address_legend_input').val() + '</span><div style="clear: both;"></div><a href="#123" title="Удалить точку" class="send normal deletezap" id="' + itemzap + '" onclick="removezap(' + card.places[card.places.length - 2].lat + ',' + card.places[card.places.length - 2].lng + ',' + itemzap + ')">Удалить точку</a></div>').appendTo('.addresses');
            $('.address_input').val('');
            $('.address_legend_input').val('');
        }

        if (card.getPlaces().length == 10) {
            $(".send .address_add_btn.add_point").fadeOut();
        }
		
		$(".hidden").fadeOut();
		$(".address_input").val("");
		$(".address_legend_input").val("");

        $(".delcur").fadeOut();
		$(".save_point").fadeOut();
	});
	
	
	
    $(".send.address_add_btn.add_point").on("click", function (event) {
        event.preventDefault();		
		if ($(".hidden").css("display")!=="none") {
			 sweetAlert("Ошибка", "Введите значения для текущей точки", "error");
			return;
		}	
		$(".hidden").fadeIn();
		$(".save_point").fadeIn();
    });

    $(".delcur").on("click", function (event) {
        event.preventDefault();
        $(".notifications_icon_wrapper.bind-notifications-icon img").css("background-image", "");
        $(".notifications_icon_wrapper.bind-notifications-icon img").remove();
        $(".notifications_icon_wrapper.bind-notifications-icon").html("<img src=''>");
        $(this).fadeOut();
    });

    $('select').chosen({disable_search: true});
    function set_barcode() {
        var textselect = $(".chosen-single span").text();

        if (textselect === "pdf417") {
            $(".barcode").removeClass("qr");
            $(".barcode").removeClass("aztec");
            $(".barcode").addClass("pdf");
            card.barcode_type = 'PKBarcodeFormatPDF417';
            return;
        }
        if (textselect === "QR") {
            $(".barcode").removeClass("pdf");
            $(".barcode").removeClass("aztec");
            $(".barcode").addClass("qr");
            card.barcode_type = 'PKBarcodeFormatQR';
        }
        if (textselect === "Aztec") {
            $(".barcode").removeClass("qr");
            $(".barcode").removeClass("pdf");
            $(".barcode").addClass("aztec");
            card.barcode_type = 'PKBarcodeFormatAztec';
        }
    }

    $(".load a").click(function () {
        $(this).parent().find("input").click();
    });

    $(".strich_sel").change(function () {
        set_barcode();
    });
    set_barcode();
});


function testingmail(item) {
    if (item.val() !== "") {
        var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
        if (!pattern.test(item.val())) {
            item.addClass("incorrect");
            sweetAlert("Ошибка", "Некорректный e-mail", "error");
        } else {
            send_link('email');
        }
    } else {
        item.addClass("incorrect");
        sweetAlert("Ошибка", "Вы не ввели email", "error");
    }
}

$(function(){
 var topPos = $('.floating').offset().top-44;
	console.log(topPos);//topPos - это значение от верха блока до окна браузера
 $(window).scroll(function() { 
  var top = $(document).scrollTop();
  if (top > topPos) $('.floating').addClass('fixed'); 
  else $('.floating').removeClass('fixed');
 });
});

(function ($) {
    $.fn.bindImageLoad = function (callback) {
        function isImageLoaded(img) {
            // Во время события load IE и другие браузеры правильно
            // определяют состояние картинки через атрибут complete.
            // Исключение составляют Gecko-based браузеры.
            if (!img.complete) {
                return false;
            }
            // Тем не менее, у них есть два очень полезных свойства: naturalWidth и naturalHeight.
            // Они дают истинный размер изображения. Если какртинка еще не загрузилась,
            // то они должны быть равны нулю.
            if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            // Картинка загружена.
            return true;
        }

        return this.each(function () {
            var ele = $(this);
            if (ele.is("img") && $.isFunction(callback)) {
                ele.one("load", callback);
                if (isImageLoaded(this)) {
                    ele.trigger("load");
                }
            }
        });
    };
})(jQuery);
