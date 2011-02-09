// =================================================
//  jQuery Smart Slider
//  version 0.0.1
//
//

(function($){
var _UA = navigator.userAgent.toLowerCase();

var jQSS = {
	opt  : function(){
		var startX, startY, moveX, moveY, startBoxX;
	},
	init : function(){
		var _self     = this;
		var $jQSS     = $('.jQSS');
		var $jQSSUl   = $jQSS.children('ul');
		var $jQSSList = $jQSS.find('li');
		var listWith  = 0;
		
		$jQSS.css({
			'height': $jQSSList.css('height'),
			'overflow':'hidden'
		});
		
		$jQSSUl.css({
			'position':'absolute',
			'top':'0',
			'left':'0'
		})
		
		//中心点を出す？
		//
		
		var hasIMG    = $jQSSList.find('img');
		
		function setUlWidth(){
			$jQSSList.each(function(i){
				var _this = $(this);
				listWith += parseInt(_this.css('width'), 10);
				if(i+2 > $jQSSList.length) $jQSSUl.css('width', listWith);
			});
		}
		setUlWidth();
		_self.addTouchEvent();
	},
	addTouchEvent : function(){
		var _self   = this;
		var $target = $('.jQSS');
		var eventTarget  = $('.jQSS')[0];
		var $moveTarget   = $target.children('ul');
		
		var passStartHandler = function(ev){_self.startHandler(ev, $moveTarget)};
		var passMoveHandler  = function(ev){_self.moveHandler(ev, $moveTarget)};
		var passEndHandler   = function(ev){_self.endHandler(ev, $moveTarget)};
		
		eventTarget.addEventListener("touchstart", passStartHandler, false);
		eventTarget.addEventListener("touchmove",  passMoveHandler, false);
		eventTarget.addEventListener("touchend",   passEndHandler, false);
	},
	startHandler : function(ev, $moveTarget){
		var _self = this;
		var _opt  = _self.opt;
		var touch = ev.touches[0];
		
		_opt.startX = touch.screenX;
		_opt.startY = touch.screenY;
		
		_opt.startBoxX = $moveTarget.offset().left - parseInt($moveTarget.parent().offset().left,10);
	},
	moveHandler : function(ev, $moveTarget){
		var _self = this;
		var _opt  = _self.opt;
		var touch = ev.touches[0];
		
		_opt.moveX = touch.screenX;
		_opt.moveY = touch.screenY;
		var movedX = Math.abs(_opt.moveX - _opt.startX);
		var movedY = Math.abs(_opt.moveY - _opt.startY);
		var vectorX = _opt.startX - _opt.moveX;
		var vectorY = _opt.startY - _opt.oveY;
		var _scrollXNum = _opt.startBoxX - vectorX;
		var _nowX = _opt.startBoxX;
		
		if(movedX < movedY ){
			//v
		}else{
			ev.preventDefault();			
			if(vectorX < 0){//Flick to left
				//console.log('migi');
				if(_scrollXNum < 70) $moveTarget.css('left', _scrollXNum);
			}else{          //Flick to right
				//console.log('hidari');
				if(_scrollXNum > -350) $moveTarget.css('left', _scrollXNum);
			}		
		}
	},
	endHandler : function(ev, $moveTarget){
		console.log(ev.type);
	}
};

$(function(){
					 
	if(_UA.indexOf('iphone') > -1 || _UA.indexOf('ipad') > -1 || _UA.indexOf('android') > -1) jQSS.init();
});

})(jQuery);