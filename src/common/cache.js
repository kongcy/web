const _PADCHAR = '='
const _ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

function _getbyte64(s, i) {
  // This is oddly fast, except on Chrome/V8.
  // Minimal or no improvement in performance by using a
  // object with properties mapping chars to value (eg. 'A': 0)

  const idx = _ALPHA.indexOf(s.charAt(i))

  if (idx === -1) {
    return 'Cannot decode base64'
  }

  return idx
}

function _getbyte(s, i) {
  const x = s.charCodeAt(i)

  if (x > 255) {
    return 'INVALID_CHARACTER_ERR: DOM Exception 5'
  }

  return x
}
function _getbyte(s, i) {
  const x = s.charCodeAt(i)

  if (x > 255) {
    return 'INVALID_CHARACTER_ERR: DOM Exception 5'
  }

  return x
}
/**
 * base64 加密
 *
 * @param {*} s
 * @returns
 */
export function encode(s) {
  if (arguments.length !== 1) {
    return 'SyntaxError: exactly one argument required'
  }

  s = String(s)

  let i
  let b10
  let x = []
  let imax = s.length - (s.length % 3)

  if (s.length === 0) {
    return s
  }

  for (i = 0; i < imax; i += 3) {
    b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8) | _getbyte(s, i + 2)
    x.push(_ALPHA.charAt(b10 >> 18))
    x.push(_ALPHA.charAt((b10 >> 12) & 0x3f))
    x.push(_ALPHA.charAt((b10 >> 6) & 0x3f))
    x.push(_ALPHA.charAt(b10 & 0x3f))
  }

  switch (s.length - imax) {
    case 1:
      b10 = _getbyte(s, i) << 16
      x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3f) + _PADCHAR + _PADCHAR)
      break

    case 2:
      b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8)
      x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3f) + _ALPHA.charAt((b10 >> 6) & 0x3f) + _PADCHAR)
      break
  }

  return x.join('')
}

/**
 * base64 解密
 *
 * @param {*} s
 * @returns
 */
export function decode(s) {
  let pads = 0
  let i
  let b10
  let imax = s.length
  let x = []

  s = String(s)

  if (imax === 0) {
    return s
  }

  if (imax % 4 !== 0) {
    return 'Cannot decode base64'
  }

  if (s.charAt(imax - 1) === _PADCHAR) {
    pads = 1

    if (s.charAt(imax - 2) === _PADCHAR) {
      pads = 2
    }

    // either way, we want to ignore this last block
    imax -= 4
  }

  for (i = 0; i < imax; i += 4) {
    b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6) | _getbyte64(s, i + 3)
    x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff))
  }

  switch (pads) {
    case 1:
      b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6)
      x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff))
      break

    case 2:
      b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12)
      x.push(String.fromCharCode(b10 >> 16))
      break
  }

  return x.join('')
}
/**
 * [isEmpty description]
 * @param  {[type]}  param [description]
 * @return {Boolean}       [description]
 */
export function isEmpty(param) {
  return param === null || param === undefined || param === ''
}
/**
 * set cache
 *
 * @export
 * @param {string} [key='']
 * @param {*} value
 */
export function set(key = '', value, type = 'sessionStorage') {
  const encodeKey = encode(key)

  if (!isEmpty(value)) {
    const encodeValue = encode(window.unescape(window.encodeURIComponent(JSON.stringify(value))))

    window[type].setItem(encodeKey, encodeValue)
  }
}

/**
 * get cache
 *
 * @export
 * @param {string} [key='']
 * @returns
 */
export function get(key = '', type = 'sessionStorage') {
  const encodeKey = encode(key)

  const value = window[type].getItem(encodeKey)
  if (!isEmpty(value)) {
    return JSON.parse(window.decodeURIComponent(window.escape(decode(value))))
  }
}


/**
 * remove cache
 *
 * @export
 * @param {string} [key='']
 */
export function remove(key = '', type = 'sessionStorage') {
  window[type].removeItem(encode(key))
}

/**
 * clear cache
 *
 * @export
 */
export function clear(type = 'sessionStorage') {
  window[type].clear()
}

export default {
  encode,
  decode,
  set,
  get,
  remove,
  clear
}
