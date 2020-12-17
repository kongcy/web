import './date'
import cache from './cache'
import media from './media'
import record from './record'


const install = function(Vue) {
	// 注册实例属性和全局可访问常量
	const xtxk = {cache, media, record}
	Vue.prototype.xtxk = xtxk
	Window.xtxk = xtxk
	global.xtxk = xtxk
}

export default { install }
