/**
 * [SliderNumber 画质调节滑块]
 * @param {[elementNode]} container [父节点]
 * @param {[object]} options   [关联文字label，类型type[1-清晰度 2-亮度 3-颜色]， 值]
 */
let PictureQualitySlider = function(container, options) {
	this.container = container;
	this.options = options;
	this._init();
}
PictureQualitySlider.prototype = {
	//声音值改变后的回调
	changedCallback: null,
	_init: function() {
		if (this.options instanceof Array) {
			this.options.forEach(item => {
				this._layout(item);
			})
		} else {
			this._layout(this.options);
		}
	},
	_layout: function(option) {
		let type = option.type;
		let value = option.value;
		let lable = option.lable;
		let sliderNumber = document.createElement('div');
		sliderNumber.className = `slider-number slider-number_${type}`;
		sliderNumber.innerHTML = `<span class="icon ${option.icon}"></span>
			<span class="label">${lable}</span>
			<span class="number-decrease">-</span>
			<div class="slider-wrapper">
				<div class="slider__runway" onclick="onClick(event)">
					<div class="slider__bar" style="width: ${value}%;"></div>
					<div class="slider__button-wrapper" style="left: ${value}%;">
						<div class="slider__button"></div>
					</div>
				</div>
			</div>
			<span class="number-increase">+</span>
			<span class="label percent">${value}%</span>`;
		this.container.appendChild(sliderNumber);
		// this.container.innerHTML = sliderNumber.outerHTML;
		// 添加事件
		let _this = this;
		sliderNumber.querySelector('.slider__button').onmousedown = function(event) {
			event.target.parentElement.classList.add('dragging');
			event.target.classList.add('dragging');

			let containerWidth = sliderNumber.querySelector('.slider-wrapper').offsetWidth;
			let containerOffsetLeft = sliderNumber.querySelector('.slider-wrapper').getBoundingClientRect().left;

			document.onmousemove = (event) => {
				let moveWidth = event.clientX - containerOffsetLeft;
				value = _this._getPercent(containerWidth, moveWidth);
				_this._doView(type, value);
			}
			document.onmouseup = (event) => {
				sliderNumber.querySelector('.slider__button').classList.remove('dragging');
				sliderNumber.querySelector('.slider__button-wrapper').classList.remove('dragging');
	            document.onmousemove = null;
				document.onmouseup = null;
	        }
		};
		sliderNumber.querySelector('.slider__runway').onclick = function() {
			let containerWidth = sliderNumber.querySelector('.slider-wrapper').offsetWidth;
			let containerOffsetLeft = sliderNumber.querySelector('.slider-wrapper').getBoundingClientRect().left;
			let moveWidth = event.clientX - containerOffsetLeft;
			value = _this._getPercent(containerWidth, moveWidth);
			_this._doView(type, value);
			if(_this.changedCallback != null)
				_this.changedCallback(type, value);
		}
		sliderNumber.querySelector('.number-decrease').onclick = function() {
			if (value > 0) {
				value = value < 5 ? 0 : value - 5; 
				_this._doView(type, value);
				if(_this.changedCallback != null)
					_this.changedCallback(type, value);
			}
		}
		sliderNumber.querySelector('.number-increase').onclick = function() {
			if (value < 100) {
				value = value > 95 ? 100 : value + 5;
				_this._doView(type, value);
				if(_this.changedCallback != null)
					_this.changedCallback(type, value);
			}
		}
	},
	// 计算百分比
	_getPercent: function(containerWidth, moveWidth) {
		if (moveWidth <= 0) {
			return 0;
		}else if (moveWidth >= containerWidth) {
			return 100;
		} else {
			return Math.round(moveWidth / containerWidth * 100);
		}
	},
	// 设置滑块高亮
	_doView: function(type, value) {
		let $type = '.slider-number_' + type;
		this.container.querySelector($type + ' .slider__bar').style.width = value + '%';
		this.container.querySelector($type + ' .slider__button-wrapper').style.left = value + '%';
		this.container.querySelector($type + ' .percent').innerHTML = value + '%';
	},
	// 鼠标拖动值后的回调
	setAfterChangedCallback: function(callback){
		this.changedCallback = callback;
	}
};
export default PictureQualitySlider