/**
 * [Slider 滑块 通过拖动滑块在一个固定区间内进行选择]
 * @param {[elementNode]} container [父节点]
 * @param {[int]}         value     [当前值]
 * @param {[object]}      options   [ 类型type(date,number), 开始值startValue，结束值endValue,背景色backgroundColor，高亮色activeColor，高度height，球的大小circleSize，球的背景色circleBackgroundColor]
 */
let Slider = function(container, value, options) {
	this.container = container;
	this.value = value;
	this.options = options;
	// this.type = type === undefined ? 'number' : type;
	// this.startTime = startTime;
	// this.maxValue = maxValue === undefined ? 255 : maxValue;
	this._init();
}
Slider.prototype = {
	//声音值改变后的回调
	volumeChangedCallback: null,

	_init: function() {
		if(!this.container) return;
		this.container.innerHTML = `<div class="slider">
			<div class="slider__runway">
				<div class="slider__bar"></div>
				<div class="slider__button-wrapper">
					<div class="slider__button"></div>
					<div class="tooltip">
						<span class="volumevalue"></span><div class="arrow"></div>
					</div>
				</div>
			</div>
		</div>`;
		this._setOptions();
		this.setValue();
		// 添加事件
		let _this = this;
		_this.container.querySelector('.slider__button').onmousedown = function(event) {
			event.target.parentElement.classList.add('dragging');
			event.target.classList.add('dragging');

			let containerWidth = _this.container.offsetWidth;
			let containerOffsetLeft = _this.container.getBoundingClientRect().left;

			document.onmousemove = (event) => {
				let moveWidth = event.clientX - containerOffsetLeft;
				_this._setPercent(containerWidth, moveWidth);
				_this._doView();
			}
			document.onmouseup = (event) => {
				_this.container.querySelector('.slider__button').classList.remove('dragging');
				_this.container.querySelector('.slider__button-wrapper').classList.remove('dragging');
	            document.onmousemove = null;
				document.onmouseup = null;
	        }
		};
		_this.container.querySelector('.slider__runway').onclick = function() {
			let containerWidth = _this.container.offsetWidth;
			let containerOffsetLeft = _this.container.getBoundingClientRect().left;
			let moveWidth = event.clientX - containerOffsetLeft;
			_this._setPercent(containerWidth, moveWidth);
			_this._doView();
			if(_this.volumeChangedCallback != null)
				_this.volumeChangedCallback(_this.getValue());
		}
	},
	// 计算百分比
	_setPercent: function(containerWidth, moveWidth) {
		if (moveWidth <= 0) {
			this.value = 0;
		}else if (moveWidth >= containerWidth) {
			this.value = 100;
		} else {
			this.value = Math.round(moveWidth / containerWidth * 100);
		}
	},
	// 设置滑块高亮
	_doView: function() {
		let maxValue = this.options.endValue - this.options.startValue;
		// 如果最大值小于等于0，进度条禁用
		if (maxValue <= 0) {
			this.isDisabled(true);
			return;
		}
		this.container.querySelector('.slider__bar').style.width = this.value + '%';
		this.container.querySelector('.slider__button-wrapper').style.left = this.value + '%';
		// 提示内容显示值
		if (this.options.type === 'date') {
			if (this.value < 10) {
				this.container.querySelector('.tooltip').style.transform = 'translateX(-14px)';
				this.container.querySelector('.arrow').style.left = '15px';
			} else if (this.value > 90) {
				this.container.querySelector('.tooltip').style.transform = 'translateX(-90%)';
				this.container.querySelector('.arrow').style.left = '90%';
			} else {
				this.container.querySelector('.tooltip').style.transform = '';
				this.container.querySelector('.arrow').style.left = '';
			}
			
			this.container.querySelector('.volumevalue').innerHTML = new Date((maxValue * this.value / 100) + this.options.startValue).formatDate('yyyy-MM-dd HH:mm:ss');
		} else {
			this.container.querySelector('.volumevalue').innerHTML = Math.round(maxValue * this.value / 100);
		}
	},
	// 设置样式选项
	_setOptions: function(options) {
		if (options) { this.options = options }
		if (this.options) {
			let $runway = this.container.querySelector('.slider__runway');
			let $bar = this.container.querySelector('.slider__bar');
			let $btn = this.container.querySelector('.slider__button');
			if (this.options.backgroundColor) {
				$runway.style.backgroundColor = this.options.backgroundColor;
			}
			if (this.options.activeColor) {
				$bar.style.backgroundColor = this.options.activeColor;
			}
			if (this.options.height) {
				$runway.style.height = `${this.options.height}px`;
				$bar.style.height = `${this.options.height}px`;
			}
			if (this.options.circleSize) {
				$btn.style.width = `${this.options.circleSize}px`;
				$btn.style.height = `${this.options.circleSize}px`;
			}
			if (this.options.circleBackgroundColor) {
				$btn.style.borderColor = this.options.circleBackgroundColor;
			}
			if (this.options.type === undefined) {
				this.options.type = 'number';
			}
			if (this.options.startValue === undefined) {
				this.options.startValue = 0;
			}
			if (this.options.endValue === undefined) {
				this.options.endValue = 255;
			}
		}
	},
	// 设置值
	setValue: function(value) {
		let maxValue = this.options.endValue - this.options.startValue;
		let val = value ? value : this.value;
		this.value = Math.round(val / maxValue * 100);
		this._doView();
	},
	// 获取值
	getValue: function() {
		let maxValue = this.options.endValue - this.options.startValue;
		if (this.options.type === 'date') {
			this.value = (maxValue * this.value / 100) + this.options.startValue;
		} else {
			this.value = Math.round(maxValue * this.value / 100);
		}
		return this.value;
	},
	//启用/禁用声音控制条
	isDisabled: function(isDisabled){
		//isDisabled为true，鼠标放到球上为禁用状态，球不可拖动，高亮色变为灰色
		//isDisabled为false，恢复到可用
		if(!this.container) return;
		if (isDisabled) {
			this.container.querySelector('.slider').classList.add('disabled');
		} else {
			this.container.querySelector('.slider').classList.remove('disabled');
		}
	},
	// 鼠标拖动值后的回调
	setAfterChangedCallback: function(callback){
		this.volumeChangedCallback = callback;
	}
};
export default Slider