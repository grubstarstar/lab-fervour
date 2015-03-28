$(document).ready(function() {
	
	// CONTACT PAGE
	$('#contact_overlay').hide();
	$('#contact_overlay').width($(window).width());
	$('#contact_overlay').height($(window).height());
	$('#contact_overlay').css('left', 0);
	$('#contact_overlay').css('top', 0);
	$('.menu_heading#contact').click(function() {
		var window_width = $(window).width();
		var window_height = $(window).height();
		var overlay_width = $('#contact_overlay #contact_box').width();
		var overlay_height = $('#contact_overlay #contact_box').height();
		$('#contact_overlay #contact_box').css('left', ( window_width - overlay_width ) / 2 + "px");
		$('#contact_overlay #contact_box').css('top', ( window_height - overlay_height ) / 2 + "px");
		$('#contact_overlay' ).fadeToggle(500);
	});
		
	$('#contact_overlay .close a').click(function() {
		$('#contact_overlay' ).fadeToggle(500);
		$('#contact_form .feedback_message').hide();
		$('#contact_form .feedback_message').empty();
	});
	
	// AJAX CONTACT REQUEST
	$('#contact_form').ajaxForm({
		beforeSubmit: function() {
			$('#contact_form .feedback_message').hide();
			$('#contact_form .feedback_message').css({
				"background-image":"url('imgs/small.gif')",
				"background-position":"right 5px",
				"background-repeat":"no-repeat"
			});
		$('#contact_form .feedback_message').fadeIn();
		},
		success: function(json) {
			if(json.result.match(/Message sent successfully/)) {
				$('#contact_form .feedback_message').css({
					"background-image":"url('imgs/tick-icon.jpg')"
				});
			} else {
				$('#contact_form .feedback_message').css({
					"background-image":"url('imgs/cross.png')"
				});
			}
		}
	}); 
	
	// ABOUT PAGE
	$('#about_overlay').hide();
	$('#about_overlay').width($(window).width());
	$('#about_overlay').height($(window).height());
	$('#about_overlay').css('left', 0);
	$('#about_overlay').css('top', 0);
	$('.menu_heading#about').click(function() {
		var window_width = $(window).width();
		var window_height = $(window).height();
		var overlay_width = $('#about_overlay #about_box').width();
		var overlay_height = $('#about_overlay #about_box').height();
		$('#about_overlay #about_box').css('left', ( window_width - overlay_width ) / 2 + "px");
		$('#about_overlay #about_box').css('top', ( window_height - overlay_height ) / 2 + "px");
		$('#about_overlay' ).fadeToggle(500);
	});
	
	$('#about_overlay .close a').click(function() {
		$('#about_overlay' ).fadeToggle(500);
	});
	
	// Deal with window resizing
	$(window).resize(function(event) {
		$('#contact_overlay, #about_overlay').width($(window).width());
		$('#contact_overlay, #about_overlay').height($(window).height());
		
		var window_width = $(window).width();
		var window_height = $(window).height();
		var overlay_width = $('#contact_overlay #contact_box, #about_overlay #about_box').width();
		var overlay_height = $('#contact_overlay #contact_box, #about_overlay #about_box').height();
		$('#contact_overlay #contact_box, #about_overlay #about_box').css('left', ( window_width - overlay_width ) / 2 + "px");
		$('#contact_overlay #contact_box, #about_overlay #about_box').css('top', ( window_height - overlay_height ) / 2 + "px");
	});
	
});