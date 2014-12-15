var metas = document.getElementsByTagName('meta');
var i;
if (navigator.userAgent.match(/iPhone/i)) {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
    }
  }
  document.addEventListener("gesturestart", gestureStart, false);
}
function gestureStart() {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
    }
  }
}
var card = {
	'bg_color': '',
	'text_color': '',
	'head_color': '',

	'logo': 'img/logo_2.png',
	'strip': 'img/strip.png',
	'notifications_icon': '',

	'name': '',
	'conditions': '',
	'contacts': '',

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

	applyChanges: function () {
		$('.bind-bg-color').css({'background-color': this.bg_color});
		$('.bind-head-color').css({'color': this.head_color});
		$('.bind-text-color').css({'color': this.text_color});

		$('.bind-name').html(this.name);
		(this.date) ? $('.bind-date').html(this.date.split(' ')[0]) : $('.bind-date').html('');
		$('.bind-discount').html(this.discount);
		$('.bind-description').html(this.description);

		$('.bind-contacts').html(this.contacts.replace(/\n/gi, '<br>'));
		$('.bind-conditions').html(this.conditions.replace(/\n/gi, '<br>'));

		$('.bind-logo').html('<img src="'+this.logo+'" style="background-color: '+this.bg_color+';">');
		$('.bind-strip').css({'background-image': 'url("'+this.strip+'")'});
		$('.bind-notifications-icon').html('<img src="'+this.notifications_icon+'">');

		(this.confirm) ? $('.bind-confirm').show() : $('.bind-confirm').hide();
	},
	set: function (key, value) {
		this[key] = value;
		this.applyChanges();
		return this;
	},
	isValidPlace: function () {
		var place = this.places[this.places.length-1];
		console.log(place.title.length*place.lat*place.lng);
		return (place.title.length*place.lat*place.lng !== 0)
	},	
	setPlace: function (place) {
		for (var k in place)
			this.places[this.places.length-1][k] = place[k]
	},
	addPlace: function () {
		this.places.push({
			'title': '',
			'lat': '',
			'lng': '',
			'legend': ''
		});
	},
	getPlaces: function () {
		return this.places;
	}
}
function handleFileSelect (field) {
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
			reader.onload = (function(theFile) {
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
function handlerAutocompleteMap (field) {
	function drawItem (model) {
		var parent = field.parent().find('.holder');
		$('<div class="holder_item">'+model.title+'</div>').appendTo(parent).click(function () {
			field.val(model.title);
			handler();
		});
	}
	var handler = function () {
		field.parent().find('.holder').empty();
		$.getJSON('http://maps.googleapis.com/maps/api/geocode/json', {
			'language': 'ru',
			'sensor': true,
			'address': field.val()
		}, function (data) {
			var types = ['street_address', 'route', 'intersection'], pushModel = [];

			for (var i=0, l=data.results.length; i<l; i++) {
				var obj = data.results[i], model = {};
				if ((obj.types.indexOf('street_address') !== -1)||(obj.types.indexOf('route') !== -1)||(obj.types.indexOf('intersection') !== -1)) {
					model.title = obj.formatted_address;
					model.lat = Math.round(obj.geometry.location.lat*1000000)/1000000;
					model.lng = Math.round(obj.geometry.location.lng*1000000)/1000000;
					pushModel.push(model);
				}
			}

			if (pushModel.length === 1) {
				field.val(pushModel[0].title+' ('+pushModel[0].lat+', '+pushModel[0].lng+')');
				card.setPlace({'title': pushModel[0].title, 'lat': pushModel[0].lat, 'lng': pushModel[0].lng});
			} else for (var i=0, l=pushModel.length; i<l; i++)
				drawItem(pushModel[i]);
		});
	}
	return handler;
}
function formReset () {
	$('.t1 #name_input').val('Asus shop');
	$('.t2 #name_input').val('Fruit&Vegatables');
	$('.t3 #name_input').val('Data center');
}
function initNullStep () {
	$('.menu_li').removeClass('active'); $('.type_li').addClass('active');
	$('.addition_to_phone.step_1').hide(); $('.addition_to_phone.step_2').hide();
	$('.step_form').hide(); $('.step_form.zero').show(); $('.back_mob').hide(); $('.front_mob').hide(); $('.preview_mob').show();
	$('.next_button').off('click').on('click', initFirstStep).show();
	$('.prev_button').hide().off('click');
	$('.finish_button').hide();

	$('.type_2_btn').click(function () {
		$('body').removeClass('t3').removeClass('t1').addClass('t2');
		$('.type_btn').removeClass('active');
		$('.type_2_btn').addClass('active');
		$('.mob_preview')[0].src = 'img/card_2.png';
		card.logo = 'img/logo_2.png'; card.strip = 'img/strip_2.png';
		$('#bg_color_input').val('#33e07b');
		card.name = 'Fruits & Vegetables';
		card.description = 'Скидка на овощи';
		card.discount = '12%';
		card.date = '01.12.2014';
		formReset();
	});
	$('.type_1_btn').click(function () {
		$('body').removeClass('t3').removeClass('t2').addClass('t1');
		$('.type_btn').removeClass('active');
		$('.type_1_btn').addClass('active');
		$('.mob_preview')[0].src = 'img/card_1.png';
		card.logo = 'img/logo_1.png'; card.strip = 'img/strip.png';
		$('#bg_color_input').val('#3caffc');
		card.name = 'ASUS shop';
		formReset();
	});
	$('.type_3_btn').click(function () {
		$('body').removeClass('t1').removeClass('t2').addClass('t3');
		$('.type_btn').removeClass('active');
		$('.type_3_btn').addClass('active');
		$('.mob_preview')[0].src = 'img/card_3.png';
		card.logo = 'img/logo_3.png'; card.strip = 'img/strip_3.png';
		$('#bg_color_input').val('#fc5441');
		card.name = 'Data center';
		card.description = 'Приглашение в дата-центр';
		card.date = '01.12.2014';
		formReset();
	});
	$('.type_1_btn').click();
}
function initFirstStep () {
	$('.step_form').hide(); $('.step_form.first').show(); $('.back_mob').hide(); $('.front_mob').show(); $('.preview_mob').hide();
	$('.addition_to_phone.step_1').show(); $('.addition_to_phone.step_2').hide();
	$('.next_button').off('click').on('click', initSecondStep).show();
	$('.prev_button').show().off('click').on('click', initNullStep);
	$('.finish_button').hide();

	$('.menu_li').removeClass('active'); $('.design_li').addClass('active');
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
	card.set('bg_color', $('#bg_color_input').val());

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
	card.set('head_color', $('#head_color_input').val());

	$('#text_color_input').iris({
		width: 132,
		hide: false,
		border: false,
		target: $('.color_scheme.text_color')[0],
		change: function () {
			setTimeout(function () {
				card.set('text_color', $('#text_color_input').val());
			}, 0);
		}
	});
	card.set('text_color', $('#text_color_input').val());

	$('.logo_input').change(handleFileSelect('logo'));
	$('.strip_input').change(handleFileSelect('strip'));
}
function initSecondStep () {
	$('.menu_li').removeClass('active'); $('.text_li').addClass('active');
	$('.addition_to_phone.step_1').hide(); $('.addition_to_phone.step_2').show();
	$('.step_form').hide(); $('.step_form.second').show(); $('.back_mob').show();  $('.front_mob').show(); $('.preview_mob').hide();
	$('.next_button').off('click').on('click', initFinishStep).show();
	$('.prev_button').show().off('click').on('click', initFirstStep);
	$('.finish_button').hide();

	$('#name_input').keydown(function () {
		setTimeout(function () {
			card.set('name', $('#name_input').val());
		}, 0);
	});
	card.set('name', $('#name_input').val());

	$('#contacts_input').keydown(function () {
		setTimeout(function () {
			card.set('contacts', $('#contacts_input').val());
		}, 0);
	});
	card.set('contacts', $('#contacts_input').val());

	$('#conditions_input').keydown(function () {
		setTimeout(function () {
			card.set('conditions', $('#conditions_input').val());
		}, 0);
	});
	card.set('conditions', $('#conditions_input').val());

	$('.notifications_icon_input').change(handleFileSelect('notifications_icon'));

	$('.address_search_btn').click(handlerAutocompleteMap($('.address_input')));
	$('.address_add_btn').click(function () {
		if ((card.isValidPlace())&&(card.getPlaces().length < 10)) {
			card.addPlace();
			$('<div><span class="h3_alter">Адрес</span><span class="no_width">'+$('.address_input').val()+'</span><span class="h3_alter">Текстовое уведомление</span><span class="no_width">'+$('.address_legend_input').val()+'</span><div style="clear: both;"></div></div>').appendTo('.addresses');
			$('.address_input').val(''); $('.address_legend_input').val('');
		}
	});
	$('.address_legend_input').change(function () {
		setTimeout(function () {
			card.setPlace({'legend': $('.address_legend_input').val().substr(0, 20)});
		}, 0);
	});

	jQuery('#discount_date_input').datetimepicker({
	  format:'d.m.Y H:i',
	  lang:'ru'
	});
	$('#discount_date_input').change(function () {
		setTimeout(function () {
			card.set('date', $('#discount_date_input').val());
		}, 0);		
	});
	jQuery('#event_date_input').datetimepicker({
	  format:'d.m.Y',
	  lang:'ru'
	});
	$('#event_date_input').change(function () {
		setTimeout(function () {
			card.set('date', $('#event_date_input').val());
		}, 0);		
	});
	card.set('date', $('#discount_date_input:visible').val()||$('#event_date_input:visible').val());

	$('#discount_input').keydown(function () {
		setTimeout(function () {
			card.set('discount', $('#discount_input').val());
		}, 0);		
	});
	card.set('discount', $('#discount_input').val());

	$('#discount_description_input').keydown(function () {
		setTimeout(function () {
			card.set('description', $('#discount_description_input').val());
		}, 0);		
	});
	$('#event_description_input').keydown(function () {
		setTimeout(function () {
			card.set('description', $('#event_description_input').val());
		}, 0);		
	});
	card.set('description', $('#discount_description_input:visible').val()||$('#event_description_input:visible').val());

	$('#confirm_input').change(function () {
		setTimeout(function () {
			card.set('confirm', $('#confirm_input').prop('checked'))
		}, 0);
	})
}
function initFinishStep () {
	$('.menu_li').removeClass('active'); $('.send_li').addClass('active');
	$('.addition_to_phone.step_1').hide(); $('.addition_to_phone.step_2').hide();
	$('.step_form').hide(); $('.step_form.finish').show(); $('.back_mob').show();  $('.front_mob').show(); $('.preview_mob').hide();
	$('.next_button').off('click').hide();
	$('.prev_button').show().off('click').on('click', initSecondStep);
	$('.finish_button').show();
}
$(document).ready(function () {
	initNullStep();
	$('.type_li').click(initNullStep);
	$('.design_li').click(initFirstStep);
	$('.text_li').click(initSecondStep);
	$('.send_li').click(initFinishStep);

	$('.locker_address').click(function () {
		if ($('.locker_address').hasClass('open')) 
			$('.locker_address').removeClass('open');
		else 
			$('.locker_address').addClass('open');
	})
});

