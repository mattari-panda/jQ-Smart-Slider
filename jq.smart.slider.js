// -------------------------------------------------
//  jQuery Smart Slider (beta)
//  version 0.8.1
//  Licensed under the MIT
//  
//
// -------------------------------------------------
(function($){
var _UA = navigator.userAgent.toLowerCase();

$.jQSS = function(element, _opt){
	this.options  = $.extend({}, this.options, _opt);
	this.$element = $(element);
	this._init();
	(this.options.LRBtn) ? this.addBottonEvent() : null;
	(this.options.posSwitch) ? this.addPositionSwitch() : null;
};


$.jQSS.prototype = {
	// Set Options ------------------------------------
	options :{
		startX       : 0,
		startY       : 0,
		moveX        : 0,
		moveY        : 0,
		vectorX      : 0,
		vectorY      : 0,
		startBoxX    : 0,
		targetWidth  : 0,
		leftLimit    : 0,
		rightLimit   : 0,
		movedVector  : '',
		delimitNum   : 0.333,
		
		pageTotalNum : 0,
		nowPageNum   : 0,
		
		slideWidth   : 0,       // 一回にスライドする幅
		rangeNum     : 0,       // 子要素をいくつ区切りでスライドさせるか
		LRBtn        : false,   // LRボタンを付けるかどうか
		leftBtn      : '.jQSSL',// Lボタンのクラス名
		rightBtn     : '.jQSSR',// Rボタンのクラス名
		posSwitch    : false,   // 場所を示すやつを付けるかどうか
		posMark      : '●',
		firstSelect  : ''
	},
	
	// Set DOM Name -----------------------------------
	$Target   : null,      //touchTarget
	$btnLeft  : null,
	$btnRight : null,
	$posList  : null,
	
	
	
	_init : function(){
		var _self = this;
		
		var $el   = _self.$element;
    var _o    = _self.options;
		
		_self.$Target = $el.children('ul, ol, div');
		
		$el.css({'overflow':'hidden'});//hidden//visible
		
		//$el.append('<div class="cover" style=" position:absolute; top:0px; left:0px; width:100%; height:100%; bacground-color:rgba(255,255,255,.8);"></div>');
		
		
		_self.$Target.css({'position':'absolute','top':'0','left':'0'});
		_o.targetWidth = parseInt(_self.$Target.width(),10);
		_o.rightLimit  = _o.targetWidth - _self.$Target.parent().width();
		
		if(_o.firstSelect){
			var selectNum = _self.$Target.find(_o.firstSelect).index();
			_self.$Target.find(_o.firstSelect).addClass('select');
			_o.nowPageNum = Math.floor(selectNum/_o.rangeNum);
			_self.$Target.css({'left' : (_o.nowPageNum*_o.slideWidth)*-1});
		}
		
		// Set TouchEvent -------------------------
		_self.addTouchEvent();
		
		// Set Page Number ------------------------
		var childrenNum = _self.$Target.find('li, div, p').length;
		_o.pageTotalNum = (_o.rangeNum > 1) ? Math.ceil(childrenNum/_o.rangeNum) : childrenNum;
		
		// Set slideWidth -------------------------
		if(_o.rangeNum == 0 && _o.slideWidth == 0){
			_o.slideWidth = parseInt($el.css('width'),10);
		}else if(_o.rangeNum > 0 && _o.slideWidth == 0){
			for(var i=0; i<_o.rangeNum; i++){
				var eachChild = _self.$Target.children('li').eq(i);
				_o.slideWidth += parseInt(eachChild.css('width'),10);
				_o.slideWidth += parseInt(eachChild.css('margin-left'),10);
				_o.slideWidth += parseInt(eachChild.css('margin-right'),10);
				_o.slideWidth += parseInt(eachChild.css('padding-left'),10);
				_o.slideWidth += parseInt(eachChild.css('padding-right'),10);
			}
		}
	},
	
	// L - R Button Setting ----------------------------
	addBottonEvent : function(){
		var _self = this;
		
		var $el   = _self.$element;
		var _o    = _self.options;
		
		_self.$btnLeft  = _self.$element.parent().find(_o.leftBtn);
		_self.$btnRight = _self.$element.parent().find(_o.rightBtn);
		
		_self.$btnRight.click(function(ev){_self.slideMove('left', null); return false;});
		_self.$btnLeft.click(function(ev){_self.slideMove('right', null); return false;});
		
		_self.LRBtnSwitch();
	},
	
	// Position Switch Setting -------------------------
	addPositionSwitch : function(){
		var _self = this;
		
		var $el   = _self.$element;
		var _o    = _self.options;
		
		var setPosElement = $('<div></div>').attr('class','jQSSPos');
		var setPosList    = $('<ul></ul>').attr('class','jQSSPosList');
		var eachPosList   = $('<li></li>').append($('<a></a>').attr({'href':'#'}));
		
		for(var i=0; i<_o.pageTotalNum; i++){
			var eachPosMark = (_o.posMark == 'number') ? i+1 : _o.posMark;
			eachPosList.children('a').text(eachPosMark);
			setPosList.append(eachPosList.clone());
		}
		
		setPosElement.append(setPosList);
		$el.after(setPosElement);
		
		$el.parent().find('.jQSSPosList>li').children('a').click(function(){return false;});
		$el.parent().find('.jQSSPosList>li').eq(_o.nowPageNum).children('a').addClass('select');
	},
	
	// Touch Event Setting -----------------------------
	addTouchEvent : function(){
		var _self = this;
		var $el   = _self.$element;
		var _o    = _self.options;
		
		_self.$Target[0].addEventListener("touchstart", startHandler, false);
		_self.$Target[0].addEventListener("touchmove",  moveHandler, false);
		_self.$Target[0].addEventListener("touchend",   endHandler, false);
		_self.$Target[0].addEventListener("touchcancel",cancelHandler, false);
		
		var LinkURL = null;
		
		_self.$Target.find('a').click(function(ev){
			ev.preventDefault();
			if(LinkURL == 'start'){
				location.href = $(this).attr('href');
			}
			return false;
		});
		
		function cancelHandler(ev){
			//alert('Cancel!');
		}
		
		function startHandler(ev){
			LinkURL = 'start';
			var touch = ev.touches[0];
		
			_o.startX = touch.screenX;
			_o.startY = touch.screenY;
			
			_o.startBoxX = _self.$Target.offset().left - parseInt(_self.$Target.parent().offset().left,10);
		}
		
		function moveHandler(ev){
			LinkURL = 'move';
			var touch = ev.touches[0];
			
			_o.moveX = touch.screenX;//screenX//pageX
			_o.moveY = touch.screenY;//screenY//pageY
			
			var movedX = Math.abs(_o.moveX - _o.startX);
			var movedY = Math.abs(_o.moveY - _o.startY);
			
			_o.vectorX = _o.startX - _o.moveX;
			_o.vectorY = _o.startY - _o.moveY;
			
			_o.scrollXNum = _o.startBoxX - _o.vectorX;
			
			if(movedX < movedY ){
				_o.movedVector = 'vertical';
			}else{
				ev.preventDefault();
				_o.movedVector = 'horizontal';
				_self.$Target.css('left', _o.scrollXNum);	
			}
		}
		
		function endHandler(ev){
			ev.preventDefault();
			
			var nowTargetX = parseInt(_self.$Target.offset().left,10);
			
			if(nowTargetX > _o.leftLimit){
				if(_o.movedVector != 'vertical') _self.slideMove('left' , 0);
			}else if(nowTargetX < _o.rightLimit*-1){
				if(_o.movedVector != 'vertical') _self.slideMove('right', _o.pageTotalNum-1);
			}else{
				var touchVector = (_o.vectorX > 0) ? 'left' : 'right';
				
				var setNum;
				if(touchVector == 'right'){
					setNum = Math.floor(Math.abs(nowTargetX/_o.slideWidth)+(_o.delimitNum));
				}else{
					setNum = Math.floor(Math.abs(nowTargetX/_o.slideWidth)+(1-_o.delimitNum));
				}
				
				_self.slideMove(touchVector, setNum);
			}
			
			_o.movedVector = '';
		}
	},
	
	// Slide Move Handler ------------------------------
	slideMove : function(_vector, _setNum){
		var _self = this;
		var $el   = _self.$element;
		var _o    = _self.options;
		
		var targetX;
		
		_o.nowPageNum = (_setNum != null) ? _setNum :
		                (_vector == 'left') ? _o.nowPageNum+1 : _o.nowPageNum-1;
		
		targetX = (_o.nowPageNum*_o.slideWidth)*-1;
		_self.$Target.animate({'left': targetX},200);
		
		// Use LR Button ---------------------------
		if(_o.LRBtn){
			_self.LRBtnSwitch();
		}
		
		// Use Position Switch ---------------------
		if(_o.posSwitch){
			$el.parent().find('.jQSSPosList>li').children('a').removeClass('select');
			$el.parent().find('.jQSSPosList>li').eq(_o.nowPageNum).children('a').addClass('select');
		}
		
		return false;
	},
	LRBtnSwitch : function(){
		var _self = this;
		var _o    = _self.options;
		
		_self.$btnLeft.show();
		_self.$btnRight.show();
		
		if(_o.nowPageNum == 0){
			_self.$btnLeft.hide();
		}else if(_o.nowPageNum == _o.pageTotalNum-1){
			_self.$btnRight.hide();
		}
	}
};

$.fn.jQSS = function(options){
	return this.each(function(){
		new $.jQSS(this, options);
	});
};

})(jQuery);