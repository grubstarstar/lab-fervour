var frameWidth;

$(document).ready(function() {
	frameWidth = $('.viewer .frame').width();
});

/* define circular list class */
function CircularList(list) {
	this.Items = new Array(list.length);
	if(list.length > 1) {
		this.Items[0] 						= new CircularListItem();
		this.Items[0].val 					= list[0];
		this.Items[1] 						= new CircularListItem();
		this.Items[1].prev 					= this.Items[0];
		for(var i = 1; i < list.length - 1; i++) {
			this.Items[i].val 				= list[i];
			this.Items[i + 1] 				= new CircularListItem();
			this.Items[i + 1].prev 			= this.Items[i];
			this.Items[i - 1].next 			= this.Items[i];
		}
		this.Items[list.length - 1].val 	= list[list.length - 1];
		this.Items[list.length - 1].next 	= this.Items[0];
		this.Items[0].prev 					= this.Items[list.length - 1];
		this.Items[list.length - 2].next	= this.Items[list.length - 1];
	} else {
		this.Items[0] 						= new CircularListItem();
		this.Items[0].val 					= list[0];
		this.Items[0].prev 					= this.Items[0];
		this.Items[0].next 					= this.Items[0];
	}
}
CircularList.prototype.insertAt = function(obj, position) {
	
}

// define the individual Circular list items
function CircularListItem(value) {
	this.val = value;
	this.next = arguments[1];
	this.prev = arguments[2];
}
CircularListItem.prototype.insertAfter = function(obj) {
	this.next.prev = obj;
	this.next = obj;
}
CircularListItem.prototype.insertBefore = function(obj) {
	this.prev.next = obj;
	this.prev = obj;
}
	
function Picture() {
	// main image
	this.img_src;
	this.imgObj;
	// thumbnail image
	this.thumb_src;
	this.thumb_imgObj
	this.title;
	this.subtitle;
	this.description;
	this.isSelected = false;
}
Picture.prototype.loadImage = function() {
	var self = this;
	// main image
	this.imgObj = new Image();
	this.imgObj.src = this.img_src;
	// thumbnail image
	this.thumb_imgObj = new Image();
	this.thumb_imgObj.src = this.thumb_src;
	// onload event hjandler
	this.imgObj.onload = function() {
		if(Gallery.currentGallery.getSelected().val.imgObj.src == self.imgObj.src && $('.viewer .frame').css('background-image').match(Gallery.throbber.src)) {
			$('.viewer .frame').css({'background-position' : '0 0'});
			Gallery.currentGallery.fadeInPicture(self);
		}
	}
}

