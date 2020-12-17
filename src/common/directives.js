import Vue from 'vue'

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cursor = 'move'
    
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    dragDom.style.margin = '0px auto 0px'

    dialogHeaderEl.onmousedown = (e) => {
      //屏幕宽高
      var ww = document.documentElement.clientWidth
      var wh = document.documentElement.clientHeight
      //元素的宽高
      var elW = dragDom.clientWidth
      var elH = dragDom.clientHeight
      
      // 鼠标按下，计算当前元素距离可视区的距离  
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      
      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }
      
      var chaT = dragDom.offsetTop - styT
      //临界值
      var maxL = -((ww - elW) / 2)
      var maxR = ((ww - elW) / 2)
      var maxT = -chaT
      var maxBottom = (elH - chaT)
      document.onmousemove = function(e) {
        const l = e.clientX - disX
        const t = e.clientY - disY

        var domLeft = l + styL
        var domTop = t + styT
        //判断边界
        if( (l + styL) < maxL ){  //向左移动 鼠标位置 < 鼠标位置到元素左边框距离 元素超出可视范围 
          domLeft = maxL
        }else if( (l + styL) > maxR){
          domLeft = maxR
        }
        if( (t + styT) < maxT ){
          domTop = maxT
        }else if( (t + styT) > maxBottom){
          domTop = maxBottom
        }
        // 移动当前元素
        dragDom.style.left = `${domLeft}px`
        dragDom.style.top = `${domTop}px`

        // // 将此时的位置传出去
        // // binding.value({x:e.pageX,y:e.pageY})

      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
  bind(el, binding, vnode, oldVnode) {
    const dragDom = binding.value.$el.querySelector('.el-dialog')

    el.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - el.offsetLeft

      document.onmousemove = function(e) {
        e.preventDefault() // 移动时禁用默认事件

        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        dragDom.style.width = `${l}px`
      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})