$(document).ready(function() {
	
	var current;
	
	// hide all gallery elements until ready to display
	$('[layout]').hide();
	
	// load all the scroll tabs
	var scroll_tabs_imgs = [];
	scroll_tabs_imgs[0] = new Image();
	scroll_tabs_imgs[0].src = 'imgs/left_scroll_short.png';
	scroll_tabs_imgs[1] = new Image();
	scroll_tabs_imgs[1].src = 'imgs/right_scroll_short.png';
	scroll_tabs_imgs[2] = new Image();
	scroll_tabs_imgs[2].src = 'imgs/left_scroll_600.png';
	scroll_tabs_imgs[3] = new Image();
	scroll_tabs_imgs[3].src = 'imgs/right_scroll_600.png';
	
	// Handles the checkbox crosses
	$('.special_chkbx').closest('tr').click(function() {
		if(current && current.get(0) == $(this).get(0)) return false;
		if(current) deselect(current);
		current = $(this);
		select(current);
		Gallery.fadeOut(function() {
			Gallery.currentGallery  = galleries[current.find('.special_chkbx').attr('gallery')];
			Gallery.currentGallery.display();
			Gallery.fadeIn();
		});
	});
	
	function select(jqObj) {
		var x = jqObj.find('.x');
		var special_chkbx = jqObj.find('.special_chkbx');
		x.animate(
			{
				backgroundPosition: "0 0"
			},
			200,
			function() {
				special_chkbx.animate(
				{
					backgroundPosition: "0 0"
				},
				200);
			}
		);
	}
	
	function deselect(jqObj) {
		jqObj.find('.special_chkbx').fadeOut(300, function() {
			var self = $(this);
			self.css({backgroundPosition: "-16px -16px"});
			self.find('.x').css({backgroundPosition: "16px -16px"});
			self.show();
		});
	}
	
	// initialise the sub menus to hidden
	$('div[subof]').hide();
	
	var selected_menu;
	
	// create click handlers for each menu heading
	$('.menu_heading').each(function() {
		var menu_heading = $(this);
		var sub_menu = $('div[subof="' + menu_heading.attr('id') + '"]');

		menu_heading.click(function() {
			if(selected_menu == this) {
				unstrikethrough($(selected_menu));
				selected_menu = undefined;
			} else {
				unstrikethrough($(selected_menu));
				strikethrough($(this));
				selected_menu = this;
			}
		});
	});
	
	// strikethrough
	function strikethrough(jqObj) {
		strikediv = $('<div class="strikethrough" style="z-index: 10"></div>');
		var sub_menu = $('div[subof="' + jqObj.attr('id') + '"]');
		sub_menu.slideToggle(500);
		$(jqObj).append(strikediv);
	}
	function unstrikethrough(jqObj) {
		var sub_menu = $('div[subof="' + jqObj.attr('id') + '"]');
		sub_menu.slideToggle(500);
		$(jqObj).find('.strikethrough').remove();
	}
	

	/**************************************/
	/****** Build the gallery objects *****/
	/**************************************/	
	var horiz_layout = {
		cssClass : "horizontal",
		thumbnailRows		: 1
	}
	var vert_layout = {
		cssClass : "vertical",
		thumbnailRows		: 6
	}

	var galleries = [];
	$('.gallery').each(function() {
		var p_arr = [];
		galJq = $(this);
		$(this).find('li').each(function() {
			var p = new Picture();
			p.img_src = $(this).attr('img_src');
			p.thumb_src = $(this).attr('thumb_src');
			if($(this).attr('title')) {
				p.title = $(this).attr('title').split(':')[0];
				p.subtitle = $(this).attr('title').split(':')[1];
			}
			p.description = $(this).html();
			p_arr.push(p);
			$(this).hide();
		});
		var layout = $(this).attr("thumbnails");
		var thisGal = galleries[$(this).attr('id')] = new Gallery(new CircularList(p_arr), (layout == "horizontal") ? horiz_layout : vert_layout );
		
		var desc = $(this).find('p.description');
		thisGal.description = desc.html();
		desc.hide();
		
		// find selected image from default
		for(var i in thisGal.pictures.Items) {
			if(thisGal.pictures.Items[i].val.img_src == galJq.find('li[default]').attr('img_src')) {
				thisGal.setSelected(thisGal.pictures.Items[i]);
			}
			if((i == thisGal.pictures.Items.length - 1) && !thisGal.getSelected()) {
				thisGal.setSelected(thisGal.pictures.Items[0]);
			}
		}
		// set if current gallery
		if($(this).attr('default')) {
			Gallery.currentGallery  = thisGal;
		};
	});
	
	/*****************************************************************/
	/****** Display the default gallery and initialise galleries *****/
	/*****************************************************************/

	// initialise the current gallery
	Gallery.currentGallery.init();
	
	// then initialise the others
	var currentGalleryId = $('.gallery[default="true"]').first().attr('id');
	for(var id in galleries) {
		if(id != currentGalleryId) {
			galleries[id].init();
		}
	}
	
	// wait for first image of current gallery, and the scroll tabs to be loaded before displaying the current gallery
	var interval = setInterval(function() { checkFirstImageLoaded(Gallery.currentGallery); }, 150);
		
	function checkFirstImageLoaded(gal) {
		var allLoaded = true;
		for(var i in scroll_tabs_imgs) {
			allLoaded = scroll_tabs_imgs[i].complete ? allLoaded : false;
		}
		if(gal.getSelected().val.imgObj.complete && allLoaded) {
			clearInterval(interval);
			Gallery.currentGallery.display();
		}
	}


	/***********************************************************************/
	/****** Set up menu click handlers to select and display a gallery *****/
	/***********************************************************************/	
	
	var viewer = $('.viewer');
	viewer.find('.left_scroll').click(onLeftScroll);
	viewer.find('.right_scroll').click(onRightScroll);
	
	function onLeftScroll() {
		Gallery.currentGallery.selectPrevious();
	}

	function onRightScroll() {
		Gallery.currentGallery.selectNext();
	}
});

