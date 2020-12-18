export function UUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 3 | 8
    return v.toString(16)
  })
}

export function loadJs (id, url, callback) {
  if (document.getElementById(id)) {
    callback()
    return
  }
  var script = document.createElement('script')
  script.id = id
  script.type = 'text/javascript'
  if (typeof (callback) !== 'undefined') {
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null
          callback()
        }
      }
    } else {
      script.onload = function () {
        callback()
      }
    }
  }
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script);
}

export function getEventPath (e) {
  const path = (e.composedPath && e.composedPath())||e.path
  const target = e.target
  if(path){
    return (path.indexOf(window) <0 )?path.concat(window):path
  }
  if(target === window){
    return [window]
  }

  function getParents(n,m){
    m = m|| []
    const pn =n.parentNode
    if(!pn){
      return m
    }
    else{
      return getParents(pn,m.concat(pn))
    }
  }

  return [target].concat(getParents(target), window)
}