/* define the gallery object */
function Gallery(circList, layout) {
	this.pictures = circList; 	// A CircularList
	var selected;		// A CirularListItem
	this.getSelected = function() { return selected; }
	this.setSelected = function(pic) {
		if(selected) selected.isSelected = false;
		selected = pic;
		pic.isSelected = true;
	}
	this.scrollBusy = { val: false };
	this.thumbnails = [];
	this.layout = layout.cssClass;
	this.rows = layout.thumbnailRows;
	this.isInitialised = false;
	this.description = '';
}
Gallery.prototype.slideLeft = function(picture) {
	if(this.pictures.Items.length <= 1) return false;

	// these lines are to display the throbber instead of the image if it hasn't loaded yet
	var affective_src = picture.imgObj.complete ? picture.imgObj.src : Gallery.throbber.src;
	var img_width = picture.imgObj.complete ? picture.imgObj.width : frameWidth;
	var new_background_offset_x = picture.imgObj.complete ? 0 : ( frameWidth - Gallery.throbber.width   ) / 2;
	var new_background_offset_y = picture.imgObj.complete ? 0 : ( $('.frame').height() - Gallery.throbber.height ) / 2;
	var last_image_was_throbber = $('.viewer .frame').css('background-image').replace(/url\(\"(.*)\"\)/g, "$1") == Gallery.throbber.src;
	var old_background_offset_x = last_image_was_throbber ? ( $('.frame').width() - Gallery.throbber.width   ) / 2 : 0;
	var old_background_offset_y = last_image_was_throbber ? ( $('.frame').height() - Gallery.throbber.height ) / 2 : 0;

	var scrollBusy = this.scrollBusy;
	scrollBusy.val = true;
	var frame = $('.viewer .frame');
	frame.css({'position':'static'});
	var newFrame = frame.clone().css({

		'background-image' : 'url("' + affective_src + '")',
		'background-position' : new_background_offset_x + "px " + new_background_offset_y + "px",
		'width' : '0',
		'float' : 'right',
		'margin' : '0px 0px'
	});
	frame.css('float', 'left');
	frame.animate({ "width":"hide", "backgroundPosition":"-" + frameWidth + "px " + old_background_offset_y + "px" }, 'slow', function() {
		frame.remove();
		scrollBusy.val = false;
	});
	$('.viewer').find('.right_scroll').after(newFrame);
	newFrame.animate({ "width":img_width }, 'slow');
	$('.viewer').animate({ "width":img_width + 70, "backgroundPosition": new_background_offset_x + "px " + new_background_offset_y + "px" }, 'slow');
	
	// animate the decription text
	this.animateDescription();
}
Gallery.prototype.slideRight = function(picture) {
	if(this.pictures.Items.length <= 1) return false;
	
	// these lines are to display the throbber instead of the image if it hasn't loaded yet
	var affective_src = picture.imgObj.complete ? picture.imgObj.src : Gallery.throbber.src;
	var img_width = picture.imgObj.complete ? picture.imgObj.width : frameWidth;
	var new_background_offset_x = picture.imgObj.complete ? 0 : ( frameWidth - Gallery.throbber.width   ) / 2;
	var new_background_offset_y = picture.imgObj.complete ? 0 : ( $('.frame').height() - Gallery.throbber.height ) / 2;
	var last_image_was_throbber = $('.viewer .frame').css('background-image').replace(/url\(\"(.*)\"\)/g, "$1") == Gallery.throbber.src;
	var old_background_offset_x = last_image_was_throbber ? ( $('.frame').width() - Gallery.throbber.width   ) / 2 : 0;
	var old_background_offset_y = last_image_was_throbber ? ( $('.frame').height() - Gallery.throbber.height ) / 2 : 0;

	var scrollBusy = this.scrollBusy;
	scrollBusy.val = true;
	var frame = $('.viewer .frame');
	frame.css({'position':'static'});
	// animate the viewer and contents
	var newFrame = frame.clone().css({

		'background-image' : 'url("' + affective_src + '")',
		'background-position' : "-" + (frameWidth - new_background_offset_x) + "px " + new_background_offset_y + "px",
		'width' : '0',
		'float' : 'left',
		'margin' : '0px 0px'
	});
	frame.css('float', 'right');
	frame.animate({ "width":"0" }, 'slow', function() {
		frame.remove();
		scrollBusy.val = false;
	});
	$('.viewer').find('.right_scroll').after(newFrame);
	newFrame.animate({ "width":img_width, "backgroundPosition":  new_background_offset_x + "px " + new_background_offset_y + "px" }, 'slow');
	$('.viewer').animate({ "width":img_width + 70, "backgroundPosition": new_background_offset_x + "px " + new_background_offset_y + "px" }, 'slow');
	
	// animate the decription text
	this.animateDescription();
}
Gallery.prototype.fadeInPicture = function(picture) {

	var scrollBusy = this.scrollBusy;
	scrollBusy.val = true;
	
	var frame = $('.viewer .frame');
	var viewer = $('.viewer');
	var newFrame = frame.clone();
	newFrame.css({
		'backgroundImage' : 'url("' + picture.img_src + '")',
		'position' : 'absolute',
		'left' : '35px',
		'right' : '0',
	}).width(picture.imgObj.width);
	newFrame.hide();
	if(newFrame.width() > frame.width()) {
		newFrame.width(frame.width);
		viewer.append(newFrame);
		newFrame.fadeIn(function() {
			$(this).css({'position':'static'});
		});
		frame.fadeOut(function() {
			frame.remove();
			onComplete();
		});
		newFrame.animate({'width': picture.imgObj.width + 'px'});
		viewer.animate({'width': picture.imgObj.width + 70 + 'px'});
	} else {
		newFrame.width(frame.width);
		frame.animate({'width': picture.imgObj.width + 'px'});
		viewer.append(newFrame);
		viewer.animate({'width': picture.imgObj.width + 70 + 'px'});
		frame.fadeOut(function() {
			frame.remove();
			onComplete();
		});
		
		newFrame.fadeIn();
	}
	
	function onComplete() {
		scrollBusy.val = false;
	}
	
	// animate the decription text
	this.animateDescription();
}
Gallery.prototype.init = function() {
	// load main images
	var selected = this.getSelected();
	selected.val.loadImage();
	var next = selected.next;
	var prev = selected.prev;
	while(next != prev) {
		next.val.loadImage();
		prev.val.loadImage();
		next = next.next;
		prev = prev.prev;
	}
	next.val.loadImage();
	
	// initialise thumbnails data structure and load thumbnails
	var pIdx = 0;
	for(var i = 0; i < Math.ceil(this.pictures.Items.length / this.rows); i++) {
		this.thumbnails[i] = [];
		for(var j = 0; j < this.rows; j++) {
			this.thumbnails[i][j] = this.pictures.Items[pIdx];
			pIdx++;
			if(pIdx >= this.pictures.Items.length) break;
		}
	}
	this.isInitialised = true;
}
Gallery.prototype.display = function() {
	if(!this.isInitialised) return;
	var self = this;
	var thisGal = self;
	var selected = self.getSelected();
	var selectedPicture = selected.val;
	replaceLayoutClass();
	
	var img_src = selectedPicture.imgObj.complete ? selectedPicture.img_src : Gallery.throbber.src;
	var width = selectedPicture.imgObj.complete ? selectedPicture.imgObj.width : frameWidth;
	var background_offset_x = selectedPicture.imgObj.complete ? 0 : ( frameWidth - Gallery.throbber.width   ) / 2;
	var background_offset_y = selectedPicture.imgObj.complete ? 0 : ( $('.frame').height() - Gallery.throbber.height ) / 2;
	
	var frame = $('.viewer .frame').empty();
	var viewer = $('.viewer');
	frame.css({
		'background-image' : 'url("' + img_src + '")',
		'background-position' : background_offset_x + "px " + background_offset_y + "px"
	});
	
	frame.width(width);
	viewer.width(width + 70);
	
	// create thumbnail DOM objects
	$('.thumbnails').empty();
	for(var i in self.thumbnails) {
		var col = $('<div class="column">');
		for(var j in self.thumbnails[i]) {
			var thumbJq = makeThumb(self.thumbnails[i][j]);
			col.append(thumbJq);
		}
		$('.thumbnails').append(col);
	}
	
	// MAKE THUMB
	function makeThumb(picClI) {
		var outer = $('<div class="outer">');
		var inner = $('<img src="' + picClI.val.thumb_src + '">').appendTo(outer);
		
		// register click event
		inner.click(function() {
			self.select(picClI);
		});
		
		var w = inner.width();
		var h = inner.height();
		var p = outer.css('padding-left').replace(/px/,'');;
		
		// register hover event
		inner.hover(function() {
			$(this).animate({
				width:'+=4px',
				height:'+=4px',
				left:'-=2px',
				top:'-=2px'
			},'fast');
		},
		function() {
			$(this).animate({
				width:'-=4px',
				height:'-=4px',
				left:'+=2px',
				top:'+=2px'
			},'fast');
		});
		return outer;
	}
	
	function replaceLayoutClass() {
		var self = $('#gallery_layout');
		self.attr('class', thisGal.layout);
		var layoutElements = $('[layout]').hide();
		layoutElements.each(function() {
			if($(this).attr('layout') == thisGal.layout) {
				$(this).show();
			}
		});
	}
	
	// animate the decription text
	this.animateDescription();
}
Gallery.prototype.animateDescription = function() {
	
	var self = this;
	var desc = $('.description_box[layout="' + this.layout + '"]');
	var animateTime = 300;

	// update the title and subtitle
	if(self.getSelected().val.title && self.getSelected().val.subtitle) {
		desc.find('h1').empty().append($('<div/>').html(self.getSelected().val.title).hide().fadeIn(animateTime * 2));
		desc.find('h2').empty().append($('<div/>').html(self.getSelected().val.subtitle).hide().fadeIn(animateTime * 2));
	}
	
	// animate the description
	var newTextObj = $('<div/>').append(self.description);
	var oldTextObj = $('<div/>').append(desc.find('p').html());
	var descPara = desc.find('p').empty().append(oldTextObj);
	var pHeight = descPara.height();
	oldTextObj.height(pHeight);
	
	// this is here because it this method has been changed so that instead of having a new description for every picture, there is just one for each gallery. So this will only get past here oon first loading the gallery. To change this to allow new descriptions for every picture, us the description property of the picture object rather than the gallery object, and optionally remove the condoitional below.
	if(oldTextObj.html().match(newTextObj.html())) return;
	
	descPara.animate({
		"padding-bottom":0,
		"padding-top":10
	}, animateTime * descPara.css("padding-bottom").replace('px','') / pHeight );
	
	oldTextObj.animate({
		"margin-top":pHeight,
		"height":0,
		"opacity":0,
		"-moz-opacity":0,
		"filter":"alpha(opacity=0)"
	}, animateTime, function() {
		oldTextObj.hide();
		descPara.css({
			"padding-bottom":5,
			"padding-top":5,
		});
		newTextObj.css({
			"height":"0",
			"opacity":0,
			"-moz-opacity":0,
			"filter":"alpha(opacity=0)"
		});
		descPara.append(newTextObj);
		newTextObj.animate({
			"height":pHeight,
			"opacity":1
		},animateTime,function() {
			//remove oldText div and remove 'div' surrounding newTextObj
			oldTextObj.remove();
			var text = newTextObj.html();
			newTextObj.remove();
			descPara.append(text);
			descPara.css('height','');
		});
	});
}
Gallery.prototype.selectNext = function() {
	if(this.scrollBusy.val) return false;
	this.setSelected(this.getSelected().next);
	this.slideRight(this.getSelected().val);
}
Gallery.prototype.selectPrevious = function() {
	if(this.scrollBusy.val) return false;
	this.setSelected(this.getSelected().prev);
	this.slideLeft(this.getSelected().val);
}
Gallery.prototype.select = function(picClI) {
	if(this.scrollBusy.val) return false;
	this.setSelected(picClI);
	this.fadeInPicture(this.getSelected().val);
}

// Static Gallery methods
Gallery.currentGallery = undefined;
Gallery.fadeOut = function(onComplete) {
	$('#gallery_layout').fadeOut(onComplete);
}
Gallery.fadeIn = function(onComplete) {
	$('#gallery_layout').fadeIn(onComplete);
}

/* load throbbers */
Gallery.throbber = new Image();
Gallery.throbber.src = "imgs/flower.gif";
Gallery.throbber2 = new Image();
Gallery.throbber2.src = "imgs/small.gif";
//Gallery.throbber.src = "imgs/drops.gif";
//Gallery.throbber.src = "imgs/loading.gif";
//Gallery.throbber.src = "imgs/standard.gif";