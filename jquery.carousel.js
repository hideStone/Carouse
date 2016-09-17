;
(function($) {
	var Carouse = function(ele, opt) {
		this.config = {
			type: 'slide', //轮播类型
			eventType: 'click', //触发方式
			Interval: true, //是否有间隔
			IntervalTime: 3000, //间隔时间
			animationTime: 2000, //动画时间
			bullets: true, //是否有指示按钮
			buttons: false, //切换按钮
			prevClass: '.prev',
			nextClass: '.next'
		};
		this.setting = $.extend({}, this.config, opt);
		this.$ele = ele;
		this.slideBox = this.$ele.find('.slide-content');
		this.slideItem = this.slideBox.find('li');
		this.singleW = this.slideItem.eq(0).outerWidth();
		this.slideItemLen = this.slideItem.length;
		this.curIndex = 0;
		this.bulletIndex = 0;
		this.slideTotal = 0;
		this.timer = null;
		this.isanimate = false;
	};

	Carouse.prototype = {
		/**
		 * 初始化插件
		 * @return {[type]} [description]
		 */
		init: function() {
			var _this_ = this,
				config = _this_.setting,
				slideBox = _this_.slideBox,
				slideItem = _this_.slideItem,
				singleW = _this_.singleW,
				slideItemLen = _this_.slideItemLen;
			if (config.type == 'slide') {
				//克隆一个放最前面
				slideItem.eq(slideItemLen - 1).clone(true).insertBefore(slideItem.eq(0))
					//克隆一个放最后面
				slideItem.eq(0).clone(true).insertAfter(slideItem.eq(slideItemLen - 1))
					//计算滚动盒子的长度
				slideBox.width(singleW * (slideItemLen + 2))
					//让第一个图片显示  
				slideBox.css('left', -singleW + 'px')
			}
			if (config.type == 'gradually') {
				slideItem.css('position', 'absolute');
				slideItem.eq(0).css('zIndex', '2');
			}
			if (config.bullets) {
				_this_.creatButtons(slideItemLen, _this_.$ele)
			}
			_this_.move(_this_.curIndex);
			_this_.setEvent();
		},
		move: function(index) {
			var _this_ = this,
				config = _this_.setting,
				slideIndex = _this_.curIndex,
				slideBox = _this_.slideBox,
				slideItem = _this_.slideItem,
				slidetotal = _this_.slideTotal = _this_.slideItem.length,
				singleW = _this_.singleW;
			if (config.type == "slide") {
				if (slideIndex > slidetotal) {
					slideBox.css('left', -singleW + 'px')
					slideIndex = _this_.curIndex = 1;
				}
				if (slideIndex < -1) {
					slideBox.css('left', -singleW * slidetotal + 'px')
					slideIndex = _this_.curIndex = slidetotal - 2;
				}
				if(_this_.bulletIndex > slidetotal-1){
					_this_.bulletIndex = 0
				}
				if(_this_.bulletIndex < 0){
					_this_.bulletIndex = slidetotal-1;
				}
				_this_.checkBullet(_this_.bulletIndex)
				slideBox.animate({left: -singleW * (slideIndex + 1) + 'px'}, config.animationTime, function() {
					_this_.start();
					_this_.isanimate = false
				})
			}
			if (config.type == 'gradually') {

				if(slideIndex > slidetotal-1){
					slideIndex = _this_.curIndex = 0;
				}
				if(slideIndex < 0){
					slideIndex = _this_.curIndex = slidetotal-1;
				}
				if(_this_.bulletIndex > slidetotal-1){
					_this_.bulletIndex = 0
				}
				if(_this_.bulletIndex < 0){
					_this_.bulletIndex = slidetotal-1;
				}
				_this_.checkBullet(_this_.bulletIndex)
				slideItem.eq(slideIndex).animate({'opacity':'1'},config.animationTime).siblings().animate({'opacity':'0'},config.animationTime,function(){
					_this_.isanimate = false;
				});
				_this_.start();
			}
		},
		start: function() {
			var _this_ = this,
				config = _this_.setting;
			clearTimeout(_this_.timer);
			_this_.timer = setTimeout(function() {
				_this_.bulletIndex++
				_this_.move(_this_.curIndex++);	
			}, config.IntervalTime)
		},
		stop: function() {
			clearTimeout(this.timer)
		},
		creatButtons: function(slidelen, ele) {
			var _html = "",
				bullets = ele.find('.bullets'),
				bullet = null,
				bulletW = 0;
			for (var i = 0, len = slidelen; i < len; i++) {
				_html += '<li></li>'
			}
			bullets.append(_html);
			bullet = bullets.find('li');
			bulletW = bullet.eq(0).outerWidth(true);
			bullets.css({
				width: bulletW * slidelen + 'px',
				left: '50%',
				marginLeft: -(bulletW * slidelen) / 2 + 'px',
				bottom: '20px',
				zIndex:10
			})
			bullet.eq(0).addClass('active')
		},
		checkBullet:function(index){
			var _this_ = this,
				bullet = _this_.$ele.find('.bullets li');
			bullet.eq(index).addClass('active').siblings().removeClass('active')
		},
		setEvent: function() {
			var _this_ = this,
				config = _this_.setting,
				prev = $(config.prevClass),
				next = $(config.nextClass),
				bullet = _this_.$ele.find('.bullets li');
			_this_.$ele.hover(function() {
				_this_.stop();
			}, function() {
				_this_.start();
			})
			if (config.buttons) {
				prev.click(function() {
					if (!_this_.isanimate) {
						_this_.bulletIndex --
						_this_.move(_this_.curIndex--);
						_this_.isanimate = true
					}
				})
				next.click(function() {
					if (!_this_.isanimate) {
						_this_.bulletIndex ++
						_this_.move(_this_.curIndex++);
						_this_.isanimate = true
					}
				})
			}
			bullet.on('click',function(){
				var _index = $(this).index();
				_this_.curIndex = _this_.bulletIndex=_index;
				if (!_this_.isanimate) {
					_this_.move(_this_.curIndex)
					_this_.checkBullet(_this_.bulletIndex);
					_this_.isanimate = true
				}
			})

		}
	};

	$.fn.carouse = function(options) {
		return this.each(function() {
			var carouse = new Carouse($(this), options);
			carouse.init();
		})
	}
})(jQuery)