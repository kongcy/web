!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){"use strict";var n=[],r=e.document,i=Object.getPrototypeOf,o=n.slice,a=n.concat,s=n.push,u=n.indexOf,l={},c=l.toString,f=l.hasOwnProperty,p=f.toString,d=p.call(Object),h={},g=function e(t){return"function"==typeof t&&"number"!=typeof t.nodeType},y=function e(t){return null!=t&&t===t.window},v={type:!0,src:!0,noModule:!0};function m(e,t,n){var i,o=(t=t||r).createElement("script");if(o.text=e,n)for(i in v)n[i]&&(o[i]=n[i]);t.head.appendChild(o).parentNode.removeChild(o)}function x(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[c.call(e)]||"object":typeof e}var b="3.3.1",w=function(e,t){return new w.fn.init(e,t)},T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;w.fn=w.prototype={jquery:"3.3.1",constructor:w,length:0,toArray:function(){return o.call(this)},get:function(e){return null==e?o.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=w.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return w.each(this,e)},map:function(e){return this.pushStack(w.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:s,sort:n.sort,splice:n.splice},w.extend=w.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||g(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)n=a[t],a!==(r=e[t])&&(l&&r&&(w.isPlainObject(r)||(i=Array.isArray(r)))?(i?(i=!1,o=n&&Array.isArray(n)?n:[]):o=n&&w.isPlainObject(n)?n:{},a[t]=w.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},w.extend({expando:"jQuery"+("3.3.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==c.call(e))&&(!(t=i(e))||"function"==typeof(n=f.call(t,"constructor")&&t.constructor)&&p.call(n)===d)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e){m(e)},each:function(e,t){var n,r=0;if(C(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(C(Object(e))?w.merge(n,"string"==typeof e?[e]:e):s.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:u.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,a=e.length,s=!n;o<a;o++)(r=!t(e[o],o))!==s&&i.push(e[o]);return i},map:function(e,t,n){var r,i,o=0,s=[];if(C(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&s.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&s.push(i);return a.apply([],s)},guid:1,support:h}),"function"==typeof Symbol&&(w.fn[Symbol.iterator]=n[Symbol.iterator]),w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function C(e){var t=!!e&&"length"in e&&e.length,n=x(e);return!g(e)&&!y(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}var E=function(e){var t,n,r,i,o,a,s,u,l,c,f,p,d,h,g,y,v,m,x,b="sizzle"+1*new Date,w=e.document,T=0,C=0,E=ae(),k=ae(),S=ae(),D=function(e,t){return e===t&&(f=!0),0},N={}.hasOwnProperty,A=[],j=A.pop,q=A.push,L=A.push,H=A.slice,O=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},P="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",I="\\["+M+"*("+R+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+M+"*\\]",W=":("+R+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+I+")*)|.*)\\)|)",$=new RegExp(M+"+","g"),B=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),F=new RegExp("^"+M+"*,"+M+"*"),_=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),z=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),X=new RegExp(W),U=new RegExp("^"+R+"$"),V={ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+W),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+P+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},G=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Q=/^[^{]+\{\s*\[native \w/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,K=/[+~]/,Z=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),ee=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},te=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ne=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},re=function(){p()},ie=me(function(e){return!0===e.disabled&&("form"in e||"label"in e)},{dir:"parentNode",next:"legend"});try{L.apply(A=H.call(w.childNodes),w.childNodes),A[w.childNodes.length].nodeType}catch(e){L={apply:A.length?function(e,t){q.apply(e,H.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function oe(e,t,r,i){var o,s,l,c,f,h,v,m=t&&t.ownerDocument,T=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==T&&9!==T&&11!==T)return r;if(!i&&((t?t.ownerDocument||t:w)!==d&&p(t),t=t||d,g)){if(11!==T&&(f=J.exec(e)))if(o=f[1]){if(9===T){if(!(l=t.getElementById(o)))return r;if(l.id===o)return r.push(l),r}else if(m&&(l=m.getElementById(o))&&x(t,l)&&l.id===o)return r.push(l),r}else{if(f[2])return L.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return L.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!S[e+" "]&&(!y||!y.test(e))){if(1!==T)m=t,v=e;else if("object"!==t.nodeName.toLowerCase()){(c=t.getAttribute("id"))?c=c.replace(te,ne):t.setAttribute("id",c=b),s=(h=a(e)).length;while(s--)h[s]="#"+c+" "+ve(h[s]);v=h.join(","),m=K.test(e)&&ge(t.parentNode)||t}if(v)try{return L.apply(r,m.querySelectorAll(v)),r}catch(e){}finally{c===b&&t.removeAttribute("id")}}}return u(e.replace(B,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function se(e){return e[b]=!0,e}function ue(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function le(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t}function ce(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function fe(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function pe(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function de(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ie(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return se(function(t){return t=+t,se(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function ge(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}n=oe.support={},o=oe.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},p=oe.setDocument=function(e){var t,i,a=e?e.ownerDocument||e:w;return a!==d&&9===a.nodeType&&a.documentElement?(d=a,h=d.documentElement,g=!o(d),w!==d&&(i=d.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",re,!1):i.attachEvent&&i.attachEvent("onunload",re)),n.attributes=ue(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ue(function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Q.test(d.getElementsByClassName),n.getById=ue(function(e){return h.appendChild(e).id=b,!d.getElementsByName||!d.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&g)return t.getElementsByClassName(e)},v=[],y=[],(n.qsa=Q.test(d.querySelectorAll))&&(ue(function(e){h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&y.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||y.push("\\["+M+"*(?:value|"+P+")"),e.querySelectorAll("[id~="+b+"-]").length||y.push("~="),e.querySelectorAll(":checked").length||y.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||y.push(".#.+[+~]")}),ue(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&y.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&y.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&y.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),y.push(",.*:")})),(n.matchesSelector=Q.test(m=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ue(function(e){n.disconnectedMatch=m.call(e,"*"),m.call(e,"[s!='']:x"),v.push("!=",W)}),y=y.length&&new RegExp(y.join("|")),v=v.length&&new RegExp(v.join("|")),t=Q.test(h.compareDocumentPosition),x=t||Q.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e===d||e.ownerDocument===w&&x(w,e)?-1:t===d||t.ownerDocument===w&&x(w,t)?1:c?O(c,e)-O(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e===d?-1:t===d?1:i?-1:o?1:c?O(c,e)-O(c,t):0;if(i===o)return ce(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?ce(a[r],s[r]):a[r]===w?-1:s[r]===w?1:0},d):d},oe.matches=function(e,t){return oe(e,null,null,t)},oe.matchesSelector=function(e,t){if((e.ownerDocument||e)!==d&&p(e),t=t.replace(z,"='$1']"),n.matchesSelector&&g&&!S[t+" "]&&(!v||!v.test(t))&&(!y||!y.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return oe(t,d,null,[e]).length>0},oe.contains=function(e,t){return(e.ownerDocument||e)!==d&&p(e),x(e,t)},oe.attr=function(e,t){(e.ownerDocument||e)!==d&&p(e);var i=r.attrHandle[t.toLowerCase()],o=i&&N.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},oe.escape=function(e){return(e+"").replace(te,ne)},oe.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},oe.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(D),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return c=null,e},i=oe.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=oe.selectors={cacheLength:50,createPseudo:se,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Z,ee),e[3]=(e[3]||e[4]||e[5]||"").replace(Z,ee),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||oe.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&oe.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return V.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Z,ee).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=oe.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace($," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",y=t.parentNode,v=s&&t.nodeName.toLowerCase(),m=!u&&!s,x=!1;if(y){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===v:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?y.firstChild:y.lastChild],a&&m){x=(d=(l=(c=(f=(p=y)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1])&&l[2],p=d&&y.childNodes[d];while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if(1===p.nodeType&&++x&&p===t){c[e]=[T,d,x];break}}else if(m&&(x=d=(l=(c=(f=(p=t)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1]),!1===x)while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===v:1===p.nodeType)&&++x&&(m&&((c=(f=p[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]=[T,x]),p===t))break;return(x-=i)===r||x%r==0&&x/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||oe.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?se(function(e,n){var r,o=i(e,t),a=o.length;while(a--)e[r=O(e,o[a])]=!(n[r]=o[a])}):function(e){return i(e,0,n)}):i}},pseudos:{not:se(function(e){var t=[],n=[],r=s(e.replace(B,"$1"));return r[b]?se(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:se(function(e){return function(t){return oe(e,t).length>0}}),contains:se(function(e){return e=e.replace(Z,ee),function(t){return(t.textContent||t.innerText||i(t)).indexOf(e)>-1}}),lang:se(function(e){return U.test(e||"")||oe.error("unsupported lang: "+e),e=e.replace(Z,ee).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:de(!1),disabled:de(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return[0]}),last:he(function(e,t){return[t-1]}),eq:he(function(e,t,n){return[n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=fe(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=pe(t);function ye(){}ye.prototype=r.filters=r.pseudos,r.setFilters=new ye,a=oe.tokenize=function(e,t){var n,i,o,a,s,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=r.preFilter;while(s){n&&!(i=F.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),n=!1,(i=_.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(B," ")}),s=s.slice(n.length));for(a in r.filter)!(i=V[a].exec(s))||l[a]&&!(i=l[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),s=s.slice(n.length));if(!n)break}return t?s.length:s?oe.error(e):k(e,u).slice(0)};function ve(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function me(e,t,n){var r=t.dir,i=t.next,o=i||r,a=n&&"parentNode"===o,s=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||a)return e(t,n,i);return!1}:function(t,n,u){var l,c,f,p=[T,s];if(u){while(t=t[r])if((1===t.nodeType||a)&&e(t,n,u))return!0}else while(t=t[r])if(1===t.nodeType||a)if(f=t[b]||(t[b]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[o])&&l[0]===T&&l[1]===s)return p[2]=l[2];if(c[o]=p,p[2]=e(t,n,u))return!0}return!1}}function xe(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)oe(e,t[r],n);return n}function we(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Te(e,t,n,r,i,o){return r&&!r[b]&&(r=Te(r)),i&&!i[b]&&(i=Te(i,o)),se(function(o,a,s,u){var l,c,f,p=[],d=[],h=a.length,g=o||be(t||"*",s.nodeType?[s]:s,[]),y=!e||!o&&t?g:we(g,p,e,s,u),v=n?i||(o?e:h||r)?[]:a:y;if(n&&n(y,v,s,u),r){l=we(v,d),r(l,[],s,u),c=l.length;while(c--)(f=l[c])&&(v[d[c]]=!(y[d[c]]=f))}if(o){if(i||e){if(i){l=[],c=v.length;while(c--)(f=v[c])&&l.push(y[c]=f);i(null,v=[],l,u)}c=v.length;while(c--)(f=v[c])&&(l=i?O(o,f):p[c])>-1&&(o[l]=!(a[l]=f))}}else v=we(v===a?v.splice(h,v.length):v),i?i(null,a,v,u):L.apply(a,v)})}function Ce(e){for(var t,n,i,o=e.length,a=r.relative[e[0].type],s=a||r.relative[" "],u=a?1:0,c=me(function(e){return e===t},s,!0),f=me(function(e){return O(t,e)>-1},s,!0),p=[function(e,n,r){var i=!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,i}];u<o;u++)if(n=r.relative[e[u].type])p=[me(xe(p),n)];else{if((n=r.filter[e[u].type].apply(null,e[u].matches))[b]){for(i=++u;i<o;i++)if(r.relative[e[i].type])break;return Te(u>1&&xe(p),u>1&&ve(e.slice(0,u-1).concat({value:" "===e[u-2].type?"*":""})).replace(B,"$1"),n,u<i&&Ce(e.slice(u,i)),i<o&&Ce(e=e.slice(i)),i<o&&ve(e))}p.push(n)}return xe(p)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,a,s,u,c){var f,h,y,v=0,m="0",x=o&&[],b=[],w=l,C=o||i&&r.find.TAG("*",c),E=T+=null==w?1:Math.random()||.1,k=C.length;for(c&&(l=a===d||a||c);m!==k&&null!=(f=C[m]);m++){if(i&&f){h=0,a||f.ownerDocument===d||(p(f),s=!g);while(y=e[h++])if(y(f,a||d,s)){u.push(f);break}c&&(T=E)}n&&((f=!y&&f)&&v--,o&&x.push(f))}if(v+=m,n&&m!==v){h=0;while(y=t[h++])y(x,b,a,s);if(o){if(v>0)while(m--)x[m]||b[m]||(b[m]=j.call(u));b=we(b)}L.apply(u,b),c&&!o&&b.length>0&&v+t.length>1&&oe.uniqueSort(u)}return c&&(T=E,l=w),x};return n?se(o):o}return s=oe.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=a(e)),n=t.length;while(n--)(o=Ce(t[n]))[b]?r.push(o):i.push(o);(o=S(e,Ee(i,r))).selector=e}return o},u=oe.select=function(e,t,n,i){var o,u,l,c,f,p="function"==typeof e&&e,d=!i&&a(e=p.selector||e);if(n=n||[],1===d.length){if((u=d[0]=d[0].slice(0)).length>2&&"ID"===(l=u[0]).type&&9===t.nodeType&&g&&r.relative[u[1].type]){if(!(t=(r.find.ID(l.matches[0].replace(Z,ee),t)||[])[0]))return n;p&&(t=t.parentNode),e=e.slice(u.shift().value.length)}o=V.needsContext.test(e)?0:u.length;while(o--){if(l=u[o],r.relative[c=l.type])break;if((f=r.find[c])&&(i=f(l.matches[0].replace(Z,ee),K.test(u[0].type)&&ge(t.parentNode)||t))){if(u.splice(o,1),!(e=i.length&&ve(u)))return L.apply(n,i),n;break}}}return(p||s(e,d))(i,t,!g,n,!t||K.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(D).join("")===b,n.detectDuplicates=!!f,p(),n.sortDetached=ue(function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))}),ue(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||le("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ue(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||le("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ue(function(e){return null==e.getAttribute("disabled")})||le(P,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),oe}(e);w.find=E,w.expr=E.selectors,w.expr[":"]=w.expr.pseudos,w.uniqueSort=w.unique=E.uniqueSort,w.text=E.getText,w.isXMLDoc=E.isXML,w.contains=E.contains,w.escapeSelector=E.escape;var k=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&w(e).is(n))break;r.push(e)}return r},S=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},D=w.expr.match.needsContext;function N(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var A=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,t,n){return g(t)?w.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?w.grep(e,function(e){return e===t!==n}):"string"!=typeof t?w.grep(e,function(e){return u.call(t,e)>-1!==n}):w.filter(t,e,n)}w.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?w.find.matchesSelector(r,e)?[r]:[]:w.find.matches(e,w.grep(t,function(e){return 1===e.nodeType}))},w.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(w(e).filter(function(){for(t=0;t<r;t++)if(w.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)w.find(e,i[t],n);return r>1?w.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&D.test(e)?w(e):e||[],!1).length}});var q,L=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(w.fn.init=function(e,t,n){var i,o;if(!e)return this;if(n=n||q,"string"==typeof e){if(!(i="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:L.exec(e))||!i[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(i[1]){if(t=t instanceof w?t[0]:t,w.merge(this,w.parseHTML(i[1],t&&t.nodeType?t.ownerDocument||t:r,!0)),A.test(i[1])&&w.isPlainObject(t))for(i in t)g(this[i])?this[i](t[i]):this.attr(i,t[i]);return this}return(o=r.getElementById(i[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):g(e)?void 0!==n.ready?n.ready(e):e(w):w.makeArray(e,this)}).prototype=w.fn,q=w(r);var H=/^(?:parents|prev(?:Until|All))/,O={children:!0,contents:!0,next:!0,prev:!0};w.fn.extend({has:function(e){var t=w(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(w.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&w(e);if(!D.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&w.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?w.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?u.call(w(e),this[0]):u.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(w.uniqueSort(w.merge(this.get(),w(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function P(e,t){while((e=e[t])&&1!==e.nodeType);return e}w.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return k(e,"parentNode")},parentsUntil:function(e,t,n){return k(e,"parentNode",n)},next:function(e){return P(e,"nextSibling")},prev:function(e){return P(e,"previousSibling")},nextAll:function(e){return k(e,"nextSibling")},prevAll:function(e){return k(e,"previousSibling")},nextUntil:function(e,t,n){return k(e,"nextSibling",n)},prevUntil:function(e,t,n){return k(e,"previousSibling",n)},siblings:function(e){return S((e.parentNode||{}).firstChild,e)},children:function(e){return S(e.firstChild)},contents:function(e){return N(e,"iframe")?e.contentDocument:(N(e,"template")&&(e=e.content||e),w.merge([],e.childNodes))}},function(e,t){w.fn[e]=function(n,r){var i=w.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=w.filter(r,i)),this.length>1&&(O[e]||w.uniqueSort(i),H.test(e)&&i.reverse()),this.pushStack(i)}});var M=/[^\x20\t\r\n\f]+/g;function R(e){var t={};return w.each(e.match(M)||[],function(e,n){t[n]=!0}),t}w.Callbacks=function(e){e="string"==typeof e?R(e):w.extend({},e);var t,n,r,i,o=[],a=[],s=-1,u=function(){for(i=i||e.once,r=t=!0;a.length;s=-1){n=a.shift();while(++s<o.length)!1===o[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=o.length,n=!1)}e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},l={add:function(){return o&&(n&&!t&&(s=o.length-1,a.push(n)),function t(n){w.each(n,function(n,r){g(r)?e.unique&&l.has(r)||o.push(r):r&&r.length&&"string"!==x(r)&&t(r)})}(arguments),n&&!t&&u()),this},remove:function(){return w.each(arguments,function(e,t){var n;while((n=w.inArray(t,o,n))>-1)o.splice(n,1),n<=s&&s--}),this},has:function(e){return e?w.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||t||(o=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||u()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l};function I(e){return e}function W(e){throw e}function $(e,t,n,r){var i;try{e&&g(i=e.promise)?i.call(e).done(t).fail(n):e&&g(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}w.extend({Deferred:function(t){var n=[["notify","progress",w.Callbacks("memory"),w.Callbacks("memory"),2],["resolve","done",w.Callbacks("once memory"),w.Callbacks("once memory"),0,"resolved"],["reject","fail",w.Callbacks("once memory"),w.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},"catch":function(e){return i.then(null,e)},pipe:function(){var e=arguments;return w.Deferred(function(t){w.each(n,function(n,r){var i=g(e[r[4]])&&e[r[4]];o[r[1]](function(){var e=i&&i.apply(this,arguments);e&&g(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+"With"](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){var o=0;function a(t,n,r,i){return function(){var s=this,u=arguments,l=function(){var e,l;if(!(t<o)){if((e=r.apply(s,u))===n.promise())throw new TypeError("Thenable self-resolution");l=e&&("object"==typeof e||"function"==typeof e)&&e.then,g(l)?i?l.call(e,a(o,n,I,i),a(o,n,W,i)):(o++,l.call(e,a(o,n,I,i),a(o,n,W,i),a(o,n,I,n.notifyWith))):(r!==I&&(s=void 0,u=[e]),(i||n.resolveWith)(s,u))}},c=i?l:function(){try{l()}catch(e){w.Deferred.exceptionHook&&w.Deferred.exceptionHook(e,c.stackTrace),t+1>=o&&(r!==W&&(s=void 0,u=[e]),n.rejectWith(s,u))}};t?c():(w.Deferred.getStackHook&&(c.stackTrace=w.Deferred.getStackHook()),e.setTimeout(c))}}return w.Deferred(function(e){n[0][3].add(a(0,e,g(i)?i:I,e.notifyWith)),n[1][3].add(a(0,e,g(t)?t:I)),n[2][3].add(a(0,e,g(r)?r:W))}).promise()},promise:function(e){return null!=e?w.extend(e,i):i}},o={};return w.each(n,function(e,t){var a=t[2],s=t[5];i[t[1]]=a.add,s&&a.add(function(){r=s},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,r=Array(n),i=o.call(arguments),a=w.Deferred(),s=function(e){return function(n){r[e]=this,i[e]=arguments.length>1?o.call(arguments):n,--t||a.resolveWith(r,i)}};if(t<=1&&($(e,a.done(s(n)).resolve,a.reject,!t),"pending"===a.state()||g(i[n]&&i[n].then)))return a.then();while(n--)$(i[n],s(n),a.reject);return a.promise()}});var B=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;w.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&B.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},w.readyException=function(t){e.setTimeout(function(){throw t})};var F=w.Deferred();w.fn.ready=function(e){return F.then(e)["catch"](function(e){w.readyException(e)}),this},w.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--w.readyWait:w.isReady)||(w.isReady=!0,!0!==e&&--w.readyWait>0||F.resolveWith(r,[w]))}}),w.ready.then=F.then;function _(){r.removeEventListener("DOMContentLoaded",_),e.removeEventListener("load",_),w.ready()}"complete"===r.readyState||"loading"!==r.readyState&&!r.documentElement.doScroll?e.setTimeout(w.ready):(r.addEventListener("DOMContentLoaded",_),e.addEventListener("load",_));var z=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===x(n)){i=!0;for(s in n)z(e,t,s,n[s],!0,o,a)}else if(void 0!==r&&(i=!0,g(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(w(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},X=/^-ms-/,U=/-([a-z])/g;function V(e,t){return t.toUpperCase()}function G(e){return e.replace(X,"ms-").replace(U,V)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function Q(){this.expando=w.expando+Q.uid++}Q.uid=1,Q.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[G(t)]=n;else for(r in t)i[G(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][G(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(G):(t=G(t))in r?[t]:t.match(M)||[]).length;while(n--)delete r[t[n]]}(void 0===t||w.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!w.isEmptyObject(t)}};var J=new Q,K=new Q,Z=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ee=/[A-Z]/g;function te(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:Z.test(e)?JSON.parse(e):e)}function ne(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ee,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=te(n)}catch(e){}K.set(e,t,n)}else n=void 0;return n}w.extend({hasData:function(e){return K.hasData(e)||J.hasData(e)},data:function(e,t,n){return K.access(e,t,n)},removeData:function(e,t){K.remove(e,t)},_data:function(e,t,n){return J.access(e,t,n)},_removeData:function(e,t){J.remove(e,t)}}),w.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=K.get(o),1===o.nodeType&&!J.get(o,"hasDataAttrs"))){n=a.length;while(n--)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=G(r.slice(5)),ne(o,r,i[r]));J.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){K.set(this,e)}):z(this,function(t){var n;if(o&&void 0===t){if(void 0!==(n=K.get(o,e)))return n;if(void 0!==(n=ne(o,e)))return n}else this.each(function(){K.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){K.remove(this,e)})}}),w.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=J.get(e,t),n&&(!r||Array.isArray(n)?r=J.access(e,t,w.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=w.queue(e,t),r=n.length,i=n.shift(),o=w._queueHooks(e,t),a=function(){w.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return J.get(e,n)||J.access(e,n,{empty:w.Callbacks("once memory").add(function(){J.remove(e,[t+"queue",n])})})}}),w.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?w.queue(this[0],e):void 0===t?this:this.each(function(){var n=w.queue(this,e,t);w._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&w.dequeue(this,e)})},dequeue:function(e){return this.each(function(){w.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=w.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=J.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var re=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ie=new RegExp("^(?:([+-])=|)("+re+")([a-z%]*)$","i"),oe=["Top","Right","Bottom","Left"],ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&w.contains(e.ownerDocument,e)&&"none"===w.css(e,"display")},se=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i};function ue(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return w.css(e,t,"")},u=s(),l=n&&n[3]||(w.cssNumber[t]?"":"px"),c=(w.cssNumber[t]||"px"!==l&&+u)&&ie.exec(w.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)w.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,w.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var le={};function ce(e){var t,n=e.ownerDocument,r=e.nodeName,i=le[r];return i||(t=n.body.appendChild(n.createElement(r)),i=w.css(t,"display"),t.parentNode.removeChild(t),"none"===i&&(i="block"),le[r]=i,i)}function fe(e,t){for(var n,r,i=[],o=0,a=e.length;o<a;o++)(r=e[o]).style&&(n=r.style.display,t?("none"===n&&(i[o]=J.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&ae(r)&&(i[o]=ce(r))):"none"!==n&&(i[o]="none",J.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e}w.fn.extend({show:function(){return fe(this,!0)},hide:function(){return fe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?w(this).show():w(this).hide()})}});var pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,he=/^$|^module$|\/(?:java|ecma)script/i,ge={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ge.optgroup=ge.option,ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td;function ye(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&N(e,t)?w.merge([e],n):n}function ve(e,t){for(var n=0,r=e.length;n<r;n++)J.set(e[n],"globalEval",!t||J.get(t[n],"globalEval"))}var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===x(o))w.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+w.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;w.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&w.inArray(o,r)>-1)i&&i.push(o);else if(l=w.contains(o.ownerDocument,o),a=ye(f.appendChild(o),"script"),l&&ve(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}!function(){var e=r.createDocumentFragment().appendChild(r.createElement("div")),t=r.createElement("input");t.setAttribute("type","radio"),t.setAttribute("checked","checked"),t.setAttribute("name","t"),e.appendChild(t),h.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,e.innerHTML="<textarea>x</textarea>",h.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue}();var be=r.documentElement,we=/^key/,Te=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Ce=/^([^.]*)(?:\.(.+)|)/;function Ee(){return!0}function ke(){return!1}function Se(){try{return r.activeElement}catch(e){}}function De(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)De(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=ke;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return w().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=w.guid++)),e.each(function(){w.event.add(this,t,i,r,n)})}w.event={global:{},add:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.get(e);if(y){n.handler&&(n=(o=n).handler,i=o.selector),i&&w.find.matchesSelector(be,i),n.guid||(n.guid=w.guid++),(u=y.events)||(u=y.events={}),(a=y.handle)||(a=y.handle=function(t){return"undefined"!=typeof w&&w.event.triggered!==t.type?w.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(M)||[""]).length;while(l--)d=g=(s=Ce.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=w.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=w.event.special[d]||{},c=w.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&w.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),w.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.hasData(e)&&J.get(e);if(y&&(u=y.events)){l=(t=(t||"").match(M)||[""]).length;while(l--)if(s=Ce.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){f=w.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,y.handle)||w.removeEvent(e,d,y.handle),delete u[d])}else for(d in u)w.event.remove(e,d+t[l],n,r,!0);w.isEmptyObject(u)&&J.remove(e,"handle events")}},dispatch:function(e){var t=w.event.fix(e),n,r,i,o,a,s,u=new Array(arguments.length),l=(J.get(this,"events")||{})[t.type]||[],c=w.event.special[t.type]||{};for(u[0]=t,n=1;n<arguments.length;n++)u[n]=arguments[n];if(t.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,t)){s=w.event.handlers.call(this,t,l),n=0;while((o=s[n++])&&!t.isPropagationStopped()){t.currentTarget=o.elem,r=0;while((a=o.handlers[r++])&&!t.isImmediatePropagationStopped())t.rnamespace&&!t.rnamespace.test(a.namespace)||(t.handleObj=a,t.data=a.data,void 0!==(i=((w.event.special[a.origType]||{}).handle||a.handler).apply(o.elem,u))&&!1===(t.result=i)&&(t.preventDefault(),t.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,t),t.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?w(i,this).index(l)>-1:w.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(e,t){Object.defineProperty(w.Event.prototype,e,{enumerable:!0,configurable:!0,get:g(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[w.expando]?e:new w.Event(e)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==Se()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===Se()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&N(this,"input"))return this.click(),!1},_default:function(e){return N(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},w.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},w.Event=function(e,t){if(!(this instanceof w.Event))return new w.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ee:ke,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&w.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[w.expando]=!0},w.Event.prototype={constructor:w.Event,isDefaultPrevented:ke,isPropagationStopped:ke,isImmediatePropagationStopped:ke,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ee,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ee,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ee,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},w.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&we.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&Te.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},w.event.addProp),w.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){w.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||w.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),w.fn.extend({on:function(e,t,n,r){return De(this,e,t,n,r)},one:function(e,t,n,r){return De(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,w(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=ke),this.each(function(){w.event.remove(this,e,n,t)})}});var Ne=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Ae=/<script|<style|<link/i,je=/checked\s*(?:[^=]|=\s*.checked.)/i,qe=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Le(e,t){return N(e,"table")&&N(11!==t.nodeType?t:t.firstChild,"tr")?w(e).children("tbody")[0]||e:e}function He(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Oe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Pe(e,t){var n,r,i,o,a,s,u,l;if(1===t.nodeType){if(J.hasData(e)&&(o=J.access(e),a=J.set(t,o),l=o.events)){delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)w.event.add(t,i,l[i][n])}K.hasData(e)&&(s=K.access(e),u=w.extend({},s),K.set(t,u))}}function Me(e,t){var n=t.nodeName.toLowerCase();"input"===n&&pe.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Re(e,t,n,r){t=a.apply([],t);var i,o,s,u,l,c,f=0,p=e.length,d=p-1,y=t[0],v=g(y);if(v||p>1&&"string"==typeof y&&!h.checkClone&&je.test(y))return e.each(function(i){var o=e.eq(i);v&&(t[0]=y.call(this,i,o.html())),Re(o,t,n,r)});if(p&&(i=xe(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(u=(s=w.map(ye(i,"script"),He)).length;f<p;f++)l=i,f!==d&&(l=w.clone(l,!0,!0),u&&w.merge(s,ye(l,"script"))),n.call(e[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,w.map(s,Oe),f=0;f<u;f++)l=s[f],he.test(l.type||"")&&!J.access(l,"globalEval")&&w.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?w._evalUrl&&w._evalUrl(l.src):m(l.textContent.replace(qe,""),c,l))}return e}function Ie(e,t,n){for(var r,i=t?w.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||w.cleanData(ye(r)),r.parentNode&&(n&&w.contains(r.ownerDocument,r)&&ve(ye(r,"script")),r.parentNode.removeChild(r));return e}w.extend({htmlPrefilter:function(e){return e.replace(Ne,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s=e.cloneNode(!0),u=w.contains(e.ownerDocument,e);if(!(h.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||w.isXMLDoc(e)))for(a=ye(s),r=0,i=(o=ye(e)).length;r<i;r++)Me(o[r],a[r]);if(t)if(n)for(o=o||ye(e),a=a||ye(s),r=0,i=o.length;r<i;r++)Pe(o[r],a[r]);else Pe(e,s);return(a=ye(s,"script")).length>0&&ve(a,!u&&ye(e,"script")),s},cleanData:function(e){for(var t,n,r,i=w.event.special,o=0;void 0!==(n=e[o]);o++)if(Y(n)){if(t=n[J.expando]){if(t.events)for(r in t.events)i[r]?w.event.remove(n,r):w.removeEvent(n,r,t.handle);n[J.expando]=void 0}n[K.expando]&&(n[K.expando]=void 0)}}}),w.fn.extend({detach:function(e){return Ie(this,e,!0)},remove:function(e){return Ie(this,e)},text:function(e){return z(this,function(e){return void 0===e?w.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Re(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Le(this,e).appendChild(e)})},prepend:function(){return Re(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Le(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(w.cleanData(ye(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return w.clone(this,e,t)})},html:function(e){return z(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ae.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=w.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(w.cleanData(ye(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Re(this,arguments,function(t){var n=this.parentNode;w.inArray(this,e)<0&&(w.cleanData(ye(this)),n&&n.replaceChild(t,this))},e)}}),w.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){w.fn[e]=function(e){for(var n,r=[],i=w(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),w(i[a])[t](n),s.apply(r,n.get());return this.pushStack(r)}});var We=new RegExp("^("+re+")(?!px)[a-z%]+$","i"),$e=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},Be=new RegExp(oe.join("|"),"i");!function(){function t(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",be.appendChild(l).appendChild(c);var t=e.getComputedStyle(c);i="1%"!==t.top,u=12===n(t.marginLeft),c.style.right="60%",s=36===n(t.right),o=36===n(t.width),c.style.position="absolute",a=36===c.offsetWidth||"absolute",be.removeChild(l),c=null}}function n(e){return Math.round(parseFloat(e))}var i,o,a,s,u,l=r.createElement("div"),c=r.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",h.clearCloneStyle="content-box"===c.style.backgroundClip,w.extend(h,{boxSizingReliable:function(){return t(),o},pixelBoxStyles:function(){return t(),s},pixelPosition:function(){return t(),i},reliableMarginLeft:function(){return t(),u},scrollboxSize:function(){return t(),a}}))}();function Fe(e,t,n){var r,i,o,a,s=e.style;return(n=n||$e(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||w.contains(e.ownerDocument,e)||(a=w.style(e,t)),!h.pixelBoxStyles()&&We.test(a)&&Be.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function _e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}var ze=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ue={position:"absolute",visibility:"hidden",display:"block"},Ve={letterSpacing:"0",fontWeight:"400"},Ge=["Webkit","Moz","ms"],Ye=r.createElement("div").style;function Qe(e){if(e in Ye)return e;var t=e[0].toUpperCase()+e.slice(1),n=Ge.length;while(n--)if((e=Ge[n]+t)in Ye)return e}function Je(e){var t=w.cssProps[e];return t||(t=w.cssProps[e]=Qe(e)||e),t}function Ke(e,t,n){var r=ie.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ze(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=w.css(e,n+oe[a],!0,i)),r?("content"===n&&(u-=w.css(e,"padding"+oe[a],!0,i)),"margin"!==n&&(u-=w.css(e,"border"+oe[a]+"Width",!0,i))):(u+=w.css(e,"padding"+oe[a],!0,i),"padding"!==n?u+=w.css(e,"border"+oe[a]+"Width",!0,i):s+=w.css(e,"border"+oe[a]+"Width",!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))),u}function et(e,t,n){var r=$e(e),i=Fe(e,t,r),o="border-box"===w.css(e,"boxSizing",!1,r),a=o;if(We.test(i)){if(!n)return i;i="auto"}return a=a&&(h.boxSizingReliable()||i===e.style[t]),("auto"===i||!parseFloat(i)&&"inline"===w.css(e,"display",!1,r))&&(i=e["offset"+t[0].toUpperCase()+t.slice(1)],a=!0),(i=parseFloat(i)||0)+Ze(e,t,n||(o?"border":"content"),a,r,i)+"px"}w.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Fe(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=G(t),u=Xe.test(t),l=e.style;if(u||(t=Je(s)),a=w.cssHooks[t]||w.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"==(o=typeof n)&&(i=ie.exec(n))&&i[1]&&(n=ue(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(w.cssNumber[s]?"":"px")),h.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=G(t);return Xe.test(t)||(t=Je(s)),(a=w.cssHooks[t]||w.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Fe(e,t,r)),"normal"===i&&t in Ve&&(i=Ve[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),w.each(["height","width"],function(e,t){w.cssHooks[t]={get:function(e,n,r){if(n)return!ze.test(w.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?et(e,t,r):se(e,Ue,function(){return et(e,t,r)})},set:function(e,n,r){var i,o=$e(e),a="border-box"===w.css(e,"boxSizing",!1,o),s=r&&Ze(e,t,r,a,o);return a&&h.scrollboxSize()===o.position&&(s-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-Ze(e,t,"border",!1,o)-.5)),s&&(i=ie.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=w.css(e,t)),Ke(e,n,s)}}}),w.cssHooks.marginLeft=_e(h.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Fe(e,"marginLeft"))||e.getBoundingClientRect().left-se(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),w.each({margin:"",padding:"",border:"Width"},function(e,t){w.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+oe[r]+t]=o[r]||o[r-2]||o[0];return i}},"margin"!==e&&(w.cssHooks[e+t].set=Ke)}),w.fn.extend({css:function(e,t){return z(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=$e(e),i=t.length;a<i;a++)o[t[a]]=w.css(e,t[a],!1,r);return o}return void 0!==n?w.style(e,t,n):w.css(e,t)},e,t,arguments.length>1)}});function tt(e,t,n,r,i){return new tt.prototype.init(e,t,n,r,i)}w.Tween=tt,tt.prototype={constructor:tt,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||w.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(w.cssNumber[n]?"":"px")},cur:function(){var e=tt.propHooks[this.prop];return e&&e.get?e.get(this):tt.propHooks._default.get(this)},run:function(e){var t,n=tt.propHooks[this.prop];return this.options.duration?this.pos=t=w.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):tt.propHooks._default.set(this),this}},tt.prototype.init.prototype=tt.prototype,tt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=w.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){w.fx.step[e.prop]?w.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[w.cssProps[e.prop]]&&!w.cssHooks[e.prop]?e.elem[e.prop]=e.now:w.style(e.elem,e.prop,e.now+e.unit)}}},tt.propHooks.scrollTop=tt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},w.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},w.fx=tt.prototype.init,w.fx.step={};var nt,rt,it=/^(?:toggle|show|hide)$/,ot=/queueHooks$/;function at(){rt&&(!1===r.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(at):e.setTimeout(at,w.fx.interval),w.fx.tick())}function st(){return e.setTimeout(function(){nt=void 0}),nt=Date.now()}function ut(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=oe[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function lt(e,t,n){for(var r,i=(pt.tweeners[t]||[]).concat(pt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ct(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),y=J.get(e,"fxshow");n.queue||(null==(a=w._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,w.queue(e,"fx").length||a.empty.fire()})}));for(r in t)if(i=t[r],it.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!y||void 0===y[r])continue;g=!0}d[r]=y&&y[r]||w.style(e,r)}if((u=!w.isEmptyObject(t))||!w.isEmptyObject(d)){f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=y&&y.display)&&(l=J.get(e,"display")),"none"===(c=w.css(e,"display"))&&(l?c=l:(fe([e],!0),l=e.style.display||l,c=w.css(e,"display"),fe([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===w.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1;for(r in d)u||(y?"hidden"in y&&(g=y.hidden):y=J.access(e,"fxshow",{display:l}),o&&(y.hidden=!g),g&&fe([e],!0),p.done(function(){g||fe([e]),J.remove(e,"fxshow");for(r in d)w.style(e,r,d[r])})),u=lt(g?y[r]:0,r,p),r in y||(y[r]=u.start,g&&(u.end=u.start,u.start=0))}}function ft(e,t){var n,r,i,o,a;for(n in e)if(r=G(n),i=t[r],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=w.cssHooks[r])&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function pt(e,t,n){var r,i,o=0,a=pt.prefilters.length,s=w.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=nt||st(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),o=0,a=l.tweens.length;o<a;o++)l.tweens[o].run(r);return s.notifyWith(e,[l,r,n]),r<1&&a?n:(a||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:w.extend({},t),opts:w.extend(!0,{specialEasing:{},easing:w.easing._default},n),originalProperties:t,originalOptions:n,startTime:nt||st(),duration:n.duration,tweens:[],createTween:function(t,n){var r=w.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(ft(c,l.opts.specialEasing);o<a;o++)if(r=pt.prefilters[o].call(l,e,c,l.opts))return g(r.stop)&&(w._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return w.map(c,lt,l),g(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),w.fx.timer(w.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l}w.Animation=w.extend(pt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return ue(n.elem,e,ie.exec(t),n),n}]},tweener:function(e,t){g(e)?(t=e,e=["*"]):e=e.match(M);for(var n,r=0,i=e.length;r<i;r++)n=e[r],pt.tweeners[n]=pt.tweeners[n]||[],pt.tweeners[n].unshift(t)},prefilters:[ct],prefilter:function(e,t){t?pt.prefilters.unshift(e):pt.prefilters.push(e)}}),w.speed=function(e,t,n){var r=e&&"object"==typeof e?w.extend({},e):{complete:n||!n&&t||g(e)&&e,duration:e,easing:n&&t||t&&!g(t)&&t};return w.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in w.fx.speeds?r.duration=w.fx.speeds[r.duration]:r.duration=w.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){g(r.old)&&r.old.call(this),r.queue&&w.dequeue(this,r.queue)},r},w.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=w.isEmptyObject(e),o=w.speed(t,n,r),a=function(){var t=pt(this,w.extend({},e),o);(i||J.get(this,"finish"))&&t.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=w.timers,a=J.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&ot.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||w.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=J.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=w.timers,a=r?r.length:0;for(n.finish=!0,w.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),w.each(["toggle","show","hide"],function(e,t){var n=w.fn[t];w.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ut(t,!0),e,r,i)}}),w.each({slideDown:ut("show"),slideUp:ut("hide"),slideToggle:ut("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){w.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),w.timers=[],w.fx.tick=function(){var e,t=0,n=w.timers;for(nt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||w.fx.stop(),nt=void 0},w.fx.timer=function(e){w.timers.push(e),w.fx.start()},w.fx.interval=13,w.fx.start=function(){rt||(rt=!0,at())},w.fx.stop=function(){rt=null},w.fx.speeds={slow:600,fast:200,_default:400},w.fn.delay=function(t,n){return t=w.fx?w.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=r.createElement("input"),t=r.createElement("select").appendChild(r.createElement("option"));e.type="checkbox",h.checkOn=""!==e.value,h.optSelected=t.selected,(e=r.createElement("input")).value="t",e.type="radio",h.radioValue="t"===e.value}();var dt,ht=w.expr.attrHandle;w.fn.extend({attr:function(e,t){return z(this,w.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){w.removeAttr(this,e)})}}),w.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?w.prop(e,t,n):(1===o&&w.isXMLDoc(e)||(i=w.attrHooks[t.toLowerCase()]||(w.expr.match.bool.test(t)?dt:void 0)),void 0!==n?null===n?void w.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=w.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!h.radioValue&&"radio"===t&&N(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(M);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),dt={set:function(e,t,n){return!1===t?w.removeAttr(e,n):e.setAttribute(n,n),n}},w.each(w.expr.match.bool.source.match(/\w+/g),function(e,t){var n=ht[t]||w.find.attr;ht[t]=function(e,t,r){var i,o,a=t.toLowerCase();return r||(o=ht[a],ht[a]=i,i=null!=n(e,t,r)?a:null,ht[a]=o),i}});var gt=/^(?:input|select|textarea|button)$/i,yt=/^(?:a|area)$/i;w.fn.extend({prop:function(e,t){return z(this,w.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[w.propFix[e]||e]})}}),w.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&w.isXMLDoc(e)||(t=w.propFix[t]||t,i=w.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=w.find.attr(e,"tabindex");return t?parseInt(t,10):gt.test(e.nodeName)||yt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),h.optSelected||(w.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),w.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){w.propFix[this.toLowerCase()]=this});function vt(e){return(e.match(M)||[]).join(" ")}function mt(e){return e.getAttribute&&e.getAttribute("class")||""}function xt(e){return Array.isArray(e)?e:"string"==typeof e?e.match(M)||[]:[]}w.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).addClass(e.call(this,t,mt(this)))});if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).removeClass(e.call(this,t,mt(this)))});if(!arguments.length)return this.attr("class","");if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])while(r.indexOf(" "+o+" ")>-1)r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):g(e)?this.each(function(n){w(this).toggleClass(e.call(this,n,mt(this),t),t)}):this.each(function(){var t,i,o,a;if(r){i=0,o=w(this),a=xt(e);while(t=a[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else void 0!==e&&"boolean"!==n||((t=mt(this))&&J.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":J.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&(" "+vt(mt(n))+" ").indexOf(t)>-1)return!0;return!1}});var bt=/\r/g;w.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=g(e),this.each(function(n){var i;1===this.nodeType&&(null==(i=r?e.call(this,n,w(this).val()):e)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=w.map(i,function(e){return null==e?"":e+""})),(t=w.valHooks[this.type]||w.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=w.valHooks[i.type]||w.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(bt,""):null==n?"":n}}}),w.extend({valHooks:{option:{get:function(e){var t=w.find.attr(e,"value");return null!=t?t:vt(w.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!N(n.parentNode,"optgroup"))){if(t=w(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=w.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=w.inArray(w.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),w.each(["radio","checkbox"],function(){w.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=w.inArray(w(e).val(),t)>-1}},h.checkOn||(w.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),h.focusin="onfocusin"in e;var wt=/^(?:focusinfocus|focusoutblur)$/,Tt=function(e){e.stopPropagation()};w.extend(w.event,{trigger:function(t,n,i,o){var a,s,u,l,c,p,d,h,v=[i||r],m=f.call(t,"type")?t.type:t,x=f.call(t,"namespace")?t.namespace.split("."):[];if(s=h=u=i=i||r,3!==i.nodeType&&8!==i.nodeType&&!wt.test(m+w.event.triggered)&&(m.indexOf(".")>-1&&(m=(x=m.split(".")).shift(),x.sort()),c=m.indexOf(":")<0&&"on"+m,t=t[w.expando]?t:new w.Event(m,"object"==typeof t&&t),t.isTrigger=o?2:3,t.namespace=x.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+x.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=i),n=null==n?[t]:w.makeArray(n,[t]),d=w.event.special[m]||{},o||!d.trigger||!1!==d.trigger.apply(i,n))){if(!o&&!d.noBubble&&!y(i)){for(l=d.delegateType||m,wt.test(l+m)||(s=s.parentNode);s;s=s.parentNode)v.push(s),u=s;u===(i.ownerDocument||r)&&v.push(u.defaultView||u.parentWindow||e)}a=0;while((s=v[a++])&&!t.isPropagationStopped())h=s,t.type=a>1?l:d.bindType||m,(p=(J.get(s,"events")||{})[t.type]&&J.get(s,"handle"))&&p.apply(s,n),(p=c&&s[c])&&p.apply&&Y(s)&&(t.result=p.apply(s,n),!1===t.result&&t.preventDefault());return t.type=m,o||t.isDefaultPrevented()||d._default&&!1!==d._default.apply(v.pop(),n)||!Y(i)||c&&g(i[m])&&!y(i)&&((u=i[c])&&(i[c]=null),w.event.triggered=m,t.isPropagationStopped()&&h.addEventListener(m,Tt),i[m](),t.isPropagationStopped()&&h.removeEventListener(m,Tt),w.event.triggered=void 0,u&&(i[c]=u)),t.result}},simulate:function(e,t,n){var r=w.extend(new w.Event,n,{type:e,isSimulated:!0});w.event.trigger(r,null,t)}}),w.fn.extend({trigger:function(e,t){return this.each(function(){w.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return w.event.trigger(e,t,n,!0)}}),h.focusin||w.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){w.event.simulate(t,e.target,w.event.fix(e))};w.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=J.access(r,t);i||r.addEventListener(e,n,!0),J.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=J.access(r,t)-1;i?J.access(r,t,i):(r.removeEventListener(e,n,!0),J.remove(r,t))}}});var Ct=e.location,Et=Date.now(),kt=/\?/;w.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(e){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||w.error("Invalid XML: "+t),n};var St=/\[\]$/,Dt=/\r?\n/g,Nt=/^(?:submit|button|image|reset|file)$/i,At=/^(?:input|select|textarea|keygen)/i;function jt(e,t,n,r){var i;if(Array.isArray(t))w.each(t,function(t,i){n||St.test(e)?r(e,i):jt(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==x(t))r(e,t);else for(i in t)jt(e+"["+i+"]",t[i],n,r)}w.param=function(e,t){var n,r=[],i=function(e,t){var n=g(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(e)||e.jquery&&!w.isPlainObject(e))w.each(e,function(){i(this.name,this.value)});else for(n in e)jt(n,e[n],t,i);return r.join("&")},w.fn.extend({serialize:function(){return w.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=w.prop(this,"elements");return e?w.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!w(this).is(":disabled")&&At.test(this.nodeName)&&!Nt.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=w(this).val();return null==n?null:Array.isArray(n)?w.map(n,function(e){return{name:t.name,value:e.replace(Dt,"\r\n")}}):{name:t.name,value:n.replace(Dt,"\r\n")}}).get()}});var qt=/%20/g,Lt=/#.*$/,Ht=/([?&])_=[^&]*/,Ot=/^(.*?):[ \t]*([^\r\n]*)$/gm,Pt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Mt=/^(?:GET|HEAD)$/,Rt=/^\/\//,It={},Wt={},$t="*/".concat("*"),Bt=r.createElement("a");Bt.href=Ct.href;function Ft(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(M)||[];if(g(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function _t(e,t,n,r){var i={},o=e===Wt;function a(s){var u;return i[s]=!0,w.each(e[s]||[],function(e,s){var l=s(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):void 0:(t.dataTypes.unshift(l),a(l),!1)}),u}return a(t.dataTypes[0])||!i["*"]&&a("*")}function zt(e,t){var n,r,i=w.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&w.extend(!0,e,r),e}function Xt(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}function Ut(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}w.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ct.href,type:"GET",isLocal:Pt.test(Ct.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":$t,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":w.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?zt(zt(e,w.ajaxSettings),t):zt(w.ajaxSettings,e)},ajaxPrefilter:Ft(It),ajaxTransport:Ft(Wt),ajax:function(t,n){"object"==typeof t&&(n=t,t=void 0),n=n||{};var i,o,a,s,u,l,c,f,p,d,h=w.ajaxSetup({},n),g=h.context||h,y=h.context&&(g.nodeType||g.jquery)?w(g):w.event,v=w.Deferred(),m=w.Callbacks("once memory"),x=h.statusCode||{},b={},T={},C="canceled",E={readyState:0,getResponseHeader:function(e){var t;if(c){if(!s){s={};while(t=Ot.exec(a))s[t[1].toLowerCase()]=t[2]}t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return c?a:null},setRequestHeader:function(e,t){return null==c&&(e=T[e.toLowerCase()]=T[e.toLowerCase()]||e,b[e]=t),this},overrideMimeType:function(e){return null==c&&(h.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)E.always(e[E.status]);else for(t in e)x[t]=[x[t],e[t]];return this},abort:function(e){var t=e||C;return i&&i.abort(t),k(0,t),this}};if(v.promise(E),h.url=((t||h.url||Ct.href)+"").replace(Rt,Ct.protocol+"//"),h.type=n.method||n.type||h.method||h.type,h.dataTypes=(h.dataType||"*").toLowerCase().match(M)||[""],null==h.crossDomain){l=r.createElement("a");try{l.href=h.url,l.href=l.href,h.crossDomain=Bt.protocol+"//"+Bt.host!=l.protocol+"//"+l.host}catch(e){h.crossDomain=!0}}if(h.data&&h.processData&&"string"!=typeof h.data&&(h.data=w.param(h.data,h.traditional)),_t(It,h,n,E),c)return E;(f=w.event&&h.global)&&0==w.active++&&w.event.trigger("ajaxStart"),h.type=h.type.toUpperCase(),h.hasContent=!Mt.test(h.type),o=h.url.replace(Lt,""),h.hasContent?h.data&&h.processData&&0===(h.contentType||"").indexOf("application/x-www-form-urlencoded")&&(h.data=h.data.replace(qt,"+")):(d=h.url.slice(o.length),h.data&&(h.processData||"string"==typeof h.data)&&(o+=(kt.test(o)?"&":"?")+h.data,delete h.data),!1===h.cache&&(o=o.replace(Ht,"$1"),d=(kt.test(o)?"&":"?")+"_="+Et+++d),h.url=o+d),h.ifModified&&(w.lastModified[o]&&E.setRequestHeader("If-Modified-Since",w.lastModified[o]),w.etag[o]&&E.setRequestHeader("If-None-Match",w.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||n.contentType)&&E.setRequestHeader("Content-Type",h.contentType),E.setRequestHeader("Accept",h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+("*"!==h.dataTypes[0]?", "+$t+"; q=0.01":""):h.accepts["*"]);for(p in h.headers)E.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(g,E,h)||c))return E.abort();if(C="abort",m.add(h.complete),E.done(h.success),E.fail(h.error),i=_t(Wt,h,n,E)){if(E.readyState=1,f&&y.trigger("ajaxSend",[E,h]),c)return E;h.async&&h.timeout>0&&(u=e.setTimeout(function(){E.abort("timeout")},h.timeout));try{c=!1,i.send(b,k)}catch(e){if(c)throw e;k(-1,e)}}else k(-1,"No Transport");function k(t,n,r,s){var l,p,d,b,T,C=n;c||(c=!0,u&&e.clearTimeout(u),i=void 0,a=s||"",E.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(b=Xt(h,E,r)),b=Ut(h,b,E,l),l?(h.ifModified&&((T=E.getResponseHeader("Last-Modified"))&&(w.lastModified[o]=T),(T=E.getResponseHeader("etag"))&&(w.etag[o]=T)),204===t||"HEAD"===h.type?C="nocontent":304===t?C="notmodified":(C=b.state,p=b.data,l=!(d=b.error))):(d=C,!t&&C||(C="error",t<0&&(t=0))),E.status=t,E.statusText=(n||C)+"",l?v.resolveWith(g,[p,C,E]):v.rejectWith(g,[E,C,d]),E.statusCode(x),x=void 0,f&&y.trigger(l?"ajaxSuccess":"ajaxError",[E,h,l?p:d]),m.fireWith(g,[E,C]),f&&(y.trigger("ajaxComplete",[E,h]),--w.active||w.event.trigger("ajaxStop")))}return E},getJSON:function(e,t,n){return w.get(e,t,n,"json")},getScript:function(e,t){return w.get(e,void 0,t,"script")}}),w.each(["get","post"],function(e,t){w[t]=function(e,n,r,i){return g(n)&&(i=i||r,r=n,n=void 0),w.ajax(w.extend({url:e,type:t,dataType:i,data:n,success:r},w.isPlainObject(e)&&e))}}),w._evalUrl=function(e){return w.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},w.fn.extend({wrapAll:function(e){var t;return this[0]&&(g(e)&&(e=e.call(this[0])),t=w(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return g(e)?this.each(function(t){w(this).wrapInner(e.call(this,t))}):this.each(function(){var t=w(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=g(e);return this.each(function(n){w(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){w(this).replaceWith(this.childNodes)}),this}}),w.expr.pseudos.hidden=function(e){return!w.expr.pseudos.visible(e)},w.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},w.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Vt={0:200,1223:204},Gt=w.ajaxSettings.xhr();h.cors=!!Gt&&"withCredentials"in Gt,h.ajax=Gt=!!Gt,w.ajaxTransport(function(t){var n,r;if(h.cors||Gt&&!t.crossDomain)return{send:function(i,o){var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(a in i)s.setRequestHeader(a,i[a]);n=function(e){return function(){n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(Vt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=n(),r=s.onerror=s.ontimeout=n("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&e.setTimeout(function(){n&&r()})},n=n("abort");try{s.send(t.hasContent&&t.data||null)}catch(e){if(n)throw e}},abort:function(){n&&n()}}}),w.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),w.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return w.globalEval(e),e}}}),w.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),w.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(i,o){t=w("<script>").prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),r.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Yt=[],Qt=/(=)\?(?=&|$)|\?\?/;w.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Yt.pop()||w.expando+"_"+Et++;return this[e]=!0,e}}),w.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,a,s=!1!==t.jsonp&&(Qt.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&Qt.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=g(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(Qt,"$1"+i):!1!==t.jsonp&&(t.url+=(kt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return a||w.error(i+" was not called"),a[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){a=arguments},r.always(function(){void 0===o?w(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Yt.push(i)),a&&g(o)&&o(a[0]),a=o=void 0}),"script"}),h.createHTMLDocument=function(){var e=r.implementation.createHTMLDocument("").body;return e.innerHTML="<form></form><form></form>",2===e.childNodes.length}(),w.parseHTML=function(e,t,n){if("string"!=typeof e)return[];"boolean"==typeof t&&(n=t,t=!1);var i,o,a;return t||(h.createHTMLDocument?((i=(t=r.implementation.createHTMLDocument("")).createElement("base")).href=r.location.href,t.head.appendChild(i)):t=r),o=A.exec(e),a=!n&&[],o?[t.createElement(o[1])]:(o=xe([e],t,a),a&&a.length&&w(a).remove(),w.merge([],o.childNodes))},w.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=vt(e.slice(s)),e=e.slice(0,s)),g(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&w.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?w("<div>").append(w.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},w.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){w.fn[t]=function(e){return this.on(t,e)}}),w.expr.pseudos.animated=function(e){return w.grep(w.timers,function(t){return e===t.elem}).length},w.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l,c=w.css(e,"position"),f=w(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=w.css(e,"top"),u=w.css(e,"left"),(l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1)?(a=(r=f.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),g(t)&&(t=t.call(e,n,w.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},w.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){w.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===w.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===w.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=w(e).offset()).top+=w.css(e,"borderTopWidth",!0),i.left+=w.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-w.css(r,"marginTop",!0),left:t.left-i.left-w.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===w.css(e,"position"))e=e.offsetParent;return e||be})}}),w.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;w.fn[e]=function(r){return z(this,function(e,r,i){var o;if(y(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),w.each(["top","left"],function(e,t){w.cssHooks[t]=_e(h.pixelPosition,function(e,n){if(n)return n=Fe(e,t),We.test(n)?w(e).position()[t]+"px":n})}),w.each({Height:"height",Width:"width"},function(e,t){w.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){w.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return z(this,function(t,n,i){var o;return y(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===i?w.css(t,n,s):w.style(t,n,i,s)},t,a?i:void 0,a)}})}),w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){w.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),w.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),w.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),w.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),g(e))return r=o.call(arguments,2),i=function(){return e.apply(t||this,r.concat(o.call(arguments)))},i.guid=e.guid=e.guid||w.guid++,i},w.holdReady=function(e){e?w.readyWait++:w.ready(!0)},w.isArray=Array.isArray,w.parseJSON=JSON.parse,w.nodeName=N,w.isFunction=g,w.isWindow=y,w.camelCase=G,w.type=x,w.now=Date.now,w.isNumeric=function(e){var t=w.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return w});var Jt=e.jQuery,Kt=e.$;return w.noConflict=function(t){return e.$===w&&(e.$=Kt),t&&e.jQuery===w&&(e.jQuery=Jt),w},t||(e.jQuery=e.$=w),w});
//-----------------------------jq----------------------------------------------

function ckplayerConfig() {
	return {
		flashvars: {},//用来补充flashvars里的对象
		languagePath: '',//语言包文件地址
		stylePath: '',//风格包文件地址
		config: {
			fullInteractive: true,//是否开启交互功能
			delay: 30,//延迟加载视频，单位：毫秒
			//delay: 0,//延迟加载视频，单位：毫秒  by guo 2020-4-3-16:22修改
			timeFrequency: 100,//计算当前播放时间和加载量的时间频率，单位：毫秒
			autoLoad: true,//视频是否自动加载
			loadNext: 0,//多段视频预加载的段数，设置成0则全部加载
			definition: true,//是否使用清晰度组件
			subtitle:false,//是否使用多字幕切换组件
			playbackRate:true,//是否使用倍速播放组件
			smartRemove: true,//是否使用智能清理，使用该功能则在多段时当前播放段之前的段都会被清除出内存，减少对内存的使用
			bufferTime: 200,//缓存区的长度，单位：毫秒,不要小于10
			//bufferTime: 0,//缓存区的长度，单位：毫秒,不要小于10  by guo 2020-4-3-16:21修改
			rtmpBufferTime:0,//rtmp视频缓存区长度，单位：毫秒
			click: true,//是否支持屏幕单击暂停
			doubleClick: true,//是否支持屏幕双击全屏
			doubleClickInterval: 200,//判断双击的标准，即二次单击间隔的时间差之内判断为是双击，单位：毫秒
			keyDown: {
				space: true,//是否启用空格键切换播放/暂停
				left: true,//是否启用左方向键快退
				right: true,//是否启用右方向键快进
				up: true,//是否支持上方向键增加音量
				down: true //是否支持下方向键减少音量
			},
			timeJump: 10,//快进快退时的秒数
			volumeJump: 0.1,//音量调整的数量，大于0小于1的小数
			timeScheduleAdjust: 1,//是否可调节调节栏,0不启用，1是启用，2是只能前进（向右拖动），3是只能后退，4是只能前进但能回到第一次拖动时的位置，5是看过的地方可以随意拖动
			previewDefaultLoad: true,//预览图片是否默认加载，优点是鼠标第一次经过进度条即可显示预览图片
			promptSpotTime: false,//提示点文字是否在前面加上对应时间
			buttonMode: {
				player: false,//鼠标在播放器上是否显示可点击形态
				controlBar: false,//鼠标在控制栏上是否显示可点击形态
				timeSchedule: true,//鼠标在时间进度条上是否显示可点击形态
				volumeSchedule: true //鼠标在音量调节栏上是否显示可点击形态
			},
			liveAndVod: { //直播+点播=回播功能
				open: false,//是否开启，开启该功能需要设置flashvars里live=true
				vodTime: 2,//可以回看的整点数
				start: 'start' //回看请求参数
			},
			usehardwareeecoder:false,//是否采用硬件加速，只针对flashplayer有效
			errorNum: 3,//错误重连次数
			// playCorrect: false,//是否需要错误修正，这是针对rtmp的
			playCorrect: true,//是否需要错误修正，这是针对rtmp的 by guo 2020-4-3-16:19修改
			timeCorrect: true,//http视频播放时间错误纠正，有些因为视频格式的问题导致视频没有实际播放结束视频文件就返回了stop命令
			m3u8Definition: { //m3u8自动清晰度时按关键字来进行判断
				//tags:['200k','110k','400k','600k','1000k']
			},
			m3u8MaxBufferLength: 30,//m3u8每次缓冲时间，单位：秒数
			split: '|',//当视频地址采用字符形式并且需要使用逗号或其它符号来切割数组里定义
			timeStamp: '',//一个地址，用来请求当前时间戳，用于播放器内部时间效准
			mobileVolumeBarShow: false,//在移动端是否显示音量调节按钮
			addCallback: 'adPlay,adPause,playOrPause,videoPlay,videoPause,videoMute,videoEscMute,videoClear,changeVolume,fastBack,fastNext,videoSeek,newVideo,getMetaDate,videoRotation,videoBrightness,videoContrast,videoSaturation,videoHue,videoZoom,videoProportion,videoError,addListener,removeListener,addElement,getElement,deleteElement,elementShow,animate,animateResume,animatePause,deleteAnimate,changeConfig,getConfig,openUrl,fullScreen,quitFullScreen,switchFull,screenshot,custom,changeControlBarShow,getCurrentSrc,changeDefinition,changeSubtitles,changeSubtitlesSize'//需要支持的事件
		},
		menu: { //版权名称支持
			ckkey: '',
			name: '',
			link: '',
			version: '',
			domain: '',
			more: []
		},
		style: { //风格部分内容配置，这里主要配置loading和logo以及广告的部分内容
			loading: { //视频加载前显示在播放器中间的图片，如果不需要可以删除该属性
				// by guo 2020-3-8-09:20修改
				file:"data:application/x-shockwave-flash;base64,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",
				// file: 'data:image/swf;base64,Q1dTCrUjAAB4nKWZBzRc/bf3BwmJJEgQoo0SEd3odRA1iU70PjqjzYg6SESITiJatKiJMLroRIsuehC999FHveT/PBn3/p/33vu+71rG+pzf2fu7z3ef39nrzBorAFACgF0FAJBjAaRvkwMAAB/iK1cBAFFnMwthNWlZWjeonT1M+PxIjN4KDncU5uR0dXXlcOXhcHC25AQJCQlxcnFzcnOzn0eww9zt4SZu7PYwBnow7W8FaXMYxNnaEW7tYE97cWxi6uACF6On/0vWDer4R9YexmFi5mBqzgFxgHK6mThygji4OC90zoOEpZzNTeAOzhoODnZgyYsoWlk7E5gVrYqzg4U5DHYub2JHK6XOJ8r5X6Mv5ZtLn3/A3FwgbnYuAXZuIQ0QvzAvjzBIgJVLUJiL61LuvyL/lapoDjcxM4GbYJIv/ng0QHzCfOdpQpeT/1PsX+kOZtYW7v+rZEwkrSjnf+ne/7qfior/fUehUM6/o2FwNXOL/z4apuHuaM6pZg5zcHGGmJ+HM/x1RxQVhR/bw+Am9hDzx9Lg8wUOa2szYUkuLhnQIyFBWUleXhluEOiRAA+vlJS0AJ8UnwA/D8+j30b/c+rfatIOEBeouT38LzWz/wu1S6l/qyk7W1tan++Jf1AV4OLi5+PjluGTlBaSAYFAQtx80o94QYICQtz8/FJ/3Yx/lvhzrebO1s/NzWSdHaC/74KjiTPM/KJTYvR/t+qiTb/7K2z9720Skv2fjP1b6t9qZv9gSOh/MvRvqX+rOfz/tOn/KEH758Zg+vT/vKXNIH92qKOLs93vsWMG4TS3M7+oBjvfpaDfU8IMImzh4Aw1gYNNHB3trCEmF4KcbuwwKweIravJc3N2i4uJIcqJCfzHS+L8a/CBaQFS2OfjsJb05vl/LMDch4r5OCQtCAAQv75JfrFy9TuAC+A2spaI56XxbK+FKa4/7vFGNXGv/CO8q69or8TIBNHeEX7R4+l7hYsu4hH2FUnhhzJXtDQ0tVVJTu+SPPJ4CScpoP2YnULPtnk0weOQJDqh5K4uMZy4jR7r7qhyXuhM2K6uhXVVv/1uNh/3NjGU7X6dzqAYuwQ/zOal3cmynJmnq2sM8LCWaS2HYN8lW7C/ZWrylGlWpMzlHTuHQvQtahK6p4rOMeXMc9wicQNf9iYsnQdFDdbMf1Vc+f4kWHdEw7vXyGUmJm7qq0Ev1jAXkZs796YsQT4T0K0IMCxGOAy+q412HUsa3Zn2pwvScoUX3uPh1r1LnKrGY8GXcyIQGx6A0+dr9bNGzAd2ONfyKVVCh8l4hmgSyPOi2r/Os/0F4RB2gNEVGyOcsFqcD8grefqAPEPsGiGC/lXTjlnsp5UfhJKmNHX79Qer4gI6VE+HfGpwNqoa8mKKCuLi4gi/ucyaWVrqiW3U81PMVLpcL5jYlnVFJ1Kqn/heba2L6upoqcSWgfqinSSeX+MaoIydxVKA4z3wxOrD8XUvkHAX3lzmnVzkn6SHzMZsvHBQxpErxV45TBbn6Rdz1XzJNjzR2hYQHR7Q5iVGbbY9X+x4uL6i2rGQBTpLbhKMXSdUcMTihvqmchtfs/WTYfcrkfwilma94/GOfSZwqauQ13iBJOWQdHLnqK5yTsI64MQhY9TFo3Hot+Q3epzoUpHS56beieZ4IbB53QfbqNt2o46KaQtxzvOqSnVuV/sItDLp7FcjS64/sT+y8jROZ2/5QYvFSUwOe6odUhozxxzAj5UglyTO0ws5mHwYN3ahizd8x65aan9hP2TmOPmAvLPYlMQTrNbQaNXceIW0747RHvvrIvIc5k077ODqKN9jiy+M2O4othob7A6TI8tCbdsgJohCPYpXoeFaCVvzL+67OdUgMjfr4xLWvm8WCo/f/RzVRudvoSZ1qkJdF/EKO8h+fJncTZCTlbHhfdSAu4Rn3WB3l2kO5I2v5ivDrm37yXoV/U0j70fNS7OwGNHmrqKQVP3BiQ4JJYjsqBOFNIgCxd2nbLDw7fBF7Ykou91I+qujzwya4C8W3x+ZcYw7MOPG1Fdn3yns3R4a6TLc1pu55tAVzqxJT53i5SXJw6HMhLsY6aZS9ON4vdQrk9FdQS7JXHjLjqoFb+k63/R9kQhIaOyMi3WImKvdEkTLJ5aEy9mqOJowR4xonr4Ipj83DKMQDWadfOZF8nn6s0jhN3Xx/fh41+1pcsL3CUc2XmIv+nBMU/IZtRpY7NuTyiy8uGTx1cpPSGCdoSYT3BAT++LXt/aEBYJmGJhe9qUugdnWnaenBUo0fzpSzTN6o386lnVRH4ecsv2Ympqa1RM3qPG6h53zKTu7Zw6mdmAVHR/Psgob6koUqR4bG4Oj+XYZxpRkkbsoJn9CD+URpnU9t/G+k8Nd4mS5UTRkESZfHvOtO2etAu15gl7qy/IfkkBai/j4wH++HsjRCj7Kss3aWJakYOKe6/Qc32Q7AJyaP3PkzHv1VPXqhxs5G4Ix/WfctpKnubYaDYmUTWiwtbSqiD2BWSukbmtnApm7uL+LJpVS5ucAPjN6lnT+aUvi9Nrq1XKndkqIjSdunmNpfMJRUG/YbeLVYXHSZSwaMtTfKGszLdSmZYFbVYkMEOXt0dlaeMjOwvISK22jSi+GwyBkSqoDF4Gs6Mqy7ZmrfKRZgg6jA78C23/P5pzy7IFNWfY0R/RY1W4mvUFqLZcsbjuAgLzz5LBTRGsLtKph2eCBvVRPL4XbuQnbH6oPb4R/s0WpSotPOLJuoZttM7qVqk+O7OZb0ApSQXEWbN6zXaHmSy02MSHaXOIrS7X7i710BdZvyYGEhIRy5fpKob+Uhx5EmtD96hvJZGsDbn4ns7QEIVrNQzreTG7t6dTrf5ARar3pwzFOAW1HSUJf4gu0lHckvKW3JlAdrR6wnN1WO0gBqQmCewsOj3U/32Zo3pQcMl/1DEQ+Www3bd5F5x1oM89EkADJagK0/WiugD+YlW7dabGfIdI0DA1csJnS7SiQDJFmQ0p+++whjRRGbWS253gjmB2u2XdvQzyItLTiEsBuxuFKJpIvXqhNsLJ9n3Dt/brTj+xWtm1r0kxntgGTU/J4ffUYvh8aZmZjmuvUZfSh09EqcvVTmQNKW7aGaQ/m1MG4Q23gJW8iRQaE3/oGij+8w8N2ur6LoqsiMCigB3F6E04JSlQw8zXfGWdNHcd38a9lMmXvvQt7w6fXEaDic6vJfL9dDXr8sRaVWEbWOcRf52PNRxLMkqIPJ6lh6woy0An4urBCzuASqI+4w558dLCXhK7GJ9tRunl9k8edm5OZg95toTTkCkcXPXWrRQVvQ0yC34f5JlN2xphwFQaxeyv56enRHTrKP7RiJmyDY/xbtmrSQgkPw1455dd4N3n1uLIx4pIcZXOAFyv8T/psEfvaRsccO3oGoPcRWMKGQ+jXvN97Toi3U0NTa9uozPlL/ZUM5NKaKnCLRzY/6fIEEgrskdd8wS3oHjqtv+Z57Kqi0xk4y1H98Dn3frWYvkbQVmHNG33wI2HuhvAlPAiExfatzjpoMHLGD25W3OkPwzG7XmAfNW0mVcNAZeQ+cXvb5Cbl9PYtdEiNaJ3aLmvqxBsdUpvcPFvSJM4qgtTTwPIffDRLvdyIjW1a7diOgYXYiQ7qxZKZ+9PaVHPF+Y/eumrQ2bizm2r2f7w+k9YaJHyFIzeeen9f9b1+wnqeGouhp7kbt9bCR9HEadZpP2dYPMM9iKsAWes7xQQSB0fRBxNl0oghcn4FlC00RDeKEHHzGkJTK4RxVktw/NpGCTj0nYdD8QCShsRTN2l4TjOhhI98r1nHRVTGKxu/fDjoINArDHLfTGe3/mBpJZogLGzksHXxF/Iscu3Mw2H/M5lR2PXwQK55inhpXLTBIUvlvSw6jZXE2a4tOGkZmLE9KcfSSXhrfPRX6BafOppoyL9kwL5jTirm7MlaADLHJgcSrJggew1N1qL9SOxu+K3mQYniubuEOMB3MUiVYyjF6w1wQD0y2f9zNnbQN3wX7/XadPwpNgHCBfLy9drFtP7JWMHEid0+HfX8mkORVWFUw254l2FHMlhEayk7kRHK72Q3dF9JXF6kWWTCoC/qU5yej2zn942h17+KysWkdpmkKuC1BykHjcO6cfzgnaVgcDJfhlLWhi6NBviROQcYeKQ8Eni8XysdHqP8TTKN2p4C/Kjdtn+XtbZwWSuq+f3P0eFFhbCsLEIaPydPcMtOWTfEfE6mCrHeAnOgzltDaetqMQ9NLy1/1FWLGkB+ESwa+nhMt4Texs0QSxDJ3z7+YNk733lvmI/pqCC/vGjGfBsW/0sAvMiH/uiYUIN+eVQfwLxrYOAVQbMcVPDK4/5gZ20Q4aGB4YRhauFLS3WzPiam7/RS0WcFyaV93jbTJWQ78RSJLUCpk0iXpcWzFv6aCSa7j6Neox93AEkih7fau8PrvSWv6r/yyj8WtdPphIbLAF1DFOwzNiq71oXsqGRPttkOz2Z4+9KKYnfXr34R9Ihcat0/0y5ebqIFGvm9nTwdHx9PysvLIygtLW0+LM2YYTVRoAspYwYOkFreaw/IEzS0OQkSVx7yfNxa778famlErmfdp/B0zFb9wCp7PTesAHnKdRDu9c6NNm1iGDXqfyQu2jMTvr0kNOD26ugT9Ff/lDLy020B2Bz167HF6gyCnJxaGZJ2Hqq7VKpDyOznc+q6/pPmA++ygOHff87lqXzeQTRfxWEyg2zVdHMZD93bGXcKmjvK4vItiNqdX4h13WxnDd4Htiv4sEgl45azkAQZ+/j4mDY2/fypMzU5OWnn4LBh1tJxzahIw5uDyjKjnyd0TmoIVVF64yQxr0UlVAkf+OjuAeTV6WdFTnYnZOgcpKlw0KY2A5UIf0mxsbLzwcvoazLvZOdQ32kjkc9NlIRsy6aoyhmcxqkZWNRarsyRuSoUTLbMUXRc+bpJiwrYb0Ug5mjNN0cvoqfwcGBhyAytHJrw5s3ZIZUfrxd81AM70fCAhJofEdRS9kGiNjFr4+aEy/Sv1Aw9CLZUiTcynRILDAaPr6+v03BwcDQGt7W2vtkil4p35lyurDgcepYm8JoQwadscEKuhxf9LYDr/TSEDWVb8GaBLKNjZinnqvyUH/DIXxZ0u+np7NBsXzrntNvTbDpRYHGiwPLb0usQPtOwsF8rQl7Md4GHFAmUNVJ1vSyChcd+Cw3BqKna9PikmGJq4b4eM7muCVklaVxI2sLeW/mJ53cM+IFyR4otPc4IBrUhXloXKMOIg+jr4s4WpFj5Jw+1I3BDI+zhzsvBzAjvr8zRT3qJTP3g0k86XDjn8VxAGexdd5KUT1PCVU2MpvkeVBwQJUGsvP3Bb/uFRFNpFhN4fvCJW2XvsdPoNe4r4gOntR93XEdSj5hyb7nSAU3XG/V/8NsA0Ypjvnx8Mfknfe2bet9QkgXRT28n+2k0FH210a30ZriFnu9o4WlOwYOk/ZKdTokUo5HKuRUS6nJL3lA9vHFgN9DoWbjFaiS0dnvxcESZxujA2dRYOiQf2EuQRGgo8rCGHnyzSXt6bEBt5SnciXEPCHVnrU6OIIaWMKHcWBhrektwpYYOwQivQFuiinnUDlq0VlNrDOlmrz/qEtuGB7REOd1pkjdlQEyeGJEBp73R0GSVNRu9GfOq/Z/KywdtNZPXWvDmFr9c5QaL4ou32pzN0kp5dazzm1FV2AuFkTTjgCIr3tsy2waG497PtZGgn/Gbp7XmSAp7o6Pq2Q49PVLOAA9KcQTulpy/MYe+c38MtXVnKwCrxoQvC0/0lwPOr2thrDPXaCnIB56bwAvnvBmXN/KaBHygL2WVTja7kQ4sVqbyQY2p0JjiA/Gqmr98mz9szz7a02rM+xLwCzuMMNoCatrD3Rse1Lp2SCAAR86Lg5yD4glN6eKa1Bpl2nSVROR5orTTXMLSGRrlrwQviM7TZN9I2HxUbKSSrSL+cJ9oS1JIeCmg/yr7vg2ikt/oTh6SaKj2Jrow70DGiIbBEIJ0MMgHoWKHhzIGM9IHE5pWVm+hJHUlwE/QhRFXR2RLGNtEDkQlY2v7bEfkhISS9Tb59CHo4U9U2r5bQcGCJw0OVl3NsFGvW8Av5TEa9MVVd5MYo/3XAhRiKOchhb6EYbdsOrNzp2jeRGay2t7Wh+/Y1K36RGfuJX/Od3UkmgeaguVFDg7aVEIlRscKM3yAGew0Uwjl1aFjh9hGW+03NxC2m+mz6JHDjG6WY4N3/cf6omQf2eUiPjKO7PT1WA404W20p9+qerOSTyKAOlb50DSUcyB7fG1BImQO8gZRhiqDTQj5cXpXhHF0lEG3CXNc/A6M9Wmrql57nxVUdzZyS9W4a4lfscvehUCrPSiX5O+3O3ltgW3kP5yqHW0enAVC14obtbxCtWy8drVGGo4rtU3EOu/wjXqak/Dc5pkul0R5J1HC7L4qOofnNJQNTbXn1M4saSk3vF7Cm6PhiD8kza01BWlC9dfb7fEzemmB4Q4ipwtjUonBvIVjaWHWzZHJfvOriJq1HioBS//BGnmmQMJU781tYPNyQDThjAL5W7D8SvvZk6eRaNlEr+IDxQ8VXtTq+4kBXvUmD8meWe2k4at2D6S0to1MnASL25FFx35GIqfHiedTRkuJ2ZRspWHvfYr1lUt+4fKaCIU4jKcezsZx7spb9akafZjPU/uUXdPeoj19PBZL1dgWACduDlYbzDlDxiZ0jLtrbQbeqdo+f0REG+MKpqoi9CCPasWzhHYPBlyuMSN/9gvbptagKr8SzqQdDc7YPNDNtQzJd2P5kj49FDGG4IRTGRBNTs1BFz1WeYW+N9gQMgDf5ZAfHt04y5E9jc1djH1R2DBh3B3Hek1XNzfP5BMvn6FuZUK+rkH4iVDmbMNByrVEH7us9I1Gqt1juZVbLT12MtQv8QmonyZWz8RpWotldKy586ACrzm5EhI+d8YnfP78btl3FX96FgUOVy0dNNfQq+2J6cOc6CBxPZHRyQOgJ1Q05ERBqpcfGMC2kR9PaG7i74G43qmj8ovZQ2bNNjfznTo4JTe5qZpp/uNMcDJ9YfGWhfRpfa5BC5ncVdyAJz/8AokytvxwHj8ekIt6m0MgYP2tJDb2c8OPH9HJ0rJqOWJPkNVVwsWejrCIgDhCZlvnU7JO9fnsMWoum+v8AwbfVk+M6lJ9gwusCBqLZh9O69gnFr4HFWZOae70BhUwK4um5YYVP0CYYnnhEyTbJ1XaHqQpizLulgE5up4/P/NS5MBbXQVYWkpkYJPg17Ved3ScLB0dURP5Ke/yPkBa/IFy0nH+puQuCyvlSGjzftZaVIXxDmVWfunyHVPNQUnDulz19NofEtvLGsE2XZ2Q46j81ZmaN9QVb2CRj61PAhzWwNZO2w+c3qit5Ofhex5Fzz1hnJzCOjgAGBqOwVxd65qupiAab/J5Hun0iYnlnrm22eyPHpvj75elPfiisUDXvSp8K0tGrh8V/SQxC0bR64FI88g1aRt5bTTznjq+d7rV5LVNzeGXx+kJo3mJ6aSN0sa0kys33DwnzF/N5wTetqGhcYne2ytQ7Z0IP7hbe1dAPU9v2X1kXHmZT15Ma6JEe2t7u4XC81bFegxoKGXFC5JncOydORbgvYdK9N4oyiUQ2jBI0ZeitkRRTOtp5uaNlv4czp5Pb6poFnFiZdkHR1VXQBXUWHIZ3nlUG9o/mYuNrK8n44w4Iyaur5eQqEtGp8geMXeZjtp7uCvGpai1du5ApvghXuqrDO+nv5MA+aLNoVXkDf5CM68+ga27SlYq8dSOJezWufGaPCawyskPm4XOX3x0T/Y/PZbS5w1RyVNacbLuFM5Vz2qZ5QutlUF+/hkZGf026X3UHZrVjY3z7wvWYOW8N7++ComTxbxrjIhYtUahFrqJbsyemZhIWD3Moj6fiOIPMz8iFBNqdi0cHfNrExM/zZSCvBYrwzPDEipqjJgRscIWlNOj2uAd6+/VX3ERyaNjG/Uk4O93ZsEmJZFFpZC6HMv+lewPN8Kz0SmZxgWadVE2u8eyAWThqTOZuOmrX33lBKgaTlvwjo/KeibVW0aK3V2NspRESjOzHH4OV+6zcmZkUI9N1JxYZkVF2RswnTFNEF7HMjUF6HZLjNwmaURNbXSDppda52aLxdjX2rtNIUDP/vb2MUH5BOSE7QnXLFlm44PMsOT5LZNlbfuH/DwPZHmbythJjVCD7aD1yPaCJryI0rkrL3Xsu5Bzcy6Nnk58aoP9H9feq8t771J+iVPDvd+M7fRFRgYWL+GtfKrkrRxqKCfrrK8SHDgZliZbRXTD29s3h1XC9sT6LN+k9mTs88DXH+vrzc6p7WWdKCbYNL56rZF6sfLysHXe87hvX/nFuBcqi+EdzAPNwsUeW7oKSwHLfGXFBO0ZixwMO2WkA7WqRvtCuOxjoRujxVhRCdhrI1i5ejjsetjFhnRCcbaPH0t4iRJRthfc7iQPCpomn+R7Bffn9RtOObXornGpdt3wdz89zTw10lPfVofOhAihBoyaAvKGe8dE2zTO316EMr28YeQCclLfGbOES4GO7OkHiFccSNVuv01EOekzidId9a8cX+rWG7vYlPMthet4aekiZz66w1JkbqyDGK9aDYYs3RglI2sBPfIiIksn02gpKVv4SisrG4o9mNvQGRLCyKiqytHVfEZNDD21CyGIfXtjvP2gjSSPLdIndvsem44fjz/h08H6YlBUE3xWb8P9aDIL7UObt7M/88SGVs+JgthjYfJ1x/ttKCWlPTjcRukdRL1K2ok42W8bddco5iNkSdRmp0pPwHjbYnJ3CGlEzWVcf1wnEf0WZUdOTBYX5ROrPlRFNpNVDqkVcg9OrdmhtlxfEODb59qt7LcUW4svzoFT116niZ8gbXufKNHWn3jQ1nmUF25ry7ugCCLmiweSbTBp9va9uEXp2yw7PTPWGkbNE+DpKTLcpsCP8JIPRSpMrRkOuire42S/TakTz/N0ABCKsn46iITrqFMiJ10METDvZ+zC6WElz9PTJwZuIUICKeeW00lvkGEHEOLEcGABEfAFWc1BVk70Yam1yemZZ37jcfI7qjNvVGowDOasqn48emeXFTJu9OSD3eruBCv4uz6U6sMhumzZAy69cHNMg+UrKhmpjCogHrCwXn9Jg9blmKNDHALm5iQMqDdnwuuiWetSpSSe76WeBYfRvD//crPGURR4L76IS068I1HgfVv+pxLlTyfya0Ztsey7PNoVpbY3k99/2aAolDeSW/hEbPAMbxy1d4oS+SwZeaa+FkROzoMbC8L53o3X1ubLrufrh/ei7UlKDY3bEZSWc2Pan4Da0LPpF2KRljJBYiLgSACoWRQ/vGgk6F7+cxhup+zjQ0tr3DI4PKwMllcCuxZCRzc495Zd1toi6IbyQihcdgNuM3AgBmrPWpu7Eq1PDm+s6Bu0hL5vVXtrBf0YfSNHbHjvbKIQJVgLYAIAANgAq4sfjLEmAVhSWICfEoCr54sAIlJkCg1e4U2qApyCHSokAPAaFxfrPBZQC6A9P43zO0k+SskXC3B2dgYguoVMua9ceJOC5TnYT7YOEIgri30edK5VCyg/j78CcAQQpgAACAA2UfkOXg+BQSPi/GQcoEPQogMQ0gEADJ51AM7e49f/Pn0Tgdfzj2cBtKRdnhRf+qC9Go0Akg4uLGhuCf/4qO/1AHlArPWDUbWo3EoxAElRHSBKTZGZmRGA6ykPsCz9eT9o8HOJbuZo+qdAAHOsMfaong20ugxATBCBxdWrWJrBqPfcA8Bs6Yt1Pz1eTe0J4OZeBKAbWvgYcHadCHBhA+tfDbgCAEicH59dHzo3hwt4Bgi6WL0KoMQFXJwJxL2KBaC8tonhG5MYJujB8O1LTFKHYbJ8DFOkYJg6AsO0vhhmcMTwg0vMbIxhNhUMc0pgmJsLw3y0GBYkwrDIJQZf8ihxyaPUJY+yl3w9vuRL4ZIv5Uusdsnjs0setS951Lvky/CSL5NLvswuseUljzaXPEIveXS85At2yZfLJV9ul9jzkkfv3x4DLvgeju8fvG78Bwkl/iAp7R+kxCAdRuHB5B9kq/uD3Cl/UBBTAowpIY3BJ5hqKpgSmpgSepgSJpgSlpgSUAzCMNXcMSV8/pQgw8fg3T8lyOj+6JKxY1DojxiZDCZNFZOmj4m1wsTC/8SSAv6skpL/SSPlxKzKYVYNMavP/6wSU2LwKQY9LvD1Bd5W+5sIjX8/3G9wcXHOn+27AIZJ8Wvn2wqA92fYYRPlRmD74dDdr7v4Hfl88v0elXmO2H4G+Y+5Lq0BaC8G4lqa5ZWpj1k4tCK4kvRyMkrXG2S7cC+K4eKei/4u9h8UUd6/',
				align: 'center',
				vAlign: 'middle',
				// offsetX: -100,
				// offsetY: -40
				offsetX: -300,// by guo 2020-4-1-16:37修改
				offsetY: -250 // by guo 2020-4-1-16:37修改
			},
			logo: { //显示在右上角的logo图片，如果不需要可以删除该属性
				// by guo 2020-3-8-11:18修改
				file:"",
				// file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAAAUCAYAAAD4BKGuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAVTSURBVHja1Fl/aJVVGP4cw/mH5tUWi3I53cA0WbeIzMgaq6lQoVawm0S6glHhIKM/TELICotqCxMSGWQRdFfRLEhc9mMxqA0rbdS2wsV0GkZXuaKUWlHvgeeNh7f3u1du3Ft74eGcnXu+c873vD/Pt0nZbDZyZL2gWZAQTBH8IjggeEjgPZASPIB+g/P7EsGT6J/BfHfjHFIv2Jpjj/+dlDskvCm42Jk7X3C7YJOgw/z2oOBGwdEYRW0RVAjOCZ4ugNggqwU3CTLRBJFyQ+xuwVRY14igB78tE9QKpgmeEHwkGKRnq9AeMesHRWwEsYGUxwSdBZ51ecweE4Lct0DsOVjaZvptA8jfC4JfghWpXIJ2jMY+EDShf1pwh6DvX5x1GtpDE43cNFlfhyFWpQ9xd5FgFo3fRi++C+2nCBNBRgU3O6RsEyyEQv4QLMb4CcE9RlFBLqS1WZ6BZ83A35ofVhuvfE5QJrjWebdgCJOx51qM1QgewbMzsO57MDQrB9DeC8ObHd5Xyb2eiNiQQxmtgkZBr+OuZwV7BIcF1RgbF1wTE2MbEccX48VY9sMzBilhTke/m+b1Q9lefpgruI7OsYhIGzPJuAnn3+6EM7vu1YKl5vkrYRSfCGZivCxoMklk7M5j6eFlXyRNRSAvAoFf0Fo/CC7LkbwuQjsZsf0qwbuI9wlYgIqGl6NEzDYibJ/gbmAfxpKoMDRcaSK8xZzjZbK+NMhSYoNSngV5e+ksKXp+JdqZwDDmdpSbsqa9gNAyi5JalSGv3iQ+dtNK9HvI+sNBh2AhvNYVaH+msRtAdsa4ehoKCuQsoP2PY8+kCSkJ5IRWjD2FZ4/BOFSWYv9KhI40eUKQ31CqdnLM1c1OOnHufKSS+iEZvgHNhji8g1yT5VZKdCnHO+ajvrYK/I7GkuSWjwvq8Mzl5M79NF89aCHaBNXmWv0sQVUUZEDwsDnbr2i9s31lKyGuFs7kITEBC+snJaToRYIFrRN0CeYgoSUxJ23WUm85eB41b4IUuIvGtyIMVMY8lzHGMoYworF7J/onKYk10/wVQL6zXYr+Zq9aOEhuXZPDel8Q3If+HMzTeHPKlForEK+mws3SMfH2UMxNLIJbasKsoIQZwVLbKFkN4T1C3HxUMM+EkCAfgjwNV40Y304KriOP+jIHqa+jvYsqnH/kqzKaGCFZxWnoTqooxky8+dHUsOGwr6Jfi9jmlVVTHGLnot9L3qGWqCToWYYRF5fDa96mtb93yI2g8B0IWxlTHWmi/hOG00D4mEJfJ5WhQX7ySCsDUaNkJeud6+sgXCgs3OLEG2/xdZSh10JBeiB1zQU0HuQdSib60rOdm9kFToIL8hmFiRHzm1YM0ylet5k579OFpcUk4I0oD0/QuJ7tcBy5ERY6ixdrh5uNwN3bUV7pd4E+J958HmPxbRRydqK/in6vxj5aH9din/udEPKtuU1GqBL24xJwBInQWiHLcbQVKBXTzkVpHP0tWHsIpZUqPeWcrScXuX2ImRkqlufBhdQl15ig3WLKH0/SeAmtD+uprBqGx1ThhlWN5LKG4lcNKbDblFDjVDU0wWK7yLLqnPNk6cKzKsfXt1GQmQQXSuwymhd3tr9lkvPJMUV152kc2PsmUEMxtzdPRk2SNX2DQ3Vhr02Is18LXjHVAz/bG0NEK8johus3UBiwyfkYlDkQUyLaWrwZBrbHMaB8Z3PJLaYk8IIVKKPSJdxbv3ecynNzLNr33GKLV1YVW4IyfycXfq0UxP4X5HJdXCqX4Wv0AKqYkkipw4LG6WxMNi+GhAtH+M/K8wVe7wuWvwQYAFT+UsGCXmX3AAAAAElFTkSuQmCC',
				align: 'right',
				vAlign: 'top',
				offsetX: -100,
				offsetY: 10
			},
			advertisement: { //广告相关的配置
				time: 5,//广告默认播放时长以及多个广告时每个广告默认播放时间，单位：秒
				method: 'get',//广告监测地址默认请求方式，get/post
				videoForce: false,//视频广告是否强制播放结束
				videoVolume: 0.8,//视频音量
				skipButtonShow: true,//是否显示跳过广告按钮
				linkButtonShow: true,//是否显示广告链接按钮，如果选择显示，只有在提供了广告链接地址时才会显示
				muteButtonShow: true,//是否在视频广告时显示静音按钮
				closeButtonShow: true,//暂停时是否显示关闭广告按钮
				closeOtherButtonShow: true,//其它广告是否需要关闭广告按钮
				frontSkipButtonDelay: 1,//前置广告跳过广告按钮延时显示的时间，单位：秒
				insertSkipButtonDelay: 0,//插入广告跳过广告按钮延时显示的时间，单位：秒
				endSkipButtonDelay: 0,//后置广告跳过广告按钮延时显示的时间，单位：秒
				frontStretched: 2,//前置广告拉伸方式，0=原始大小，1=自动缩放，2=只有当广告的宽或高大于播放器宽高时才进行缩放，3=参考播放器宽高，4=宽度参考播放器宽、高度自动，5=高度参考播放器高、宽度自动
				insertStretched: 2,//插入广告拉伸方式，0=原始大小，1=自动缩放，2=只有当广告的宽或高大于播放器宽高时才进行缩放，3=参考播放器宽高，4=宽度参考播放器宽、高度自动，5=高度参考播放器高、宽度自动
				pauseStretched: 2,//暂停广告拉伸方式，0=原始大小，1=自动缩放，2=只有当广告的宽或高大于播放器宽高时才进行缩放，3=参考播放器宽高，4=宽度参考播放器宽、高度自动，5=高度参考播放器高、宽度自动
				endStretched: 2 //结束广告拉伸方式，0=原始大小，1=自动缩放，2=只有当广告的宽或高大于播放器宽高时才进行缩放，3=参考播放器宽高，4=宽度参考播放器宽、高度自动，5=高度参考播放器高、宽度自动
			},
			video: { //视频的默认比例，当视频元数据里没有宽和高属性时默认使用该宽高
				defaultWidth: 16,//宽度
				defaultHeight: 9 //高度
			}
		}
	};
}
! (function() {
	var javascriptPath = '';
	!function() {
		// var scriptList = document.scripts,
		// thisPath = scriptList[scriptList.length - 1].src;
		var thisPath = document.getElementById('playSDK').src
		javascriptPath = thisPath.substring(0, thisPath.lastIndexOf('/') + 1);
	} ();
	var ckplayer = function(obj) {
		/*
			javascript部分开发所用的注释说明：
			1：初始化-程序调用时即运行的代码部分
			2：定义样式-定义容器（div,p,canvas等）的样式表，即css
			3：监听动作-监听元素节点（单击-click，鼠标进入-mouseover，鼠标离开-mouseout，鼠标移动-mousemove等）事件
			4：监听事件-监听视频的状态（播放，暂停，全屏，音量调节等）事件
			5：共用函数-这类函数在外部也可以使用
			6：全局变量-定义成全局使用的变量
			7：其它相关注释
			全局变量说明：
			在本软件中所使用到的全局变量（变量（类型）包括Boolean，String，Int，Object（包含元素对象和变量对象），Array，Function等）
			下面列出重要的全局变量：
				V:Object：视频对象
				VA:Array：视频列表（包括视频地址，类型，清晰度说明）
				ID:String：视频ID
				CB:Object：控制栏各元素的集合对象
				PD:Object：内部视频容器对象
			---------------------------------------------------------------------------------------------
			程序开始
			下面为需要初始化配置的全局变量
			初始化配置
			config：全局变量定义一些基本配置
		*/
		this.config = {
			videoDbClick: true,//是否支持双击全屏/退出全屏动作
			errorTime: 100,//延迟判断失败的时间，单位：毫秒
			videoDrawImage: false,//是否使用视频drawImage功能，注意，该功能在移动端表现不了
			adSkipClick: 'javaScript->adjump' //h5环境中点击跳过广告按钮触发的功能
		};
		//全局变量：播放器默认配置，在外部传递过来相应配置后，则进行相关替换
		this.varsConfig = {
			playerID: '',//播放器ID
			container: '',//视频容器的ID
			variable: 'ckplayer',//播放函数(变量)名称
			volume: 0.8,//默认音量，范围0-1
			poster: '',//封面图片地址
			autoplay: false,//是否自动播放
			loop: false,//是否需要循环播放
			live: false,//是否是直播
			duration: 0,//指定总时间
			forceduration:0,//强制使用该时间为总时间
			seek: 0,//默认需要跳转的秒数
			drag: '',//拖动时支持的前置参数
			front: '',//前一集按钮动作
			next: '',//下一集按钮动作
			loaded: '',//加载播放器后调用的函数
			flashplayer: false,//设置成true则强制使用flashplayer
			html5m3u8: false,//PC平台上是否使用h5播放器播放m3u8
			track: null,//字幕轨道
			cktrack: null,//ck字幕
			cktrackdelay:0,//字幕显示延迟时间
			preview: null,//预览图片对象
			prompt: null,//提示点功能
			video: null,//视频地址
			config: '',//调用配置函数名称
			type: '',//视频格式
			crossorigin: '',//设置html5视频的crossOrigin属性
			crossdomain: '',//安全策略文件地址
			unescape: false,//默认flashplayer里需要解码
			mobileCkControls: false,//移动端h5显示控制栏
			mobileAutoFull: true,//移动端是否默认全屏播放
			playbackrate: 1,//默认倍速
			h5container: '',//h5环境中使用自定义容器
			debug: false,//是否开启调试模式
			overspread:true,//是否让视频铺满播放器
			//以下为广告相关配置
			adfront: '',
			adfronttime: '',
			adfrontlink: '',
			adpause: '',
			adpausetime: '',
			adpauselink: '',
			adinsert: '',
			adinserttime: '',
			adinsertlink: '',
			inserttime: '',
			adend: '',
			adendtime: '',
			adendlink: '',
			advertisements: ''
		};
		this.vars = {};//全局变量：语言配置
		this.language = {
			volume: '音量：',
			play: '点击播放',
			pause: '点击暂停',
			full: '点击全屏',
			escFull: '退出全屏',
			mute: '点击静音',
			escMute: '取消静音',
			front: '上一集',
			next: '下一集',
			definition: '点击选择清晰度',
			playbackRate: '点击选择速度',
			subtitles: '点击选择字幕',
			error: '加载出错',
			adTime: '广告{$second}秒',
			skipAd: '跳过广告',
			skipAdTime: '{$second}秒后可跳过广告',
			adLink: '查看详情',
			noLoadShockwaveFlash:'您的浏览器不支持FlashPlayer插件或没有启用该插件',
			downLoadShockwaveFlash:'点击下载FlashPlayer插件'
		};
		//全局变量：右键菜单：[菜单标题,类型(link:链接，default:灰色，function：调用函数，javascript:调用js函数),执行内容(包含链接地址，函数名称),[line(间隔线)]]
		this.contextMenu = [['ckplayer', 'link', 'http://www.ckplayer.com', '_blank'], ['version:X1', 'default', 'line']];
		//全局变量：错误提示列表
		this.errorList = [['000', 'Object does not exist'], ['001', 'Variables type is not a object'], ['002', 'Video object does not exist'], ['003', 'Video object format error'], ['004', 'Video object format error'], ['005', 'Video object format error'], ['006', '[error] does not exist '], ['007', 'Ajax error'], ['008', 'Ajax error'], ['009', 'Ajax object format error'], ['010', 'Ajax.status:[error]']];
		//全局变量：HTML5变速播放的值数组/如果不需要可以设置成null
		this.playbackRateArr = [[0.5, '0.5倍'], [1, '正常'], [1.25, '1.25倍'], [1.5, '1.5倍'], [2, '2倍速'], [4, '4倍速']];
		//全局变量：保存倍速
		this.playbackRateTemp=1;
		//全局变量：HTML5默认变速播放的值
		this.playbackRateDefault = 1;
		//全局变量：HTML5当前显示的字幕编号
		this.subtitlesTemp=-1;
		//全局变量：定义logo
		this.logo = '';
		//全局变量：是否加载了播放器
		this.loaded = false;
		//全局变量：计时器，监听视频加载出错的状态
		this.timerError = null;
		//全局变量：是否出错
		this.error = false;
		//全局变量：出错地址的数组
		this.errorUrl = [];
		//全局变量：计时器，监听全屏与非全屏状态
		this.timerFull = null;
		//全局变量：是否全屏状态
		this.full = false;
		//全局变量：计时器，监听当前的月/日 时=分=秒
		this.timerTime = null;
		//全局变量：计时器，监听视频加载
		this.timerBuffer = null;
		//全局变量：设置进度按钮及进度条是否跟着时间变化，该属性主要用来在按下进度按钮时暂停进度按钮移动和进度条的长度变化
		this.isTimeButtonMove = true;
		//全局变量：进度栏是否有效，如果是直播，则不需要监听时间让进度按钮和进度条变化
		this.isTimeButtonDown = false;
		//全局变量：用来模拟双击功能的判断
		this.isClick = false;
		//全局变量：计时器，用来模拟双击功能的计时器
		this.timerClick = null;
		//全局变量：计时器，旋转loading
		this.timerLoading = null;
		//全局变量：计时器，监听鼠标在视频上移动显示控制栏
		this.timerCBar = null;
		//全局变量：播放视频时如果该变量的值大于0，则进行跳转后设置该值为0
		this.needSeek = 0;
		//全局变量：当前音量
		this.volume = 0;
		//全局变量：静音时保存临时音量
		this.volumeTemp = 0;
		//全局变量/变量类型：Number/功能：当前播放时间
		this.time = 0;
		//全局变量：定义首次调用
		this.isFirst = true;
		//全局变量：是否使用HTML5-VIDEO播放
		this.html5Video = true;
		//全局变量记录视频容器节点的x;y
		this.pdCoor = {
			x: 0,
			y: 0
		};
		//全局变量：判断当前使用的播放器类型，html5video或flashplayer
		this.playerType = '';
		//全局变量：加载进度条的长度
		this.loadTime = 0;
		//全局变量：body对象
		this.body = document.body || document.documentElement;
		//全局变量：播放器
		this.V = null;
		//全局变量：保存外部js监听事件数组
		this.listenerJsArr = [];
		//全局变量：保存控制栏显示元素的总宽度
		this.buttonLen = 0;
		//全局变量：保存控制栏显示元素的数组
		this.buttonArr = [];
		//全局变量：保存按钮元素的宽
		this.buttonWidth = {};
		//全局变量：保存播放器上新增元件的数组
		this.elementArr = [];
		//全局变量：保存播放器上弹幕的临时数组
		this.elementTempArr = [];
		//全局变量：字幕内容
		this.track = [];
		//全局变量：字幕索引
		this.trackIndex = 0;
		//全局变量：当前显示的字幕内容
		this.nowTrackShow = {
			sn: ''
		};
		//全局变量：保存字幕元件数组
		this.trackElement = [];
		//全局变量：将视频转换为图片
		this.timerVCanvas = null;
		//全局变量：animate，缓动对象数组
		this.animateArray = [];
		//全局变量：保存animate的元件
		this.animateElementArray = [];
		//全局变量：保存需要在暂停时停止缓动的数组
		this.animatePauseArray = [];
		//全局变量：预览图片加载状态/0=没有加载，1=正在加载，2=加载完成
		this.previewStart = 0;
		//全局变量：预览图片容器
		this.previewDiv = null;
		//全局变量：预览框
		this.previewTop = null;
		//全局变量：预览框的宽
		this.previewWidth = 120;
		//全局变量：预览图片容器缓动函数
		this.previewTween = null;
		//全局变量：是否是m3u8格式，是的话则可以加载hls.js
		this.isM3u8 = false;
		//全局变量：保存提示点数组
		this.promptArr = [];
		//全局变量：显示提示点文件的容器
		this.promptElement = null;
		//全局变量：配置文件函数
		this.ckplayerConfig = {};
		//全局变量：控制栏是否显示
		this.showFace = false;
		//全局变量：是否监听过h5的错误
		this.errorAdd = false;
		//全局变量：是否发送了错误
		this.errorSend = false;
		//全局变量：控制栏是否隐藏
		this.controlBarIsShow = true;
		//全局变量，保存当前缩放比例
		this.videoScale = 1;
		//全局变量：设置字体
		this.fontFamily = '"Microsoft YaHei"; YaHei; "\5FAE\8F6F\96C5\9ED1"; SimHei; "\9ED1\4F53";Arial';
		//全局变量：设置字幕的文字大小
		this.trackFontSize=16;
		//全局变量：记录第一次拖动进度按钮时的位置
		this.timeSliderLeftTemp = 0;
		//全局变量：判断是否记录了总时间
		this.durationSendJS = false;
		//全局变量：初始化广告分析是否结束设置
		this.adAnalysisEnd = false;
		//全局变量：广告变量
		this.advertisements = {};
		//全局变量：是否是第一次播放视频
		this.isFirstTimePlay = true;
		//全局变量：当前需要播放的广告类型
		this.adType = '';
		//全局变量：播放广告计数
		this.adI = 0;
		//全局变量：要播放的临时地址
		this.videoTemp = {
			src: '',
			source: '',
			currentSrc: '',
			loop: false
		};
		//全局变量：当前要播放的广告组总时间
		this.adTimeAllTotal = 0;
		//全局变量：肖前要播放的广告时间
		this.adTimeTotal = 0;
		//全局变量：用来做倒计时
		this.adCountDownObj = null;
		//全局变量：前置，中插，结尾广告是否已开始运行
		this.adPlayStart = false;
		//全局变量：目前是否在播放广告
		this.adPlayerPlay = false;
		//全局变量：当前广告是否暂停
		this.adIsPause = false;
		//全局变量：视频广告是否静音
		this.adVideoMute = false;
		//全局变量：是否需要记录当前播放的时间供广告播放结束后进行跳转
		this.adIsVideoTime = false;
		//全局变量：后置广告是否播放
		this.endAdPlay = false;
		//全局变量：暂停广告是否在显示
		this.adPauseShow = false;
		//全局变量：是否需要重置广告以实现重新播放时再播放一次
		this.adReset = false;
		//全局变量：记录鼠标在视频上点击时的坐标
		this.videoClickXy={x:0,y:0};
		//全局变量：是否在播放广告时播放过视频广告
		this.adVideoPlay = false;
		if (obj) {
			this.embed(obj);
		}
		//全局变量：临时存储已加载时间的变量
		this.loadTimeTemp=0;
		//全局变量，临时存储hls形式下首次加载时是否需要暂停或播放的判断
		this.hlsAutoPlay=true;
	};
	ckplayer.prototype = {
		/*
			主要函数部分开始
			主接口函数：
			调用播放器需初始化该函数
		*/
		embed: function(c) {
			//c:Object：是调用接口传递的属性对象
			if (window.location.href.substr(0, 7) == 'file://') {//如果是使用的file协议打网页则弹出提示
				alert('Please use the HTTP protocol to open the page');
				return;
			}
			if (c == undefined || !c) {
				this.eject(this.errorList[0]);
				return;
			}
			if (typeof(c) != 'object') {
				this.eject(this.errorList[1]);
			}
			this.vars = this.standardization(this.varsConfig, c);
			if (!this.vars['mobileCkControls'] && this.isMobile()) {
				this.vars['flashplayer'] = false;
				this.showFace = false;
			}
			var videoString = this.vars['video'];
			if (!videoString) {
				this.eject(this.errorList[2]);
				return;
			}
			if (typeof(videoString) == 'string') {
				if (videoString.substr(0, 3) == 'CK:' || videoString.substr(0, 3) == 'CE:' || videoString.substr(8, 3) == 'CK:' || videoString.substr(8, 3) == 'CE:') {
					this.vars['flashplayer'] = true;
				}
			}
			if (typeof(videoString) == 'object') {
				if (videoString.length > 1) {
					if (videoString[0][0].substr(0, 3) == 'CK:' || videoString[0][0].substr(0, 3) == 'CE:' || videoString[0][0].substr(8, 3) == 'CK:' || videoString[0][0].substr(8, 3) == 'CE:') {
						this.vars['flashplayer'] = true;
					}
				}
			}
			if (this.vars['config']) {
				this.ckplayerConfig = eval(this.vars['config'] + '()');
			} else {
				this.ckplayerConfig = ckplayerConfig();
			}
			if ((!this.supportVideo() && this.vars['flashplayer'] != '') || (this.vars['flashplayer'] && this.uploadFlash()) || !this.isMsie()) {
				this.html5Video = false;
				this.getVideo();
			} else if (videoString) {
				//判断视频数据类型
				this.analysedVideoUrl(videoString);
				return this;
			} else {
				this.eject(this.errorList[2]);
			}
		},
		/*
			内部函数
			根据外部传递过来的video开始分析视频地址
		*/
		analysedVideoUrl: function(video) {
			var i = 0,
			y = 0;
			var thisTemp = this;
			this.VA = [];//定义全局变量VA：视频列表（包括视频地址，类型，清晰度说明）
			if (this.typeString(video) == 'string') { //如果是字符形式的则判断后缀进行填充
				if (video.substr(0, 8) != 'website:') {
					this.VA = [[video, '', '', 0]];
					var fileExt = this.getFileExt(video);
					switch (fileExt) {
					case '.mp4':
						this.VA[0][1] = 'video/mp4';
						break;
					case '.ogg':
						this.VA[0][1] = 'video/ogg';
						break;
					case '.webm':
						this.VA[0][1] = 'video/webm';
						break;
					default:
						break;
					}
					this.getVideo();
				} else {
					if (this.html5Video) {
						var ajaxObj = {
							url: video.substr(8),
							success: function(data) {
								if (data) {
									thisTemp.analysedUrl(data);
								} else {
									thisTemp.eject(thisTemp.errorList[5]);
									this.VA = video;
									thisTemp.getVideo();
								}
							}
						};
						this.ajax(ajaxObj);
					} else {
						this.VA = video;
						this.getVideo();
					}

				}
			} 
			else if(this.typeString(video)=='array'){//如果视频地址是数组
				if (!this.isUndefined(typeof(video[0].length))) { //如果视频地址是二维数组
					this.VA = video;
				}
				this.getVideo();
			}
			else if(this.typeString(video)=='object'){
				/*
					如果video格式是对象形式，则分二种
					如果video对象里包含type，则直接播放
				*/
				if (!this.isUndefined(video['type'])) {
					this.VA.push([video['file'], video['type'], '', 0]);
					this.getVideo();
				} else {
					this.eject(this.errorList[5]);
				}
			}
			else {
				this.eject(this.errorList[4]);
			}
		},
		/*
			对请求到的视频地址进行重新分析
		*/
		analysedUrl: function(data) {
			this.vars = this.standardization(this.vars, data);
			if (!this.isUndefined(data['video'])) {
				this.vars['video'] = data['video'];
			}
			this.analysedVideoUrl(this.vars['video']);
		},
		/*
			内部函数
			检查浏览器支持的视频格式，如果是则将支持的视频格式重新分组给播放列表
		*/
		getHtml5Video: function() {
			var va = this.VA;
			var nva = [];
			var mobile = false;
			var video = document.createElement('video');
			var codecs = function(type) {
				var cod = '';
				switch (type) {
				case 'video/mp4':
					cod = 'avc1.4D401E, mp4a.40.2';
					break;
				case 'video/ogg':
					cod = 'theora, vorbis';
					break;
				case 'video/webm':
					cod = 'vp8.0, vorbis';
					break;
				default:
					break;
				}
				return cod;
			};
			var supportType = function(vidType, codType) {
				if (!video.canPlayType) {
					this.html5Video = false;
					return;
				}
				var isSupp = video.canPlayType(vidType + ';codecs="' + codType + '"');
				if (isSupp == '') {
					return false
				}
				return true;
			};
			if (this.vars['flashplayer'] || !this.isMsie()) {
				this.html5Video = false;
				return;
			}
			if (this.isMobile()) {
				mobile = true;
			}
			for (var i = 0; i < va.length; i++) {
				var v = va[i];
				if (v) {
					if (v[1] != '' && !mobile && supportType(v[1], codecs(v[1])) && v[0].substr(0, 4) != 'rtmp') {
						nva.push(v);
					}
					if ((this.getFileExt(v[0]) == '.m3u8' || this.vars['type'] == 'video/m3u8' || this.vars['type'] == 'm3u8' || v[1] == 'video/m3u8' || v[1] == 'm3u8') && this.vars['html5m3u8'] && !mobile) {
						this.isM3u8 = true;
						nva.push(v);
					}
				}
			}
			if (nva.length > 0) {
				this.VA = nva;
			} else {
				if (!mobile) {
					this.html5Video = false;
				}
			}
		},
		/*
			内部函数
			根据视频地址开始构建播放器
		*/
		getVideo: function() {
			var thisTemp = this;
			var v = this.vars;
			//如果存在广告字段则开始分析广告
			if (!this.adAnalysisEnd && (v['adfront'] != '' || v['adpause'] != '' || v['adinsert'] != '' || v['adend'] != '' || v['advertisements'] != '')) {
				this.adAnalysisEnd = true;
				this.adAnalysis();
				return;
			}
			//如果存在字幕则加载
			if (this.V) { //如果播放器已存在，则认为是从newVideo函数发送过来的请求
				this.changeVideo();
				return;
			}
			if (this.vars['cktrack']) {
				this.loadTrack();
			}
			if (this.supportVideo() && !this.vars['flashplayer']) {
				this.getHtml5Video(); //判断浏览器支持的视频格式
			}
			var src = '',
			source = '',
			poster = '',
			loop = '',
			autoplay = '',
			track = '';
			var video = v['video'];
			var i = 0;
			this.CD = this.getByElement(v['container']);
			volume = v['volume'];
			if (!this.CD) {
				this.eject(this.errorList[6], v['container']);
				return false;
			}
			//开始构建播放器容器
			this.V = undefined;
			var thisPd = null;
			if (v['h5container'] != '') {
				thisPd = this.getByElement(v['h5container']);
				if (this.isUndefined(thisPd)) {
					thisPd = null;
				}
			}
			var isVideoH5 = null; //isUndefined  thisPd
			if (v['playerID'] != '') {
				isVideoH5 = this.getByElement('#' + v['playerID']);
				if (this.isUndefined(isVideoH5)) {
					isVideoH5 = null;
				}
			}
			if (thisPd != null && isVideoH5 != null) {
				this.PD = thisPd; //PD:定义播放器容器对象全局变量
			} else {
				var playerID = 'ckplayer' + this.randomString();
				var playerDiv = document.createElement('div');
				playerDiv.className = playerID;
				this.CD.innerHTML = '';
				this.CD.appendChild(playerDiv);
				this.PD = this.getByElement(playerID); //PD:定义播放器容器对象全局变量
			}
			this.css(this.CD, {
				backgroundColor: '#000000',
				overflow: 'hidden',
				position: 'relative'
			});
			this.css(this.PD, {
				backgroundColor: '#000000',
				width: '100%',
				height: '100%',
				fontFamily: this.fontFamily
			});
			if (this.html5Video) { //如果支持HTML5-VIDEO则默认使用HTML5-VIDEO播放器
				//禁止播放器容器上鼠标选择文本
				this.PD.onselectstart = this.PD.ondrag = function() {
					return false;
				};
				//播放器容器构建完成并且设置好样式
				//构建播放器
				if (this.VA.length == 1) {
					this.videoTemp['src'] = decodeURIComponent(this.VA[0][0]);
					src = ' src="' + this.videoTemp['src'] + '"';

				} else {
					var videoArr = this.VA.slice(0);
					videoArr = this.arrSort(videoArr);
					for (i = 0; i < videoArr.length; i++) {
						var type = '';
						var va = videoArr[i];
						if (va[1]) {
							type = ' type="' + va[1] + '"';
							if (type == ' type="video/m3u8"' || type == ' type="m3u8"') {
								type = '';
							}
						}
						source += '<source src="' + decodeURIComponent(va[0]) + '"' + type + '>';
					}
					this.videoTemp['source'] = source;
				}
				//分析视频地址结束
				if (v['autoplay']) {
					autoplay = ' autoplay="autoplay"';
				}
				if (v['poster']) {
					poster = ' poster="' + v['poster'] + '"';
				}
				if (v['loop']) {
					loop = ' loop="loop"';
				}
				if (v['seek'] > 0) {
					this.needSeek = v['seek'];
				}
				if (v['track'] != null && v['cktrack'] == null) {
					var trackArr = v['track'];
					var trackDefault = '';
					var defaultHave = false;
					for (i = 0; i < trackArr.length; i++) {
						var trackObj = trackArr[i];
						if (trackObj['default'] && !defaultHave) {
							trackDefault = ' default';
							defaultHave = true;
						} else {
							trackDefault = '';
						}
						track += '<track kind="' + trackObj['kind'] + '" src="' + trackObj['src'] + '" srclang="' + trackObj['srclang'] + '" label="' + trackObj['label'] + '"' + trackDefault + '>';
					}
				}
				var autoLoad = this.ckplayerConfig['config']['autoLoad'];
				var preload = '';
				if (!autoLoad) {
					preload = ' preload="meta"';
				}
				var vid = this.randomString();
				var controls = '';
				if (!this.showFace) {
					controls = ' controls="controls"';
				}
				var mobileAutoFull = v['mobileAutoFull'];
				var mobileautofull = '';
				if (!mobileAutoFull) {
					mobileautofull = ' x-webkit-airplay="true" playsinline  webkit-playsinline="true"  x5-video-player-type="h5"';
				}
				if (isVideoH5 != null && thisPd != null) {
					this.V = isVideoH5;
					if (v['poster']) {
						this.V.poster = v['poster'];
					}
				} else {
					var html = '';
					if (!this.isM3u8) {
						html = '<video id="' + vid + '"' + src + ' width="100%" height="100%"' + autoplay + poster + loop + preload + controls + mobileautofull + track + '>' + source + '</video>';
					} else {
						html = '<video id="' + vid + '" width="100%" height="100%"' + poster + loop + preload + controls + mobileautofull + track + '></video>';
					}
					this.PD.innerHTML = html;
					this.V = this.getByElement('#' + vid); //V：定义播放器对象全局变量
				}
				if (this.vars['crossorigin']) {
					this.V.crossOrigin = this.vars['crossorigin'];
				}
				try {
					this.V.volume = volume; //定义音量
					if (this.playbackRateArr && this.vars['playbackrate'] > -1) {
						if (this.vars['playbackrate'] < this.playbackRateArr.length) {
							this.playbackRateDefault = this.vars['playbackrate'];
						}
						this.V.playbackRate = this.playbackRateArr[this.playbackRateDefault][0]; //定义倍速
					}
				} catch(error) {}
				this.css(this.V, {
					width: '100%',
					height: '100%'
				});
				if (this.isM3u8) {
					var loadJsHandler = function() {
						thisTemp.embedHls(thisTemp.VA[0][0], v['autoplay']);
					};
					this.loadJs(javascriptPath + 'hls/hls.min.js', loadJsHandler);
				}
				this.css(this.V, 'backgroundColor', '#000000');
				//创建一个画布容器
				if (this.config['videoDrawImage']) {
					var canvasID = 'vcanvas' + this.randomString();
					var canvasDiv = document.createElement('div');
					canvasDiv.className = canvasID;
					this.PD.appendChild(canvasDiv);
					this.MD = this.getByElement(canvasID); //定义画布存储容器
					this.css(this.MD, {
						backgroundColor: '#000000',
						width: '100%',
						height: '100%',
						position: 'absolute',
						display: 'none',
						cursor: 'pointer',
						left: '0px',
						top: '0px',
						zIndex: '10'
					});
					var cvid = 'ccanvas' + this.randomString();
					this.MD.innerHTML = this.newCanvas(cvid, this.PD.offsetWidth, this.PD.offsetHeight);
					this.MDC = this.getByElement(cvid + '-canvas');
					this.MDCX = this.MDC.getContext('2d');
				}
				this.playerType = 'html5video';
				//播放器构建完成并且设置好样式
				//建立播放器的监听函数，包含操作监听及事件监听
				this.addVEvent();
				//根据清晰度的值构建清晰度切换按钮
				if (this.showFace) {
					this.definition();
					if (!this.vars['live'] && this.playbackRateArr && this.vars['playbackrate'] > -1) {
						this.playbackRate();
					}
					if (v['autoplay']) {
						this.loadingStart(true);
					}
					this.subtitleSwitch();
				}
				this.playerLoad();
			} else { //如果不支持HTML5-VIDEO则调用flashplayer
				this.embedSWF();
			}
		},
		/*
			分析广告数据
		*/
		adAnalysis: function() {
			var thisTemp = this;
			var v = this.vars;
			var isAdvShow = [];
			var i = 0;
			if (v['advertisements'] != '' && v['advertisements'].substr(0, 8) == 'website:') {
				var ajaxObj = {
					url: v['advertisements'].substr(8),
					success: function(data) {
						if (data) {
							var newData = {};
							var val = null;
							//对广告进行分析
							try {
								if (!thisTemp.isUndefined(data['front']) || !thisTemp.isUndefined(data['pause']) || !thisTemp.isUndefined(data['end']) || !thisTemp.isUndefined(data['insert']) || !thisTemp.isUndefined(data['other'])) {
									val = thisTemp.arrayDel(data['front']);
									if (!thisTemp.isUndefined(val)) {
										newData['front'] = val;
									}
									val = thisTemp.arrayDel(data['pause']);
									if (!thisTemp.isUndefined(val)) {
										newData['pause'] = val;
									}
									val = thisTemp.arrayDel(data['insert']);
									if (!thisTemp.isUndefined(val)) {
										newData['insert'] = val;
										if (!thisTemp.isUndefined(data['inserttime'])) {
											newData['inserttime'] = thisTemp.arrayInt(data['inserttime']);
											isAdvShow = [];
											for (i = 0; i < newData['inserttime'].length; i++) {
												isAdvShow.push(false);
											}
											newData['insertPlay'] = isAdvShow;
										}
									}
									val = thisTemp.arrayDel(data['end']);
									if (!thisTemp.isUndefined(val)) {
										newData['end'] = val;
									}
									val = thisTemp.arrayDel(data['other']);
									if (!thisTemp.isUndefined(val)) {
										newData['other'] = val;
										isAdvShow = [];
										var arrTemp = [];
										for (i = 0; i < val.length; i++) {
											isAdvShow.push(false);
											arrTemp.push(parseInt('0' + val[i]['startTime']));
										}
										newData['othertime'] = arrTemp;
										newData['otherPlay'] = isAdvShow;
									}
								}
							} catch(event) {
								thisTemp.log(event)
							}
							thisTemp.advertisements = newData;
							//对广告进行分析结束
						}
						thisTemp.getVideo();
					}
				};
				this.ajax(ajaxObj);
			} else {
				//根据广告分析
				this.adAnalysisOne('front', 'adfront', 'adfronttime', 'adfrontlink', 'adfronttype');
				this.adAnalysisOne('pause', 'adpause', 'adpausetime', 'adpauselink', 'adpausetype');
				this.adAnalysisOne('insert', 'adinsert', 'adinserttime', 'adinsertlink', 'adinserttype');
				this.adAnalysisOne('end', 'adend', 'adendtime', 'adendlink', 'adendtype');
				if (!this.isUndefined(this.advertisements['insert'])) {
					if (!this.isUndefined(v['inserttime'])) {
						thisTemp.advertisements['inserttime'] = v['inserttime'];
					}
				}
				if (!this.isUndefined(thisTemp.advertisements['inserttime'])) {
					thisTemp.advertisements['inserttime'] = thisTemp.arrayInt(thisTemp.advertisements['inserttime']);
					isInsert = [];
					for (i = 0; i < thisTemp.advertisements['inserttime'].length; i++) {
						isInsert.push(false);
					}
					thisTemp.advertisements['insertPlay'] = isInsert;
				}
				thisTemp.getVideo();
			}
		},
		/*
			将广告数组数据里不是视频和图片的去除
		*/
		arrayDel: function(arr) {
			if(this.isUndefined(arr)){
				return arr;
			}
			if (arr.length == 0) {
				return null;
			}
			var newArr = [];
			for (var i = 0; i < arr.length; i++) {
				var type = arr[i]['type'];
				if (type == 'mp4' || type == 'mov' || this.isStrImage(type)) {
					newArr.push(arr[i]);
				}
			}
			if (newArr.length > 0) {
				return newArr;
			}
			return null;
		},
		/*分析单个类型的广告*/
		adAnalysisOne: function(adType, adName, adTime, adLink, adStype) {
			var v = this.vars;
			if (this.isUndefined(v[adName])) {
				v[adName] = '';
			}
			if (this.isUndefined(v[adTime])) {
				v[adTime] = '';
			}
			if (this.isUndefined(v[adLink])) {
				v[adLink] = '';
			}
			if (this.isUndefined(v[adStype])) {
				v[adStype] = '';
			}
			if (v[adName] != '') {
				var adList = [];
				var ad = v[adName].split(',');
				var adtime = v[adTime].split(',');
				var adlink = v[adLink].split(',');
				var adstype = v[adStype].split(',');
				var i = 0;
				if (ad.length > 0) {
					var adLinkLen = adlink.length,
					adTimeLen = adtime.length;
					if (v[adLink] == '') {
						adLinkLen = 0;
						adlink = [];
					}
					if (v[adTime] == '') {
						adTimeLen = 0;
						adtime = [];
					}
					if (adLinkLen < ad.length) {
						for (i = adLinkLen; i < ad.length; i++) {
							adlink.push('');
						}
					}
					if (adTimeLen < ad.length) {
						for (i = adTimeLen; i < ad.length; i++) {
							adtime.push('');
						}
					}
					var adstypeLen = adstype.length;
					if (v[adStype] == '') {
						adstypeLen = 0;
						adstype = [];
					}
					if (adstypeLen < ad.length) {
						for (i = adstypeLen; i < ad.length; i++) {
							adstype.push(this.getFileExt(ad[i]).replace('.', ''));
						}
					}
					for (i = 0; i < ad.length; i++) {
						var type = adstype[i];
						if (type == 'mp4' || type == 'mov' || this.isStrImage(type)) {
							var obj = {
								file: ad[i],
								type: type,
								time: parseInt(adtime[i]) > 0 ? parseInt(adtime[i]) : this.ckplayerConfig['style']['advertisement']['time'],
								link: adlink[i]
							};
							adList.push(obj);
						}

					}
					if (this.isUndefined(this.advertisements)) {
						this.advertisements = {};
					}
					if (adList.length > 0) {
						this.advertisements[adType] = adList;
					}
				}
			}
		},
		/*
			内部函数
			发送播放器加载成功的消息
		*/
		playerLoad: function() {
			var thisTemp = this;
			if (this.isFirst) {
				this.isFirst = false;
				setTimeout(function() {
					thisTemp.loadedHandler();
				},1);
			}
		},
		/*
			内部函数
			建立播放器的监听函数，包含操作监听及事件监听
		*/
		addVEvent: function() {
			var thisTemp = this;
			var duration=0;
			//监听视频单击事件
			var eventVideoClick = function(event) {
				thisTemp.videoClickXy={x:event.clientX,y:event.clientY};
				thisTemp.videoClick();
			};
			this.addListenerInside('click', eventVideoClick);
			this.addListenerInside('click', eventVideoClick, this.MDC);
			//延迟计算加载失败事件
			this.timerErrorFun();
			//监听视频加载到元数据事件
			var eventJudgeIsLive = function(event) {
				thisTemp.sendJS('loadedmetadata');
				if (typeof(thisTemp.V.duration) == 'number' && thisTemp.V.duration > 1) {
					duration = thisTemp.V.duration;
					if(!duration){
						if(thisTemp.vars['duration']>0){
							duration=thisTemp.vars['duration'];
						}
					}
					if(thisTemp.vars['forceduration']>0){
						duration=thisTemp.vars['forceduration'];
					}
					thisTemp.sendJS('duration', duration);
					thisTemp.formatInserttime(duration);
					if (thisTemp.adPlayerPlay) {
						thisTemp.advertisementsTime(duration + 1);
					}
					thisTemp.durationSendJS = true;
				}
				thisTemp.judgeIsLive();
			};
			this.addListenerInside('loadedmetadata', eventJudgeIsLive);
			//监听视频播放事件
			var eventPlaying = function(event) {
				thisTemp.playingHandler();
				thisTemp.sendJS('play');
				thisTemp.sendJS('paused', false);
				if (!thisTemp.durationSendJS && typeof(thisTemp.V.duration) == 'number' && thisTemp.V.duration > 0) {
					duration = thisTemp.V.duration;
					if(!duration){
						if(thisTemp.vars['duration']>0){
							duration=thisTemp.vars['duration'];
						}
					}
					if(thisTemp.vars['forceduration']>0){
						duration=thisTemp.vars['forceduration'];
					}
					thisTemp.durationSendJS = true;
					thisTemp.sendJS('duration', duration);
					thisTemp.formatInserttime(duration);
				}
			};
			this.addListenerInside('playing', eventPlaying);
			//监听视频暂停事件
			var eventPause = function(event) {
				thisTemp.pauseHandler();
				thisTemp.sendJS('pause');
				thisTemp.sendJS('paused', true);
			};
			this.addListenerInside('pause', eventPause);
			//监听视频播放结束事件
			var eventEnded = function(event) {
				thisTemp.endedHandler();
			};
			this.addListenerInside('ended', eventEnded);
			//监听视频播放时间事件
			var eventTimeupdate = function(event) {
				if (thisTemp.timerLoading != null) {
					thisTemp.loadingStart(false);
				}
				if (thisTemp.time) {
					if (!thisTemp.adPlayerPlay) {
						thisTemp.sendJS('time', thisTemp.time);
						//监听中间插入广告是否需要播放
						if (!thisTemp.isUndefined(thisTemp.advertisements['insert'])) {
							thisTemp.checkAdInsert(thisTemp.time);
						}
						//监听其它广告
						if (!thisTemp.isUndefined(thisTemp.advertisements['other'])) {
							thisTemp.checkAdOther(thisTemp.time);
						}
						if (thisTemp.time < 3 && thisTemp.adReset) {
							thisTemp.adReset = false;
							thisTemp.endedAdReset();
						}
					} else { //如果是广告则进行广告倒计时
						thisTemp.adPlayerTimeHandler(thisTemp.time);
					}

				}
			};
			this.addListenerInside('timeupdate', eventTimeupdate);
			//监听视频缓冲事件
			var eventWaiting = function(event) {
				thisTemp.loadingStart(true);
			};
			this.addListenerInside('waiting', eventWaiting);
			//监听视频seek开始事件
			var eventSeeking = function(event) {
				thisTemp.sendJS('seek', 'start');
			};
			this.addListenerInside('seeking', eventSeeking);
			//监听视频seek结束事件
			var eventSeeked = function(event) {
				thisTemp.seekedHandler();
				thisTemp.sendJS('seek', 'ended');
			};
			this.addListenerInside('seeked', eventSeeked);
			//监听视频音量
			var eventVolumeChange = function(event) {
				try {
					thisTemp.volumechangeHandler();
					thisTemp.sendJS('volume', thisTemp.volume || thisTemp.V.volume);
				} catch(event) {}
			};
			this.addListenerInside('volumechange', eventVolumeChange);
			//监听全屏事件
			var eventFullChange = function(event) {
				var fullState = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
				thisTemp.sendJS('full', fullState);
			};
			this.addListenerInside('fullscreenchange', eventFullChange);
			this.addListenerInside('webkitfullscreenchange', eventFullChange);
			this.addListenerInside('mozfullscreenchange', eventFullChange);
			//建立界面
			if (this.showFace) {
				this.interFace();
			}
		},
		/*
			内部函数
			重置界面元素
		*/
		resetPlayer: function() {
			this.timeTextHandler();
			if (this.showFace) {
				this.timeProgress(0, 1); //改变时间进度条宽
				this.changeLoad(0);
				this.initPlayPause(); //判断显示播放或暂停按钮
				this.definition(); //构建清晰度按钮
				this.showFrontNext(); //构建上一集下一集按钮
				this.deletePrompt(); //删除提示点
				this.deletePreview(); //删除预览图
				this.trackHide(); //重置字幕
				this.resetTrack();
				this.trackElement = [];
				this.track = [];
			}
		},
		/*
			内部函数
			构建界面元素
		 */
		interFace: function() {
			this.showFace = true;
			var thisTemp = this;
			var html = ''; //控制栏内容
			var i = 0;
			var bWidth = 38,//按钮的宽
			bHeight = 38; //按钮的高
			var bBgColor = '#FFFFFF',//按钮元素默认颜色
			bOverColor = '#0782F5'; //按钮元素鼠标经过时的颜色
			var timeInto = this.formatTime(0) + ' / ' + this.formatTime(this.vars['duration']); //时间显示框默认显示内容
			var randomS = this.randomString(10); //获取一个随机字符串
			/*
				以下定义界面各元素的ID，统一以ID结束
			*/
			var controlBarBgID = 'controlbgbar' + randomS,//控制栏背景
			controlBarID = 'controlbar' + randomS,//控制栏容器
			timeProgressBgID = 'timeprogressbg' + randomS,//播放进度条背景
			loadProgressID = 'loadprogress' + randomS,//加载进度条
			timeProgressID = 'timeprogress' + randomS,//播放进度条
			timeBOBGID = 'timebobg' + randomS,//播放进度按钮容器，该元素为一个透明覆盖在播放进度条上
			timeBOID = 'timebo' + randomS,//播放进度可拖动按钮外框
			timeBWID = 'timebw' + randomS,//播放进度可拖动按钮内框
			timeTextID = 'timetext' + randomS,//时间文本框
			playID = 'play' + randomS,//播放按钮
			pauseID = 'pause' + randomS,//暂停按钮
			frontID = 'front' + randomS,//前一集按钮
			nextID = 'next' + randomS,//下一集按钮
			fullID = 'full' + randomS,//全屏按钮
			escFullID = 'escfull' + randomS,//退出全屏按钮
			muteID = 'mute' + randomS,//静音按钮
			escMuteID = 'escmute' + randomS,//取消静音按钮				
			volumeID = 'volume' + randomS,//音量调节框容器
			volumeDbgID = 'volumedbg' + randomS,//音量调节框容器背景
			volumeBgID = 'volumebg' + randomS,//音量调节框背景层
			volumeUpID = 'volumeup' + randomS,//音量调节框可变宽度层
			volumeBOID = 'volumebo' + randomS,//音量调节按钮外框
			volumeBWID = 'volumebw' + randomS,//音量调节按钮内框
			definitionID = 'definition' + randomS,//清晰度容器
			definitionPID = 'definitionp' + randomS,//清晰度列表容器
			playbackRateID = 'playbackrate' + randomS,//倍速容器
			playbackRatePID = 'playbackratep' + randomS,//倍速列表容器
			subtitlesID = 'subtitles' + randomS,//多字幕容器
			subtitlesPID = 'subtitlesp' + randomS,//多字幕列表容器
			promptBgID = 'promptbg' + randomS,//提示框背景
			promptID = 'prompt' + randomS,//提示框
			dlineID = 'dline' + randomS,//分隔线共用前缀
			menuID = 'menu' + randomS,//右键容器
			pauseCenterID = 'pausecenter' + randomS,//中间暂停按钮
			loadingID = 'loading' + randomS,//缓冲
			errorTextID = 'errortext' + randomS,//错误文本框
			logoID = 'logo' + randomS,//logo
			adBackgroundID = 'background' + randomS,//广告背景图片
			adElementID = 'adelement' + randomS,//广告容器
			adBarID = 'adBar' + randomS,//广告顶部倒计时，跳过广告，静音按钮容器
			adSkipID = 'adskip' + randomS,//跳过广告按钮
			adTimeID = 'adtime' + randomS,//倒计时按钮
			adLinkID = 'adlink' + randomS,//广告链接按钮
			adMuteID = 'admute' + randomS,//广告静音按钮
			adEscMuteID = 'adescmute' + randomS,//广告取消静音按钮
			adPauseCloseID = 'adpauseclose' + randomS; //暂停广场的关闭按钮
			/*
				构建一些PD（播放器容器）里使用的元素
			*/
			var controlBarBg = document.createElement('div'),
			controlBar = document.createElement('div'),
			timeProgressBg = document.createElement('div'),
			timeBoBg = document.createElement('div'),
			pauseCenter = document.createElement('div'),
			errorText = document.createElement('div'),
			promptBg = document.createElement('div'),
			prompt = document.createElement('div'),
			menuDiv = document.createElement('div'),
			definitionP = document.createElement('div'),
			playbackrateP = document.createElement('div'),
			subtitlesP = document.createElement('div'),
			loading = document.createElement('div'),
			logo = document.createElement('div'),
			adBackground = document.createElement('div'),
			adElement = document.createElement('div'),
			adBar = document.createElement('div'),
			adLink = document.createElement('div'),
			adPauseClose = document.createElement('div');
			/*
				定义各节点的样式 
			*/
			controlBarBg.className = controlBarBgID;
			controlBar.className = controlBarID;
			timeProgressBg.className = timeProgressBgID;
			timeBoBg.className = timeBOBGID;
			promptBg.className = promptBgID;
			prompt.className = promptID;
			menuDiv.className = menuID;
			definitionP.className = definitionPID;
			playbackrateP.className = playbackRatePID;
			subtitlesP.className = subtitlesPID;
			pauseCenter.className = pauseCenterID;
			loading.className = loadingID;
			logo.className = logoID;
			errorText.className = errorTextID;
			adBackground.className = adBackgroundID;
			adElement.className = adElementID;
			adBar.className = adBarID;
			adLink.className = adLinkID;
			adPauseClose.className = adPauseCloseID;
			/*
				加载节点到播放器容器中
			*/
			this.PD.appendChild(controlBarBg);
			this.PD.appendChild(controlBar);
			this.PD.appendChild(timeProgressBg);
			this.PD.appendChild(timeBoBg);
			this.PD.appendChild(promptBg);
			this.PD.appendChild(prompt);
			this.PD.appendChild(definitionP);
			this.PD.appendChild(playbackrateP);
			this.PD.appendChild(subtitlesP);
			this.PD.appendChild(pauseCenter);
			this.PD.appendChild(loading);
			this.PD.appendChild(errorText);
			this.PD.appendChild(logo);
			this.PD.appendChild(adBackground);
			this.PD.appendChild(adElement);
			this.PD.appendChild(adBar);
			this.PD.appendChild(adLink);
			this.PD.appendChild(adPauseClose);
			this.body.appendChild(menuDiv);
			if (this.vars['live']) { //如果是直播，时间显示文本框里显示当前系统时间
				timeInto = this.getNowDate();
			}
			/*
				构建控制栏的内容 
			*/
			html += '<div class="' + playID + '" data-title="' + thisTemp.language['play'] + '">' + this.newCanvas(playID, bWidth, bHeight) + '</div>'; //播放按钮
			html += '<div class="' + pauseID + '" data-title="' + thisTemp.language['pause'] + '">' + this.newCanvas(pauseID, bWidth, bHeight) + '</div>'; //暂停按钮
			html += '<div class="' + dlineID + '-la"></div>'; //分隔线
			html += '<div class="' + frontID + '" data-title="' + thisTemp.language['front'] + '">' + this.newCanvas(frontID, bWidth, bHeight) + '</div>'; //前一集按钮
			html += '<div class="' + dlineID + '-lb"></div>'; //分隔线
			html += '<div class="' + nextID + '" data-title="' + thisTemp.language['next'] + '">' + this.newCanvas(nextID, bWidth, bHeight) + '</div>'; //下一集按钮
			html += '<div class="' + dlineID + '-lc"></div>'; //分隔线
			html += '<div class="' + timeTextID + '">' + timeInto + '</div>'; //时间文本
			html += '<div class="' + fullID + '" data-title="' + thisTemp.language['full'] + '">' + this.newCanvas(fullID, bWidth, bHeight) + '</div>'; //全屏按钮
			html += '<div class="' + escFullID + '" data-title="' + thisTemp.language['escFull'] + '">' + this.newCanvas(escFullID, bWidth, bHeight) + '</div>'; //退出全屏按钮
			html += '<div class="' + dlineID + '-ra"></div>'; //分隔线
			html += '<div class="' + definitionID + '" data-title="' + thisTemp.language['definition'] + '"></div>'; //清晰度容器
			html += '<div class="' + dlineID + '-rb"></div>'; //分隔线
			html += '<div class="' + playbackRateID + '" data-title="' + thisTemp.language['playbackRate'] + '"></div>'; //倍速
			html += '<div class="' + dlineID + '-rc"></div>'; //分隔线
			html += '<div class="' + subtitlesID + '" data-title="' + thisTemp.language['subtitles'] + '"></div>'; //字幕
			html += '<div class="' + dlineID + '-rd"></div>'; //分隔线
			html += '<div class="' + volumeID + '"><div class="' + volumeDbgID + '"><div class="' + volumeBgID + '"><div class="' + volumeUpID + '"></div></div><div class="' + volumeBOID + '"><div class="' + volumeBWID + '"></div></div></div></div>'; //音量调节框,音量调节按钮
			html += '<div class="' + muteID + '" data-title="' + thisTemp.language['mute'] + '">' + this.newCanvas(muteID, bWidth, bHeight) + '</div>'; //静音按钮
			html += '<div class="' + escMuteID + '" data-title="' + thisTemp.language['escMute'] + '">' + this.newCanvas(escMuteID, bWidth, bHeight) + '</div>'; //退出静音按钮
			html += '<div class="' + dlineID + '-re"></div>'; //分隔线
			this.getByElement(controlBarID).innerHTML = html;
			//构建进度条内容
			this.getByElement(timeProgressBgID).innerHTML = '<div class="' + loadProgressID + '"></div><div class="' + timeProgressID + '"></div>';
			this.getByElement(timeBOBGID).innerHTML = '<div class="' + timeBOID + '"><div class="' + timeBWID + '"></div></div>';
			//构建进度条内容结束
			this.getByElement(pauseCenterID).innerHTML = this.newCanvas(pauseCenterID, 80, 80); //构建中间暂停按钮
			this.getByElement(loadingID).innerHTML = this.newCanvas(loadingID, 60, 60); //构建中间缓冲时显示的图标
			this.getByElement(errorTextID).innerHTML = this.language['error']; //构建错误时显示的文本框
			//构建广告相关
			html = '<div class="' + adTimeID + '">' + this.language['adTime'].replace('{$second}', 0) + '</div>';
			html += '<div class="' + adMuteID + '">' + this.newCanvas(adMuteID, 30, 30) + '</div>';
			html += '<div class="' + adEscMuteID + '">' + this.newCanvas(adEscMuteID, 30, 30) + '</div>';
			html += '<div class="' + adSkipID + '"></div>';
			this.getByElement(adBarID).innerHTML = html;
			this.getByElement(adLinkID).innerHTML = this.language['adLink'];
			this.getByElement(adPauseCloseID).innerHTML = this.newCanvas(adPauseCloseID, 20, 20);
			if (this.ckplayerConfig['style']['logo']) {
				if (this.ckplayerConfig['style']['logo']['file']) {
					var logoFile = this.ckplayerConfig['style']['logo']['file'];
					if (logoFile.substr(0, 15) == 'data:image/png;' || logoFile.substr(0, 15) == 'data:image/jpg;' || logoFile.substr(0, 16) == 'data:image/jpeg;') {
						this.getByElement(logoID).innerHTML = '<img src="' + logoFile + '" border="0">'; //构建logo
					}
				}
			} else {
				this.getByElement(logoID).innerHTML = this.vars['logo'] || this.logo || ''; //构建logo
			}
			var pd = this.PD;
			//CB:Object：全局变量，将一些全局需要用到的元素统一放在CB对象里
			this.CB = {
				controlBarBg: this.getByElement(controlBarBgID, pd),
				controlBar: this.getByElement(controlBarID, pd),
				promptBg: this.getByElement(promptBgID, pd),
				prompt: this.getByElement(promptID, pd),
				timeProgressBg: this.getByElement(timeProgressBgID, pd),
				loadProgress: this.getByElement(loadProgressID, pd),
				timeProgress: this.getByElement(timeProgressID, pd),
				timeBoBg: this.getByElement(timeBOBGID, pd),
				timeButton: this.getByElement(timeBOID, pd),
				timeText: this.getByElement(timeTextID, pd),
				play: this.getByElement(playID, pd),
				front: this.getByElement(frontID, pd),
				next: this.getByElement(nextID, pd),
				pause: this.getByElement(pauseID, pd),
				definition: this.getByElement(definitionID, pd),
				definitionP: this.getByElement(definitionPID, pd),
				definitionLine: this.getByElement(dlineID + '-rb', pd),
				playbackrate: this.getByElement(playbackRateID, pd),
				playbackrateP: this.getByElement(playbackRatePID, pd),
				playbackrateLine: this.getByElement(dlineID + '-rc', pd),
				subtitles: this.getByElement(subtitlesID, pd),
				subtitlesP: this.getByElement(subtitlesPID, pd),
				subtitlesLine: this.getByElement(dlineID + '-rd', pd),
				full: this.getByElement(fullID, pd),
				escFull: this.getByElement(escFullID, pd),
				mute: this.getByElement(muteID, pd),
				escMute: this.getByElement(escMuteID, pd),
				volume: this.getByElement(volumeID, pd),
				volumeBg: this.getByElement(volumeBgID, pd),
				volumeUp: this.getByElement(volumeUpID, pd),
				volumeBO: this.getByElement(volumeBOID, pd),
				pauseCenter: this.getByElement(pauseCenterID, pd),
				menu: this.getByElement(menuID),
				loading: this.getByElement(loadingID, pd),
				loadingCanvas: this.getByElement(loadingID + '-canvas', pd),
				errorText: this.getByElement(errorTextID, pd),
				logo: this.getByElement(logoID, pd),
				playLine: this.getByElement(dlineID + '-la', pd),
				frontLine: this.getByElement(dlineID + '-lb', pd),
				nextLine: this.getByElement(dlineID + '-lc', pd),
				fullLine: this.getByElement(dlineID + '-ra'),
				muteLine: this.getByElement(dlineID + '-re', pd),
				adBackground: this.getByElement(adBackgroundID, pd),
				adElement: this.getByElement(adElementID, pd),
				adBar: this.getByElement(adBarID, pd),
				adSkip: this.getByElement(adSkipID, pd),
				adTime: this.getByElement(adTimeID, pd),
				adLink: this.getByElement(adLinkID, pd),
				adMute: this.getByElement(adMuteID, pd),
				adEscMute: this.getByElement(adEscMuteID, pd),
				adPauseClose: this.getByElement(adPauseCloseID, pd)
			};
			this.buttonWidth = {
				play: bWidth,
				full: bWidth,
				front: bWidth,
				next: bWidth,
				mute: bWidth
			};
			//定义界面元素的样式
			//控制栏背景
			this.css(controlBarBgID, {
				width: '100%',
				height: bHeight + 'px',
				backgroundColor: '#000000',
				position: 'absolute',
				bottom: '0px',
				filter: 'alpha(opacity:0.8)',
				opacity: '0.8',
				zIndex: '990'
			});
			//控制栏容器
			this.css(controlBarID, {
				width: '100%',
				height: bHeight + 'px',
				position: 'absolute',
				bottom: '0px',
				zIndex: '990'
			});
			//中间暂停按钮
			this.css(pauseCenterID, {
				width: '80px',
				height: '80px',
				borderRadius: '50%',
				position: 'absolute',
				display: 'none',
				cursor: 'pointer',
				zIndex: '996'
			});
			//loading
			this.css(loadingID, {
				width: '60px',
				height: '60px',
				position: 'absolute',
				display: 'none',
				zIndex: '996'
			});
			//出错文本框
			this.css(errorTextID, {
				width: '120px',
				height: '30px',
				lineHeight: '30px',
				color: '#FFFFFF',
				fontSize: '14px',
				textAlign: 'center',
				position: 'absolute',
				display: 'none',
				zIndex: '101',
				cursor: 'default',
				zIndex: '996'
			});
			//定义logo文字的样式
			this.css(logoID, {
				height: '30px',
				lineHeight: '30px',
				color: '#FFFFFF',
				fontFamily: 'Arial',
				fontSize: '28px',
				textAlign: 'center',
				position: 'absolute',
				float: 'left',
				left: '-1000px',
				top: '20px',
				zIndex: '996',
				filter: 'alpha(opacity:0.8)',
				opacity: '0.8',
				cursor: 'default'
			});

			this.css(this.CB['loadingCanvas'], {
				transform: 'rotate(0deg)',
				msTransform: 'rotate(0deg)',
				mozTransform: 'rotate(0deg)',
				webkitTransform: 'rotate(0deg)',
				oTransform: 'rotate(0deg)'
			});
			//定义提示语的样式
			this.css([promptBgID, promptID], {
				height: '30px',
				lineHeight: '30px',
				color: '#FFFFFF',
				fontSize: '14px',
				textAlign: 'center',
				position: 'absolute',
				borderRadius: '5px',
				paddingLeft: '5px',
				paddingRight: '5px',
				bottom: '0px',
				display: 'none',
				zIndex: '995'
			});
			this.css(promptBgID, {
				backgroundColor: '#000000',
				filter: 'alpha(opacity:0.5)',
				opacity: '0.5'
			});
			//时间进度条背景容器
			this.css(timeProgressBgID, {
				width: '100%',
				height: '6px',
				backgroundColor: '#3F3F3F',
				overflow: 'hidden',
				position: 'absolute',
				bottom: '38px',
				zIndex: '888'
			});
			//加载进度和时间进度
			this.css([loadProgressID, timeProgressID], {
				width: '1px',
				height: '6px',
				position: 'absolute',
				bottom: '38px',
				top: '0px',
				zIndex: '991'
			});
			this.css(loadProgressID, 'backgroundColor', '#6F6F6F');
			this.css(timeProgressID, 'backgroundColor', bOverColor);
			//时间进度按钮
			this.css(timeBOBGID, {
				width: '100%',
				height: '14px',
				overflow: 'hidden',
				position: 'absolute',
				bottom: '34px',
				cursor: 'pointer',
				zIndex: '992'
			});
			this.css(timeBOID, {
				width: '14px',
				height: '14px',
				overflow: 'hidden',
				borderRadius: '50%',
				backgroundColor: bBgColor,
				cursor: 'pointer',
				position: 'absolute',
				top: '0px',
				zIndex: '200'
			});
			this.css(timeBWID, {
				width: '8px',
				height: '8px',
				overflow: 'hidden',
				borderRadius: '50%',
				position: 'absolute',
				backgroundColor: bOverColor,
				left: '3px',
				top: '3px'
			});
			this.css(timeTextID, {
				lineHeight: bHeight + 'px',
				color: '#FFFFFF',
				fontFamily: 'arial',
				fontSize: '16px',
				paddingLeft: '10px',
				float: 'left',
				overflow: 'hidden',
				cursor: 'default'
			});
			//分隔线
			this.css([dlineID + '-la', dlineID + '-lb', dlineID + '-lc', dlineID + '-ra', dlineID + '-rb', dlineID + '-rc', dlineID + '-rd', dlineID + '-re'], {
				width: '0px',
				height: bHeight + 'px',
				overflow: 'hidden',
				borderLeft: '1px solid #303030',
				borderRight: '1px solid #151515',
				filter: 'alpha(opacity:0.9)',
				opacity: '0.9'
			});
			this.css([dlineID + '-la', dlineID + '-lb', dlineID + '-lc'], 'float', 'left');
			this.css([dlineID + '-ra', dlineID + '-rb', dlineID + '-rc', dlineID + '-rd', dlineID + '-re'], 'float', 'right');
			this.css([dlineID + '-lb', dlineID + '-lc', dlineID + '-rb', dlineID + '-rc', dlineID + '-rd'], 'display', 'none');
			//播放/暂停/上一集/下一集按钮
			this.css([playID, pauseID, frontID, nextID], {
				width: bWidth + 'px',
				height: bHeight + 'px',
				float: 'left',
				overflow: 'hidden',
				cursor: 'pointer'
			});
			this.css([frontID, nextID], 'display', 'none');
			//初始化判断播放/暂停按钮隐藏项
			this.initPlayPause();

			//设置静音/取消静音的按钮样式
			this.css([muteID, escMuteID], {
				width: bWidth + 'px',
				height: bHeight + 'px',
				float: 'right',
				overflow: 'hidden',
				cursor: 'pointer'
			});
			if (this.vars['volume'] > 0) {
				this.css(escMuteID, 'display', 'none');
			} else {
				this.css(muteID, 'display', 'none');
			}
			if (!this.ckplayerConfig['config']['mobileVolumeBarShow'] && this.isMobile()) {
				this.css([muteID, escMuteID, volumeID, volumeDbgID, dlineID + '-re'], {
					display: 'none'
				});
			}
			//音量调节框
			this.css([volumeID, volumeDbgID], {
				width: '70px',
				height: bHeight + 'px',
				overflow: 'hidden',
				float: 'right'
			});
			this.css(volumeDbgID, {
				position: 'absolute'
			});
			this.css([volumeBgID, volumeUpID], {
				width: '60px',
				height: '6px',
				overflow: 'hidden',
				borderRadius: '5px',
				cursor: 'pointer'
			});
			this.css(volumeBgID, {
				position: 'absolute',
				top: '16px'
			});
			this.css(volumeBgID, 'backgroundColor', '#666666');
			this.css(volumeUpID, 'backgroundColor', bOverColor);
			this.buttonWidth['volume'] = 100;
			//音量调节按钮
			this.css(volumeBOID, {
				width: '12px',
				height: '12px',
				overflow: 'hidden',
				borderRadius: '50%',
				position: 'absolute',
				backgroundColor: bBgColor,
				top: '13px',
				left: '0px',
				cursor: 'pointer'
			});
			this.css(volumeBWID, {
				width: '6px',
				height: '6px',
				overflow: 'hidden',
				borderRadius: '50%',
				position: 'absolute',
				backgroundColor: bOverColor,
				left: '3px',
				top: '3px'
			});
			//清晰度容器
			this.css(definitionID, {
				lineHeight: bHeight + 'px',
				color: '#FFFFFF',
				float: 'right',
				fontSize: '14px',
				textAlign: 'center',
				overflow: 'hidden',
				display: 'none',
				cursor: 'pointer'
			});
			this.css(definitionPID, {
				lineHeight: (bHeight - 8) + 'px',
				color: '#FFFFFF',
				overflow: 'hidden',
				position: 'absolute',
				bottom: '4px',
				backgroundColor: '#000000',
				textAlign: 'center',
				zIndex: '995',
				cursor: 'pointer',
				display: 'none'
			});
			//倍速容器
			this.css(playbackRateID, {
				lineHeight: bHeight + 'px',
				color: '#FFFFFF',
				float: 'right',
				fontSize: '14px',
				textAlign: 'center',
				overflow: 'hidden',
				display: 'none',
				cursor: 'pointer'
			});
			this.css(playbackRatePID, {
				lineHeight: (bHeight - 8) + 'px',
				color: '#FFFFFF',
				overflow: 'hidden',
				position: 'absolute',
				bottom: '4px',
				backgroundColor: '#000000',
				textAlign: 'center',
				zIndex: '995',
				cursor: 'pointer',
				display: 'none'
			});
			//字幕容器
			this.css(subtitlesID, {
				lineHeight: bHeight + 'px',
				color: '#FFFFFF',
				float: 'right',
				fontSize: '14px',
				textAlign: 'center',
				overflow: 'hidden',
				display: 'none',
				cursor: 'pointer'
			});
			this.css(subtitlesPID, {
				lineHeight: (bHeight - 8) + 'px',
				color: '#FFFFFF',
				overflow: 'hidden',
				position: 'absolute',
				bottom: '4px',
				backgroundColor: '#000000',
				textAlign: 'center',
				zIndex: '995',
				cursor: 'pointer',
				display: 'none'
			});
			//设置全屏/退出全屏按钮样式
			this.css([fullID, escFullID], {
				width: bWidth + 'px',
				height: bHeight + 'px',
				float: 'right',
				overflow: 'hidden',
				cursor: 'pointer'
			});
			this.css(escFullID, 'display', 'none');
			//设置广告背景层样式
			this.css(adBackgroundID, {
				width: '100%',
				height: '100%',
				backgroundColor: '#000000',
				position: 'absolute',
				top: '0px',
				zIndex: '997',
				display: 'none'
			});
			this.css(adElementID, {
				position: 'absolute',
				overflow: 'hidden',
				top: '0px',
				zIndex: '998',
				float: 'center',
				display: 'none'
			});
			this.css(adBarID, {
				position: 'absolute',
				overflow: 'hidden',
				top: '10px',
				right: '10px',
				zIndex: '999',
				textAlign: 'right',
				display: 'none'
			});
			this.css(adTimeID, {
				backgroundColor: '#000000',
				color: '#FF0000',
				paddingLeft: '10px',
				paddingRight: '10px',
				lineHeight: (bHeight - 8) + 'px',
				marginLeft: '5px',
				float: 'right',
				cursor: 'pointer'
			});
			this.css([adMuteID, adEscMuteID], {
				backgroundColor: '#000000',
				width: '30px',
				height: '30px',
				marginLeft: '5px',
				float: 'right',
				display: 'none',
				cursor: 'pointer'
			});
			this.css(adSkipID, {
				backgroundColor: '#000000',
				lineHeight: (bHeight - 8) + 'px',
				color: '#FFFFFF',
				paddingLeft: '10px',
				paddingRight: '10px',
				float: 'right',
				display: 'none',
				cursor: 'pointer'
			});
			this.css(adLinkID, {
				backgroundColor: '#ea5503',
				lineHeight: (bHeight - 8) + 'px',
				color: '#FFFFFF',
				paddingLeft: '10px',
				paddingRight: '10px',
				position: 'absolute',
				overflow: 'hidden',
				bottom: '10px',
				right: '10px',
				zIndex: '999',
				display: 'none'
			});
			this.css(adPauseCloseID, {
				backgroundColor: '#f7f7f7',
				//f8f7f7
				widht: '20px',
				height: '20px',
				position: 'absolute',
				overflow: 'hidden',
				zIndex: '999',
				top: '60px',
				left: '30px',
				borderRadius: '20px',
				display: 'none',
				cursor: 'pointer'
			});
			//构建各按钮的形状
			//播放按钮
			var cPlay = this.getByElement(playID + '-canvas').getContext('2d');
			var cPlayFillRect = function() {
				thisTemp.canvasFill(cPlay, [[12, 10], [29, 19], [12, 28]]);
			};
			cPlay.fillStyle = bBgColor;
			cPlayFillRect();
			var cPlayOver = function(event) {
				cPlay.clearRect(0, 0, bWidth, bHeight);
				cPlay.fillStyle = bOverColor;
				cPlayFillRect();
			};
			var cPlayOut = function(event) {
				cPlay.clearRect(0, 0, bWidth, bHeight);
				cPlay.fillStyle = bBgColor;
				cPlayFillRect();
			};

			this.addListenerInside('mouseover', cPlayOver, this.getByElement(playID + '-canvas'));
			this.addListenerInside('mouseout', cPlayOut, this.getByElement(playID + '-canvas'));
			//暂停按钮
			var cPause = this.getByElement(pauseID + '-canvas').getContext('2d');
			var cPauseFillRect = function() {
				thisTemp.canvasFillRect(cPause, [[10, 10, 5, 18], [22, 10, 5, 18]]);
			};
			cPause.fillStyle = bBgColor;
			cPauseFillRect();
			var cPauseOver = function(event) {
				cPause.clearRect(0, 0, bWidth, bHeight);
				cPause.fillStyle = bOverColor;
				cPauseFillRect();
			};
			var cPauseOut = function(event) {
				cPause.clearRect(0, 0, bWidth, bHeight);
				cPause.fillStyle = bBgColor;
				cPauseFillRect();
			};
			this.addListenerInside('mouseover', cPauseOver, this.getByElement(pauseID + '-canvas'));
			this.addListenerInside('mouseout', cPauseOut, this.getByElement(pauseID + '-canvas'));
			//前一集按钮
			var cFront = this.getByElement(frontID + '-canvas').getContext('2d');
			var cFrontFillRect = function() {
				thisTemp.canvasFill(cFront, [[16, 19], [30, 10], [30, 28]]);
				thisTemp.canvasFillRect(cFront, [[8, 10, 5, 18]]);
			};
			cFront.fillStyle = bBgColor;
			cFrontFillRect();
			var cFrontOver = function(event) {
				cFront.clearRect(0, 0, bWidth, bHeight);
				cFront.fillStyle = bOverColor;
				cFrontFillRect();
			};
			var cFrontOut = function(event) {
				cFront.clearRect(0, 0, bWidth, bHeight);
				cFront.fillStyle = bBgColor;
				cFrontFillRect();
			};

			this.addListenerInside('mouseover', cFrontOver, this.getByElement(frontID + '-canvas'));
			this.addListenerInside('mouseout', cFrontOut, this.getByElement(frontID + '-canvas'));
			//下一集按钮
			var cNext = this.getByElement(nextID + '-canvas').getContext('2d');
			var cNextFillRect = function() {
				thisTemp.canvasFill(cNext, [[8, 10], [22, 19], [8, 28]]);
				thisTemp.canvasFillRect(cNext, [[25, 10, 5, 18]]);
			};
			cNext.fillStyle = bBgColor;
			cNextFillRect();
			var cNextOver = function(event) {
				cNext.clearRect(0, 0, bWidth, bHeight);
				cNext.fillStyle = bOverColor;
				cNextFillRect();
			};
			var cNextOut = function(event) {
				cNext.clearRect(0, 0, bWidth, bHeight);
				cNext.fillStyle = bBgColor;
				cNextFillRect();
			};
			this.addListenerInside('mouseover', cNextOver, this.getByElement(nextID + '-canvas'));
			this.addListenerInside('mouseout', cNextOut, this.getByElement(nextID + '-canvas'));
			//全屏按钮
			var cFull = this.getByElement(fullID + '-canvas').getContext('2d');
			var cFullFillRect = function() {
				thisTemp.canvasFillRect(cFull, [[19, 10, 9, 3], [25, 13, 3, 6], [10, 19, 3, 9], [13, 25, 6, 3]]);
			};
			cFull.fillStyle = bBgColor;
			cFullFillRect();
			var cFullOver = function() {
				cFull.clearRect(0, 0, bWidth, bHeight);
				cFull.fillStyle = bOverColor;
				cFullFillRect();
			};
			var cFullOut = function() {
				cFull.clearRect(0, 0, bWidth, bHeight);
				cFull.fillStyle = bBgColor;
				cFullFillRect();
			};
			this.addListenerInside('mouseover', cFullOver, this.getByElement(fullID + '-canvas'));
			this.addListenerInside('mouseout', cFullOut, this.getByElement(fullID + '-canvas'));
			//定义退出全屏按钮样式
			var cEscFull = this.getByElement(escFullID + '-canvas').getContext('2d');
			var cEscFullFillRect = function() {
				thisTemp.canvasFillRect(cEscFull, [[20, 9, 3, 9], [23, 15, 6, 3], [9, 20, 9, 3], [15, 23, 3, 6]]);
			};
			cEscFull.fillStyle = bBgColor;
			cEscFullFillRect();
			var cEscFullOver = function() {
				cEscFull.clearRect(0, 0, bWidth, bHeight);
				cEscFull.fillStyle = bOverColor;
				cEscFullFillRect();
			};
			var cEscFullOut = function() {
				cEscFull.clearRect(0, 0, bWidth, bHeight);
				cEscFull.fillStyle = bBgColor;
				cEscFullFillRect();
			};
			this.addListenerInside('mouseover', cEscFullOver, this.getByElement(escFullID + '-canvas'));
			this.addListenerInside('mouseout', cEscFullOut, this.getByElement(escFullID + '-canvas'));
			//定义静音按钮的样式
			var cMute = this.getByElement(muteID + '-canvas').getContext('2d');
			var cMuteFillRect = function() {
				thisTemp.canvasFill(cMute, [[10, 15], [15, 15], [21, 10], [21, 28], [15, 23], [10, 23]]);
				thisTemp.canvasFillRect(cMute, [[23, 15, 2, 8], [27, 10, 2, 18]]);
			};
			cMute.fillStyle = bBgColor;
			cMuteFillRect();
			var cMuteOver = function() {
				cMute.clearRect(0, 0, bWidth, bHeight);
				cMute.fillStyle = bOverColor;
				cMuteFillRect();
			};
			var cMuteOut = function() {
				cMute.clearRect(0, 0, bWidth, bHeight);
				cMute.fillStyle = bBgColor;
				cMuteFillRect();
			};
			this.addListenerInside('mouseover', cMuteOver, this.getByElement(muteID + '-canvas'));
			this.addListenerInside('mouseout', cMuteOut, this.getByElement(muteID + '-canvas'));
			//定义取消广告静音按钮样式
			var cEscMute = this.getByElement(escMuteID + '-canvas').getContext('2d');
			var cEscMuteFillRect = function() {
				thisTemp.canvasFill(cEscMute, [[10, 15], [15, 15], [21, 10], [21, 28], [15, 23], [10, 23]]);
				thisTemp.canvasFill(cEscMute, [[23, 13], [24, 13], [33, 25], [32, 25]]);
				thisTemp.canvasFill(cEscMute, [[32, 13], [33, 13], [24, 25], [23, 25]]);
			};
			cEscMute.fillStyle = bBgColor;
			cEscMuteFillRect();
			var cEscMuteOver = function() {
				cEscMute.clearRect(0, 0, bWidth, bHeight);
				cEscMute.fillStyle = bOverColor;
				cEscMuteFillRect();
			};
			var cEscMuteOut = function() {
				cEscMute.clearRect(0, 0, bWidth, bHeight);
				cEscMute.fillStyle = bBgColor;
				cEscMuteFillRect();
			};
			this.addListenerInside('mouseover', cEscMuteOver, this.getByElement(escMuteID + '-canvas'));
			this.addListenerInside('mouseout', cEscMuteOut, this.getByElement(escMuteID + '-canvas'));
			//定义广告静音按钮的样式
			var cAdMute = this.getByElement(adMuteID + '-canvas').getContext('2d');
			var cAdMuteFillRect = function() {
				thisTemp.canvasFill(cAdMute, [[8, 12], [12, 12], [16, 8], [16, 21], [12, 18], [8, 18]]);
				thisTemp.canvasFillRect(cAdMute, [[18, 12, 2, 6], [21, 8, 2, 14]]);
			};
			cAdMute.fillStyle = bBgColor;
			cAdMuteFillRect();
			var cAdMuteOver = function() {
				cAdMute.clearRect(0, 0, bWidth, bHeight);
				cAdMute.fillStyle = bOverColor;
				cAdMuteFillRect();
			};
			var cAdMuteOut = function() {
				cAdMute.clearRect(0, 0, bWidth, bHeight);
				cAdMute.fillStyle = bBgColor;
				cAdMuteFillRect();
			};
			this.addListenerInside('mouseover', cAdMuteOver, this.getByElement(adMuteID + '-canvas'));
			this.addListenerInside('mouseout', cAdMuteOut, this.getByElement(adMuteID + '-canvas'));
			//定义取消静音广告按钮样式
			var cAdEscMute = this.getByElement(adEscMuteID + '-canvas').getContext('2d');
			var cAdEscMuteFillRect = function() {
				thisTemp.canvasFill(cAdEscMute, [[8, 12], [12, 12], [16, 8], [16, 21], [12, 18], [8, 18]]);
				thisTemp.canvasFill(cAdEscMute, [[18, 10], [20, 10], [26, 20], [24, 20]]);
				thisTemp.canvasFill(cAdEscMute, [[25, 10], [27, 10], [20, 20], [18, 20]]);
			};
			cAdEscMute.fillStyle = bBgColor;
			cAdEscMuteFillRect();
			var cAdEscMuteOver = function() {
				cAdEscMute.clearRect(0, 0, bWidth, bHeight);
				cAdEscMute.fillStyle = bOverColor;
				cAdEscMuteFillRect();
			};
			var cAdEscMuteOut = function() {
				cAdEscMute.clearRect(0, 0, bWidth, bHeight);
				cAdEscMute.fillStyle = bBgColor;
				cAdEscMuteFillRect();
			};
			this.addListenerInside('mouseover', cAdEscMuteOver, this.getByElement(adEscMuteID + '-canvas'));
			this.addListenerInside('mouseout', cAdEscMuteOut, this.getByElement(adEscMuteID + '-canvas'));
			//定义暂停广告关闭按钮
			var adPauseClose = this.getByElement(adPauseCloseID + '-canvas').getContext('2d');
			var adPauseCloseFillRect = function() {
				thisTemp.canvasFill(adPauseClose, [[4, 6], [6, 6], [16, 15], [14, 15]]);
				thisTemp.canvasFill(adPauseClose, [[14, 6], [16, 6], [6, 15], [4, 15]]);
			};
			adPauseClose.fillStyle = '#404856';
			adPauseCloseFillRect();
			var adPauseCloseOver = function() {
				adPauseClose.clearRect(0, 0, bWidth, bHeight);
				adPauseClose.fillStyle = bOverColor;
				adPauseCloseFillRect();
			};
			var adPauseCloseOut = function() {
				adPauseClose.clearRect(0, 0, bWidth, bHeight);
				adPauseClose.fillStyle = '#404856';
				adPauseCloseFillRect();
			};
			this.addListenerInside('mouseover', adPauseCloseOver, this.getByElement(adPauseCloseID + '-canvas'));
			this.addListenerInside('mouseout', adPauseCloseOut, this.getByElement(adPauseCloseID + '-canvas'));
			//定义loading样式
			var cLoading = this.getByElement(loadingID + '-canvas').getContext('2d');
			var cLoadingFillRect = function() {
				cLoading.save();
				var grad = cLoading.createLinearGradient(0, 0, 60, 60);
				grad.addColorStop(0, bBgColor);
				var grad2 = cLoading.createLinearGradient(0, 0, 80, 60);
				grad2.addColorStop(1, bOverColor);
				var grad3 = cLoading.createLinearGradient(0, 0, 80, 60);
				grad3.addColorStop(1, '#FF9900');
				var grad4 = cLoading.createLinearGradient(0, 0, 80, 60);
				grad4.addColorStop(1, '#CC3300');
				cLoading.strokeStyle = grad; //设置描边样式
				cLoading.lineWidth = 8; //设置线宽
				cLoading.beginPath(); //路径开始
				cLoading.arc(30, 30, 25, 0, 0.4 * Math.PI, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
				cLoading.stroke(); //绘制
				cLoading.closePath(); //路径结束
				cLoading.beginPath(); //路径开始
				cLoading.strokeStyle = grad2; //设置描边样式
				cLoading.arc(30, 30, 25, 0.5 * Math.PI, 0.9 * Math.PI, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
				cLoading.stroke(); //绘制
				cLoading.beginPath(); //路径开始
				cLoading.strokeStyle = grad3; //设置描边样式
				cLoading.arc(30, 30, 25, Math.PI, 1.4 * Math.PI, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
				cLoading.stroke(); //绘制
				cLoading.beginPath(); //路径开始
				cLoading.strokeStyle = grad4; //设置描边样式
				cLoading.arc(30, 30, 25, 1.5 * Math.PI, 1.9 * Math.PI, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
				cLoading.stroke(); //绘制
				cLoading.closePath(); //路径结束
				cLoading.restore();
			};
			cLoading.fillStyle = bBgColor;
			cLoadingFillRect();
			//定义中间暂停按钮的样式
			var cPauseCenter = this.getByElement(pauseCenterID + '-canvas').getContext('2d');
			var cPauseCenterFillRect = function() {
				thisTemp.canvasFill(cPauseCenter, [[28, 22], [59, 38], [28, 58]]);
				/* 指定几个颜色 */
				cPauseCenter.save();
				cPauseCenter.lineWidth = 5; //设置线宽
				cPauseCenter.beginPath(); //路径开始
				cPauseCenter.arc(40, 40, 35, 0, 2 * Math.PI, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
				cPauseCenter.stroke(); //绘制
				cPauseCenter.closePath(); //路径结束
				cPauseCenter.restore();
			};
			cPauseCenter.fillStyle = bBgColor;
			cPauseCenter.strokeStyle = bBgColor;
			cPauseCenterFillRect();
			var cPauseCenterOver = function() {
				cPauseCenter.clearRect(0, 0, 80, 80);
				cPauseCenter.fillStyle = bOverColor;
				cPauseCenter.strokeStyle = bOverColor;
				cPauseCenterFillRect();
			};
			var cPauseCenterOut = function() {
				cPauseCenter.clearRect(0, 0, 80, 80);
				cPauseCenter.fillStyle = bBgColor;
				cPauseCenter.strokeStyle = bBgColor;
				cPauseCenterFillRect();
			};
			this.addListenerInside('mouseover', cPauseCenterOver, this.getByElement(pauseCenterID + '-canvas'));
			this.addListenerInside('mouseout', cPauseCenterOut, this.getByElement(pauseCenterID + '-canvas'));

			//鼠标经过/离开音量调节按钮
			var volumeBOOver = function() {
				thisTemp.css(volumeBOID, 'backgroundColor', bOverColor);
				thisTemp.css(volumeBWID, 'backgroundColor', bBgColor);
			};
			var volumeBOOut = function() {
				thisTemp.css(volumeBOID, 'backgroundColor', bBgColor);
				thisTemp.css(volumeBWID, 'backgroundColor', bOverColor);
			};
			this.addListenerInside('mouseover', volumeBOOver, this.getByElement(volumeBOID));
			this.addListenerInside('mouseout', volumeBOOut, this.getByElement(volumeBOID));
			//鼠标经过/离开进度按钮
			var timeBOOver = function() {
				thisTemp.css(timeBOID, 'backgroundColor', bOverColor);
				thisTemp.css(timeBWID, 'backgroundColor', bBgColor);
			};
			var timeBOOut = function() {
				thisTemp.css(timeBOID, 'backgroundColor', bBgColor);
				thisTemp.css(timeBWID, 'backgroundColor', bOverColor);
			};
			this.addListenerInside('mouseover', timeBOOver, this.getByElement(timeBOID));
			this.addListenerInside('mouseout', timeBOOut, this.getByElement(timeBOID));

			this.addButtonEvent(); //注册按钮及音量调节，进度操作事件
			this.newMenu(); //单独设置右键的样式和事件
			this.controlBarHide(); //单独注册控制栏隐藏事件
			this.keypress(); //单独注册键盘事件
			//初始化音量调节框
			this.changeVolume(this.vars['volume']);
			//初始化判断是否需要显示上一集和下一集按钮
			this.showFrontNext();
			setTimeout(function() {
				thisTemp.elementCoordinate(); //调整中间暂停按钮/loading的位置/error的位置
			},
			100);
			this.checkBarWidth();
			var resize = function() {
				thisTemp.elementCoordinate();
				thisTemp.timeUpdateHandler();
				thisTemp.changeLoad();
				thisTemp.checkBarWidth();
				thisTemp.changeElementCoor(); //修改新加元件的坐标
				thisTemp.changePrompt();
				thisTemp.adPauseCoor();
				thisTemp.adOtherCoor();
			};
			this.addListenerInside('resize', resize, window);
		},
		/*
			内部函数
			创建按钮，使用canvas画布
		*/
		newCanvas: function(id, width, height) {
			return '<canvas class="' + id + '-canvas" width="' + width + '" height="' + height + '"></canvas>';
		},
		/*
			内部函数
			注册按钮，音量调节框，进度操作框事件
		*/
		addButtonEvent: function() {
			var thisTemp = this;
			//定义按钮的单击事件
			var playClick = function(event) {
				thisTemp.videoPlay();
				thisTemp.sendJS('clickEvent', 'actionScript->videoPlay');
			};
			this.addListenerInside('click', playClick, this.CB['play']);
			this.addListenerInside('click', playClick, this.CB['pauseCenter']);
			var pauseClick = function(event) {
				thisTemp.videoPause();
				thisTemp.sendJS('clickEvent', 'actionScript->videoPause');
			};
			this.addListenerInside('click', pauseClick, this.CB['pause']);
			var frontClick = function(event) {
				if (thisTemp.vars['front']) {
					eval(thisTemp.vars['front'] + '()');
					thisTemp.sendJS('clickEvent', 'actionScript->' + thisTemp.vars['front']);
				}
			};
			this.addListenerInside('click', frontClick, this.CB['front']);
			var nextClick = function(event) {
				if (thisTemp.vars['next']) {
					eval(thisTemp.vars['next'] + '()');
					thisTemp.sendJS('clickEvent', 'actionScript->' + thisTemp.vars['next']);
				}
			};
			this.addListenerInside('click', nextClick, this.CB['next']);
			var muteClick = function(event) {
				thisTemp.videoMute();
				thisTemp.sendJS('clickEvent', 'actionScript->videoMute');
			};
			this.addListenerInside('click', muteClick, this.CB['mute']);
			var escMuteClick = function(event) {
				thisTemp.videoEscMute();
				thisTemp.sendJS('clickEvent', 'actionScript->videoEscMute');
			};
			this.addListenerInside('click', escMuteClick, this.CB['escMute']);
			var fullClick = function(event) {
				thisTemp.fullScreen();
				thisTemp.sendJS('clickEvent', 'actionScript->fullScreen');
			};
			this.addListenerInside('click', fullClick, this.CB['full']);
			var escFullClick = function(event) {
				thisTemp.quitFullScreen();
				thisTemp.sendJS('clickEvent', 'actionScript->quitFullScreen');
			};
			this.addListenerInside('click', escFullClick, this.CB['escFull']);
			var adSkipClick = function(event) {
				if (thisTemp.CB['adSkip'].innerHTML == thisTemp.language['skipAd']) {
					thisTemp.runFunction(thisTemp.config['adSkipClick']);
				}
			};
			this.addListenerInside('click', adSkipClick, this.CB['adSkip']);
			var adMuteClick = function(event) {
				thisTemp.adMuteFunction();
			};
			this.addListenerInside('click', adMuteClick, this.CB['adMute']);
			var adEscMuteClick = function(event) {
				thisTemp.adEscMuteFunction();
			};
			this.addListenerInside('click', adEscMuteClick, this.CB['adEscMute']);
			var adPauseCloseClick = function(event) {
				thisTemp.adPauseCloseFunction();
			};
			this.addListenerInside('click', adPauseCloseClick, this.CB['adPauseClose']);
			//定义各个按钮的鼠标经过/离开事件
			var promptHide = function(event) {
				thisTemp.promptShow(false);
			};
			var playOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['play']);
			};
			this.addListenerInside('mouseover', playOver, this.CB['play']);
			this.addListenerInside('mouseout', promptHide, this.CB['play']);
			var pauseOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['pause']);
			};
			this.addListenerInside('mouseover', pauseOver, this.CB['pause']);
			this.addListenerInside('mouseout', promptHide, this.CB['pause']);
			var frontOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['front']);
			};
			this.addListenerInside('mouseover', frontOver, this.CB['front']);
			this.addListenerInside('mouseout', promptHide, this.CB['front']);
			var nextOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['next']);
			};
			this.addListenerInside('mouseover', nextOver, this.CB['next']);
			this.addListenerInside('mouseout', promptHide, this.CB['next']);
			var muteOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['mute']);
			};
			this.addListenerInside('mouseover', muteOver, this.CB['mute']);
			this.addListenerInside('mouseout', promptHide, this.CB['mute']);
			var escMuteOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['escMute']);
			};
			this.addListenerInside('mouseover', escMuteOver, this.CB['escMute']);
			this.addListenerInside('mouseout', promptHide, this.CB['escMute']);
			var fullOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['full']);
			};
			this.addListenerInside('mouseover', fullOver, this.CB['full']);
			this.addListenerInside('mouseout', promptHide, this.CB['full']);
			var escFullOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['escFull']);
			};
			this.addListenerInside('mouseover', escFullOver, this.CB['escFull']);
			this.addListenerInside('mouseout', promptHide, this.CB['escFull']);
			var definitionOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['definition']);
			};
			this.addListenerInside('mouseover', definitionOver, this.CB['definition']);
			this.addListenerInside('mouseout', promptHide, this.CB['definition']);
			var playbackrateOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['playbackrate']);
			};
			this.addListenerInside('mouseover', playbackrateOver, this.CB['playbackrate']);
			this.addListenerInside('mouseout', promptHide, this.CB['playbackrate']);
			var subtitlesOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['subtitles']);
			};
			this.addListenerInside('mouseover', subtitlesOver, this.CB['subtitles']);
			this.addListenerInside('mouseout', promptHide, this.CB['subtitles']);
			//定义音量和进度按钮的滑块事件
			var volumePrompt = function(vol) {
				var volumeBOXY = thisTemp.getCoor(thisTemp.CB['volumeBO']);
				var promptObj = {
					title: thisTemp.language['volume'] + vol + '%',
					x: volumeBOXY['x'] + thisTemp.CB['volumeBO'].offsetWidth * 0.5,
					y: volumeBOXY['y']
				};
				thisTemp.promptShow(false, promptObj);
			};
			var volumeObj = {
				slider: this.CB['volumeBO'],
				follow: this.CB['volumeUp'],
				refer: this.CB['volumeBg'],
				grossValue: 'volume',
				pd: true,
				startFun: function(vol) {},
				monitorFun: function(vol) {
					thisTemp.changeVolume(vol * 0.01, false, false);
					volumePrompt(vol);
				},
				endFun: function(vol) {},
				overFun: function(vol) {
					volumePrompt(vol);
				}
			};
			this.slider(volumeObj);
			var volumeClickObj = {
				refer: this.CB['volumeBg'],
				grossValue: 'volume',
				fun: function(vol) {
					thisTemp.changeVolume(vol * 0.01, true, true);
				}
			};
			this.progressClick(volumeClickObj);
			this.timeButtonMouseDown(); //用单击的函数来判断是否需要建立控制栏监听
			//鼠标经过/离开音量调节框时的
			var volumeBgMove = function(event) {
				var volumeBgXY = thisTemp.getCoor(thisTemp.CB['volumeBg']);
				var eventX = thisTemp.client(event)['x'];
				var eventVolume = parseInt((eventX - volumeBgXY['x']) * 100 / thisTemp.CB['volumeBg'].offsetWidth);
				var buttonPromptObj = {
					title: thisTemp.language['volume'] + eventVolume + '%',
					x: eventX,
					y: volumeBgXY['y']
				};
				thisTemp.promptShow(false, buttonPromptObj);
			};
			this.addListenerInside('mousemove', volumeBgMove, this.CB['volumeBg']);
			this.addListenerInside('mouseout', promptHide, this.CB['volumeBg']);
			this.addListenerInside('mouseout', promptHide, this.CB['volumeBO']);
			//注册清晰度相关事件
			this.addDefListener();
			//注册倍速相关事件
			this.addPlaybackrate();
			//注册多字幕事件
			this.addSubtitles();
		},
		/*
			内部函数
			注册单击视频动作
		*/
		videoClick: function() {
			var thisTemp = this;
			var clearTimerClick = function() {
				if (thisTemp.timerClick != null) {
					if (thisTemp.timerClick.runing) {
						thisTemp.timerClick.stop();
					}
					thisTemp.timerClick = null;
				}
			};
			var timerClickFun = function() {
				clearTimerClick();
				thisTemp.isClick = false;
				thisTemp.sendJS('videoClick',thisTemp.videoClickXy);
				if (thisTemp.adPlayerPlay) {
					var ad = thisTemp.getNowAdvertisements();
					try {
						if (ad['link'] != '') {
							window.open(ad['link']);
						}
						thisTemp.ajaxSuccessNull(ad['clickMonitor']);
					} catch(event) {}
				} else {
					if (thisTemp.ckplayerConfig['config']['click']) {
						thisTemp.playOrPause();
					}
				}

			};
			clearTimerClick();
			if (this.isClick) {
				this.isClick = false;
				thisTemp.sendJS('videoDoubleClick',thisTemp.videoClickXy);
				if (thisTemp.ckplayerConfig['config']['doubleClick']) {
					if (!this.full) {
						thisTemp.fullScreen();
					} else {
						thisTemp.quitFullScreen();
					}
				}

			} else {
				this.isClick = true;
				this.timerClick = new this.timer(300, timerClickFun, 1)
				//this.timerClick.start();
			}

		},
		/*
			内部函数
			注册鼠标经过进度滑块的事件
		*/
		timeButtonMouseDown: function() {
			var thisTemp = this;
			var timePrompt = function(time) {
				if (isNaN(time)) {
					time = 0;
				}
				var timeButtonXY = thisTemp.getCoor(thisTemp.CB['timeButton']);
				var promptObj = {
					title: thisTemp.formatTime(time),
					x: timeButtonXY['x'] - thisTemp.pdCoor['x'] + thisTemp.CB['timeButton'].offsetWidth * 0.5,
					y: timeButtonXY['y'] - thisTemp.pdCoor['y']
				};
				thisTemp.promptShow(false, promptObj);
			};
			var timeObj = {
				slider: this.CB['timeButton'],
				follow: this.CB['timeProgress'],
				refer: this.CB['timeBoBg'],
				grossValue: 'time',
				pd: false,
				startFun: function(time) {
					thisTemp.isTimeButtonMove = false;
				},
				monitorFun: function(time) {},
				endFun: function(time) {
					if (thisTemp.V) {
						if (thisTemp.V.duration > 0) {
							thisTemp.needSeek = 0;
							thisTemp.videoSeek(parseInt(time));
						}
					}
				},
				overFun: function(time) {
					timePrompt(time);
				}
			};
			var timeClickObj = {
				refer: this.CB['timeBoBg'],
				grossValue: 'time',
				fun: function(time) {
					if (thisTemp.V) {
						if (thisTemp.V.duration > 0) {
							thisTemp.needSeek = 0;
							thisTemp.videoSeek(parseInt(time));
						}
					}
				}
			};
			var timeBoBgmousemove = function(event) {
				var timeBoBgXY = thisTemp.getCoor(thisTemp.CB['timeBoBg']);
				var eventX = thisTemp.client(event)['x'];
				var duration=thisTemp.V.duration;
				if (isNaN(duration) || parseInt(duration) < 0.2) {
					duration = thisTemp.vars['duration'];
				}
				if(thisTemp.vars['forceduration']>0){
					duration=thisTemp.vars['forceduration'];
				}
				var eventTime = parseInt((eventX - timeBoBgXY['x']) * duration / thisTemp.CB['timeBoBg'].offsetWidth);
				var buttonPromptObj = {
					title: thisTemp.formatTime(eventTime),
					x: eventX,
					y: timeBoBgXY['y']
				};
				thisTemp.promptShow(false, buttonPromptObj);
				var def = false;
				if (!thisTemp.isUndefined(thisTemp.CB['definitionP'])) {
					if (thisTemp.css(thisTemp.CB['definitionP'], 'display') != 'block') {
						def = true;
					}
				}
				if (thisTemp.vars['preview'] != null && def) {
					buttonPromptObj['time'] = eventTime;
					thisTemp.preview(buttonPromptObj);
				}
			};
			var promptHide = function(event) {
				thisTemp.promptShow(false);
				if (thisTemp.previewDiv != null) {
					thisTemp.css([thisTemp.previewDiv, thisTemp.previewTop], 'display', 'none');
				}
			};
			if (!this.vars['live']) { //如果不是直播
				this.isTimeButtonDown = true;
				this.addListenerInside('mousemove', timeBoBgmousemove, this.CB['timeBoBg']);
				this.addListenerInside('mouseout', promptHide, this.CB['timeBoBg']);
			} else {
				this.isTimeButtonDown = false;
				timeObj['removeListenerInside'] = true;
				timeClickObj['removeListenerInside'] = true;
			}
			this.slider(timeObj);
			this.progressClick(timeClickObj);

		},
		/*
			内部函数
			注册调节框上单击事件，包含音量调节框和播放时度调节框
		*/
		progressClick: function(obj) {
			/*
				refer:参考对象
				fun:返回函数
				refer:参考元素，即背景
				grossValue:调用的参考值类型
				pd:
			*/
			//建立参考元素的mouseClick事件，用来做为鼠标在其上按下时触发的状态
			var thisTemp = this;
			var referMouseClick = function(event) {
				var referX = thisTemp.client(event)['x'] - thisTemp.getCoor(obj['refer'])['x'];
				var rWidth = obj['refer'].offsetWidth;
				var grossValue = 0;
				if (obj['grossValue'] == 'volume') {
					grossValue = 100;
				} else {
					if (thisTemp.V) {
						grossValue = thisTemp.V.duration;
						if (isNaN(grossValue) || parseInt(grossValue) < 0.2) {
							grossValue = thisTemp.vars['duration'];
						}
						if(thisTemp.vars['forceduration']>0){
							grossValue=thisTemp.vars['forceduration'];
						}
					}
				}
				var nowZ = parseInt(referX * grossValue / rWidth);
				if (obj['fun']) {
					if (obj['grossValue'] === 'time') {
						var sliderXY = thisTemp.getCoor(thisTemp.CB['timeButton']);
						sliderLeft = sliderXY['x'];
						if (!thisTemp.checkSlideLeft(referX, sliderLeft, rWidth)) {
							return;
						}
						var bimeButtonWB = thisTemp.CB['timeButton'].offsetWidth * 0.5;
						thisTemp.css(thisTemp.CB['timeButton'], 'left', (referX - bimeButtonWB) + 'px');
						thisTemp.css(thisTemp.CB['timeProgress'], 'width', (referX) + 'px');
					}
					obj['fun'](nowZ);
				}
			};
			if (this.isUndefined(obj['removeListenerInside'])) {
				this.addListenerInside('click', referMouseClick, obj['refer']);
			} else {
				this.removeListenerInside('click', referMouseClick, obj['refer']);
			}

		},

		/*
			内部函数
			共用的注册滑块事件
		*/
		slider: function(obj) {
			/*
				obj={
					slider:滑块元素
					follow:跟随滑块的元素
					refer:参考元素，即背景
					grossValue:调用的参考值类型
					startFun:开始调用的元素
					monitorFun:监听函数
					endFun:结束调用的函数
					overFun:鼠标放上去后调用的函数
					pd:是否需要修正
				}
			*/
			var thisTemp = this;
			var clientX = 0,
			criterionWidth = 0,
			sliderLeft = 0,
			referLeft = 0;
			var value = 0;
			var calculation = function() { //根据滑块的left计算百分比
				var sLeft = parseInt(thisTemp.css(obj['slider'], 'left'));
				var rWidth = obj['refer'].offsetWidth - obj['slider'].offsetWidth;
				var grossValue = 0;
				if (thisTemp.isUndefined(sLeft) || isNaN(sLeft)) {
					sLeft = 0;
				}
				if (obj['grossValue'] == 'volume') {
					grossValue = 100;
				} else {
					if (thisTemp.V) {
						grossValue = thisTemp.V.duration;
					}
				}
				return parseInt(sLeft * grossValue / rWidth);
			};
			var mDown = function(event) {
				thisTemp.addListenerInside('mousemove', mMove, document);
				thisTemp.addListenerInside('mouseup', mUp, document);
				var referXY = thisTemp.getCoor(obj['refer']);
				var sliderXY = thisTemp.getCoor(obj['slider']);
				clientX = thisTemp.client(event)['x'];
				referLeft = referXY['x'];
				sliderLeft = sliderXY['x'];
				criterionWidth = clientX - sliderLeft;
				if (obj['startFun']) {
					obj['startFun'](calculation());
				}
			};
			var mMove = function(event) {
				clientX = thisTemp.client(event)['x'];
				var newX = clientX - criterionWidth - referLeft;
				if (newX < 0) {
					newX = 0;
				}
				if (newX > obj['refer'].offsetWidth - obj['slider'].offsetWidth) {
					newX = obj['refer'].offsetWidth - obj['slider'].offsetWidth;
				}
				if (obj['slider'] === thisTemp.CB['timeButton']) {
					if (!thisTemp.checkSlideLeft(newX, sliderLeft, obj['refer'].offsetWidth)) {
						return;
					}
				}
				thisTemp.css(obj['slider'], 'left', newX + 'px');
				thisTemp.css(obj['follow'], 'width', (newX + obj['slider'].offsetWidth * 0.5) + 'px');
				var nowZ = calculation();
				if (obj['monitorFun']) {
					obj['monitorFun'](nowZ);
				}
			};
			var mUp = function(event) {
				thisTemp.removeListenerInside('mousemove', mMove, document);
				thisTemp.removeListenerInside('mouseup', mUp, document);
				if (obj['endFun']) {
					obj['endFun'](calculation());
				}
			};
			var mOver = function(event) {
				if (obj['overFun']) {
					obj['overFun'](calculation());
				}

			};
			if (this.isUndefined(obj['removeListenerInside'])) {
				this.addListenerInside('mousedown', mDown, obj['slider']);
				this.addListenerInside('mouseover', mOver, obj['slider']);
			} else {
				this.removeListenerInside('mousedown', mDown, obj['slider']);
				this.removeListenerInside('mouseover', mOver, obj['slider']);
			}
		},
		/*
			内部函数
			判断是否可以拖动进度按钮或点击进度栏
		*/
		checkSlideLeft: function(newX, sliderLeft, refer) {
			var timeSA = this.ckplayerConfig['config']['timeScheduleAdjust'];
			switch (timeSA) {
			case 0:
				return false;
				break;
			case 2:
				if (newX < sliderLeft) {
					return false;
				}
				break;
			case 3:
				if (newX > sliderLeft) {
					return false;
				}
				break;
			case 4:
				if (!this.timeSliderLeftTemp) {
					this.timeSliderLeftTemp = sliderLeft / refer;
				}
				if (newX < this.timeSliderLeftTemp * refer) {
					return false;
				}
				break;
			case 5:
				if (!this.timeSliderLeftTemp) {
					this.timeSliderLeftTemp = sliderLeft / refer;
				} else {
					var timeSliderMax = sliderLeft / refer;
					if (timeSliderMax > this.timeSliderLeftTemp) {
						this.timeSliderLeftTemp = timeSliderMax;
					}
				}
				if (newX > this.timeSliderLeftTemp * refer) {
					return false;
				}
				break;
			default:
				return true;
				break;
			}
			return true;
		},
		/*
			内部函数
			显示loading
		*/
		loadingStart: function(rot) {
			var thisTemp = this;
			if (this.isUndefined(rot)) {
				rot = true;
			}
			if (this.showFace) {
				this.css(thisTemp.CB['loading'], 'display', 'none');
			}
			if (this.timerLoading != null) {
				if (this.timerLoading.runing) {
					this.timerLoading.stop();
				}
				this.timerLoading = null;
			}
			var buffer = 0;
			var loadingFun = function() {
				var nowRotate = '0';
				try {
					nowRotate = thisTemp.css(thisTemp.CB['loadingCanvas'], 'transform') || thisTemp.css(thisTemp.CB['loadingCanvas'], '-ms-transform') || thisTemp.css(thisTemp.CB['loadingCanvas'], '-moz-transform') || thisTemp.css(thisTemp.CB['loadingCanvas'], '-webkit-transform') || thisTemp.css(thisTemp.CB['loadingCanvas'], '-o-transform') || '0';
				} catch(event) {}
				nowRotate = parseInt(nowRotate.replace('rotate(', '').replace('deg);', ''));
				nowRotate += 4;
				if (nowRotate > 360) {
					nowRotate = 0;
				}
				if (thisTemp.showFace) {
					thisTemp.css(thisTemp.CB['loadingCanvas'], {
						transform: 'rotate(' + nowRotate + 'deg)',
						msTransform: 'rotate(' + nowRotate + 'deg)',
						mozTransform: 'rotate(' + nowRotate + 'deg)',
						webkitTransform: 'rotate(' + nowRotate + 'deg)',
						oTransform: 'rotate(' + nowRotate + 'deg)'
					});
				}
				buffer++;
				if (buffer >= 99) {
					buffer = 99;
				}
				thisTemp.sendJS('buffer', buffer);
			};
			if (rot) {
				this.timerLoading = new this.timer(10, loadingFun);
				//this.timerLoading.start();
				if (this.showFace) {
					this.css(thisTemp.CB['loading'], 'display', 'block');
				}
			} else {
				thisTemp.sendJS('buffer', 100);
			}
		},
		/*
			内部函数
			判断是否需要显示上一集和下一集
		*/
		showFrontNext: function() {
			if (!this.showFace) {
				return;
			}
			if (this.vars['front']) {
				this.css([this.CB['front'], this.CB['frontLine']], 'display', 'block');
			} else {
				this.css([this.CB['front'], this.CB['frontLine']], 'display', 'none');
			}
			if (this.vars['next']) {
				this.css([this.CB['next'], this.CB['nextLine']], 'display', 'block');
			} else {
				this.css([this.CB['next'], this.CB['nextLine']], 'display', 'none');
			}
		},
		/*
			内部函数
			显示提示语
		*/
		promptShow: function(ele, data) {
			if (!this.showFace) {
				return;
			}
			var obj = {};
			if (ele || data) {
				if (!this.isUndefined(data)) {
					obj = data;
				} else {
					var offsetCoor = this.getCoor(ele);
					obj = {
						title: this.getDataset(ele, 'title'),
						x: offsetCoor['x'] + ele.offsetWidth * 0.5,
						y: offsetCoor['y']
					};
				}
				this.CB['prompt'].innerHTML = obj['title'];
				this.css(this.CB['prompt'], 'display', 'block');
				var promoptWidth = this.getStringLen(obj['title']) * 10;
				this.css(this.CB['promptBg'], 'width', promoptWidth + 'px');
				this.css(this.CB['prompt'], 'width', promoptWidth + 'px');
				promoptWidth += 10;
				var x = obj['x'] - (promoptWidth * 0.5);
				var y = this.PD.offsetHeight - obj['y'] + 8;
				if (x < 0) {
					x = 0;
				}
				if (x > this.PD.offsetWidth - promoptWidth) {
					x = this.PD.offsetWidth - promoptWidth;
				}
				this.css([this.CB['promptBg'], this.CB['prompt']], {
					display: 'block',
					left: x + 'px',
					bottom: y + 'px'
				});
			} else {
				this.css([this.CB['promptBg'], this.CB['prompt']], {
					display: 'none'
				});
			}
		},
		/*
			内部函数
			监听错误
		*/
		timerErrorFun: function() {
			var thisTemp = this;
			this.errorSend = false;
			var clearIntervalError = function(event) {
				if (thisTemp.timerError != null) {
					if (thisTemp.timerError.runing) {
						thisTemp.timerError.stop();
					}
					thisTemp.timerError = null;
				}
			};
			var errorFun = function(event) {
				clearIntervalError();
				thisTemp.error = true;
				//提取错误播放地址
				thisTemp.errorUrl = thisTemp.getVideoUrl();
				//提取错误播放地址结束
				if (!thisTemp.errorSend) {
					thisTemp.errorSend = true;
					thisTemp.sendJS('error');
				}
				if (thisTemp.showFace) {
					thisTemp.css(thisTemp.CB['errorText'], 'display', 'block');
					thisTemp.css(thisTemp.CB['pauseCenter'], 'display', 'none');
					thisTemp.css(thisTemp.CB['loading'], 'display', 'none');
				}
				thisTemp.V.removeAttribute('poster');
				thisTemp.resetPlayer();
			};
			var errorListenerFun = function(event) {
				setTimeout(function() {
					if (isNaN(thisTemp.V.duration)) {
						errorFun(event);
					}
				},
				500);

			};
			if (!this.errorAdd) {
				this.errorAdd = true;
				this.addListenerInside('error', errorListenerFun, this.V);
			}
			clearIntervalError();
			var timerErrorFun = function() {
				if (thisTemp.V && parseInt(thisTemp.V.networkState) == 3) {
					errorFun();
				}
			};
			this.timerError = new this.timer(this.config['errorTime'], timerErrorFun);
			//this.timerError.start();
		},
		/*
			内部函数
			构建判断全屏还是非全屏的判断
		*/
		judgeFullScreen: function() {
			var thisTemp = this;
			if (this.timerFull != null) {
				if (this.timerFull.runing) {
					this.timerFull.stop();
				}
				this.timerFull = null;
			}
			var fullFun = function() {
				thisTemp.isFullScreen();
			};
			this.timerFull = new this.timer(20, fullFun);
		},
		/*
			内部函数
			判断是否是全屏
		*/
		isFullScreen: function() {
			if (!this.showFace) {
				return;
			}
			var fullState = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement;
			if (fullState && !this.full) {
				this.full = true;
				this.sendJS('full', true);
				this.elementCoordinate();
				this.css(this.CB['full'], 'display', 'none');
				this.css(this.CB['escFull'], 'display', 'block');
				if (this.vars['live'] == 0) {
					this.timeUpdateHandler();
				}
				this.PD.appendChild(this.CB['menu']);
			}
			if (!fullState && this.full) {
				this.full = false;
				this.sendJS('full', false);
				this.elementCoordinate();
				this.css(this.CB['full'], 'display', 'block');
				this.css(this.CB['escFull'], 'display', 'none');
				if (this.timerFull != null) {
					if (this.timerFull.runing) {
						this.timerFull.stop();
					}
					this.timerFull = null;
				}
				if (this.vars['live'] == 0) {
					this.timeUpdateHandler();
				}
				this.body.appendChild(this.CB['menu']);
			}
		},
		/*
			内部函数
			构建右键内容及注册相关动作事件
		*/
		newMenu: function() {
			var thisTemp = this;
			var i = 0;
			this.css(this.CB['menu'], {
				backgroundColor: '#FFFFFF',
				padding: '5px',
				position: 'absolute',
				left: '10px',
				top: '20px',
				display: 'none',
				zIndex: '999',
				color: '#A1A9BE',
				boxShadow: '2px 2px 3px #AAAAAA'
			});
			var mArr = this.contextMenu;
			var cMenu = this.ckplayerConfig['menu'];
			if (cMenu['name']) {
				if (cMenu['link']) {
					mArr[0] = [cMenu['name'], 'link', cMenu['link']];
				} else {
					mArr[0] = [cMenu['name'], 'default'];
				}
			}
			if (cMenu['version']) {
				mArr[1] = [cMenu['version'], 'default', 'line'];
			}
			if (cMenu['more']) {
				if (typeof(cMenu['more']) == 'object') {
					if (cMenu['more'].length > 0) {
						var moreArr = cMenu['more'];
						for (i = 0; i < moreArr.length; i++) {
							var mTemp = moreArr[i];
							var arrTemp = [];
							if (mTemp['name']) {
								arrTemp.push(mTemp['name']);
							}
							if (mTemp['clickEvent'] && mTemp['clickEvent'] != 'none') {
								var eveObj = this.clickEvent(mTemp['clickEvent']);
								arrTemp.push(eveObj['type']);
								if (eveObj['fun']) {
									arrTemp.push(eveObj['fun']);
								}
								if (eveObj['link']) {
									arrTemp.push(eveObj['link']);
								}
								if (eveObj['target']) {
									arrTemp.push(' target="' + eveObj['target'] + '"');
								}
							}
							if (mTemp['separatorBefore']) {
								arrTemp.push('line');
							}
							mArr.push(arrTemp);
						}
					}
				}
			}
			var html = '';
			for (i = 0; i < mArr.length; i++) {
				var me = mArr[i];
				switch (me[1]) {
				case 'default':
					html += '<p>' + me[0] + '</p>';
					break;
				case 'link':
					if (me[3]) {
						me[3] = 'target="' + me[3] + '"';
					}
					html += '<p><a href="' + me[2] + '"' + me[3] + '>' + me[0] + '</a></p>';
					break;
				case 'javaScript':
					html += '<p><a href="javascript:' + me[2] + '">' + me[0] + '</a></p>';
					break;
				case 'actionScript':
					html += '<p><a href="javascript:' + this.vars['variable'] + me[2].replace('thisTemp', '') + '">' + me[0] + '</a></p>';
					break;
				default:
					break;
				}
			}
			this.CB['menu'].innerHTML = html;
			var pArr = this.CB['menu'].childNodes;
			for (i = 0; i < pArr.length; i++) {
				this.css(pArr[i], {
					height: '30px',
					lineHeight: '30px',
					margin: '0px',
					fontFamily: this.fontFamily,
					fontSize: '12px',
					paddingLeft: '10px',
					paddingRight: '30px'
				});
				if (mArr[i][mArr[i].length - 1] == 'line') {
					this.css(pArr[i], 'borderBottom', '1px solid #e9e9e9');
				}
				var aArr = pArr[i].childNodes;
				for (var n = 0; n < aArr.length; n++) {
					if (aArr[n].localName == 'a') {
						this.css(aArr[n], {
							color: '#000000',
							textDecoration: 'none'
						});
					}
				}
			}
			this.PD.oncontextmenu = function(event) {
				retrun;
				var eve = event || window.event;
				var client = thisTemp.client(event);
				if (eve.button == 2) {
					eve.returnvalue = false;
					var x = client['x'] + thisTemp.pdCoor['x'] - 2;
					var y = client['y'] + thisTemp.pdCoor['y'] - 2;
					thisTemp.css(thisTemp.CB['menu'], {
						display: 'block',
						left: x + 'px',
						top: y + 'px'
					});
					return false;
				}
				return true;
			};
			var setTimeOutPClose = function() {
				if (setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
			};
			var setTimeOutP = null;
			var mouseOut = function(event) {
				setTimeOutPClose();
				setTimeOutP = setTimeout(function(event) {
					thisTemp.css(thisTemp.CB['menu'], 'display', 'none');
				},
				500);
			};
			this.addListenerInside('mouseout', mouseOut, thisTemp.CB['menu']);
			var mouseOver = function(event) {
				setTimeOutPClose();
			};
			this.addListenerInside('mouseover', mouseOver, thisTemp.CB['menu']);

		},
		/*
			内部函数
			构建控制栏隐藏事件
		*/
		controlBarHide: function(hide) {
			var thisTemp = this;
			var client = {
				x: 0,
				y: 0
			},
			oldClient = {
				x: 0,
				y: 0
			};
			var cShow = true,
			force = false;
			var oldCoor = [0, 0];
			var controlBarShow = function(show) {
				if (show && !cShow && thisTemp.controlBarIsShow) {
					cShow = true;
					thisTemp.sendJS('controlBar', true);
					thisTemp.css(thisTemp.CB['controlBarBg'], 'display', 'block');
					thisTemp.css(thisTemp.CB['controlBar'], 'display', 'block');
					thisTemp.css(thisTemp.CB['timeProgressBg'], 'display', 'block');
					thisTemp.css(thisTemp.CB['timeBoBg'], 'display', 'block');
					thisTemp.changeVolume(thisTemp.volume);
					thisTemp.changeLoad();
					if (!thisTemp.timerBuffer) {
						thisTemp.bufferEdHandler();
					}
				} else {
					if (cShow) {
						cShow = false;
						var paused = thisTemp.getMetaDate()['paused'];
						if (force) {
							paused = false;
						}
						if (!paused) {
							thisTemp.sendJS('controlBar', false);
							thisTemp.css(thisTemp.CB['controlBarBg'], 'display', 'none');
							thisTemp.css(thisTemp.CB['controlBar'], 'display', 'none');
							thisTemp.css(thisTemp.CB['timeProgressBg'], 'display', 'none');
							thisTemp.css(thisTemp.CB['timeBoBg'], 'display', 'none');
							thisTemp.promptShow(false);

						}
					}
				}
			};
			var cbarFun = function(event) {
				if (client['x'] == oldClient['x'] && client['y'] == oldClient['y']) {
					var cdH = parseInt(thisTemp.CD.offsetHeight);
					if ((client['y'] < cdH - 50 || client['y'] > cdH - 2) && cShow && !thisTemp.getMetaDate()['paused']) {
						controlBarShow(false);
					}
				} else {
					if (!cShow) {
						controlBarShow(true);
					}
				}
				oldClient = {
					x: client['x'],
					y: client['y']
				}
			};
			this.timerCBar = new this.timer(2000, cbarFun);
			var cdMove = function(event) {
				var getClient = thisTemp.client(event);
				client['x'] = getClient['x'];
				client['y'] = getClient['y'];
				if (!cShow) {
					controlBarShow(true);
				}
			};
			this.addListenerInside('mousemove', cdMove, thisTemp.CD);
			this.addListenerInside('ended', cdMove);
			this.addListenerInside('resize', cdMove, window);
			if (hide === true) {
				cShow = true;
				force = true;
				controlBarShow(false);
			}
			if (hide === false) {
				cShow = false;
				force = true;
				controlBarShow(true);
			}
		},

		/*
			内部函数
			注册键盘按键事件
		*/
		keypress: function() {
			var thisTemp = this;
			var keyDown = function(eve) {
				var keycode = eve.keyCode || eve.which;
				if (thisTemp.adPlayerPlay) {
					return;
				}
				switch (keycode) {
					case 32:
						thisTemp.playOrPause();
						break;
					case 37:
						thisTemp.fastBack();
						break;
					case 39:
						thisTemp.fastNext();
						break;
					case 38:
						now = thisTemp.volume + thisTemp.ckplayerConfig['config']['volumeJump'];
						thisTemp.changeVolume(now > 1 ? 1 : now);
						break;
					case 40:
						now = thisTemp.volume - thisTemp.ckplayerConfig['config']['volumeJump'];
						thisTemp.changeVolume(now < 0 ? 0 : now);
						break;
					default:
						break;
				}
			};
			this.addListenerInside('keydown', keyDown, window || document);
		},
		/*
			内部函数
			注册倍速相关
		*/
		playbackRate: function() {
			if (!this.showFace || !this.ckplayerConfig['config']['playbackRate']) {
				return;
			}
			var thisTemp = this;
			var vArr = this.playbackRateArr;
			var html = '';
			var nowD = ''; //当前的倍速
			var i = 0;
			if (!nowD) {
				nowD = vArr[this.playbackRateDefault][1];
			}
			if (vArr.length > 1) {
				var zlen = 0;
				for (i = 0; i < vArr.length; i++) {
					html = '<p>' + vArr[i][1] + '</p>' + html;
					var dlen = this.getStringLen(vArr[i][1]);
					if (dlen > zlen) {
						zlen = dlen;
					}
				}
				if (html) {
					html += '<p>' + nowD + '</p>';
				}
				this.CB['playbackrate'].innerHTML = nowD;
				this.CB['playbackrateP'].innerHTML = html;
				this.css([this.CB['playbackrate'], this.CB['playbackrateLine']], 'display', 'block');
				var pArr = this.CB['playbackrateP'].childNodes;
				for (var i = 0; i < pArr.length; i++) {
					var fontColor = '#FFFFFF';
					if (pArr[i].innerHTML == nowD) {
						fontColor = '#0782F5';
					}
					this.css(pArr[i], {
						color: fontColor,
						margin: '0px',
						padding: '0px',
						fontSize: '14px',
						textAlign:'center'
					});
					if (i < pArr.length - 1) {
						this.css(pArr[i], 'borderBottom', '1px solid #282828')
					}
					var defClick = function(event) {
						if (nowD != this.innerHTML) {
							thisTemp.css(thisTemp.CB['playbackrateP'], 'display', 'none');
							thisTemp.newPlaybackrate(this.innerHTML);
							thisTemp.sendJS('clickEvent', 'actionScript->newPlaybackrate');
						}
					};
					this.addListenerInside('click', defClick, pArr[i]);

				}
				var pW = (zlen * 10) + 10;
				this.css(this.CB['playbackrateP'], {
					width: pW + 'px'
				});
				this.css(this.CB['playbackrate'], {
					width: pW + 'px'
				});
				this.buttonWidth['playbackrate'] = this.CB['playbackrate'].offsetWidth;
			} else {
				this.CB['playbackrate'].innerHTML = '';
				this.CB['playbackrateP'].innerHTML = '';
				this.css([this.CB['playbackrate'], this.CB['playbackrateLine']], 'display', 'none');
			}
		},
		/*
			内部函数
			注册切换倍速播放相关事件
		*/
		addPlaybackrate: function() {
			var thisTemp = this;
			var setTimeOutP = null;
			var defClick = function(event) {
				thisTemp.css(thisTemp.CB['playbackrateP'], {
					left: thisTemp.getCoor(thisTemp.CB['playbackrate'])['x'] + 'px',
					display: 'block'
				});
			};
			this.addListenerInside('click', defClick, this.CB['playbackrate']);
			var defMouseOut = function(event) {
				if (setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
				setTimeOutP = setTimeout(function(event) {
					thisTemp.css(thisTemp.CB['playbackrateP'], 'display', 'none');
				},
				500);
			};
			this.addListenerInside('mouseout', defMouseOut, thisTemp.CB['playbackrateP']);
			var defMouseOver = function(event) {
				if (setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
			};
			this.addListenerInside('mouseover', defMouseOver, thisTemp.CB['playbackrateP']);
		},
		/*
			内部函数
			切换倍速后发生的动作
		*/
		newPlaybackrate: function(title) {
			var vArr = this.playbackRateArr;
			var nVArr = [];
			var i = 0;
			for (i = 0; i < vArr.length; i++) {
				var v = vArr[i];
				if (v[1] == title) {
					this.playbackRateDefault = i;
					this.V.playbackRate = v[0];
					if (this.showFace) {
						this.CB['playbackrate'].innerHTML = v[1];
						this.playbackRate();
					}
					this.sendJS('playbackRate', v);
					this.playbackRateTemp=v[0];
				}
			}
		},
		/*
			内部函数
			注册多字幕切换相关
		*/
		subtitleSwitch: function() {
			if (!this.showFace || !this.ckplayerConfig['config']['subtitle']) {
				return;
			}
			var thisTemp = this;
			var vArr = this.vars['cktrack'];//字幕数组
			if(this.typeString(vArr)!='array'){
				return;
			}
			if(vArr[0][1]==''){
				return;
			}
			var html = '';
			var nowD = ''; //当前的字幕
			var i = 0;
			if (!nowD) {
				if(this.subtitlesTemp==-1){
					var indexN=0;
					for(var i=0;i<vArr.length;i++){
						var li=vArr[i];
						if(li.length==3 && li[2]>indexN){
							indexN=li[2];
							this.subtitlesTemp=i;
						}
					}
				}
				nowD = vArr[this.subtitlesTemp][1];
			}
			if (vArr.length > 1) {
				var zlen = 0;
				for (i = 0; i < vArr.length; i++) {
					html += '<p>' + vArr[i][1] + '</p>';
					var dlen = this.getStringLen(vArr[i][1]);
					if (dlen > zlen) {
						zlen = dlen;
					}
				}
				if (html) {
					html += '<p>' + nowD + '</p>';
				}
				
				this.CB['subtitles'].innerHTML = nowD;
				this.CB['subtitlesP'].innerHTML = html;
				this.css([this.CB['subtitles'], this.CB['subtitlesLine']], 'display', 'block');
				var pArr = this.CB['subtitlesP'].childNodes;
				for (var i = 0; i < pArr.length; i++) {
					var fontColor = '#FFFFFF';
					if (pArr[i].innerHTML == nowD) {
						fontColor = '#0782F5';
					}
					this.css(pArr[i], {
						color: fontColor,
						margin: '0px',
						padding: '0px',
						fontSize: '14px'
					});
					if (i < pArr.length - 1) {
						this.css(pArr[i], 'borderBottom', '1px solid #282828')
					}
					var defClick = function(event) {
						if (nowD != this.innerHTML) {
							thisTemp.css(thisTemp.CB['subtitlesP'], 'display', 'none');
							thisTemp.newSubtitles(this.innerHTML);
							thisTemp.sendJS('clickEvent', 'actionScript->newPlaybackrate');
						}
					};
					this.addListenerInside('click', defClick, pArr[i]);

				}
				var pW = (zlen * 10) + 10;
				this.css(this.CB['subtitlesP'], {
					width: pW + 'px'
				});
				this.css(this.CB['subtitles'], {
					width: pW + 'px'
				});
				this.buttonWidth['subtitles'] = this.CB['subtitles'].offsetWidth;
			} else {
				this.CB['subtitles'].innerHTML = '';
				this.CB['subtitlesP'].innerHTML = '';
				this.css([this.CB['subtitles'], this.CB['subtitlesLine']], 'display', 'none');
			}
		},
		/*
			内部函数
			注册多字幕切换事件
		*/
		addSubtitles:function(){
			var thisTemp = this;
			var setTimeOutP = null;
			var defClick = function(event) {
				thisTemp.css(thisTemp.CB['subtitlesP'], {
					left: thisTemp.getCoor(thisTemp.CB['subtitles'])['x'] + 'px',
					display: 'block'
				});
			};
			this.addListenerInside('click', defClick, this.CB['subtitles']);
			var defMouseOut = function(event) {
				if (setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
				setTimeOutP = setTimeout(function(event) {
					thisTemp.css(thisTemp.CB['subtitlesP'], 'display', 'none');
				},
				500);
			};
			this.addListenerInside('mouseout', defMouseOut, thisTemp.CB['subtitlesP']);
			var defMouseOver = function(event) {
				if (setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
			};
			this.addListenerInside('mouseover', defMouseOver, thisTemp.CB['subtitlesP']);
		},
		/*
			接口函数:修改字幕，按数组编号来
			提供给外部api
		*/
		changeSubtitles: function(n) {
			if (!this.loaded || n < 0) {
				return;
			}
			var vArr = this.vars['cktrack'];//字幕数组
			if(this.typeString(vArr)!='array'){
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.changeSubtitles(n);
				return;
			}
			if (vArr.length > n) {
				var arr = vArr[n];
				if (arr.length > 2) {
					var title = arr[1];
					if (title) {
						this.newSubtitles(title);
					}
				}
			}
		},
		/*
			接口函数：修改字幕大小
			提供给外部api
		*/
		changeSubtitlesSize:function(n){
			if (!this.loaded || n < 0) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.changeSubtitlesSize(n);
				return;
			}
			this.trackFontSize=n;
			this.trackShowAgain();
		},
		/*
			当切换字幕时的动作 
		*/
		newSubtitles:function(title){
			var vArr = this.vars['cktrack'];//字幕数组
			var i = 0;
			for (i = 0; i < vArr.length; i++) {
				var v = vArr[i];
				if (v[1] == title) {
					this.subtitlesTemp=i;
					if (this.showFace) {
						this.CB['subtitles'].innerHTML = v[1];
						this.subtitleSwitch();
						this.loadTrack(i);
					}
					this.sendJS('subtitles', v);
				}
			}
		},
		/*
			内部函数
			构建清晰度按钮及切换事件(Click事件)
		*/
		definition: function() {
			if (!this.showFace || !this.ckplayerConfig['config']['definition']) {
				return;
			}
			var thisTemp = this;
			var vArr = this.VA;
			var dArr = [];
			var html = '';
			var nowD = ''; //当前的清晰度
			var i = 0;
			for (i = 0; i < vArr.length; i++) {
				var d = vArr[i][2];
				if (dArr.indexOf(d) == -1) {
					dArr.push(d);
				}
				if (this.V) {
					if (vArr[i][0] == this.V.currentSrc) {
						nowD = d;
					}
				}
			}
			if (!nowD) {
				nowD = dArr[0];
			}
			if (dArr.length > 1) {
				var zlen = 0;
				for (i = dArr.length - 1; i > -1; i--) {
					html = '<p>' + dArr[i] + '</p>' + html;
					var dlen = this.getStringLen(dArr[i]);
					if (dlen > zlen) {
						zlen = dlen;
					}
				}
				if (html) {
					html += '<p>' + nowD + '</p>';
				}
				this.CB['definition'].innerHTML = nowD;
				this.CB['definitionP'].innerHTML = html;
				this.css([this.CB['definition'], this.CB['definitionLine']], 'display', 'block');
				var pArr = this.CB['definitionP'].childNodes;
				for (var i = 0; i < pArr.length; i++) {
					var fontColor = '#FFFFFF';
					if (pArr[i].innerHTML == nowD) {
						fontColor = '#0782F5';
					}
					this.css(pArr[i], {
						color: fontColor,
						margin: '0px',
						padding: '0px',
						fontSize: '14px'
					});
					if (i < pArr.length - 1) {
						this.css(pArr[i], 'borderBottom', '1px solid #282828')
					}
					var defClick = function() {
						if (nowD != this.innerHTML) {
							thisTemp.css(thisTemp.CB['definitionP'], 'display', 'none');
							thisTemp.newDefinition(this.innerHTML);
						}
					};
					this.addListenerInside('click', defClick, pArr[i]);

				}
				var pW = (zlen * 10) + 10;
				this.css(this.CB['definitionP'], {
					width: pW + 'px'
				});
				this.css(this.CB['definition'], {
					width: pW + 'px'
				});
				this.buttonWidth['definition'] = this.CB['definition'].offsetWidth;
			} else {
				this.CB['definition'].innerHTML = '';
				this.CB['definitionP'].innerHTML = '';
				this.css([this.CB['definition'], this.CB['definitionLine']], 'display', 'none');
			}
		},
		/*
			内部函数
			注册清晰度相关事件
		*/
		addDefListener: function() {
			var thisTemp = this;
			var setTimeOutP = null;
			var defClick = function(event) {
				thisTemp.css(thisTemp.CB['definitionP'], {
					left: thisTemp.getCoor(thisTemp.CB['definition'])['x'] + 'px',
					display: 'block'
				});
			};
			this.addListenerInside('click', defClick, this.CB['definition']);
			var defMouseOut = function(event) {
				if (setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
				setTimeOutP = setTimeout(function(event) {
					thisTemp.css(thisTemp.CB['definitionP'], 'display', 'none');
				},
				500);
			};
			this.addListenerInside('mouseout', defMouseOut, thisTemp.CB['definitionP']);
			var defMouseOver = function(event) {
				if (setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
			};
			this.addListenerInside('mouseover', defMouseOver, thisTemp.CB['definitionP']);
		},
		/*
			接口函数
			提供给外部api
		*/
		changeDefinition: function(n) {
			if (!this.loaded || n < 0) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.changeDefinition(n);
				return;
			}
			if (this.VA.length > n) {
				var arr = this.VA[n];
				if (arr.length > 3) {
					var title = arr[2];
					if (title) {
						this.newDefinition(title);
					}
				}
			}
		},
		/*
			内部函数
			切换清晰度后发生的动作
		*/
		newDefinition: function(title) {
			var vArr = this.VA;
			var nVArr = [];
			var i = 0;
			for (i = 0; i < vArr.length; i++) {
				var v = vArr[i];
				if (v[2] == title) {
					nVArr.push(v);
					this.sendJS('definitionChange', i + '');
				}
			}
			if (nVArr.length < 1) {
				return;
			}
			if (this.V != null && this.needSeek == 0) {
				this.needSeek = this.V.currentTime;
			}
			if (this.getFileExt(nVArr[0][0]) != '.m3u8') {
				this.isM3u8 = false;
			}
			if (!this.isM3u8) {
				if (nVArr.length == 1) {
					this.V.innerHTML = '';
					this.V.src = nVArr[0][0];
					this.V.currentSrc = nVArr[0][0];
				} else {
					var source = '';
					nVArr = this.arrSort(nVArr);
					for (i = 0; i < nVArr.length; i++) {
						var type = '';
						var va = nVArr[i];
						if (va[1]) {
							type = ' type="' + va[1] + '"';
						}
						source += '<source src="' + va[0] + '"' + type + '>';
					}
					this.V.removeAttribute('src');
					this.V.innerHTML = source;
					this.V.currentSrc = nVArr[0][0];
				}
			} else {
				this.embedHls(vArr[0][0], this.vars['autoplay']);
			}
			this.V.autoplay = 'autoplay';
			this.V.load();
			if (this.playbackRateTemp!=1) {
				this.V.playbackRate = this.playbackRateTemp; //定义倍速
			}
			this.timerErrorFun();
		},
		/*
			内置函数
			播放hls
		*/
		embedHls: function(url, autoplay) {
			var thisTemp = this;
			thisTemp.hlsAutoPlay=autoplay;
			if (Hls.isSupported()) {
				var hls = new Hls();
				hls.loadSource(url);
				hls.attachMedia(this.V);
				hls.on(Hls.Events.MANIFEST_PARSED,
				function() {
					thisTemp.playerLoad();
					if (autoplay) {
						thisTemp.videoPlay();
					}
				});
			}
		},
		/*
			内部函数
			构建提示点
		*/
		prompt: function() {
			if (!this.showFace) {
				return;
			}
			var thisTemp = this;
			var prompt = this.vars['promptSpot'];
			if (prompt == null || this.promptArr.length > 0) {
				return;
			}
			var showPrompt = function(event) {
				if (thisTemp.promptElement == null) {
					var random2 = 'prompte' + thisTemp.randomString(5);
					var ele2 = document.createElement('div');
					ele2.className = random2;
					thisTemp.PD.appendChild(ele2);
					thisTemp.promptElement = thisTemp.getByElement(random2);
					thisTemp.css(thisTemp.promptElement, {
						overflowX: 'hidden',
						lineHeight: '22px',
						fontSize: '14px',
						color: '#FFFFFF',
						position: 'absolute',
						display: 'block',
						zIndex: '90'
					});
				}
				var pcon = thisTemp.getPromptTest();
				var pW = pcon['pW'],
				pT = pcon['pT'],
				pL = parseInt(thisTemp.css(this, 'left')) - parseInt(pW * 0.5);
				if (pcon['pL'] > 10) {
					pL = pcon['pL'];
				}
				if (pL < 0) {
					pL = 0;
				}
				thisTemp.css(thisTemp.promptElement, {
					width: pW + 'px',
					left: ( - pW - 10) + 'px',
					display: 'block'
				});
				thisTemp.promptElement.innerHTML = thisTemp.getDataset(this, 'words');
				thisTemp.css(thisTemp.promptElement, {
					left: pL + 'px',
					top: (pT - thisTemp.promptElement.offsetHeight - 10) + 'px'
				});
			};
			var hidePrompt = function(event) {
				if (thisTemp.promptElement != null) {
					thisTemp.css(thisTemp.promptElement, {
						display: 'none'
					});
				}
			};
			var i = 0;
			for (i = 0; i < prompt.length; i++) {
				var pr = prompt[i];
				var words = pr['words'];
				var time = pr['time'];
				var random = 'prompt' + this.randomString(5);
				var ele = document.createElement('div');
				ele.className = random;
				this.CB['timeBoBg'].appendChild(ele);
				var div = this.getByElement(random);
				div.setAttribute('data-time', time);
				div.setAttribute('data-words', words);
				this.css(div, {
					width: '6px',
					height: '6px',
					backgroundColor: '#FFFFFF',
					position: 'absolute',
					top: '4px',
					left: '-100px',
					display: 'none',
					zIndex: '1',
					borderRadius: '6px'
				});

				this.addListenerInside('mouseover', showPrompt, div);
				this.addListenerInside('mouseout', hidePrompt, div);
				this.promptArr.push(div);
			}
			this.changePrompt();
		},
		/*
			内部函数
			计算提示文本的位置
		*/
		getPromptTest: function() {
			var pW = this.previewWidth,
			pT = this.getCoor(this.CB['timeButton'])['y'],
			pL = 0;
			if (this.previewTop != null) {
				pT -= parseInt(this.css(this.previewTop, 'height'));
				pL = parseInt(this.css(this.previewTop, 'left'));
			} else {
				pT -= 35;
			}
			pL += 2;
			if (pL < 0) {
				pL = 0;
			}
			if (pL > this.PD.offsetWidth - pW) {
				pL = this.PD.offsetWidth - pW;
			}
			return {
				pW: pW,
				pT: pT,
				pL: pL
			};
		},
		/*
			内部函数
			删除提示点
		*/
		deletePrompt: function() {
			var arr = this.promptArr;
			if (arr.length > 0) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i]) {
						this.deleteChild(arr[i]);
					}
				}
			}
			this.promptArr = [];
		},
		/*
			内部函数
			计算提示点坐标
		*/
		changePrompt: function() {
			if (this.promptArr.length == 0) {
				return;
			}
			var arr = this.promptArr;
			var duration = this.getMetaDate()['duration'];
			var bw = this.CB['timeBoBg'].offsetWidth;
			for (var i = 0; i < arr.length; i++) {
				var time = parseInt(this.getDataset(arr[i], 'time'));
				var left = parseInt(time * bw / duration) - parseInt(arr[i].offsetWidth * 0.5);
				if (left < 0) {
					left = 0;
				}
				if (left > bw - parseInt(arr[i].offsetWidth * 0.5)) {
					left = bw - parseInt(arr[i].offsetWidth * 0.5);
				}
				this.css(arr[i], {
					left: left + 'px',
					display: 'block'
				});
			}
		},
		/*
			内部函数
			构建预览图片效果
		*/
		preview: function(obj) {
			var thisTemp = this;
			var preview = {
				file: null,
				scale: 0
			};
			preview = this.standardization(preview, this.vars['preview']);
			if (preview['file'] == null || preview['scale'] <= 0) {
				return;
			}
			var srcArr = preview['file'];
			if (this.previewStart == 0) { //如果还没有构建，则先进行构建
				this.previewStart = 1;
				if (srcArr.length > 0) {
					var i = 0;
					var imgW = 0,
					imgH = 0;
					var random = thisTemp.randomString(10);
					var loadNum = 0;
					var loadImg = function(i) {
						srcArr[i] = thisTemp.getNewUrl(srcArr[i]);
						var n = 0;
						var img = new Image();
						img.src = srcArr[i];
						img.className = random + i;
						img.onload = function(event) {
							loadNum++;
							if (thisTemp.previewDiv == null) { //如果没有建立DIV，则建
								imgW = img.width;
								imgH = img.height;
								thisTemp.previewWidth = parseInt(imgW * 0.1);
								var ele = document.createElement('div');
								ele.className = random;
								thisTemp.PD.appendChild(ele);
								thisTemp.previewDiv = thisTemp.getByElement(random);
								var eleTop = (obj['y'] - parseInt(imgH * 0.1) + 2);
								thisTemp.css(thisTemp.previewDiv, {
									width: srcArr.length * imgW * 10 + 'px',
									height: parseInt(imgH * 0.1) + 'px',
									backgroundColor: '#000000',
									position: 'absolute',
									left: '0px',
									top: eleTop + 'px',
									display: 'none',
									zIndex: '80'
								});
								ele.setAttribute('data-x', '0');
								ele.setAttribute('data-y', eleTop);
								var ele2 = document.createElement('div');
								ele2.className = random + 'd2';
								thisTemp.PD.appendChild(ele2);
								thisTemp.previewTop = thisTemp.getByElement(ele2.className);
								thisTemp.css(thisTemp.previewTop, {
									width: parseInt(imgW * 0.1) + 'px',
									height: parseInt(imgH * 0.1) + 'px',
									position: 'absolute',
									border: '5px solid ' + thisTemp.css(thisTemp.CB['timeProgress'], 'backgroundColor'),
									left: '0px',
									top: (obj['y'] - parseInt(imgH * 0.1) + 2) + 'px',
									display: 'none',
									zIndex: '81'
								});
								var html = '';
								for (n = 0; n < srcArr.length; n++) {
									html += thisTemp.newCanvas(random + n, imgW * 10, parseInt(imgH * 0.1))
								}
								thisTemp.previewDiv.innerHTML = html;
							}
							thisTemp.previewDiv.appendChild(img);
							var cimg = thisTemp.getByElement(img.className);
							var canvas = thisTemp.getByElement(img.className + '-canvas');
							var context = canvas.getContext('2d');
							var sx = 0,
							sy = 0,
							x = 0,
							h = parseInt(imgH * 0.1);
							for (n = 0; n < 100; n++) {
								x = parseInt(n * imgW * 0.1);
								context.drawImage(cimg, sx, sy, parseInt(imgW * 0.1), h, x, 0, parseInt(imgW * 0.1), h);
								sx += parseInt(imgW * 0.1);
								if (sx >= imgW) {
									sx = 0;
									sy += h;
								}
								thisTemp.css(cimg, 'display', 'none');
							}
							if (loadNum == srcArr.length) {
								thisTemp.previewStart = 2;
							} else {
								i++;
								loadImg(i);
							}
						};
					};
				}
				loadImg(i);
				return;
			}
			if (this.previewStart == 2) {
				var isTween = true;
				var nowNum = parseInt(obj['time'] / this.vars['preview']['scale']);
				var numTotal = parseInt(thisTemp.getMetaDate()['duration'] / this.vars['preview']['scale']);
				if (thisTemp.css(thisTemp.previewDiv, 'display') == 'none') {
					isTween = false;
				}
				thisTemp.css(thisTemp.previewDiv, 'display', 'block');
				var imgWidth = thisTemp.previewDiv.offsetWidth * 0.01 / srcArr.length;
				var left = (imgWidth * nowNum) - obj['x'] + parseInt(imgWidth * 0.5),
				top = obj['y'] - thisTemp.previewDiv.offsetHeight;
				thisTemp.css(thisTemp.previewDiv, 'top', top + 2 + 'px');
				var topLeft = obj['x'] - parseInt(imgWidth * 0.5);
				var timepieces = 0;
				if (topLeft < 0) {
					topLeft = 0;
					timepieces = obj['x'] - topLeft - imgWidth * 0.5;
				}
				if (topLeft > thisTemp.PD.offsetWidth - imgWidth) {
					topLeft = thisTemp.PD.offsetWidth - imgWidth;
					timepieces = obj['x'] - topLeft - imgWidth * 0.5;
				}
				if (left < 0) {
					left = 0;
				}
				if (left > numTotal * imgWidth - thisTemp.PD.offsetWidth) {
					left = numTotal * imgWidth - thisTemp.PD.offsetWidth;
				}
				thisTemp.css(thisTemp.previewTop, {
					left: topLeft + 'px',
					top: top + 2 + 'px',
					display: 'block'
				});
				if (thisTemp.previewTop.offsetHeight > thisTemp.previewDiv.offsetHeight) {
					thisTemp.css(thisTemp.previewTop, {
						height: thisTemp.previewDiv.offsetHeight - (thisTemp.previewTop.offsetHeight - thisTemp.previewDiv.offsetHeight) + 'px'
					});
				}
				if (this.previewTween != null) {
					this.animatePause(this.previewTween);
					this.previewTween = null
				}
				var nowLeft = parseInt(thisTemp.css(thisTemp.previewDiv, 'left'));
				var leftC = nowLeft + left;
				if (nowLeft == -(left + timepieces)) {
					return;
				}
				if (isTween) {
					var obj = {
						element: thisTemp.previewDiv,
						start: null,
						end: -(left + timepieces),
						speed: 0.3
					};
					this.previewTween = this.animate(obj);
				} else {
					thisTemp.css(thisTemp.previewDiv, 'left', -(left + timepieces) + 'px')
				}
			}
		},
		/*
			内部函数
			删除预览图节点
		*/
		deletePreview: function() {
			if (this.previewDiv != null) {
				this.deleteChild(this.previewDiv);
				this.previewDiv = null;
				this.previewStart = 0;
			}
		},
		/*
			内部函数
			修改视频地址，属性
		*/
		changeVideo: function() {
			if (!this.html5Video) {
				this.getVarsObject();
				this.V.newVideo(this.vars);
				return;
			}
			var vArr = this.VA;
			var v = this.vars;
			var i = 0;
			if (vArr.length < 1) {
				return;
			}
			if (this.V != null && this.needSeek == 0) {
				this.needSeek = this.V.currentTime;
			}
			if (v['poster']) {
				this.V.poster = v['poster'];
			} else {
				this.V.removeAttribute('poster');
			}
			if (v['loop']) {
				this.V.loop = 'loop';
			} else {
				this.V.removeAttribute('loop');
			}
			if (v['seek'] > 0) {
				this.needSeek = v['seek'];
			} else {
				this.needSeek = 0;
			}
			if (this.getFileExt(vArr[0][0]) != '.m3u8') {
				this.isM3u8 = false;
			}
			if (!this.isM3u8) {
				if (vArr.length == 1) {
					this.V.innerHTML = '';
					this.V.src = vArr[0][0];
				} else {
					var source = '';
					vArr = this.arrSort(vArr);
					for (i = 0; i < vArr.length; i++) {
						var type = '';
						var va = vArr[i];
						if (va[1]) {
							type = ' type="' + va[1] + '"';
						}
						source += '<source src="' + va[0] + '"' + type + '>';
					}
					this.V.removeAttribute('src');
					this.V.innerHTML = source;
				}
				//分析视频地址结束
				if (v['autoplay']) {
					this.V.autoplay = 'autoplay';
				} else {
					this.V.removeAttribute('autoplay');
				}
				this.V.load();
			} else {
				this.embedHls(vArr[0][0], v['autoplay']);
			}
			if (!this.isUndefined(v['volume'])) {
				this.changeVolume(v['volume']);
			}
			this.resetPlayer(); //重置界面元素
			this.timerErrorFun();
			//如果存在字幕则加载
			if (this.vars['cktrack']) {
				this.loadTrack();
			}
		},
		/*
			内部函数
			调整中间暂停按钮,缓冲loading，错误提示文本框的位置
		*/
		elementCoordinate: function() {
			this.pdCoor = this.getXY(this.PD);
			try {
				this.css(this.CB['pauseCenter'], {
					left: parseInt((this.PD.offsetWidth - 80) * 0.5) + 'px',
					top: parseInt((this.PD.offsetHeight - 80) * 0.5) + 'px'
				});
			} catch(event) {}
			try {
				this.css(this.CB['loading'], {
					left: parseInt((this.PD.offsetWidth - 60) * 0.5) + 'px',
					top: parseInt((this.PD.offsetHeight - 60) * 0.5) + 'px'
				});
			} catch(event) {}
			try {
				this.css(this.CB['errorText'], {
					left: parseInt((this.PD.offsetWidth - 120) * 0.5) + 'px',
					top: parseInt((this.PD.offsetHeight - 30) * 0.5) + 'px'
				});
			} catch(event) {}
			try {
				this.css(this.CB['logo'], {
					left: parseInt(this.PD.offsetWidth - this.CB['logo'].offsetWidth - 20) + 'px',
					top: '20px'
				});
			} catch(event) {}
			this.checkBarWidth();
		},
		/*
			内部函数
			当播放器尺寸变化时，显示和隐藏相关节点
		*/
		checkBarWidth: function() {
			if (!this.showFace) {
				return;
			}
			var controlBarW = this.CB['controlBar'].offsetWidth;
			var ele = [];
			ele.push([[this.CB['full'], this.CB['escFull'], this.CB['fullLine']], this.buttonWidth['full'] + 2, 'full']);
			if (this.vars['front'] != '') {
				ele.push([[this.CB['front'], this.CB['frontLine']], this.buttonWidth['front'] + 2]);
			}
			if (this.vars['next'] != '') {
				ele.push([[this.CB['next'], this.CB['nextLine']], this.buttonWidth['next'] + 2]);
			}
			if (this.CB['definition'].innerHTML != '') {
				ele.push([[this.CB['definition'], this.CB['definitionLine']], this.buttonWidth['definition'] + 2]);
			}
			if ((this.ckplayerConfig['config']['mobileVolumeBarShow'] || !this.isMobile()) && this.css(this.CB['volume'], 'display') != 'none') {
				ele.push([[this.CB['volume']], this.buttonWidth['volume']]);
				ele.push([[this.CB['mute'], this.CB['escMute'], this.CB['muteLine']], this.buttonWidth['mute'] + 2, 'mute']);
			}
			ele.push([[this.CB['timeText']], this.buttonWidth['timeText']]);
			ele.push([[this.CB['play'], this.CB['pause'], this.CB['playLine']], this.buttonWidth['play'] + 2, 'play']);

			var i = 0;
			var len = 0;
			var isc = true;
			//计算所有要显示的节点的总宽度
			for (var i = 0; i < ele.length; i++) {
				var nlen = ele[i][1];
				if (nlen > 2) {
					len += nlen;
				} else {
					isc = false;
				}
			}
			if (isc) {
				this.buttonLen = len;
				this.buttonArr = ele;
			}
			len = this.buttonLen;
			ele = this.buttonArr;
			for (var i = 0; i < ele.length; i++) {
				if (len > controlBarW) {
					len -= ele[i][1];
					this.css(ele[i][0], 'display', 'none');
				} else {
					this.css(ele[i][0], 'display', 'block');
					if (ele[i].length == 3) {
						var name = ele[i][2];
						switch (name) {
						case 'mute':
							if (this.volume == 0) {
								this.css(this.CB['mute'], 'display', 'none');
							} else {
								this.css(this.CB['escMute'], 'display', 'none');
							}
							break;
						case 'play':
							this.playShow(this.V.paused ? false: true);
							break;
						case 'full':
							if (this.full) {
								this.css(this.CB['full'], 'display', 'none');
							} else {
								this.css(this.CB['escFull'], 'display', 'none');
							}
							break;
						}
					}
				}
			}
		},
		/*
			内部函数
			初始化暂停或播放按钮
		*/
		initPlayPause: function() {
			if (!this.showFace) {
				return;
			}
			if (this.vars['autoplay']) {
				this.css([this.CB['play'], this.CB['pauseCenter']], 'display', 'none');
				this.css(this.CB['pause'], 'display', 'block');
			} else {
				this.css(this.CB['play'], 'display', 'block');
				if (this.css(this.CB['errorText'], 'display') == 'none') {
					this.css(this.CB['pauseCenter'], 'display', 'block');
				}
				this.css(this.CB['pause'], 'display', 'none');
			}
		},

		/*
			下面为监听事件
			内部函数
			监听元数据已加载
		*/
		loadedHandler: function() {
			this.loaded = true;
			if (this.vars['loaded'] != '') {
				try {
					eval(this.vars['loaded'] + '()');
				} catch(event) {
					this.log(event);
				}
			}
		},
		/*
			内部函数
			监听播放
		*/
		playingHandler: function() {
			this.playShow(true);
			//如果是第一次播放
			if (this.isFirstTimePlay && !this.isUndefined(this.advertisements['front'])) {
				this.isFirstTimePlay = false;
				//调用播放前置广告组件
				this.adI = 0;
				this.adType = 'front';
				this.adMuteInto();
				this.adIsVideoTime = true;
				this.adPlayStart = true;
				this.adVideoPlay = false;
				this.videoPause();
				this.advertisementsTime();
				this.advertisementsPlay();
				this.adSkipButtonShow();
				//调用播放前置广告组件结束
				return;
			}
			if (this.adPlayerPlay) {
				return;
			}
			//判断第一次播放结束
			if (this.needSeek > 0) {
				this.videoSeek(this.needSeek);
				this.needSeek = 0;
			}
			if (this.animatePauseArray.length > 0) {
				this.animateResume('pause');
			}
			if (this.playerType == 'html5video' && this.V != null && this.config['videoDrawImage']) {
				this.sendVCanvas();
			}
			if (!this.isUndefined(this.advertisements['pause']) && !this.adPlayStart) { //如果存在暂停广告
				this.adPauseCloseFunction();
			}
		},
		/*暂停时播放暂停广告*/
		adPausePlayer: function() {
			this.adI = 0;
			this.adType = 'pause';
			this.adPauseShow = true;
			this.loadAdPause();
		},
		loadAdPause: function() {
			var ad = this.getNowAdvertisements();
			var type = ad['type'];
			var thisTemp = this;
			var width = this.PD.offsetWidth,
			height = this.PD.offsetHeight;
			if (this.isStrImage(type) && this.adPauseShow) {
				this.css(this.CB['adElement'], 'display', 'block');
				var imgClass = 'adimg' + this.randomString(10);
				var imgHtml = '<img src="' + ad['file'] + '" class="' + imgClass + '">';
				if (ad['link']) {
					imgHtml = '<a href="' + ad['link'] + '" target="_blank">' + imgHtml + '</a>';
				}
				this.CB['adElement'].innerHTML = imgHtml;
				this.addListenerInside('load',
				function() {
					var imgObj = new Image();
					imgObj.src = this.src;
					var imgWH = thisTemp.adjustmentWH(imgObj.width, imgObj.height);
					thisTemp.css([thisTemp.getByElement(imgClass), thisTemp.CB['adElement']], {
						width: imgWH['width'] + 'px',
						height: imgWH['height'] + 'px',
						border: '0px'
					});
					if (thisTemp.ckplayerConfig['style']['advertisement']['closeButtonShow'] && thisTemp.adPauseShow) {
						thisTemp.css(thisTemp.CB['adPauseClose'], {
							display: 'block'
						});
					}
					thisTemp.ajaxSuccessNull(ad['exhibitionMonitor']);
					thisTemp.adPauseCoor();
				},
				this.getByElement(imgClass));
				this.addListenerInside('click',
				function() {
					thisTemp.ajaxSuccessNull(ad['clickMonitor']);
				},
				this.CB['adElement']);
				var newI = this.adI;
				if (this.adI < this.advertisements['pause'].length - 1) {
					newI++;
				} else {
					newI = 0;
				}
				if (ad['time'] > 0) {
					setTimeout(function() {
						if (thisTemp.adPauseShow) {
							thisTemp.adI = newI;
							thisTemp.loadAdPause();
						}
					},
					ad['time'] * 1000);
				}
			}
		},
		/*调整暂停广告的位置*/
		adPauseCoor: function() {
			if (this.css(this.CB['adElement'], 'display') == 'block') {
				var w = this.CB['adElement'].offsetWidth,
				h = this.CB['adElement'].offsetHeight;
				var pw = this.PD.offsetWidth,
				ph = this.PD.offsetHeight;
				this.css(this.CB['adElement'], {
					top: (ph - h) * 0.5 + 'px',
					left: (pw - w) * 0.5 + 'px'
				});
				if (this.css(this.CB['adPauseClose'], 'display') == 'block') {
					this.css(this.CB['adPauseClose'], {
						top: (ph - h) * 0.5 - 10 + 'px',
						left: (pw - w) * 0.5 + w - 10 + 'px'
					});
				}
			}
		},
		/*
			关闭暂停广告
		*/
		adPauseCloseFunction: function() {
			this.CB['adElement'].innerHTML = '';
			this.css([this.CB['adElement'], this.CB['adPauseClose']], 'display', 'none');
			this.adPauseShow = false;
		},
		/*计算广告时间*/
		advertisementsTime: function(nt) {
			if (this.isUndefined(nt)) {
				nt = 0;
			}
			var ad = this.advertisements[this.adType];
			if (nt > 0) {
				ad[this.adI]['time'] = Math.ceil(nt);
			}
			this.adTimeAllTotal = 0;
			for (var i = this.adI; i < ad.length; i++) {
				if (!this.isUndefined(ad[i]['time'])) {
					this.adTimeAllTotal += Math.ceil(ad[i]['time']);
				}
			}
			if (this.adTimeAllTotal > 0) {
				this.CB['adTime'].innerHTML = this.language['adTime'].replace('{$second}', this.adTimeAllTotal > 9 ? this.adTimeAllTotal: '0' + this.adTimeAllTotal);
			}
			if (this.adPauseShow) {
				this.adPauseCloseFunction();
			}
			this.adOtherCloseAll();
			this.adTimeTotal = -1;
		},
		/*判断是否需要显示跳过广告按钮*/
		adSkipButtonShow: function() {
			var thisTemp = this;
			var skipConfig = this.ckplayerConfig['style']['advertisement'];
			var delayTimeTemp = skipConfig[this.adType + 'SkipButtonDelay'];
			var timeFun = function() {
				if (delayTimeTemp >= 0) {
					thisTemp.CB['adSkip'].innerHTML = thisTemp.language['skipAdTime'].replace('{$second}', delayTimeTemp > 9 ? delayTimeTemp: '0' + delayTimeTemp);
					setTimeout(timeFun, 1000);
				} else {
					thisTemp.CB['adSkip'].innerHTML = thisTemp.language['skipAd'];
				}
				delayTimeTemp--;
			};
			if (skipConfig['skipButtonShow']) {
				this.css(thisTemp.CB['adSkip'], 'display', 'block');
				if (skipConfig[this.adType + 'SkipButtonDelay'] > 0 && this.isUndefined(this.adSkipButtonTime)) {
					timeFun();
				} else {
					thisTemp.css(thisTemp.CB['adSkip'], 'display', 'block');
					thisTemp.CB['adSkip'].innerHTML = this.language['skipAd'];
				}
			}
		},
		/*播放广告*/
		advertisementsPlay: function() {
			this.css([this.CB['adBackground'], this.CB['adElement'], this.CB['adBar'], this.CB['adLink']], 'display', 'none');
			this.adPlayerPlay = false;
			var ad = this.advertisements[this.adType];
			if (this.adI == 0 && (this.adType == 'front' || this.adType == 'insert' || this.adType == 'end')) {
				this.sendJS('process', this.adType + ' ad play')
			}
			this.trackHide();
			if (this.adI < ad.length) {
				if (!this.isUndefined(ad[this.adI]['time'])) {
					this.adTimeTotal = parseInt(ad[this.adI]['time']);
				}
				this.loadAdvertisements();
			} else {
				this.adEnded();
			}
		},
		/*清除当前所有广告*/
		eliminateAd: function() {
			if (this.adType) {
				var ad = this.advertisements[this.adType];
				this.adI = ad.length;
				this.advertisementsPlay();
			}

		},
		/*广告播放结束*/
		adEnded: function() {
			var thisTemp = this;
			this.adPlayStart = false;
			this.adPlayerPlay = false;
			if (this.adVideoPlay) {
				if (this.videoTemp['src'] != '') {
					this.V.src = this.videoTemp['src'];
				} else {
					if (this.V.src) {
						this.V.removeAttribute('src');
					}
				}
				if (this.videoTemp['source'] != '') {
					this.V.innerHTML = this.videoTemp['source'];
				}
				if (this.videoTemp['currentSrc'] != '') {
					this.V.src = this.videoTemp['currentSrc'];
					this.V.currentSrc = this.videoTemp['currentSrc'];
				}
				if (this.videoTemp['loop']) {
					this.V.loop = true;
					this.videoTemp['loop'] = false;
				}
				if (this.adType == 'end') {
					this.endedHandler();
				} else {
					this.videoPlay();
				}
			} else {
				this.videoPlay();
			}
			this.changeVolume(this.vars['volume']);
			this.sendJS('process', this.adType + ' ad ended');
			this.changeControlBarShow(true);
		},
		/*加载广告*/
		loadAdvertisements: function() {
			//this.videoTemp
			var ad = this.getNowAdvertisements();
			var type = ad['type'];
			var thisTemp = this;
			var width = this.PD.offsetWidth,
			height = this.PD.offsetHeight;
			this.changeControlBarShow(false);
			this.adPlayerPlay = true;
			if (this.isStrImage(type)) {
				this.css([this.CB['adBackground'], this.CB['adElement'], this.CB['adBar']], 'display', 'block');
				this.css([this.CB['adMute'], this.CB['adEscMute']], 'display', 'none');
				var imgClass = 'adimg' + this.randomString(10);
				var imgHtml = '<img src="' + ad['file'] + '" class="' + imgClass + '">';
				if (ad['link']) {
					imgHtml = '<a href="' + ad['link'] + '" target="_blank">' + imgHtml + '</a>';
				}
				this.CB['adElement'].innerHTML = imgHtml;
				this.addListenerInside('load',
				function() {
					var imgObj = new Image();
					imgObj.src = this.src;
					var imgWH = thisTemp.adjustmentWH(imgObj.width, imgObj.height);
					thisTemp.css(thisTemp.getByElement(imgClass), {
						width: imgWH['width'] + 'px',
						height: imgWH['height'] + 'px',
						border: '0px'
					});
					thisTemp.css(thisTemp.CB['adElement'], {
						width: imgWH['width'] + 'px',
						height: imgWH['height'] + 'px',
						top: (height - imgWH['height']) * 0.5 + 'px',
						left: (width - imgWH['width']) * 0.5 + 'px'
					});
					thisTemp.ajaxSuccessNull(ad['exhibitionMonitor']);
				},
				this.getByElement(imgClass));
				this.addListenerInside('click',
				function() {
					thisTemp.ajaxSuccessNull(ad['clickMonitor']);
				},
				this.CB['adElement']);
				if (!this.isUndefined(ad['time'])) {
					this.adCountDown();
				}
			} else {
				this.css(this.CB['adBar'], 'display', 'block');
				//判断是否静音
				if (this.adVideoMute) {
					this.css(this.CB['adEscMute'], 'display', 'block');
					this.css(this.CB['adMute'], 'display', 'none');
				} else {
					this.css(this.CB['adEscMute'], 'display', 'none');
					this.css(this.CB['adMute'], 'display', 'block');
				}
				this.CB['adElement'].innerHTML = '';
				if (this.videoTemp['currentSrc'] == '') {
					this.videoTemp['currentSrc'] = this.getCurrentSrc();
				}
				if (this.V.loop) {
					this.videoTemp['loop'] = true;
					this.V.loop = false;
				}
				if (this.V != null && this.V.currentTime > 0 && this.adIsVideoTime) { //当有视频广告时而又没有记录下已播放的时间则进行记录
					this.adIsVideoTime = false;
					this.needSeek = this.V.currentTime;
				}
				this.V.src = ad['file'];
				this.V.currentSrc = ad['file'];
				this.V.innerHTML = '';
				this.V.play();
				this.adVideoPlay = true;
				this.ajaxSuccessNull(ad['exhibitionMonitor']);
				if (!this.adVideoMute) {
					this.adEscMuteFunction();
				}
			}
			if (ad['link']) {
				this.css(this.CB['adLink'], 'display', 'block');
				var link = '<a href="' + ad['link'] + '" target="_blank" class="ckadmorelink">' + this.language['adLink'] + '</a>';
				this.CB['adLink'].innerHTML = link;
				this.css(this.getByElement('ckadmorelink'), {
					color: '#FFFFFF',
					textDecoration: 'none'
				});
				this.addListenerInside('click',
				function() {
					thisTemp.ajaxSuccessNull(ad['clickMonitor']);
				},
				this.CB['adLink']);
			} else {
				this.css(this.CB['adLink'], 'display', 'none');
			}

		},
		/*普通广告倒计时*/
		adCountDown: function() {
			var thisTemp = this;
			if (this.adTimeTotal > 0) {
				if (!this.adIsPause) {
					this.adTimeTotal--;
					this.showAdTime();
					this.adCountDownObj = null;
					this.adCountDownObj = setTimeout(function() {
						thisTemp.adCountDown();
					},
					1000);
				}
			} else {
				this.adI++;
				this.advertisementsPlay();
			}
		},
		/*视频广告倒计时*/
		adPlayerTimeHandler: function(time) {
			var ad = this.getNowAdvertisements();
			var type = ad['type'];
			if (this.isStrImage(type)) {
				return;
			}
			if (this.adTimeTotal != parseInt(time)) {
				this.adTimeTotal = parseInt(time);
				this.showAdTime();
			}
		},
		/*格式化广告倒计时显示*/
		showAdTime: function() {
			this.adTimeAllTotal--;
			var n = this.adTimeAllTotal;
			if (n < 0) {
				n = 0;
			}
			this.CB['adTime'].innerHTML = this.language['adTime'].replace('{$second}', n < 10 ? '0' + n: n);
		},
		/*
			单独监听其它广告
		*/
		checkAdOther: function(t) {
			if (this.adPlayerPlay) {
				return;
			}
			var adTime = this.advertisements['othertime'];
			var adPlay = this.advertisements['otherPlay'];
			for (var i = 0; i < adTime.length; i++) {
				if (t >= adTime[i] && !adPlay[i]) { //如果播放时间大于广告时间而该广告还没有播放，则开始播放
					adPlay[i] = true;
					this.newAdOther(i);
				}
			}
		},
		/*
			新建其它广告 
		*/
		newAdOther: function(i) {
			var thisTemp = this;
			var ad = this.advertisements['other'][i];
			var randomS = this.randomString(10); //获取一个随机字符串
			var adDivID = 'adother' + randomS; //广告容器
			imgClassName = 'adimgother' + randomS;
			var adDiv = document.createElement('div');
			adDiv.className = adDivID;
			this.PD.appendChild(adDiv);
			ad['div'] = adDivID;
			ad['element'] = imgClassName;
			var adHtml='<img src="' + ad['file'] + '" class="' + imgClassName + '">';
			if(ad['link']){
				adHtml='<a href="' + ad['link'] + '" target="blank">'+adHtml+'</a>';
			}
			this.getByElement(adDivID).innerHTML =adHtml;
			this.css(adDivID, {
				position: 'absolute',
				overflow: 'hidden',
				zIndex: '996',
				top: '60px',
				left: '30px',
				cursor: 'pointer'
			});
			if (this.ckplayerConfig['style']['advertisement']['closeOtherButtonShow']) {
				var closeAdDivID = 'adotherclose' + randomS; //广告容器
				var closeAdDiv = document.createElement('div');
				closeAdDiv.className = closeAdDivID;
				this.PD.appendChild(closeAdDiv);
				this.getByElement(closeAdDivID).innerHTML = this.newCanvas(closeAdDivID, 20, 20);
				ad['closeDiv'] = closeAdDivID;
				ad['close'] = false;
				this.css(closeAdDivID, {
					backgroundColor: '#f7f7f7',
					//f8f7f7
					widht: '20px',
					height: '20px',
					position: 'absolute',
					overflow: 'hidden',
					zIndex: '997',
					top: '60px',
					left: '30px',
					borderRadius: '20px',
					cursor: 'pointer'
				});
				var adOtherClose = this.getByElement(closeAdDivID + '-canvas').getContext('2d');
				var adOtherCloseFillRect = function() {
					thisTemp.canvasFill(adOtherClose, [[4, 6], [6, 6], [16, 15], [14, 15]]);
					thisTemp.canvasFill(adOtherClose, [[14, 6], [16, 6], [6, 15], [4, 15]]);
				};
				adOtherClose.fillStyle = '#404856';
				adOtherCloseFillRect();
				var adOtherCloseOver = function() {
					adOtherClose.clearRect(0, 0, 20, 20);
					adOtherClose.fillStyle = '#0782F5';
					adOtherCloseFillRect();
				};
				var adOtherCloseOut = function() {
					adOtherClose.clearRect(0, 0, 20, 20);
					adOtherClose.fillStyle = '#404856';
					adOtherCloseFillRect();
				};
				this.addListenerInside('mouseover', adOtherCloseOver, this.getByElement(closeAdDivID + '-canvas'));
				this.addListenerInside('mouseout', adOtherCloseOut, this.getByElement(closeAdDivID + '-canvas'));
			}
			this.addListenerInside('load',
			function() {
				var imgObj = new Image();
				imgObj.src = this.src;
				var imgWH = thisTemp.adjustmentWH(imgObj.width, imgObj.height);
				thisTemp.css([thisTemp.getByElement(imgClassName), thisTemp.getByElement(adDivID)], {
					width: imgWH['width'] + 'px',
					height: imgWH['height'] + 'px',
					border: '0px'
				});
				thisTemp.advertisements['other'][i] = ad;
				thisTemp.ajaxSuccessNull(ad['exhibitionMonitor']);
				thisTemp.adOtherCoor();
			},
			this.getByElement(imgClassName));
			this.addListenerInside('click',
			function() {
				thisTemp.adOtherClose(i);
			},
			this.getByElement(closeAdDivID));
			this.addListenerInside('click',
			function() {
				thisTemp.ajaxSuccessNull(ad['clickMonitor']);
			},
			this.getByElement(imgClassName));
			if (ad['time'] > 0) {
				setTimeout(function() {
					thisTemp.adOtherClose(i);
				},
				ad['time'] * 1000);
			}
		},
		/*
		关闭其它广告
		*/
		adOtherClose: function(i) {
			var ad = this.advertisements['other'][i];
			if (!this.isUndefined(ad['close'])) {
				if (!ad['close']) {
					ad['close'] = true;
					this.PD.removeChild(this.getByElement(ad['div']));
					this.PD.removeChild(this.getByElement(ad['closeDiv']));
				}
			}
		},
		adOtherCloseAll: function() {
			if (!this.isUndefined(this.advertisements['other'])) {
				var ad = this.advertisements['other'];
				for (var i = 0; i < ad.length; i++) {
					this.adOtherClose(i);
				}
			}
		},
		/*
			计算其它广告的坐标
		*/
		adOtherCoor: function() {
			if (!this.isUndefined(this.advertisements['other'])) {
				var arr = this.advertisements['other'];
				for (var i = 0; i < arr.length; i++) {
					var ad = arr[i];
					if (!this.isUndefined(ad['close'])) {
						if (!ad['close']) {
							var coor = this.getPosition(ad);
							var x = coor['x'],
							y = coor['y'],
							cx = x + this.getByElement(ad['div']).offsetWidth - 10,
							cy = y - 10;
							this.css(this.getByElement(ad['div']), {
								left: x + 'px',
								top: y + 'px'
							});
							if (!this.isUndefined(ad['closeDiv'])) {
								this.css(this.getByElement(ad['closeDiv']), {
									left: cx + 'px',
									top: cy + 'px'
								});
							}
						}
					}
				}
			}
		},
		/*
			单独监听中间插入广告
		*/
		checkAdInsert: function(t) {
			if (this.adPlayerPlay) {
				return;
			}
			var adTime = this.advertisements['inserttime'];
			var adPlay = this.advertisements['insertPlay'];
			var duration = this.getMetaDate()['duration'];
			for (var i = adTime.length - 1; i > -1; i--) {
				if (t >= adTime[i] && t < duration - 2 && t > 1 && !adPlay[i]) { //如果播放时间大于广告时间而该广告还没有播放，则开始播放
					this.adI = 0;
					this.adType = 'insert';
					this.adMuteInto();
					this.adIsVideoTime = true;
					this.adPlayStart = true;
					this.adVideoPlay = false;
					this.videoPause();
					this.advertisementsTime();
					this.advertisementsPlay();
					this.adSkipButtonShow();
					adPlay[i] = true;
					for (var n = 0; n < i + 1; n++) {
						adPlay[n] = true;
					}
					break;
				}
			}
		},
		/*格式化中间插入广告的播放时间*/
		formatInserttime: function(duration) {
			if (!this.isUndefined(this.advertisements['inserttime'])) {
				var arr = this.advertisements['inserttime'];
				var newArr = [];
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].toString().substr( - 1) == '%') {
						newArr.push(parseInt(duration * parseInt(arr[i]) * 0.01));
					} else {
						newArr.push(parseInt(arr[i]));
					}
				}
				this.advertisements['inserttime'] = newArr;
			}
		},
		/*获取当前的广告*/
		getNowAdvertisements: function() {
			if (this.adI == -1) {
				return {
					file: '',
					time: 0,
					link: ''
				};
			}
			return this.advertisements[this.adType][this.adI];
		},
		/*根据元件尺寸和播放器尺寸调整大小*/
		adjustmentWH: function(w, h) {
			var width = this.PD.offsetWidth,
			height = this.PD.offsetHeight;
			var nw = 0,
			nh = 0;
			if (w >= width || h >= height) {
				if (width / w > height / h) {
					nh = height - 20;
					nw = w * nh / h;
				} else {
					nw = width - 20;
					nh = h * nw / w;
				}
			} else {
				nw = w;
				nh = h;
			}
			return {
				width: nw,
				height: nh
			}
		},
		/*单独请求一次地址，但不处理返回的数据*/
		ajaxSuccessNull: function(url) {
			if (!this.isUndefined(url)) {
				var ajaxObj = {
					url: url,
					success: function(data) {}
				};
				this.ajax(ajaxObj);
			}
		},
		/*
			内部函数
			运行指定函数
		*/
		runFunction: function(s) {
			try {
				var arr = s.split('->');
				switch (arr[0]) {
				case 'javaScript':
					eval(arr[1] + '()');
					break;
				case 'actionScript':
					eval('this.' + arr[1] + '()');
					break;
				}
			} catch(event) {}
		},
		/*
			内部函数
			使用画布附加视频
		*/
		sendVCanvas: function() {
			if (this.timerVCanvas == null) {
				this.css(this.V, 'display', 'none');
				this.css(this.MD, 'display', 'block');
				var thisTemp = this;
				var videoCanvas = function() {
					if (thisTemp.MDCX.width != thisTemp.PD.offsetWidth) {
						thisTemp.MDC.width = thisTemp.PD.offsetWidth;
					}
					if (thisTemp.MDCX.height != thisTemp.PD.offsetHeight) {
						thisTemp.MDC.height = thisTemp.PD.offsetHeight;
					}
					thisTemp.MDCX.clearRect(0, 0, thisTemp.MDCX.width, thisTemp.MDCX.height);
					var coor = thisTemp.getProportionCoor(thisTemp.PD.offsetWidth, thisTemp.PD.offsetHeight, thisTemp.V.videoWidth, thisTemp.V.videoHeight);
					thisTemp.MDCX.drawImage(thisTemp.V, 0, 0, thisTemp.V.videoWidth, thisTemp.V.videoHeight, coor['x'], coor['y'], coor['width'], coor['height']);
				};
				this.timerVCanvas = new this.timer(0, videoCanvas);
			}
		},
		/*
			内部函数
			监听暂停
		*/
		pauseHandler: function() {
			var thisTemp = this;
			this.playShow(false);
			if (this.animatePauseArray.length > 0) {
				this.animatePause('pause');
			}
			if (this.playerType == 'html5video' && this.V != null && this.config['videoDrawImage']) {
				this.stopVCanvas();
			}
			if (!this.isUndefined(this.advertisements['pause']) && !this.adPlayStart && !this.adPauseShow) { //如果存在暂停广告
				setTimeout(function() {
					if (!thisTemp.isUndefined(thisTemp.advertisements['pause']) && !thisTemp.adPlayStart && !thisTemp.adPauseShow && thisTemp.time > 1) { //如果存在暂停广告
						thisTemp.adPausePlayer();
					}
				},
				300);
			}
		},
		/*
			内部函数
			停止画布
		*/
		stopVCanvas: function() {
			if (this.timerVCanvas != null) {
				this.css(this.V, 'display', 'block');
				this.css(this.MD, 'display', 'none');
				if (this.timerVCanvas.runing) {
					this.timerVCanvas.stop();
				}
				this.timerVCanvas = null;
			}
		},
		/*
			内部函数
			根据当前播放还是暂停确认图标显示
		*/
		playShow: function(b) {
			if (!this.showFace) {
				return;
			}
			if (b) {
				this.css(this.CB['play'], 'display', 'none');
				this.css(this.CB['pauseCenter'], 'display', 'none');
				this.css(this.CB['pause'], 'display', 'block');
			} else {
				this.css(this.CB['play'], 'display', 'block');
				if (this.css(this.CB['errorText'], 'display') == 'none') {
					if (!this.adPlayerPlay) {
						this.css(this.CB['pauseCenter'], 'display', 'block');
					}

				} else {
					this.css(this.CB['pauseCenter'], 'display', 'none');
				}
				this.css(this.CB['pause'], 'display', 'none');
			}
		},
		/*
			内部函数
			监听seek结束
		*/
		seekedHandler: function() {
			this.resetTrack();
			this.isTimeButtonMove = true;
			if (this.V.paused) {
				if(this.hlsAutoPlay){
					this.videoPlay();
				}
				else{
					this.hlsAutoPlay=true;
				}
			}
		},
		/*
			内部函数
			监听播放结束
		*/
		endedHandler: function() {
			if (this.adPlayerPlay) {
				this.adI++;
				this.advertisementsPlay();
				return;
			}
			if (!this.endAdPlay && !this.isUndefined(this.advertisements['end'])) {
				this.endAdPlay = true;
				this.adI = 0;
				this.adType = 'end';
				this.adMuteInto();
				this.adIsVideoTime = true;
				this.adPlayStart = true;
				this.adVideoPlay = false;
				this.videoPause();
				this.advertisementsTime();
				this.advertisementsPlay();
				this.adSkipButtonShow();
				this.adReset = true;
				return;
			}
			this.sendJS('ended');
			this.endedAdReset();
			if (this.vars['loop']) {
				this.videoSeek(0);
			}
		},
		/*
			重置结束后相关的设置
		*/
		endedAdReset: function() {
			var arr = [];
			var i = 0;
			if (!this.isUndefined(this.advertisements['insertPlay'])) {
				arr = this.advertisements['insertPlay'];
				for (i = 0; i < arr.length; i++) {
					this.advertisements['insertPlay'][i] = false;
				}
			}
			if (!this.isUndefined(this.advertisements['otherPlay'])) {
				arr = this.advertisements['otherPlay'];
				for (i = 0; i < arr.length; i++) {
					this.advertisements['otherPlay'][i] = false;
				}
			}
			//this.endAdPlay=false;
		},
		/*
			内部函数
			监听音量改变
		*/
		volumechangeHandler: function() {
			if (!this.showFace) {
				return;
			}
			if ((this.ckplayerConfig['config']['mobileVolumeBarShow'] || !this.isMobile()) && this.css(this.CB['volume'], 'display') != 'none') {
				try {
					var volume=this.volume || this.V.volume;
					if (volume > 0) {
						this.css(this.CB['mute'], 'display', 'block');
						this.css(this.CB['escMute'], 'display', 'none');
					} else {
						this.css(this.CB['mute'], 'display', 'none');
						this.css(this.CB['escMute'], 'display', 'block');
					}
				} catch(event) {}
			}
		},
		/*
			内部函数
			监听播放时间调节进度条
		*/
		timeUpdateHandler: function() {
			var duration = 0;
			if (this.playerType == 'html5video') {
				try {
					duration = this.V.duration;
				} catch(event) {}
			}
			if (isNaN(duration) || parseInt(duration) < 0.2) {
				duration = this.vars['duration'];
			}
			if(this.vars['forceduration']>0){
				duration=this.vars['forceduration'];
			}
			if (duration > 0) {
				this.time = this.V.currentTime;
				this.timeTextHandler();
				this.trackShowHandler();
				if (this.isTimeButtonMove) {
					this.timeProgress(this.time, duration);
				}
			}
		},
		/*
			内部函数
			按时间改变进度条
		*/
		timeProgress: function(time, duration) {
			if (!this.showFace) {
				return;
			}
			var timeProgressBgW = this.CB['timeProgressBg'].offsetWidth;
			var timeBOW = parseInt((time * timeProgressBgW / duration) - (this.CB['timeButton'].offsetWidth * 0.5));
			if (timeBOW > timeProgressBgW - this.CB['timeButton'].offsetWidth) {
				timeBOW = timeProgressBgW - this.CB['timeButton'].offsetWidth;
			}
			if (timeBOW < 0) {
				timeBOW = 0;
			}
			this.css(this.CB['timeProgress'], 'width', timeBOW + 'px');
			this.css(this.CB['timeButton'], 'left', parseInt(timeBOW) + 'px');
		},
		/*
			内部函数
			监听播放时间改变时间显示文本框
		*/
		timeTextHandler: function() { //显示时间/总时间
			if (!this.showFace) {
				return;
			}
			var duration = this.V.duration;
			var time = this.V.currentTime;
			if (isNaN(duration) || parseInt(duration) < 0.2) {
				duration = this.vars['duration'];
			}
			if(this.vars['forceduration']>0){
				duration=this.vars['forceduration'];
			}
			this.CB['timeText'].innerHTML = this.formatTime(time) + ' / ' + this.formatTime(duration);
			if (this.CB['timeText'].offsetWidth > 0) {
				this.buttonWidth['timeText'] = this.CB['timeText'].offsetWidth;
			}
		},
		/*
			内部函数
			监听是否是缓冲状态
		*/
		bufferEdHandler: function() {
			if (!this.showFace || this.playerType == 'flashplayer') {
				return;
			}
			var thisTemp = this;
			var clearTimerBuffer = function() {
				if (thisTemp.timerBuffer != null) {
					if (thisTemp.timerBuffer.runing) {
						thisTemp.sendJS('buffer', 100);
						thisTemp.timerBuffer.stop();
					}
					thisTemp.timerBuffer = null;
				}
			};
			clearTimerBuffer();
			var bufferFun = function() {
				if (!thisTemp.isUndefined(thisTemp.V) && thisTemp.V.buffered.length > 0) {
					var duration = thisTemp.V.duration;
					var len = thisTemp.V.buffered.length;
					var bufferStart = thisTemp.V.buffered.start(len - 1);
					var bufferEnd = thisTemp.V.buffered.end(len - 1);
					var loadTime = bufferStart + bufferEnd;
					var loadProgressBgW = thisTemp.CB['timeProgressBg'].offsetWidth;
					var timeButtonW = thisTemp.CB['timeButton'].offsetWidth;
					var loadW = parseInt((loadTime * loadProgressBgW / duration) + timeButtonW);
					if (loadW >= loadProgressBgW) {
						loadW = loadProgressBgW;
						clearTimerBuffer();
					}
					thisTemp.changeLoad(loadTime);
				}
			};
			this.timerBuffer = new this.timer(200, bufferFun);
		},
		/*
			内部函数
			单独计算加载进度
		*/
		changeLoad: function(loadTime) {
			if (this.V == null) {
				return;
			}
			if (!this.showFace) {
				return;
			}
			var loadProgressBgW = this.CB['timeProgressBg'].offsetWidth;
			var timeButtonW = this.CB['timeButton'].offsetWidth;
			var duration = this.V.duration;
			if (isNaN(duration) || parseInt(duration) < 0.2) {
				duration = this.vars['duration'];
			}
			if(this.vars['forceduration']>0){
				duration=this.vars['forceduration'];
			}
			if (this.isUndefined(loadTime)) {
				loadTime = this.loadTime;
			} else {
				this.loadTime = loadTime;
			}
			var loadW = parseInt((loadTime * loadProgressBgW / duration) + timeButtonW);
			this.css(this.CB['loadProgress'], 'width', loadW + 'px');
			this.sendJS('loadTime',loadTime);
			this.loadTimeTemp=loadTime;
		},
		/*
			内部函数
			判断是否是直播
		*/
		judgeIsLive: function() {
			var thisTemp = this;
			if (this.timerError != null) {
				if (this.timerError.runing) {
					this.timerError.stop();
				}
				this.timerError = null;
			}
			this.error = false;
			if (this.showFace) {
				this.css(this.CB['errorText'], 'display', 'none');
			}
			var timeupdate = function(event) {
				thisTemp.timeUpdateHandler();
			};
			if (!this.vars['live']) {
				if (this.V != null && this.playerType == 'html5video') {
					this.addListenerInside('timeupdate', timeupdate);
					thisTemp.timeTextHandler();
					thisTemp.prompt(); //添加提示点
					setTimeout(function() {
						thisTemp.bufferEdHandler();
					},
					200);
				}
			} else {
				this.removeListenerInside('timeupdate', timeupdate);
				if (this.timerTime != null) {
					window.clearInterval(this.timerTime);
					timerTime = null;
				}
				if (this.timerTime != null) {
					if (this.timerTime.runing) {
						this.timerTime.stop();
					}
					this.timerTime = null;
				}
				var timeFun = function() {
					if (thisTemp.V != null && !thisTemp.V.paused && thisTemp.showFace) {
						thisTemp.CB['timeText'].innerHTML = thisTemp.getNowDate();
					}
				};
				this.timerTime = new this.timer(1000, timeFun);
				//timerTime.start();
			}
			this.definition();
		},
		/*
			内部函数
			加载字幕
		*/
		loadTrack: function(def) {
			if (this.playerType == 'flashplayer' || this.vars['flashplayer'] == true) {
				return;
			}
			if(this.isUndefined(def)){
				def=-1;
			}
			var track = this.vars['cktrack'];
			var loadTrackUrl='';
			var type=this.typeString(track);
			var thisTemp = this;
			if(type=='array'){
				if(def==-1){
					var index=0;
					var indexN=0;
					for(var i=0;i<track.length;i++){
						var li=track[i];
						if(li.length==3 && li[2]>indexN){
							indexN=li[2];
							index=i;
						}
					}
				}
				else{
					index=def;
				}
				loadTrackUrl=track[index][0];
			}
			else{
				loadTrackUrl=track;
			}
			var obj = {
				method: 'get',
				dataType: 'text',
				url: loadTrackUrl,
				charset: 'utf-8',
				success: function(data) {
					//console.log(data);
					if(data){
						thisTemp.track = thisTemp.parseSrtSubtitles(data);
						thisTemp.trackIndex = 0;
						thisTemp.nowTrackShow = {
							sn: ''
						}
					}
					
				}
			};
			this.ajax(obj);
		},
		/*
			内部函数
			重置字幕
		*/
		resetTrack: function() {
			this.trackIndex = 0;
			this.nowTrackShow = {
				sn: ''
			};
		},
		/*
			内部函数
			根据时间改变读取显示字幕
		*/
		trackShowHandler: function() {
			if (!this.showFace || this.adPlayerPlay) {
				return;
			}
			if (this.track.length < 1) {
				return;
			}
			if (this.trackIndex >= this.track.length) {
				this.trackIndex = 0;
			}
			var nowTrack = this.track[this.trackIndex]; //当前编号对应的字幕内容
			/*
				this.nowTrackShow=当前显示在界面上的内容
				如果当前时间正好在nowTrack时间内，则需要判断
			*/
			if (this.time >= nowTrack['startTime'] && this.time <= nowTrack['endTime']) {
				/*
				 	如果当前显示的内容不等于当前需要显示的内容时，则需要显示正确的内容
				*/
				var nowShow = this.nowTrackShow;
				if (nowShow['sn'] != nowTrack['sn']) {
					this.trackHide();
					this.trackShow(nowTrack);
					this.nowTrackTemp=nowTrack;
				}
			} else {
				/*
				 * 如果当前播放时间不在当前编号字幕内，则需要先清空当前的字幕内容，再显示新的字幕内容
				 */
				this.trackHide();
				this.checkTrack();
			}
		},
		trackShowAgain:function(){
			this.trackHide();
			this.trackShow(this.nowTrackTemp);
		},
		/*
			内部函数
			显示字幕内容
		*/
		trackShow: function(track) {
			this.nowTrackShow = track;
			var arr = track['content'];
			for (var i = 0; i < arr.length; i++) {
				var obj = {
					list: [{
						type: 'text',
						text: arr[i],
						color: '#FFFFFF',
						size: this.trackFontSize,
						font: this.fontFamily,
						lineHeight: 30
					}],
					position: [1, 2, null, -(arr.length - i) * 30 - 50]
				};
				var ele = this.addElement(obj);
				this.trackElement.push(ele);
			}
		},
		/*
			内部函数
			隐藏字字幕内容
		*/
		trackHide: function() {
			for (var i = 0; i < this.trackElement.length; i++) {
				this.deleteElement(this.trackElement[i]);
			}
			this.trackElement = [];
		},
		/*
			内部函数
			重新计算字幕的编号
		*/
		checkTrack: function() {
			var num = this.trackIndex;
			var arr = this.track;
			var i = 0;
			for (i = num; i < arr.length; i++) {
				if (this.time >= arr[i]['startTime'] && this.time <= arr[i]['endTime']) {
					this.trackIndex = i;
					break;
				}
			}
		},
		/*
		-----------------------------------------------------------------------------接口函数开始
			接口函数
			在播放和暂停之间切换
		*/
		playOrPause: function() {
			if (!this.loaded) {
				return;
			}
			if (this.V == null) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.playOrPause();
				return;
			}
			if (this.V.paused) {
				this.videoPlay();
			} else {
				this.videoPause();
			}
		},
		/*
			接口函数
			播放动作
		*/
		videoPlay: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoPlay();
				return;
			}
			if (this.adPlayerPlay) {
				this.eliminateAd(); //清除广告
				return;
			}
			try {
				if (this.V.currentSrc) {
					this.V.play();
				}
			} catch(event) {}
		},
		/*
			接口函数
			暂停动作
		*/
		videoPause: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoPause();
				return;
			}
			try {
				this.V.pause();
			} catch(event) {}
		},
		/*
			接口函数
			跳转时间动作
		*/
		videoSeek: function(time) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoSeek(time);
				return;
			}
			var duration = this.V.duration>0.2?this.V.duration:this.getMetaDate()['duration'];
			if (duration > 0 && time > duration) {
				if(this.vars['forceduration']>0){
					time=0;
					this.sendJS('ended');
				}
				else{
					time = duration-0.1;
				}
			}
			if (time >= 0) {
				this.V.currentTime = time;
				this.sendJS('seekTime', time);
			}
		},
		/*
			接口函数
			调节音量/获取音量
		*/
		changeVolume: function(vol, bg, button) {
			if (this.loaded) {
				if (this.playerType == 'flashplayer') {
					this.V.changeVolume(vol);
					return;
				}
			}
			if (isNaN(vol) || this.isUndefined(vol)) {
				vol = 0;
			}
			if (!this.loaded) {
				this.vars['volume'] = vol;
			}
			if (!this.html5Video) {
				this.V.changeVolume(vol);
				return;
			}
			try {
				if (this.isUndefined(bg)) {
					bg = true;
				}
			} catch(e) {}
			try {
				if (this.isUndefined(button)) {
					button = true;
				}
			} catch(e) {}
			if (!vol) {
				vol = 0;
			}
			if (vol < 0) {
				vol = 0;
			}
			if (vol > 1) {
				vol = 1;
			}
			try {
				this.V.volume = vol;
			} catch(error) {}
			this.volume = vol;
			if (bg && this.showFace) {
				var bgW = vol * this.CB['volumeBg'].offsetWidth;
				if (bgW < 0) {
					bgW = 0;
				}
				if (bgW > this.CB['volumeBg'].offsetWidth) {
					bgW = this.CB['volumeBg'].offsetWidth;
				}
				this.css(this.CB['volumeUp'], 'width', bgW + 'px');
			}

			if (button && this.showFace) {
				var buLeft = parseInt(this.CB['volumeUp'].offsetWidth - (this.CB['volumeBO'].offsetWidth * 0.5));
				if (buLeft > this.CB['volumeBg'].offsetWidth - this.CB['volumeBO'].offsetWidth) {
					buLeft = this.CB['volumeBg'].offsetWidth - this.CB['volumeBO'].offsetWidth
				}
				if (buLeft < 0) {
					buLeft = 0;
				}
				this.css(this.CB['volumeBO'], 'left', buLeft + 'px');
			}
		},
		/*
			接口函数
			静音
		*/
		videoMute: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoMute();
				return;
			}
			this.volumeTemp = this.V ? (this.V.volume > 0 ? this.V.volume: this.vars['volume']) : this.vars['volume'];
			this.changeVolume(0);
		},
		/*
			接口函数
			取消静音
		*/
		videoEscMute: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoEscMute();
				return;
			}
			this.changeVolume(this.volumeTemp > 0 ? this.volumeTemp: this.vars['volume']);
		},
		/*
			接口函数
			视频广告静音
		*/
		adMuteFunction: function() {
			if (!this.loaded) {
				return;
			}
			this.changeVolume(0);
			this.adVideoMute = true;
			this.css(this.CB['adEscMute'], 'display', 'block');
			this.css(this.CB['adMute'], 'display', 'none');
		},
		/*
			接口函数
			视频广告取消静音
		*/
		adEscMuteFunction: function() {
			if (!this.loaded) {
				return;
			}
			var v = this.ckplayerConfig['style']['advertisement']['videoVolume'];
			this.changeVolume(v);
			this.adMuteInto();
		},
		/*
		 	初始化广告的音量按钮
		*/
		adMuteInto: function() {
			this.adVideoMute = false;
			this.css(this.CB['adEscMute'], 'display', 'none');
			this.css(this.CB['adMute'], 'display', 'block');
		},
		/*
			接口函数
			快退
		*/
		fastBack: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.fastBack();
				return;
			}
			var time = this.time - this.ckplayerConfig['config']['timeJump'];
			if (time < 0) {
				time = 0;
			}
			this.videoSeek(time);
		},
		/*
			接口函数
			快进
		*/
		fastNext: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.fastNext();
				return;
			}
			var time = this.time + this.ckplayerConfig['config']['timeJump'];
			if (time > this.V.duration) {
				time = this.V.duration;
			}
			this.videoSeek(time);
		},
		/*
			接口函数
			获取当前播放的地址
		*/
		getCurrentSrc: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				return this.V.getCurrentSrc();
			}
			return this.V.currentSrc;
		},
		/*
			内置函数
			全屏/退出全屏动作，该动作只能是用户操作才可以触发，比如用户点击按钮触发该事件
		*/
		switchFull: function() {
			if (this.full) {
				this.quitFullScreen();
			} else {
				this.fullScreen();
			}
		},
		/*
			内置函数
			全屏动作，该动作只能是用户操作才可以触发，比如用户点击按钮触发该事件
		*/
		fullScreen: function() {
			if (this.html5Video && this.playerType == 'html5video') {
				var element = this.PD;
				if (element.requestFullscreen) {
					element.requestFullscreen();
				} else if (element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if (element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen();
				} else if (element.msRequestFullscreen) {
					element.msRequestFullscreen();
				} else if (element.oRequestFullscreen) {
					element.oRequestFullscreen();
				}
				this.judgeFullScreen();
			} else {
				//this.V.fullScreen();
			}
		},
		/*
			接口函数
			退出全屏动作
		*/
		quitFullScreen: function() {
			if (this.html5Video && this.playerType == 'html5video') {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.oRequestFullscreen) {
					document.oCancelFullScreen();
				} else if (document.requestFullscreen) {
					document.requestFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else {
					this.css(document.documentElement, 'cssText', '');
					this.css(document.document.body, 'cssText', '');
					this.css(this.PD, 'cssText', '');
				}
				this.judgeFullScreen();
			}
		},
		/*
		 下面列出只有flashplayer里支持的 
		 */
		videoRotation: function(n) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoRotation(n);
				return;
			}
			if (this.isUndefined(n)) {
				n = 0;
			}
			var tf = this.css(this.V, 'transform');
			if (this.isUndefined(tf) && !tf) {
				tf = 'rotate(0deg)';
			}
			var reg = tf.match(/rotate\([^)]+\)/);
			reg = reg ? reg[0].replace('rotate(', '').replace('deg)', '') : '';
			if (reg == '') {
				reg = 0;
			} else {
				reg = parseInt(reg);
			}
			if (n == -1) {
				reg -= 90;
			} else if (n == 1) {
				reg += 90;
			} else {
				if (n != 90 && n != 180 && n != 270 && n != -90 && n != -180 && n != -270) {
					reg = 0;
				} else {
					reg = n;
				}
			}
			n = reg;
			var y90 = n % 90,
			y180 = n % 180,
			y270 = n % 270;
			var ys = false;
			if (y90 == 0 && y180 == 90 && y270 == 90) {
				ys = true;
			}
			if (y90 == 0 && y180 == 90 && y270 == 0) {
				ys = true;
			}
			if (y90 == -0 && y180 == -90 && y270 == -90) {
				ys = true;
			}
			if (y90 == -0 && y180 == -90 && y270 == -0) {
				ys = true;
			}
			tf = tf.replace(/rotate\([^)]+\)/, '').replace(/scale\([^)]+\)/, '') + ' rotate(' + n + 'deg)';
			var cdW = this.CD.offsetWidth,
			cdH = this.CD.offsetHeight,
			vW = this.V.videoWidth,
			vH = this.V.videoHeight;
			if (vW > 0 && vH > 0) {
				if (ys) {
					if (cdW / cdH > vH / vW) {
						nH = cdH;
						nW = vH * nH / vW;
					} else {
						nW = cdW;
						nH = vW * nW / vH;
					}
					this.css(this.V, 'transform', 'rotate(0deg)');
					this.css(this.V, 'transform', 'scale(' + nH / cdW + ',' + nW / cdH + ')' + tf);
				} else {
					this.css(this.V, 'transform', tf);
				}
			} else {
				this.css(this.V, 'transform', tf);
			}
			return;
		},
		videoBrightness: function(n) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoBrightness(n);
				return;
			}
		},
		videoContrast: function(n) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoContrast(n);
				return;
			}
		},
		videoSaturation: function(n) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoSaturation(n);
				return;
			}
		},
		videoHue: function(n) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoHue(n);
				return;
			}
		},
		videoZoom: function(n) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoZoom(n);
				return;
			}
			if (this.isUndefined(n)) {
				n = 1;
			}
			if (n < 0) {
				n = 0;
			}
			if (n > 2) {
				n = 2;
			}
			var tf = this.css(this.V, 'transform');
			tf = tf.replace(/scale\([^)]+\)/, '') + ' scale(' + n + ')';
			this.videoScale = n;
			this.css(this.V, 'transform', tf);
			return;
		},
		videoProportion: function(w, h) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoProportion(w, h);
				return;
			}
		},
		adPlay: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.adPlay();
				return;
			}
			if (this.adPlayerPlay) {
				this.adIsPause = false;
				if (this.adPlayerPlay) {
					var ad = this.getNowAdvertisements();
					var type = ad['type'];
					if (this.isStrImage(type)) {
						this.adCountDown();
					} else {
						this.V.play();
					}
				}
			}
		},
		adPause: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.adPause();
				return;
			}
			if (this.adPlayerPlay) {
				this.adIsPause = true;
				var ad = this.getNowAdvertisements();
				var type = ad['type'];
				if (type != 'jpg' && type != 'jpeg' && type != 'png' && type != 'svg' && type != 'gif') {
					this.videoPause();
				}
			}
		},
		videoError: function(n) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoError(n);
				return;
			}
		},
		changeConfig: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				var args = Array.prototype.slice.call(arguments);
				switch(args.length){
					case 1:
						this.V.changeConfig(args[0]);
						break;
					case 2:
						this.V.changeConfig(args[0],args[1]);
						break;
					case 3:
						this.V.changeConfig(args[0],args[1],args[2]);
						break;
					case 4:
						this.V.changeConfig(args[0],args[1],args[2],args[3]);
						break;
					case 5:
						this.V.changeConfig(args[0],args[1],args[2],args[3],args[4]);
						break;
					case 6:
						this.V.changeConfig(args[0],args[1],args[2],args[3],args[4],args[5]);
						break;
					case 7:
						this.V.changeConfig(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
						break;
					case 8:
						this.V.changeConfig(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
						break;
					case 8:
						this.V.changeConfig(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8]);
						break;
				}
				return;
			}
			var obj = this.ckplayerConfig;
			var arg = arguments;
			for (var i = 0; i < arg.length - 1; i++) {
				if (obj.hasOwnProperty(arg[i])) {
					obj = obj[arg[i]];
				} else {
					return;
				}
			}
			var val = arg[arg.length - 1];
			switch (arg.length) {
			case 2:
				this.ckplayerConfig[arg[0]] = val;
				break;
			case 3:
				this.ckplayerConfig[arg[0]][arg[1]] = val;
				break;
			case 4:
				this.ckplayerConfig[arg[0]][arg[1]][arg[2]] = val;
				break;
			case 5:
				this.ckplayerConfig[arg[0]][arg[1]][arg[2]][arg[3]] = val;
				break;
			case 6:
				this.ckplayerConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]] = val;
				break;
			case 7:
				this.ckplayerConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]][arg[5]] = val;
				break;
			case 8:
				this.ckplayerConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]][arg[5]][arg[6]] = val;
				break;
			case 9:
				this.ckplayerConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]][arg[5]][arg[6]][arg[7]] = val;
				break;
			case 10:
				this.ckplayerConfig[arg[0]][arg[1]][arg[2]][arg[3]][arg[4]][arg[5]][arg[6]][arg[7]][arg[8]] = val;
				break;
			default:
				return;
				break;
			}
			this.sendJS('configChange', this.ckplayerConfig);
		},
		custom: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.custom(arguments);
				return;
			}
		},
		getConfig: function() {
			if (!this.loaded) {
				return null;
			}
			if (this.playerType == 'flashplayer') {
				return this.V.getConfig(arguments);
			}
			else{
				var temp=this.ckplayerConfig;
				for(var index in arguments) {  
			        try{
			        	temp=temp[arguments[index]];
			        }
			        catch(error){
			        	temp=null;
			        }
			    }; 
				return temp;
			}
		},
		openUrl: function(n) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.openUrl(n);
				return;
			}
		},
		/*
			接口函数
			清除视频
		*/
		videoClear: function() {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.videoClear();
				return;
			}
		},
		/*
			接口函数
			向播放器传递新的视频地址
		*/
		newVideo: function(c) {
			if (this.playerType == 'flashplayer') {
				this.V.newVideo(c);
				return;
			} else {
				this.embed(c);
			}
		},
		/*
			接口函数
			截图
		*/
		screenshot: function(obj, save, name) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				try {
					this.V.screenshot(obj, save, name);
				} catch(error) {
					this.log(error);
				}
				return;
			}
			if (obj == 'video') {
				var newCanvas = document.createElement('canvas');
				newCanvas.width = this.V.videoWidth;
				newCanvas.height = this.V.videoHeight;
				newCanvas.getContext('2d').drawImage(this.V, 0, 0, this.V.videoWidth, this.V.videoHeight);
				try {
					var base64 = newCanvas.toDataURL('image/jpeg');
					this.sendJS('screenshot', {
						object: obj,
						save: save,
						name: name,
						base64: base64
					});
				} catch(error) {
					this.log(error);
				}
			}
		},
		/*
			接口函数
			改变播放器尺寸
		*/
		changeSize: function(w, h) {
			if (this.isUndefined(w)) {
				w = 0;
			}
			if (this.isUndefined(h)) {
				h = 0;
			}
			if (w > 0) {
				this.css(this.CD, 'width', w + 'px');
			}
			if (h > 0) {
				this.css(this.CD, 'height', h + 'px');
			}
			if (this.html5Video) {
				this.elementCoordinate();
			}
		},
		/*
			接口函数
			改变视频播放速度
		*/
		changePlaybackRate: function(n) {
			if (this.html5Video) {
				var arr = this.playbackRateArr;
				n = parseInt(n);
				if (n < arr.length) {
					this.newPlaybackrate(arr[n][1]);
				}
			}
		},
		/*
			内部函数
			注册控制控制栏显示与隐藏函数
		*/
		changeControlBarShow: function(show) {
			if (!this.loaded) {
				return;
			}
			if (this.playerType == 'flashplayer') {
				this.V.changeControlBarShow(show);
				return;
			}
			if (show) {
				this.controlBarIsShow = true;
				this.controlBarHide(false);
			} else {
				this.controlBarIsShow = false;
				this.controlBarHide(true);
			}
		},
		/*
			-----------------------------------------------------------------------
			调用flashplayer
		*/
		embedSWF: function() {
			var vid = this.randomString();
			var flashvars = this.getFlashVars();
			var param = this.getFlashplayerParam();
			var flashplayerUrl = 'http://www.macromedia.com/go/getflashplayer';
			var html = '',
			src = javascriptPath + 'ckplayer.swf';
			id = 'id="' + vid + '" name="' + vid + '" ';
			html += '<object pluginspage="' + flashplayerUrl + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,3,0,0" width="100%" height="100%" ' + id + ' align="middle" wmode="transparent">';
			html += param['v'];
			html += '<param name="movie" value="' + src + '">';
			html += '<param name="flashvars" value="' + flashvars + '">';
			html += '<param name="wmode" value="transparent">';
			html += '<embed wmode="transparent" ' + param['w'] + ' src="' + src + '" flashvars="' + flashvars + '" width="100%" height="100%" ' + id + ' align="middle" type="application/x-shockwave-flash" pluginspage="' + flashplayerUrl + '" />';
			html += '</object>';
			this.PD.innerHTML = html;
			this.V = this.getObjectById(vid); //V：定义播放器对象全局变量
			this.playerType = 'flashplayer';
			//if(!this.checkShockwaveFlash()){
				//this.PD.innerHTML = '<p>'+this.language['noLoadShockwaveFlash']+'</p><p><a href="https://www.flash.cn/" target="_blank" style="color:#FFFFFF">'+this.language['downLoadShockwaveFlash']+'</a></p>';
				//this.css(this.PD,{color:'#FFFFFF',textAlign:'center',paddingTop:'40px'});
			//}
		},
		/*
			判断浏览器是否支持flashplayer 
		*/
		checkShockwaveFlash:function(){
			if(window.ActiveXObject) {
				try {
					var s = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
					if(s) {
						return true;
					}
				} catch(e) {}
			} else {
				try {
					var s = navigator.plugins['Shockwave Flash'];
					if(s) {
						return true;
					}
				} catch(e) {}
			}
			return false;
		},
		/*
			内置函数
			将vars对象转换成字符
		*/
		getFlashVars: function() {
			this.getVarsObject();
			var v = this.vars;
			var z = '';
			for (k in v) {
				if (k != 'flashplayer' && k != 'container' && v[k] != '') {
					if (z != '') {
						z += '&';
					}
					var vk = v[k];
					if (vk == true) {
						vk = 1;
					}
					if (vk == false) {
						vk = 0;
					}
					z += k + '=' + vk;
				}

			}
			if (!v.hasOwnProperty('volume') || !v['volume']) {
				if (z != '') {
					z += '&';
				}
				z += 'volume=0';
			}
			return z;
		},
		/*判断字符串是否是图片*/
		isStrImage: function(s) {
			if (s == 'jpg' || s == 'jpeg' || s == 'png' || s == 'svg' || s == 'gif') {
				return true;
			}
			return false;
		},
		/*
			内置函数
			将vars格式化成flash能接受的对象。再由getFlashVars函数转化成字符串或由newVideo直接使用
		*/
		getVarsObject: function() {
			var v = this.vars;
			var f = '',
			d = '',
			w = ''; //f=视频地址，d=清晰度地址,w=权重，z=最终地址
			var arr = this.VA;
			var prompt = v['promptSpot'];
			var i = 0;
			var video = this.vars['video'];
			if (typeof(video) == 'object') { //对象或数组
				if (!this.isUndefined(typeof(video.length))) { //说明是数组
					var arr = video;
					for (i = 0; i < arr.length; i++) {
						var arr2 = arr[i];
						if (arr2) {
							if (f != '') {
								f += this.ckplayerConfig['config']['split'];
								d += ',';
								w += ',';
								v['type'] += this.ckplayerConfig['config']['split'];
							}
							f += encodeURIComponent(decodeURIComponent(arr2[0]));
							d += arr2[2];
							w += arr2[3];
							v['type'] += arr2[1].replace('video/', '');
						}
					}
				} else {
					f = encodeURIComponent(decodeURIComponent(video['file']));
					if (!this.isUndefined(video['type'])) {
						v['type'] = video['type'];
					}
					d = '';
					w = '';
				}
			} else {
				f = encodeURIComponent(decodeURIComponent(video));
			}
			if (v['preview'] != null) {
				v['previewscale'] = v['preview']['scale'];
				v['preview'] = v['preview']['file'].join(',');

			}
			if (prompt != null) {
				v['promptspot'] = '';
				v['promptspottime'] = '';
				for (i = 0; i < prompt.length; i++) {
					if (v['promptspot'] != '') {
						v['promptspot'] += ',';
						v['promptspottime'] += ',';
					}
					v['promptspot'] += prompt[i]['words'];
					v['promptspottime'] += prompt[i]['time'];
				}

			}
			if (f != '') {
				v['video'] = f;
				v['definition'] = d;
				v['weight'] = w;
			}
			if (!v['volume']) {
				v['volume'] = 0;
			}
			var newV = {};

			for (var k in v) {
				if (v[k] != null) {
					newV[k] = v[k];
				}
				if (k == 'type') {
					newV[k] = v[k].replace('video/m3u8', 'm3u8');
				}
			}

			this.vars = newV;
		},
		/*
			内置函数
			将embedSWF里的param的对象进行转换
		*/
		getFlashplayerParam: function() {
			var w = '',
			v = '',
			o = {
				allowScriptAccess: 'always',
				allowFullScreen: true,
				quality: 'high',
				bgcolor: '#000'
			};
			for (var e in o) {
				w += e + '="' + o[e] + '" ';
				v += '<param name="' + e + '" value="' + o[e] + '" />';
			}
			w = w.replace('movie=', 'src=');
			return {
				w: w,
				v: v
			};
		},

		/*
			操作动作结束
			-----------------------------------------------------------------------
			
			接口函数
			获取元数据部分
		*/
		getMetaDate: function() {
			if (!this.loaded || this.V == null) {
				return false;
			}
			if (this.playerType == 'html5video') {
				var duration = 0;
				try {
					duration = !isNaN(this.V.duration) ? this.V.duration: 0;
					if (isNaN(duration) || parseInt(duration) < 0.2) {
						if(this.vars['duration']>0){
							duration=this.vars['duration'];
						}
					}
					if(this.vars['forceduration']>0){
						duration=this.vars['forceduration'];
					}
				} catch(event) {
					this.log(event);
				}
				var data = {
					duration: duration,
					volume: this.V.volume,
					playbackRate: this.V.playbackRate,
					width: this.PD.offsetWidth || this.V.offsetWidth || this.V.width,
					height: this.PD.offsetHeight || this.V.offsetHeight || this.V.height,
					streamWidth: this.V.videoWidth,
					streamHeight: this.V.videoHeight,
					videoWidth: this.V.offsetWidth,
					videoHeight: this.V.offsetHeight,
					paused: this.V.paused,
					loadTime:this.loadTimeTemp
				};
				return data;
			} else {
				try {
					return this.V.getMetaDate();
				} catch(event) {
					this.log(event);
				}
			}
			return false;
		},
		/*
			接口函数
			取当前提供给播放器播放的视频列表
		*/
		getVideoUrl: function() {
			if (this.playerType == 'flashplayer') {
				return this.V.getVideoUrl();
			}
			var arr = [];
			if (this.V.src) {
				arr.push(this.V.src);
			} else {
				var uArr = this.V.childNodes;
				for (var i = 0; i < uArr.length; i++) {
					arr.push(uArr[i].src);
				}
			}
			return arr;
		},
		/*
			内置函数
			格式化函数
		*/
		clickEvent: function(call) {
			if (call == 'none' || call == '' || call == null) {
				return {
					type: 'none'
				};
			}
			var callArr = call.split('->');
			var type = '',
			fun = '',
			link = '',
			target = '';
			if (callArr.length == 2) {
				var callM = callArr[0];
				var callE = callArr[1];
				if (!callE) {
					return {
						type: 'none'
					};
				}
				var val = '';
				var eArr = [];
				type = callM;
				switch (callM) {
				case 'actionScript':
					//trace(THIS.hasOwnProperty(callE));
					if (callE.indexOf('(') > -1) {
						eArr = callE.split('(');
						callE = eArr[0];
						val = eArr[1].replace(')', '');
					}
					if (val == '') {
						fun = 'thisTemp.' + callE + '()';
					} else {
						fun = 'thisTemp.' + callE + '(' + val + ')';
					}
					break;
				case 'javaScript':
					if (callE.substr(0, 11) == '[flashvars]') {
						callE = callE.substr(11);
						if (this.vars.hasOwnProperty(callE)) {
							callE = this.vars[callE];
						} else {
							break;
						}

					}
					if (callE.indexOf('(') > -1) {
						eArr = callE.split('(');
						callE = eArr[0];
						val = eArr[1].replace(')', '');
					}
					if (val == '') {
						fun = callE + '()';
					} else {
						fun = callE + '(' + val + ')';
					}
					break;
				case "link":
					var callLink = (callE + ',').split(',');
					if (callLink[0].substr(0, 11) == '[flashvars]') {
						var fl = callLink[0].replace('[flashvars]', '');
						if (this.vars.hasOwnProperty(fl)) {
							callLink[0] = this.vars[fl];
						} else {
							break;
						}
					}
					if (!callLink[1]) {
						callLink[1] = '_blank';
					}
					link = callLink[0];
					target = callLink[1];
					break;
				}
			}
			return {
				type: type,
				fun: fun,
				link: link,
				target: target
			}
		},
		/*
			内置函数
			根据指定的align,valign,offsetX,offsetY计算坐标
		*/
		getPosition: function(obj) {
			/*
			{
	            "align": "right",
	            "vAlign": "right",
	            "offsetX": -60,
	            "offsetY": -60
	        } 
			*/
			var pw = this.PD.offsetWidth,
			ph = this.PD.offsetHeight;
			var x = 0,
			y = 0;
			switch (obj['align']) {
			case 'left':
				x = obj['offsetX'];
				break;
			case 'center':
				x = pw * 0.5 + obj['offsetX'];
				break;
			case 'right':
				x = pw + obj['offsetX'];
				break;
			}
			switch (obj['vAlign']) {
			case 'top':
				y = obj['offsetY'];
				break;
			case 'middle':
				y = ph * 0.5 + obj['offsetY'];
				break;
			case 'bottom':
				y = ph + obj['offsetY'];
				break;
			}
			return {
				x: x,
				y: y
			};
		},
		/*
			内置函数
			向播放器界面添加一个文本
		*/
		addElement: function(attribute) {
			var thisTemp = this;
			if (this.playerType == 'flashplayer') {
				return this.V.addElement(attribute);
			}
			var i = 0;
			var obj = {
				list: null,
				x: '100%',
				y: "50%",
				position: null,
				alpha: 1,
				backgroundColor: '',
				backAlpha: 1,
				backRadius: 0,
				clickEvent: ''
			};
			obj = this.standardization(obj, attribute);
			var list = obj['list'];
			if (list == null) {
				return '';
			}
			var id = 'element' + this.randomString(10);
			var ele = document.createElement('div');
			ele.className = id;
			if (obj['x']) {
				ele.setAttribute('data-x', obj['x']);
			}
			if (obj['y']) {
				ele.setAttribute('data-y', obj['y']);
			}
			if (obj['position'] != null) {
				ele.setAttribute('data-position', obj['position'].join(','));
			}

			this.PD.appendChild(ele);
			var eid = this.getByElement(id);
			this.css(eid, {
				position: 'absolute',
				filter: 'alpha(opacity:' + obj['alpha'] + ')',
				opacity: obj['alpha'].toString(),
				width: '800px',
				zIndex: '20'
			});
			var bgid = 'elementbg' + this.randomString(10);
			var bgAlpha = obj['alpha'].toString();
			var bgColor = obj['backgroundColor'].replace('0x', '#');
			var html = '';
			var idArr = [];
			var clickArr = [];
			if (!this.isUndefined(list) && list.length > 0) {
				var textObj, returnObj, clickEvent;
				for (i = 0; i < list.length; i++) {
					var newEleid = 'elementnew' + this.randomString(10);
					switch (list[i]['type']) {
					case 'image':
					case 'png':
					case 'jpg':
					case 'jpeg':
					case 'gif':
						textObj = {
							type: 'image',
							file: '',
							radius: 0,
							//圆角弧度
							width: 30,
							//定义宽，必需要定义
							height: 30,
							//定义高，必需要定义
							alpha: 1,
							//透明度
							paddingLeft: 0,
							//左边距离
							paddingRight: 0,
							//右边距离
							paddingTop: 0,
							paddingBottom: 0,
							marginLeft: 0,
							marginRight: 0,
							marginTop: 0,
							marginBottom: 0,
							backgroundColor: '',
							clickEvent: ''
						};

						list[i] = this.standardization(textObj, list[i]);
						clickEvent = this.clickEvent(list[i]['clickEvent']);
						clickArr.push(clickEvent);
						if (clickEvent['type'] == 'link') {
							html += '<div class="' + newEleid + '" data-i="' + i + '"><a href="' + clickEvent['link'] + '" target="' + clickEvent['target'] + '"><img class="' + newEleid + '_image" src="' + list[i]['file'] + '" style="border:0;"></a></div>';
						} else {
							html += '<div class="' + newEleid + '" data-i="' + i + '"><img class="' + newEleid + '_image" src="' + list[i]['file'] + '" style="border:0;"></div>';
						}
						break;
					case 'text':
						textObj = {
							type: 'text',
							//说明是文本
							text: '',
							//文本内容
							color: '0xFFFFFF',
							size: 14,
							font: this.fontFamily,
							leading: 0,
							alpha: 1,
							//透明度
							paddingLeft: 0,
							//左边距离
							paddingRight: 0,
							//右边距离
							paddingTop: 0,
							paddingBottom: 0,
							marginLeft: 0,
							marginRight: 0,
							marginTop: 0,
							marginBottom: 0,
							backgroundColor: '',
							backAlpha: 1,
							backRadius: 0,
							//背景圆角弧度，支持数字统一设置，也支持分开设置[30,20,20,50]，对应上左，上右，下右，下左
							clickEvent: ''
						};
						list[i] = this.standardization(textObj, list[i]);
						clickEvent = this.clickEvent(list[i]['clickEvent']);
						clickArr.push(clickEvent);
						if (clickEvent['type'] == 'link') {
							html += '<div class="' + newEleid + '" data-i="' + i + '"><div class="' + newEleid + '_bg"></div><div class="' + newEleid + '_text"><a href="' + clickEvent['link'] + '" target="' + clickEvent['target'] + '">' + list[i]['text'] + '</a></div></div>';
						} else {
							html += '<div  class="' + newEleid + '" data-i="' + i + '"><div class="' + newEleid + '_bg"></div><div class="' + newEleid + '_text">' + list[i]['text'] + '</div></div>';
						}
						break;
					default:
						break;
					}
					idArr.push(newEleid);
				}
			}
			var objClickEvent = this.clickEvent(obj['clickEvent']);
			/*if(objClickEvent['type']=='link'){
				html = '<a href="'+objClickEvent['link']+'" target="'+objClickEvent['target']+'">' + html + '</a>';
			}*/
			eid.innerHTML = '<div class="' + bgid + '"></div><div class="' + bgid + '_c">' + html + '</div>';
			if (objClickEvent['type'] == 'javaScript' || objClickEvent['type'] == 'actionScript') {
				var objClickHandler = function() {
					eval(objClickEvent['fun']);
					thisTemp.sendJS('clickEvent', clk['type'] + '->' + clk['fun'].replace('thisTemp.', '').replace('()', ''));
				};
				this.addListenerInside('click', objClickHandler, this.getByElement(bgid + '_c'))
			}
			this.css(bgid + '_c', {
				position: 'absolute',
				zIndex: '2'
			});
			for (i = 0; i < idArr.length; i++) {
				var clk = clickArr[i];

				if (clk['type'] == 'javaScript' || clk['type'] == 'actionScript') {
					var clickHandler = function() {
						clk = clickArr[this.getAttribute('data-i')];
						eval(clk['fun']);
						thisTemp.sendJS('clickEvent', clk['type'] + '->' + clk['fun'].replace('thisTemp.', '').replace('()', ''));
					};
					this.addListenerInside('click', clickHandler, this.getByElement(idArr[i]))
				}
				switch (list[i]['type']) {
				case 'image':
				case 'png':
				case 'jpg':
				case 'jpeg':
				case 'gif':
					this.css(idArr[i], {
						float: 'left',
						width: list[i]['width'] + 'px',
						height: list[i]['height'] + 'px',
						filter: 'alpha(opacity:' + list[i]['alpha'] + ')',
						opacity: list[i]['alpha'].toString(),
						marginLeft: list[i]['marginLeft'] + 'px',
						marginRight: list[i]['marginRight'] + 'px',
						marginTop: list[i]['marginTop'] + 'px',
						marginBottom: list[i]['marginBottom'] + 'px',
						borderRadius: list[i]['radius'] + 'px',
						cursor: 'pointer'
					});
					this.css(idArr[i] + '_image', {
						width: list[i]['width'] + 'px',
						height: list[i]['height'] + 'px',
						borderRadius: list[i]['radius'] + 'px'
					});
					break;
				case 'text':
					this.css(idArr[i] + '_text', {
						filter: 'alpha(opacity:' + list[i]['alpha'] + ')',
						opacity: list[i]['alpha'].toString(),
						borderRadius: list[i]['radius'] + 'px',
						fontFamily: list[i]['font'],
						fontSize: list[i]['size'] + 'px',
						color: list[i]['color'].replace('0x', '#'),
						lineHeight: list[i]['leading'] > 0 ? list[i]['leading'] + 'px': '',
						paddingLeft: list[i]['paddingLeft'] + 'px',
						paddingRight: list[i]['paddingRight'] + 'px',
						paddingTop: list[i]['paddingTop'] + 'px',
						paddingBottom: list[i]['paddingBottom'] + 'px',
						whiteSpace: 'nowrap',
						position: 'absolute',
						zIndex: '3',
						cursor: 'pointer'
					});
					this.css(idArr[i], {
						float: 'left',
						width: this.getByElement(idArr[i] + '_text').offsetWidth + 'px',
						height: this.getByElement(idArr[i] + '_text').offsetHeight + 'px',
						marginLeft: list[i]['marginLeft'] + 'px',
						marginRight: list[i]['marginRight'] + 'px',
						marginTop: list[i]['marginTop'] + 'px',
						marginBottom: list[i]['marginBottom'] + 'px'
					});
					this.css(idArr[i] + '_bg', {
						width: this.getByElement(idArr[i] + '_text').offsetWidth + 'px',
						height: this.getByElement(idArr[i] + '_text').offsetHeight + 'px',
						filter: 'alpha(opacity:' + list[i]['backAlpha'] + ')',
						opacity: list[i]['backAlpha'].toString(),
						borderRadius: list[i]['backRadius'] + 'px',
						backgroundColor: list[i]['backgroundColor'].replace('0x', '#'),
						position: 'absolute',
						zIndex: '2'
					});
					break;
				default:
					break;
				}
			}
			this.css(bgid, {
				width: this.getByElement(bgid + '_c').offsetWidth + 'px',
				height: this.getByElement(bgid + '_c').offsetHeight + 'px',
				position: 'absolute',
				filter: 'alpha(opacity:' + bgAlpha + ')',
				opacity: bgAlpha,
				backgroundColor: bgColor.replace('0x', '#'),
				borderRadius: obj['backRadius'] + 'px',
				zIndex: '1'
			});
			this.css(eid, {
				width: this.getByElement(bgid).offsetWidth + 'px',
				height: this.getByElement(bgid).offsetHeight + 'px'
			});
			var eidCoor = this.calculationCoor(eid);
			this.css(eid, {
				left: eidCoor['x'] + 'px',
				top: eidCoor['y'] + 'px'
			});

			this.elementArr.push(eid.className);
			return eid;
		},
		/*
			内置函数
			获取元件的属性，包括x,y,width,height,alpha
		*/
		getElement: function(element) {
			if (this.playerType == 'flashplayer') {
				return this.V.getElement(element);
			}
			var ele = element;
			if (typeof(element) == 'string') {
				ele = this.getByElement(element);
			}
			var coor = this.getCoor(ele);
			return {
				x: coor['x'],
				y: coor['y'],
				width: ele.offsetWidth,
				height: ele.offsetHeight,
				alpha: !this.isUndefined(this.css(ele, 'opacity')) ? parseFloat(this.css(ele, 'opacity')) : 1,
				show: this.css(ele, 'display') == 'none' ? false: true
			};
		},
		/*
			内置函数
			控制元件显示和隐藏
		*/
		elementShow: function(element, show) {
			if (this.playerType == 'flashplayer') {
				this.V.elementShow(element, show);
				return;
			}
			if (typeof(element) == 'string') {
				if (element) {
					this.css(ele, 'display', show == true ? 'block': 'none');
				} else {
					var arr = this.elementTempArr;
					for (var i = 0; i < arr.length; i++) {
						this.css(arr[i], 'display', show == true ? 'block': 'none');
					}
				}
			}

		},
		/*
			内置函数
			根据节点的x,y计算在播放器里的坐标
		*/
		calculationCoor: function(ele) {
			if (this.playerType == 'flashplayer') {
				return this.V.calculationCoor(ele);
			}
			if (ele == []) {
				return;
			}
			var x, y, position = [];
			var w = this.PD.offsetWidth,
			h = this.PD.offsetHeight;
			var ew = ele.offsetWidth,
			eh = ele.offsetHeight;
			if (!this.isUndefined(this.getDataset(ele, 'x'))) {
				x = this.getDataset(ele, 'x');
			}
			if (!this.isUndefined(this.getDataset(ele, 'y'))) {
				y = this.getDataset(ele, 'y');
			}
			if (!this.isUndefined(this.getDataset(ele, 'position'))) {
				try {
					position = this.getDataset(ele, 'position').toString().split(',');
				} catch(event) {}
			}
			if (position.length > 0) {
				position.push(null, null, null, null);
				var i = 0;
				for (i = 0; i < position.length; i++) {
					if (this.isUndefined(position[i]) || position[i] == null || position[i] == 'null' || position[i] == '') {
						position[i] = null;
					} else {
						position[i] = parseFloat(position[i]);
					}
				}

				if (position[2] == null) {
					switch (position[0]) {
					case 0:
						x = 0;
						break;
					case 1:
						x = parseInt((w - ew) * 0.5);
						break;
					default:
						x = w - ew;
						break;
					}
				} else {
					switch (position[0]) {
					case 0:
						x = position[2];
						break;
					case 1:
						x = parseInt(w * 0.5) + position[2];
						break;
					default:
						x = w + position[2];
						break;
					}
				}
				if (position[3] == null) {
					switch (position[1]) {
					case 0:
						y = 0;
						break;
					case 1:
						y = parseInt((h - eh) * 0.5);
						break;
					default:
						y = h - eh;
						break;
					}
				} else {
					switch (position[1]) {
					case 0:
						y = position[3];
						break;
					case 1:
						y = parseInt(h * 0.5) + position[3];
						break;
					default:
						y = h + position[3];
						break;
					}
				}
			} else {
				if (x.substring(x.length - 1, x.length) == '%') {
					x = Math.floor(parseInt(x.substring(0, x.length - 1)) * w * 0.01);
				}
				if (y.substring(y.length - 1, y.length) == '%') {
					y = Math.floor(parseInt(y.substring(0, y.length - 1)) * h * 0.01);
				}
			}
			return {
				x: x,
				y: y
			}

		},
		/*
			内置函数
			修改新增元件的坐标
		*/
		changeElementCoor: function() {
			for (var i = 0; i < this.elementArr.length; i++) {
				if (this.getByElement(this.elementArr[i]) != []) {
					var c = this.calculationCoor(this.getByElement(this.elementArr[i]));
					if (c['x'] && c['y']) {
						this.css(this.elementArr[i], {
							top: c['y'] + 'px',
							left: c['x'] + 'px'
						});
					}
				}
			}
		},
		/*
			内置函数
			缓动效果集
		*/
		tween: function() {
			var Tween = {
				None: { //均速运动
					easeIn: function(t, b, c, d) {
						return c * t / d + b;
					},
					easeOut: function(t, b, c, d) {
						return c * t / d + b;
					},
					easeInOut: function(t, b, c, d) {
						return c * t / d + b;
					}
				},
				Quadratic: {
					easeIn: function(t, b, c, d) {
						return c * (t /= d) * t + b;
					},
					easeOut: function(t, b, c, d) {
						return - c * (t /= d) * (t - 2) + b;
					},
					easeInOut: function(t, b, c, d) {
						if ((t /= d / 2) < 1) return c / 2 * t * t + b;
						return - c / 2 * ((--t) * (t - 2) - 1) + b;
					}
				},
				Cubic: {
					easeIn: function(t, b, c, d) {
						return c * (t /= d) * t * t + b;
					},
					easeOut: function(t, b, c, d) {
						return c * ((t = t / d - 1) * t * t + 1) + b;
					},
					easeInOut: function(t, b, c, d) {
						if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
						return c / 2 * ((t -= 2) * t * t + 2) + b;
					}
				},
				Quartic: {
					easeIn: function(t, b, c, d) {
						return c * (t /= d) * t * t * t + b;
					},
					easeOut: function(t, b, c, d) {
						return - c * ((t = t / d - 1) * t * t * t - 1) + b;
					},
					easeInOut: function(t, b, c, d) {
						if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
						return - c / 2 * ((t -= 2) * t * t * t - 2) + b;
					}
				},
				Quintic: {
					easeIn: function(t, b, c, d) {
						return c * (t /= d) * t * t * t * t + b;
					},
					easeOut: function(t, b, c, d) {
						return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
					},
					easeInOut: function(t, b, c, d) {
						if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
						return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
					}
				},
				Sine: {
					easeIn: function(t, b, c, d) {
						return - c * Math.cos(t / d * (Math.PI / 2)) + c + b;
					},
					easeOut: function(t, b, c, d) {
						return c * Math.sin(t / d * (Math.PI / 2)) + b;
					},
					easeInOut: function(t, b, c, d) {
						return - c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
					}
				},
				Exponential: {
					easeIn: function(t, b, c, d) {
						return (t == 0) ? b: c * Math.pow(2, 10 * (t / d - 1)) + b;
					},
					easeOut: function(t, b, c, d) {
						return (t == d) ? b + c: c * ( - Math.pow(2, -10 * t / d) + 1) + b;
					},
					easeInOut: function(t, b, c, d) {
						if (t == 0) return b;
						if (t == d) return b + c;
						if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
						return c / 2 * ( - Math.pow(2, -10 * --t) + 2) + b;
					}
				},
				Circular: {
					easeIn: function(t, b, c, d) {
						return - c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
					},
					easeOut: function(t, b, c, d) {
						return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
					},
					easeInOut: function(t, b, c, d) {
						if ((t /= d / 2) < 1) return - c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
						return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
					}
				},
				Elastic: {
					easeIn: function(t, b, c, d, a, p) {
						if (t == 0) return b;
						if ((t /= d) == 1) return b + c;
						if (!p) p = d * .3;
						if (!a || a < Math.abs(c)) {
							a = c;
							var s = p / 4;
						} else var s = p / (2 * Math.PI) * Math.asin(c / a);
						return - (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
					},
					easeOut: function(t, b, c, d, a, p) {
						if (t == 0) return b;
						if ((t /= d) == 1) return b + c;
						if (!p) p = d * .3;
						if (!a || a < Math.abs(c)) {
							a = c;
							var s = p / 4;
						} else var s = p / (2 * Math.PI) * Math.asin(c / a);
						return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
					},
					easeInOut: function(t, b, c, d, a, p) {
						if (t == 0) return b;
						if ((t /= d / 2) == 2) return b + c;
						if (!p) p = d * (.3 * 1.5);
						if (!a || a < Math.abs(c)) {
							a = c;
							var s = p / 4;
						} else var s = p / (2 * Math.PI) * Math.asin(c / a);
						if (t < 1) return - .5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
						return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
					}
				},
				Back: {
					easeIn: function(t, b, c, d, s) {
						if (s == undefined) s = 1.70158;
						return c * (t /= d) * t * ((s + 1) * t - s) + b;
					},
					easeOut: function(t, b, c, d, s) {
						if (s == undefined) s = 1.70158;
						return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
					},
					easeInOut: function(t, b, c, d, s) {
						if (s == undefined) s = 1.70158;
						if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
						return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
					}
				},
				Bounce: {
					easeIn: function(t, b, c, d) {
						return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
					},
					easeOut: function(t, b, c, d) {
						if ((t /= d) < (1 / 2.75)) {
							return c * (7.5625 * t * t) + b;
						} else if (t < (2 / 2.75)) {
							return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
						} else if (t < (2.5 / 2.75)) {
							return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
						} else {
							return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
						}
					},
					easeInOut: function(t, b, c, d) {
						if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
						else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
					}
				}
			};
			return Tween;
		},
		/*
			接口函数
			缓动效果
			ele:Object=需要缓动的对象,
			parameter:String=需要改变的属性：x,y,width,height,alpha,
			effect:String=效果名称,
			start:Int=起始值,
			end:Int=结束值,
			speed:Number=运动的总秒数，支持小数
		*/
		animate: function(attribute) {
			if (this.playerType == 'flashplayer') {
				return this.V.animate(attribute);
			}
			var thisTemp = this;
			var animateId = 'animate_' + this.randomString();
			var obj = {
				element: null,
				parameter: 'x',
				static: false,
				effect: 'None.easeIn',
				start: null,
				end: null,
				speed: 0,
				overStop: false,
				pauseStop: false,
				//暂停播放时缓动是否暂停
				callBack: null
			};
			obj = this.standardization(obj, attribute);
			if (obj['element'] == null || obj['speed'] == 0) {
				return false;
			}
			var w = this.PD.offsetWidth,
			h = this.PD.offsetHeight;
			var effArr = (obj['effect'] + '.').split('.');
			var tweenFun = this.tween()[effArr[0]][effArr[1]];
			var eleCoor = {
				x: 0,
				y: 0
			};
			if (this.isUndefined(tweenFun)) {
				return false;
			}
			//先将该元件从元件数组里删除，让其不再跟随播放器的尺寸改变而改变位置
			var def = this.arrIndexOf(this.elementArr, obj['element'].className);
			if (def > -1) {
				this.elementTempArr.push(obj['element'].className);
				this.elementArr.splice(def, 1);
			}
			//var run = true;
			var css = {};
			//对传递的参数进行转化，x和y转化成left,top
			var pm = this.getElement(obj['element']); //包含x,y,width,height,alpha属性
			var t = 0; //当前时间
			var b = 0; //初始值
			var c = 0; //变化量
			var d = obj['speed'] * 1000; //持续时间
			var timerTween = null;
			var tweenObj = null;
			var start = obj['start'] == null ? '': obj['start'].toString();
			var end = obj['end'] == null ? '': obj['end'].toString();
			switch (obj['parameter']) {
			case 'x':
				if (obj['start'] == null) {
					b = pm['x'];
				} else {
					if (start.substring(start.length - 1, start.length) == '%') {
						b = parseInt(start) * w * 0.01;
					} else {
						b = parseInt(start);
					}

				}
				if (obj['end'] == null) {
					c = pm['x'] - b;
				} else {
					if (end.substring(end.length - 1, end.length) == '%') {
						c = parseInt(end) * w * 0.01 - b;
					} else if (end.substring(0, 1) == '-' || end.substring(0, 1) == '+') {
						if (typeof(obj['end']) == 'number') {
							c = parseInt(obj['end']) - b;
						} else {
							c = parseInt(end);
						}

					} else {
						c = parseInt(end) - b;
					}
				}
				break;
			case 'y':
				if (obj['start'] == null) {
					b = pm['y'];
				} else {
					if (start.substring(start.length - 1, start.length) == '%') {
						b = parseInt(start) * h * 0.01;
					} else {
						b = parseInt(start);
					}

				}
				if (obj['end'] == null) {
					c = pm['y'] - b;
				} else {
					if (end.substring(end.length - 1, end.length) == '%') {
						c = parseInt(end) * h * 0.01 - b;
					} else if (end.substring(0, 1) == '-' || end.substring(0, 1) == '+') {
						if (typeof(obj['end']) == 'number') {
							c = parseInt(obj['end']) - b;
						} else {
							c = parseInt(end);
						}
					} else {
						c = parseInt(end) - b;
					}
				}
				break;
			case 'alpha':
				if (obj['start'] == null) {
					b = pm['alpha'] * 100;
				} else {
					if (start.substring(start.length - 1, start.length) == '%') {
						b = parseInt(obj['start']);
					} else {
						b = parseInt(obj['start'] * 100);
					}

				}
				if (obj['end'] == null) {
					c = pm['alpha'] * 100 - b;
				} else {
					if (end.substring(end.length - 1, end.length) == '%') {
						c = parseInt(end) - b;
					} else if (end.substring(0, 1) == '-' || end.substring(0, 1) == '+') {
						if (typeof(obj['end']) == 'number') {
							c = parseInt(obj['end']) * 100 - b;
						} else {
							c = parseInt(obj['end']) * 100;
						}
					} else {
						c = parseInt(obj['end']) * 100 - b;
					}
				}
				break;
			}
			var callBack = function() {
				var index = thisTemp.arrIndexOf(thisTemp.animateElementArray, animateId);
				if (index > -1) {
					thisTemp.animateArray.splice(index, 1);
					thisTemp.animateElementArray.splice(index, 1);
				}
				index = thisTemp.arrIndexOf(thisTemp.animatePauseArray, animateId);
				if (index > -1) {
					thisTemp.animatePauseArray.splice(index, 1);
				}
				if (obj['callBack'] != null && obj['element'] && obj['callBack'] != 'callBack' && obj['callBack'] != 'tweenX' && obj['tweenY'] != 'callBack' && obj['callBack'] != 'tweenAlpha') {
					var cb = eval(obj['callBack']);
					cb(obj['element']);
					obj['callBack'] = null;
				}
			};
			var stopTween = function() {
				if (timerTween != null) {
					if (timerTween.runing) {
						timerTween.stop();
					}
					timerTween = null;
				}
			};
			var tweenX = function() {
				if (t < d) {
					t += 10;
					css = {
						left: Math.ceil(tweenFun(t, b, c, d)) + 'px'
					};
					if (obj['static']) {
						eleCoor = thisTemp.calculationCoor(obj['element']);
						css['top'] = eleCoor['y'] + 'px';
					}
					thisTemp.css(obj['element'], css);

				} else {
					stopTween();
					try {
						var defX = this.arrIndexOf(this.elementTempArr, obj['element'].className);
						if (defX > -1) {
							this.elementTempArr.splice(defX, 1);
						}
					} catch(event) {}
					thisTemp.elementArr.push(obj['element'].className);
					callBack();
				}
			};
			var tweenY = function() {
				if (t < d) {
					t += 10;
					css = {
						top: Math.ceil(tweenFun(t, b, c, d)) + 'px'
					};
					if (obj['static']) {
						eleCoor = thisTemp.calculationCoor(obj['element']);
						css['left'] = eleCoor['x'] + 'px';
					}
					thisTemp.css(obj['element'], css);
				} else {
					stopTween();
					try {
						var defY = this.arrIndexOf(this.elementTempArr, obj['element'].className);
						if (defY > -1) {
							this.elementTempArr.splice(defY, 1);
						}
					} catch(event) {}
					thisTemp.elementArr.push(obj['element'].className);
					callBack();
				}
			};
			var tweenAlpha = function() {
				if (t < d) {
					t += 10;
					eleCoor = thisTemp.calculationCoor(obj['element']);
					var ap = Math.ceil(tweenFun(t, b, c, d)) * 0.01;
					css = {
						filter: 'alpha(opacity:' + ap + ')',
						opacity: ap.toString()
					};
					if (obj['static']) {
						eleCoor = thisTemp.calculationCoor(obj['element']);
						css['top'] = eleCoor['y'] + 'px';
						css['left'] = eleCoor['x'] + 'px';
					}
					thisTemp.css(obj['element'], css);
				} else {
					stopTween();
					try {
						var defA = this.arrIndexOf(this.elementTempArr, obj['element'].className);
						if (defA > -1) {
							this.elementTempArr.splice(defA, 1);
						}
					} catch(event) {}
					thisTemp.elementArr.push(obj['element'].className);
					callBack();
				}
			};
			switch (obj['parameter']) {
			case 'x':
				tweenObj = tweenX;
				break;
			case 'y':
				tweenObj = tweenY;
				break;
			case 'alpha':
				tweenObj = tweenAlpha;
				break;
			default:
				break;
			}
			timerTween = new thisTemp.timer(10, tweenObj);
			timerTween.callBackFunction = callBack;
			if (obj['overStop']) {
				var mouseOver = function() {
					if (timerTween != null && timerTween.runing) {
						timerTween.stop();
					}
				};
				this.addListenerInside('mouseover', mouseOver, obj['element']);
				var mouseOut = function() {
					var start = true;
					if (obj['pauseStop'] && thisTemp.getMetaDate()['paused']) {
						start = false;
					}
					if (timerTween != null && !timerTween.runing && start) {
						timerTween.start();
					}
				};
				this.addListenerInside('mouseout', mouseOut, obj['element']);
			}

			this.animateArray.push(timerTween);
			this.animateElementArray.push(animateId);
			if (obj['pauseStop']) {
				this.animatePauseArray.push(animateId);
			}
			return animateId;
		},
		/*
			接口函数函数
			继续运行animate
		*/
		animateResume: function(id) {
			if (this.playerType == 'flashplayer') {
				this.V.animateResume(this.isUndefined(id) ? '': id);
				return;
			}
			var arr = [];
			if (id != '' && !this.isUndefined(id) && id != 'pause') {
				arr.push(id);
			} else {
				if (id === 'pause') {
					arr = this.animatePauseArray;
				} else {
					arr = this.animateElementArray;
				}
			}
			for (var i = 0; i < arr.length; i++) {
				var index = this.arrIndexOf(this.animateElementArray, arr[i]);
				if (index > -1) {
					this.animateArray[index].start();
				}
			}

		},
		/*
			接口函数
			暂停运行animate
		*/
		animatePause: function(id) {
			if (this.playerType == 'flashplayer') {
				this.V.animatePause(this.isUndefined(id) ? '': id);
				return;
			}
			var arr = [];
			if (id != '' && !this.isUndefined(id) && id != 'pause') {
				arr.push(id);
			} else {
				if (id === 'pause') {
					arr = this.animatePauseArray;
				} else {
					arr = this.animateElementArray;
				}
			}
			for (var i = 0; i < arr.length; i++) {
				var index = this.arrIndexOf(this.animateElementArray, arr[i]);
				if (index > -1) {
					this.animateArray[index].stop();
				}
			}
		},
		/*
			内置函数
			根据ID删除数组里对应的内容
		*/
		deleteAnimate: function(id) {
			if (this.playerType == 'flashplayer' && this.V) {
				try {
					this.V.deleteAnimate(id);
				} catch(event) {
					this.log(event);
				}
				return;
			}
			var index = this.arrIndexOf(this.animateElementArray, id);
			if (index > -1) {
				this.animateArray[index].callBackFunction();
				this.animateArray.splice(index, 1);
				this.animateElementArray.splice(index, 1);
			}
		},
		/*
			内置函数
			删除外部新建的元件
		*/
		deleteElement: function(ele) {
			if (this.playerType == 'flashplayer' && this.V) {
				try {
					this.V.deleteElement(ele);
				} catch(event) {}
				return;
			}
			//先将该元件从元件数组里删除，让其不再跟随播放器的尺寸改变而改变位置
			var def = this.arrIndexOf(this.elementArr, ele.className);
			if (def > -1) {
				this.elementArr.splice(def, 1);
			}
			try {
				def = this.arrIndexOf(this.elementTempArr, ele.className);
				if (def > -1) {
					this.elementTempArr.splice(def, 1);
				}
			} catch(event) {}
			this.deleteAnimate(ele);
			this.deleteChild(ele);
		},
		/*
			--------------------------------------------------------------
			共用函数部分
			以下函数并非只能在本程序中使用，也可以在页面其它项目中使用
			根据ID获取元素对象
		*/
		getByElement: function(obj, parent) {
			if (this.isUndefined(parent)) {
				parent = document;
			}
			var num = obj.substr(0, 1);
			var res = [];
			if (num != '#') {
				if (num == '.') {
					obj = obj.substr(1, obj.length);
				}
				if (parent.getElementsByClassName) {
					res = parent.getElementsByClassName(obj);
				} else {
					var reg = new RegExp(' ' + obj + ' ', 'i');
					var ele = parent.getElementsByTagName('*');

					for (var i = 0; i < ele.length; i++) {
						if (reg.test(' ' + ele[i].className + ' ')) {
							res.push(ele[i]);
						}
					}
				}

				if (res.length > 0) {
					return res[0];
				} else {
					return res;
				}
			} else {
				if (num == '#') {
					obj = obj.substr(1, obj.length);
				}
				return document.getElementById(obj);
			}
		},
		/*
		 	共用函数
			功能：修改样式或获取指定样式的值，
				elem：ID对象或ID对应的字符，如果多个对象一起设置，则可以使用数组
				attribute：样式名称或对象，如果是对象，则省略掉value值
				value：attribute为样式名称时，定义的样式值
				示例一：
				this.css(ID,'width','100px');
				示例二：
				this.css('id','width','100px');
				示例三：
				this.css([ID1,ID2,ID3],'width','100px');
				示例四：
				this.css(ID,{
					width:'100px',
					height:'100px'
				});
				示例五(获取宽度)：
				var width=this.css(ID,'width');
		*/
		css: function(elem, attribute, value) {
			var i = 0;
			var k = '';
			if (typeof(elem) == 'object') { //对象或数组
				if (!this.isUndefined(typeof(elem.length))) { //说明是数组
					for (i = 0; i < elem.length; i++) {
						var el;
						if (typeof(elem[i]) == 'string') {
							el = this.getByElement(elem[i])
						} else {
							el = elem[i];
						}
						if (typeof(attribute) != 'object') {
							if (!this.isUndefined(value)) {
								el.style[attribute] = value;
							}
						} else {
							for (k in attribute) {
								if (!this.isUndefined(attribute[k])) {
									try {
										el.style[k] = attribute[k];
									} catch(event) {
										this.log(event);
									}
								}
							}
						}
					}
					return;
				}

			}
			if (typeof(elem) == 'string') {
				elem = this.getByElement(elem);
			}
			if (typeof(attribute) != 'object') {
				if (!this.isUndefined(value)) {
					elem.style[attribute] = value;
				} else {
					if (!this.isUndefined(this.getStyle(elem, attribute))) {
						return this.getStyle(elem, attribute);
					} else {
						return false;
					}
				}
			} else {
				for (k in attribute) {
					if (!this.isUndefined(attribute[k])) {
						elem.style[k] = attribute[k];
					}
				}
			}

		},
		/*
			内置函数
			兼容型获取style
		*/
		getStyle: function(obj, attr) {
			if (!this.isUndefined(obj.style[attr])) {
				return obj.style[attr];
			} else {
				if (obj.currentStyle) {
					return obj.currentStyle[attr];
				} else {
					return getComputedStyle(obj, false)[attr];
				}
			}
		},
		/*
			共用函数
			判断变量是否存在或值是否为undefined
		*/
		isUndefined: function(value) {
			try {
				if (value == 'undefined' || value == undefined || value == null) {
					return true;
				}
			} catch(event) {
				this.log(event);
			}
			return false;
		},
		/*
		 	共用函数
			外部监听函数
		*/
		addListener: function(name, funName) {
			if (name && funName) {
				if (this.playerType == 'flashplayer') {
					var ff = ''; //定义用来向flashplayer传递的函数字符
					if (typeof(funName) == 'function') {
						ff = this.getParameterNames(funName);
					}
					this.V.addListener(name, ff);
					return;
				}
				var have = false;
				for (var i = 0; i < this.listenerJsArr.length; i++) {
					var arr = this.listenerJsArr[i];
					if (arr[0] == name && arr[1] == funName) {
						have = true;
						break;
					}
				}
				if (!have) {
					this.listenerJsArr.push([name, funName]);
				}
			}
		},
		/*
			共用函数
			外部删除监听函数
		*/
		removeListener: function(name, funName) {
			if (name && funName) {
				if (this.playerType == 'flashplayer') {
					var ff = ''; //定义用来向flashplayer传递的函数字符
					if (typeof(funName) == 'function') {
						ff = this.getParameterNames(funName);
					}
					this.V.removeListener(name, ff);
					return;
				}
				for (var i = 0; i < this.listenerJsArr.length; i++) {
					var arr = this.listenerJsArr[i];
					if (arr[0] == name && arr[1] == funName) {
						this.listenerJsArr.splice(i, 1);
						break;
					}
				}
			}
		},
		/*
			内部监听函数，调用方式：
			this.addListenerInside('click',function(event){},[ID]);
			d值为空时，则表示监听当前的视频播放器
		*/
		addListenerInside: function(e, f, d, t) {
			if (this.isUndefined(t)) {
				t = false;
			}
			var o = this.V;
			if (!this.isUndefined(d)) {
				o = d;
			}
			if (o.addEventListener) {
				try {
					o.addEventListener(e, f, t);
				} catch(event) {}
			} else if (o.attachEvent) {
				try {
					o.attachEvent('on' + e, f);
				} catch(event) {}
			} else {
				o['on' + e] = f;
			}
		},
		/*
			删除内部监听函数，调用方式：
			this.removeListenerInside('click',function(event){}[,ID]);
			d值为空时，则表示监听当前的视频播放器
		*/
		removeListenerInside: function(e, f, d, t) {
			/*if(this.playerType=='flashplayer' && this.getParameterNames(f) && this.isUndefined(d)) {
				return;
			}*/
			if (this.isUndefined(t)) {
				t = false;
			}
			var o = this.V;
			if (!this.isUndefined(d)) {
				o = d;
			}
			if (o.removeEventListener) {
				try {
					this.addNum--;
					o.removeEventListener(e, f, t);
				} catch(e) {}
			} else if (o.detachEvent) {
				try {
					o.detachEvent('on' + e, f);
				} catch(e) {}
			} else {
				o['on' + e] = null;
			}
		},
		/*
			共用函数
			统一分配监听，以达到跟as3同样效果
		*/
		sendJS: function(name, val) {
			if (this.adPlayerPlay && name.substr( - 2) != 'Ad') {
				return;
			}
			var list = this.listenerJsArr;
			var obj = {
				variable: this.vars['variable']
			};
			if (this.vars['playerID']) {
				obj['playerID'] = this.vars['playerID'];
			}
			for (var i = 0; i < list.length; i++) {
				var arr = list[i];
				if (arr[0] == name) {
					if (val) {
						switch (arr[1].length) {
						case 1:
							arr[1](val);
							break;
						case 2:
							arr[1](val, obj);
							break;
						default:
							arr[1]();
							break;
						}

					} else {
						switch (arr[1].length) {
						case 1:
							if (typeof(val) == 'boolean') {
								arr[1](false);
							} else {
								arr[1](obj);
							}
							break;
						default:
							arr[1]();
							break;
						}

					}
				}
			}
		},
		/*
			共用函数
			获取函数名称，如 function ckplayer(){} var fun=ckplayer，则getParameterNames(fun)=ckplayer
		*/
		getParameterNames: function(fn) {
			if (typeof(fn) !== 'function') {
				return false;
			}
			var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
			var code = fn.toString().replace(COMMENTS, '');
			var result = code.slice(code.indexOf(' ') + 1, code.indexOf('('));
			return result === null ? false: result;
		},
		/*
			共用函数
			获取当前本地时间
		*/
		getNowDate: function() {
			var nowDate = new Date();
			var month = nowDate.getMonth() + 1;
			var date = nowDate.getDate();
			var hours = nowDate.getHours();
			var minutes = nowDate.getMinutes();
			var seconds = nowDate.getSeconds();
			var tMonth = '',
			tDate = '',
			tHours = '',
			tMinutes = '',
			tSeconds = '',
			tSeconds = (seconds < 10) ? '0' + seconds: seconds + '',
			tMinutes = (minutes < 10) ? '0' + minutes: minutes + '',
			tHours = (hours < 10) ? '0' + hours: hours + '',
			tDate = (date < 10) ? '0' + date: date + '',
			tMonth = (month < 10) ? '0' + month: month + '';
			return tMonth + '/' + tDate + ' ' + tHours + ':' + tMinutes + ':' + tSeconds;
		},
		/*
			共用函数
			格式化时分秒
			seconds:Int：秒数
			ishours:Boolean：是否显示小时，如果设置成false，则会显示如80:20，表示1小时20分钟20秒
		*/
		formatTime: function(seconds, ishours) {
			var tSeconds = '',
			tMinutes = '',
			tHours = '';
			if (isNaN(seconds)) {
				seconds = 0;
			}
			var s = Math.floor(seconds % 60),
			m = 0,
			h = 0;
			if (ishours) {
				m = Math.floor(seconds / 60) % 60;
				h = Math.floor(seconds / 3600);
			} else {
				m = Math.floor(seconds / 60);
			}
			tSeconds = (s < 10) ? '0' + s: s + '';
			tMinutes = (m > 0) ? ((m < 10) ? '0' + m + ':': m + ':') : '00:';
			tHours = (h > 0) ? ((h < 10) ? '0' + h + ':': h + ':') : '';
			if (ishours) {
				return tHours + tMinutes + tSeconds;
			} else {
				return tMinutes + tSeconds;
			}
		},
		/*
			共用函数
			获取一个随机字符
			len：随机字符长度
		*/
		randomString: function(len) {
			len = len || 16;
			var chars = 'abcdefghijklmnopqrstuvwxyz';
			var maxPos = chars.length;
			var val = '';
			for (i = 0; i < len; i++) {
				val += chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return 'ch' + val;
		},
		/*
			共用函数
			获取字符串长度,中文算两,英文数字算1
		*/
		getStringLen: function(str) {
			var len = 0;
			for (var i = 0; i < str.length; i++) {
				if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
					len += 2;
				} else {
					len++;
				}
			}
			return len;
		},
		/*
			内部函数
			用来为ajax提供支持
		*/
		createXHR: function() {
			if (window.XMLHttpRequest) {
				//IE7+、Firefox、Opera、Chrome 和Safari
				return new XMLHttpRequest();
			} else if (window.ActiveXObject) {
				//IE6 及以下
				try {
					return new ActiveXObject('Microsoft.XMLHTTP');
				} catch(event) {
					try {
						return new ActiveXObject('Msxml2.XMLHTTP');
					} catch(event) {
						this.eject(this.errorList[7]);
					}
				}
			} else {
				this.eject(this.errorList[8]);
			}
		},
		/*
			共用函数
			ajax调用
		*/
		ajax: function(cObj) {
			var thisTemp = this;
			var callback = null;
			var obj = {
				method: 'get',
				//请求类型
				dataType: 'json',
				//请求的数据类型
				charset: 'utf-8',
				async: false,
				//true表示异步，false表示同步
				url: '',
				data: null,
				success: null
			};
			if (typeof(cObj) != 'object') {
				this.eject(this.errorList[9]);
				return;
			}
			obj = this.standardization(obj, cObj);
			if (obj.dataType === 'json' || obj.dataType === 'text' || obj.dataType === 'html') {
				var xhr = this.createXHR();
				callback = function() {
					//判断http的交互是否成功
					if (xhr.status == 200) {
						if (thisTemp.isUndefined(obj.success)) {
							return;
						}
						if (obj.dataType === 'json') {
							try {
								obj.success(eval('(' + xhr.responseText + ')')); //回调传递参数
							} catch(event) {
								obj.success(null);
							}
						} else {
							obj.success(xhr.responseText); //回调传递参数
						}
					} else {
						obj.success(null);
						thisTemp.eject(thisTemp.errorList[10], 'Ajax.status:' + xhr.status);
					}
				};
				obj.url = obj.url.indexOf('?') == -1 ? obj.url + '?rand=' + this.randomString(6) : obj.url;
				obj.data = this.formatParams(obj.data); //通过params()将名值对转换成字符串
				if (obj.method === 'get' && !this.isUndefined(obj.data)) {
					if (obj.data != '') {
						if (obj.url.indexOf('?') == -1) {
							obj.url += '?' + obj.data
						} else {
							obj.url += '&' + obj.data;
						}
					}
				}
				if (obj.async === true) { //true表示异步，false表示同步
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4 && callback != null) { //判断对象的状态是否交互完成
							callback(); //回调
						}
					};
				}
				xhr.open(obj.method, obj.url, obj.async);
				if (obj.method === 'post') {
					try{
						xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						xhr.setRequestHeader('charset', obj['charset']);
						xhr.send(obj.data);
					}
					catch(event){callback();}
				} else {
					try{
						xhr.send(null); //get方式则填null
					}
					catch(event){callback(); }	
				}
				if (obj.async === false) { //同步
					callback();
				}

			} else if (obj.dataType === 'jsonp') {
				var oHead = document.getElementsByTagName('head')[0];
				var oScript = document.createElement('script');
				var callbackName = 'callback' + new Date().getTime();
				var params = this.formatParams(obj.data) + '&callback=' + callbackName; //按时间戳拼接字符串
				callback = obj.success;
				//拼接好src
				oScript.src = obj.url.split('?') + '?' + params;
				//插入script标签
				oHead.insertBefore(oScript, oHead.firstChild);
				//jsonp的回调函数
				window[callbackName] = function(json) {
					callback(json);
					oHead.removeChild(oScript);
				};
			}
		},
		/*
			内置函数
			动态加载js
		*/
		loadJs: function(path, success) {
			var oHead = document.getElementsByTagName('HEAD').item(0);
			var oScript = document.createElement('script');
			oScript.type = 'text/javascript';
			oScript.src = this.getNewUrl(path);
			oHead.appendChild(oScript);
			oScript.onload = function() {
				success();
			}
		},
		/*
			共用函数
			排除IE6-9
		*/
		isMsie: function() {
			var browser = navigator.appName;
			var b_version = navigator.appVersion;
			var version = b_version.split(';');
			var trim_Version = '';
			if (version.length > 1) {
				trim_Version = version[1].replace(/[ ]/g, '');
			}
			if (browser == 'Microsoft Internet Explorer' && (trim_Version == 'MSIE6.0' || trim_Version == 'MSIE7.0' || trim_Version == 'MSIE8.0' || trim_Version == 'MSIE9.0' || trim_Version == 'MSIE10.0')) {
				return false;
			}
			return true;
		},
		/*
			共用函数
			判断是否安装了flashplayer
		*/
		uploadFlash: function() {
			var swf;
			if (navigator.userAgent.indexOf('MSIE') > 0) {
				try {
					var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
					return true;
				} catch(e) {
					return false;
				}
			}
			if (navigator.userAgent.indexOf('Firefox') > 0) {
				swf = navigator.plugins['Shockwave Flash'];
				if (swf) {
					return true
				} else {
					return false;
				}
			}
			return true;
		},
		/*
			共用函数
			检测浏览器是否支持HTML5-Video
		*/
		supportVideo: function() {
			if (!this.isMsie()) {
				return false;
			}
			if ( !! document.createElement('video').canPlayType) {
				var vidTest = document.createElement('video');
				var oggTest;
				try {
					oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
				} catch(error) {
					oggTest = false;
				}
				if (!oggTest) {
					var h264Test;
					try {
						h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
					} catch(error) {
						h264Test = false;
					}
					if (!h264Test) {
						return false;
					} else {
						if (h264Test == "probably") {
							return true;
						} else {
							return false;
						}
					}
				} else {
					if (oggTest == "probably") {
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		},
		/*
			共用函数
			获取属性值
		*/
		getDataset: function(ele, z) {
			try {
				return ele.dataset[z];
			} catch(error) {
				try {
					return ele.getAttribute('data-' + z)
				} catch(error) {
					return false;
				}
			}
		},
		/*
			共用函数
			返回flashplayer的对象
		*/
		getObjectById: function(id) {
			var x = null;
			var y = this.getByElement('#' + id);
			var r = 'embed';
			if (y && y.nodeName == 'OBJECT') {
				if (typeof(y.SetVariable) != 'undefined') {
					x = y;
				} else {
					var z = y.getElementsByTagName(r)[0];
					if (z) {
						x = z;
					}
				}
			}
			return x;
		},
		/*
			共用函数
			对象转地址字符串
		*/
		formatParams: function(data) {
			var arr = [];
			for (var i in data) {
				arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
			}
			return arr.join('&');
		},
		/*
			内置函数
			对地址进行冒泡排序
		*/
		arrSort: function(arr) {
			var temp = [];
			for (var i = 0; i < arr.length; i++) {
				for (var j = 0; j < arr.length - i; j++) {
					if (!this.isUndefined(arr[j + 1]) && arr[j][3] < arr[j + 1][3]) {
						temp = arr[j + 1];
						arr[j + 1] = arr[j];
						arr[j] = temp;
					}
				}
			}
			return arr;
		},
		/*
			内置函数
			判断文件后缀
		*/
		getFileExt: function(filepath) {
			if (filepath != '' && !this.isUndefined(filepath)) {
				if (filepath.indexOf('?') > -1) {
					filepath = filepath.split('?')[0];
				}
				var pos = '.' + filepath.replace(/.+\./, '');
				return pos.toLowerCase();
			}
			return '';
		},
		/*
			内置函数
			判断是否是移动端
		*/
		isMobile: function() {
			if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android|ios)/i)) {
				return true;
			}
			return false;
		},
		/*
			内置函数
			搜索字符串str是否包含key
		*/
		isContains: function(str, key) {
			return str.indexOf(key) > -1;
		},
		/*
			内置函数
			给地址添加随机数
		*/
		getNewUrl: function(url) {
			if (this.isContains(url, '?')) {
				return url += '&' + this.randomString(8) + '=' + this.randomString(8);
			} else {
				return url += '?' + this.randomString(8) + '=' + this.randomString(8);
			}
		},
		/*
			共用函数
			获取clientX和clientY
		*/
		client: function(event) {
			var eve = event || window.event;
			if (this.isUndefined(eve)) {
				eve = {
					clientX: 0,
					clientY: 0
				};
			}
			return {
				x: eve.clientX + (document.documentElement.scrollLeft || this.body.scrollLeft) - this.pdCoor['x'],
				y: eve.clientY + (document.documentElement.scrollTop || this.body.scrollTop) - this.pdCoor['y']
			}
		},
		/*
			内置函数
			获取节点的绝对坐标
		*/
		getCoor: function(obj) {
			var coor = this.getXY(obj);
			return {
				x: coor['x'] - this.pdCoor['x'],
				y: coor['y'] - this.pdCoor['y']
			};
		},
		getXY: function(obj) {
			var parObj = obj;
			var left = obj.offsetLeft;
			var top = obj.offsetTop;
			while (parObj = parObj.offsetParent) {
				left += parObj.offsetLeft;
				top += parObj.offsetTop;
			}
			return {
				x: left,
				y: top
			};
		},
		/*
			内置函数
			删除本对象的所有属性
		*/
		removeChild: function() {
			if (this.playerType == 'html5video') {
				//删除计时器
				var i = 0;
				var timerArr = [this.timerError, this.timerFull, this.timerTime, this.timerBuffer, this.timerClick, this.timerLoading, this.timerCBar, this.timerVCanvas];
				for (i = 0; i < timerArr.length; i++) {
					if (timerArr[i] != null) {
						if (timerArr[i].runing) {
							timerArr[i].stop();
						}
						timerArr[i] = null;
					}
				}
				//删除事件监听
				var ltArr = this.listenerJsArr;
				for (i = 0; i < ltArr.length; i++) {
					this.removeListener(ltArr[i][0], ltArr[i][1]);
				}
			}
			this.playerType == '';
			this.V = null;
			if (this.showFace) {
				this.deleteChild(this.CB['menu']);
			}
			this.deleteChild(this.PD);
			this.CD.innerHTML = '';
		},
		/*
			内置函数
			画封闭的图形
		*/
		canvasFill: function(name, path) {
			name.beginPath();
			for (var i = 0; i < path.length; i++) {
				var d = path[i];
				if (i > 0) {
					name.lineTo(d[0], d[1]);
				} else {
					name.moveTo(d[0], d[1]);
				}
			}
			name.closePath();
			name.fill();
		},
		/*
			内置函数
			画矩形
		*/
		canvasFillRect: function(name, path) {
			for (var i = 0; i < path.length; i++) {
				var d = path[i];
				name.fillRect(d[0], d[1], d[2], d[3]);
			}
		},
		/*
			共用函数
			删除容器节点
		*/
		deleteChild: function(f) {
			var def = this.arrIndexOf(this.elementArr, f.className);
			if (def > -1) {
				this.elementArr.splice(def, 1);
			}
			var childs = f.childNodes;
			for (var i = childs.length - 1; i >= 0; i--) {
				f.removeChild(childs[i]);
			}

			if (f && f != null && f.parentNode) {
				try {
					if (f.parentNode) {
						f.parentNode.removeChild(f);

					}

				} catch(event) {}
			}
		},
		/*
			内置函数
		 	根据容器的宽高,内部节点的宽高计算出内部节点的宽高及坐标
		*/
		getProportionCoor: function(stageW, stageH, vw, vh) {
			var w = 0,
			h = 0,
			x = 0,
			y = 0;
			if (stageW / stageH < vw / vh) {
				w = stageW;
				h = w * vh / vw;
			} else {
				h = stageH;
				w = h * vw / vh;
			}
			x = (stageW - w) * 0.5;
			y = (stageH - h) * 0.5;
			return {
				width: parseInt(w),
				height: parseInt(h),
				x: parseInt(x),
				y: parseInt(y)
			};
		},
		/*
			共用函数
			将字幕文件内容转换成数组
		*/
		parseSrtSubtitles: function(srt) {
			var subtitlesArr = [];
			var textSubtitles = [];
			var i = 0;
			var arrs = srt.split('\n');
			var arr = [];
			var delHtmlTag = function(str) {
				return str.replace(/<[^>]+>/g, ''); //去掉所有的html标记
			};
			for (i = 0; i < arrs.length; i++) {
				if (arrs[i].replace(/\s/g, '').length > 0) {
					arr.push(arrs[i]);
				} else {
					if (arr.length > 0) {
						textSubtitles.push(arr);
					}
					arr = [];
				}
			}
			for (i = 0; i < textSubtitles.length; ++i) {
				var textSubtitle = textSubtitles[i];
				if (textSubtitle.length >= 2) {
					var sn = textSubtitle[0]; // 字幕的序号
					var startTime = this.toSeconds(this.trim(textSubtitle[1].split(' --> ')[0])); // 字幕的开始时间
					var endTime = this.toSeconds(this.trim(textSubtitle[1].split(' --> ')[1])); // 字幕的结束时间
					var content = [delHtmlTag(textSubtitle[2])]; // 字幕的内容
					var cktrackdelay=this.vars['cktrackdelay'];
					if(cktrackdelay!=0){
						startTime+=cktrackdelay;
						endTime+=cktrackdelay;
					}
					// 字幕可能有多行
					if (textSubtitle.length > 2) {
						for (var j = 3; j < textSubtitle.length; j++) {
							content.push(delHtmlTag(textSubtitle[j]));
						}
					}
					// 字幕对象
					var subtitle = {
						sn: sn,
						startTime: startTime,
						endTime: endTime,
						content: content
					};
					subtitlesArr.push(subtitle);
				}
			}
			return subtitlesArr;
		},
		/*
			共用函数
			计时器,该函数模拟as3中的timer原理
			time:计时时间,单位:毫秒
			fun:接受函数
			number:运行次数,不设置则无限运行
		*/
		timer: function(time, fun, number) {
			var thisTemp = this;
			this.time = 10; //运行间隔
			this.fun = null; //监听函数
			this.timeObj = null; //setInterval对象
			this.number = 0; //已运行次数
			this.numberTotal = null; //总至需要次数
			this.runing = false; //当前状态
			this.startFun = function() {
				thisTemp.number++;
				thisTemp.fun();
				if (thisTemp.numberTotal != null && thisTemp.number >= thisTemp.numberTotal) {
					thisTemp.stop();
				}
			};
			this.start = function() {
				if (!thisTemp.runing) {
					thisTemp.runing = true;
					thisTemp.timeObj = window.setInterval(thisTemp.startFun, time);
				}
			};
			this.stop = function() {
				if (thisTemp.runing) {
					thisTemp.runing = false;
					window.clearInterval(thisTemp.timeObj);
					thisTemp.timeObj = null;
				}
			};
			if (time) {
				this.time = time;
			}
			if (fun) {
				this.fun = fun;
			}
			if (number) {
				this.numberTotal = number;
			}
			this.start();
		},
		/*
			共用函数
			将时分秒转换成秒
		*/
		toSeconds: function(t) {
			var s = 0.0;
			if (t) {
				var p = t.split(':');
				for (i = 0; i < p.length; i++) {
					s = s * 60 + parseFloat(p[i].replace(',', '.'));
				}
			}
			return s;
		},
		/*将字符变成数字形式的数组*/
		arrayInt: function(str) {
			var a = str.split(',');
			var b = [];
			for (var i = 0; i < a.length; i++) {
				if (this.isUndefined(a[i])) {
					a[i] = 0;
				}
				if (a[i].substr( - 1) != '%') {
					a[i] = parseInt(a[i]);
				}
				b.push(a[i]);
			}
			return b;
		},
		/*
			共用函数
			将对象Object标准化
		*/
		standardization: function(o, n) { //n替换进o
			var h = {};
			var k;
			for (k in o) {
				h[k] = o[k];
			}
			for (k in n) {
				var type = typeof(h[k]);
				switch (type) {
				case 'number':
					h[k] = parseFloat(n[k]);
					break;
				default:
					h[k] = n[k];
					break;
				}

			}
			return h;
		},
		/*
			共用函数
			搜索数组
		 */
		arrIndexOf: function(arr, key) {
			var re = new RegExp(key, ['']);
			return (arr.toString().replace(re, '┢').replace(/[^,┢]/g, '')).indexOf('┢');
		},
		/*
			共用函数
			去掉空格
		 */
		trim: function(str) {
			if (str != '') {
				return str.replace(/(^\s*)|(\s*$)/g, '');
			}
			return '';
		},
		/*
			共用函数
			判断对象类型
		*/
		typeString:function typeString(object) {
   			return Object.prototype.toString.call(object).slice(8,-1).toLowerCase();
		},
		/*
			共用函数
			输出内容到控制台
		*/
		log: function(val) {
			try {
				console.log(val);
			} catch(e) {}
		},
		/*
			共用函数
			弹出提示
		*/
		eject: function(er, val) {
			if (!this.vars['debug']) {
				return;
			}
			var errorVal = er[1];
			if (!this.isUndefined(val)) {
				errorVal = errorVal.replace('[error]', val);
			}
			var value = 'error ' + er[0] + ':' + errorVal;
			try {
				this.log(value);
			} catch(e) {}
		}
	};
	window.ckplayer = ckplayer;
})();


//----------------------------------------------ckplay-----------------------------------------------------------------------
var JSMpeg={Player:null,VideoElement:null,BitBuffer:null,Source:{},Demuxer:{},Decoder:{},Renderer:{},AudioOutput:{},Now:function(){return window.performance?window.performance.now()/1e3:Date.now()/1e3},CreateVideoElements:function(){var elements=document.querySelectorAll(".jsmpeg");for(var i=0;i<elements.length;i++){new JSMpeg.VideoElement(elements[i])}},Fill:function(array,value){if(array.fill){array.fill(value)}else{for(var i=0;i<array.length;i++){array[i]=value}}},Base64ToArrayBuffer:function(base64){var binary=window.atob(base64);var length=binary.length;var bytes=new Uint8Array(length);for(var i=0;i<length;i++){bytes[i]=binary.charCodeAt(i)}return bytes.buffer},WASM_BINARY_INLINED:null};if(document.readyState==="complete"){JSMpeg.CreateVideoElements()}else{document.addEventListener("DOMContentLoaded",JSMpeg.CreateVideoElements)}JSMpeg.VideoElement=function(){"use strict";var VideoElement=function(element){var url=element.dataset.url;if(!url){throw"VideoElement has no `data-url` attribute"}var addStyles=function(element,styles){for(var name in styles){element.style[name]=styles[name]}};this.container=element;addStyles(this.container,{display:"inline-block",position:"relative",minWidth:"80px",minHeight:"80px"});this.canvas=document.createElement("canvas");this.canvas.width=960;this.canvas.height=540;addStyles(this.canvas,{display:"block",width:"100%"});this.container.appendChild(this.canvas);this.playButton=document.createElement("div");this.playButton.innerHTML=VideoElement.PLAY_BUTTON;addStyles(this.playButton,{zIndex:2,position:"absolute",top:"0",bottom:"0",left:"0",right:"0",maxWidth:"75px",maxHeight:"75px",margin:"auto",opacity:"0.7",cursor:"pointer"});this.container.appendChild(this.playButton);var options={canvas:this.canvas};for(var option in element.dataset){try{options[option]=JSON.parse(element.dataset[option])}catch(err){options[option]=element.dataset[option]}}this.player=new JSMpeg.Player(url,options);element.playerInstance=this.player;if(options.poster&&!options.autoplay&&!this.player.options.streaming){options.decodeFirstFrame=false;this.poster=new Image;this.poster.src=options.poster;this.poster.addEventListener("load",this.posterLoaded);addStyles(this.poster,{display:"block",zIndex:1,position:"absolute",top:0,left:0,bottom:0,right:0});this.container.appendChild(this.poster)}if(!this.player.options.streaming){this.container.addEventListener("click",this.onClick.bind(this))}if(options.autoplay||this.player.options.streaming){this.playButton.style.display="none"}if(this.player.audioOut&&!this.player.audioOut.unlocked){var unlockAudioElement=this.container;if(options.autoplay||this.player.options.streaming){this.unmuteButton=document.createElement("div");this.unmuteButton.innerHTML=VideoElement.UNMUTE_BUTTON;addStyles(this.unmuteButton,{zIndex:2,position:"absolute",bottom:"10px",right:"20px",width:"75px",height:"75px",margin:"auto",opacity:"0.7",cursor:"pointer"});this.container.appendChild(this.unmuteButton);unlockAudioElement=this.unmuteButton}this.unlockAudioBound=this.onUnlockAudio.bind(this,unlockAudioElement);unlockAudioElement.addEventListener("touchstart",this.unlockAudioBound,false);unlockAudioElement.addEventListener("click",this.unlockAudioBound,true)}};VideoElement.prototype.onUnlockAudio=function(element,ev){if(this.unmuteButton){ev.preventDefault();ev.stopPropagation()}this.player.audioOut.unlock(function(){if(this.unmuteButton){this.unmuteButton.style.display="none"}element.removeEventListener("touchstart",this.unlockAudioBound);element.removeEventListener("click",this.unlockAudioBound)}.bind(this))};VideoElement.prototype.onClick=function(ev){if(this.player.isPlaying){this.player.pause();this.playButton.style.display="block"}else{this.player.play();this.playButton.style.display="none";if(this.poster){this.poster.style.display="none"}}};VideoElement.PLAY_BUTTON='<svg style="max-width: 75px; max-height: 75px;" '+'viewBox="0 0 200 200" alt="Play video">'+'<circle cx="100" cy="100" r="90" fill="none" '+'stroke-width="15" stroke="#fff"/>'+'<polygon points="70, 55 70, 145 145, 100" fill="#fff"/>'+"</svg>";VideoElement.UNMUTE_BUTTON='<svg style="max-width: 75px; max-height: 75px;" viewBox="0 0 75 75">'+'<polygon class="audio-speaker" stroke="none" fill="#fff" '+'points="39,13 22,28 6,28 6,47 21,47 39,62 39,13"/>'+'<g stroke="#fff" stroke-width="5">'+'<path d="M 49,50 69,26"/>'+'<path d="M 69,50 49,26"/>'+"</g>"+"</svg>";return VideoElement}();JSMpeg.Player=function(){"use strict";var Player=function(url,options){this.options=options||{};if(options.source){this.source=new options.source(url,options);options.streaming=!!this.source.streaming}else if(url.match(/^wss?:\/\//)){this.source=new JSMpeg.Source.WebSocket(url,options);options.streaming=true}else if(options.progressive!==false){this.source=new JSMpeg.Source.AjaxProgressive(url,options);options.streaming=false}else{this.source=new JSMpeg.Source.Ajax(url,options);options.streaming=false}this.maxAudioLag=options.maxAudioLag||.25;this.loop=options.loop!==false;this.autoplay=!!options.autoplay||options.streaming;this.demuxer=new JSMpeg.Demuxer.TS(options);this.source.connect(this.demuxer);if(!options.disableWebAssembly&&JSMpeg.WASMModule.IsSupported()){this.wasmModule=JSMpeg.WASMModule.GetModule();options.wasmModule=this.wasmModule}if(options.video!==false){this.video=options.wasmModule?new JSMpeg.Decoder.MPEG1VideoWASM(options):new JSMpeg.Decoder.MPEG1Video(options);this.renderer=!options.disableGl&&JSMpeg.Renderer.WebGL.IsSupported()?new JSMpeg.Renderer.WebGL(options):new JSMpeg.Renderer.Canvas2D(options);this.demuxer.connect(JSMpeg.Demuxer.TS.STREAM.VIDEO_1,this.video);this.video.connect(this.renderer)}if(options.audio!==false&&JSMpeg.AudioOutput.WebAudio.IsSupported()){this.audio=options.wasmModule?new JSMpeg.Decoder.MP2AudioWASM(options):new JSMpeg.Decoder.MP2Audio(options);this.audioOut=new JSMpeg.AudioOutput.WebAudio(options);this.demuxer.connect(JSMpeg.Demuxer.TS.STREAM.AUDIO_1,this.audio);this.audio.connect(this.audioOut)}Object.defineProperty(this,"currentTime",{get:this.getCurrentTime,set:this.setCurrentTime});Object.defineProperty(this,"volume",{get:this.getVolume,set:this.setVolume});this.paused=true;this.unpauseOnShow=false;if(options.pauseWhenHidden!==false){document.addEventListener("visibilitychange",this.showHide.bind(this))}if(this.wasmModule){if(this.wasmModule.ready){this.startLoading()}else if(JSMpeg.WASM_BINARY_INLINED){var wasm=JSMpeg.Base64ToArrayBuffer(JSMpeg.WASM_BINARY_INLINED);this.wasmModule.loadFromBuffer(wasm,this.startLoading.bind(this))}else{this.wasmModule.loadFromFile("jsmpeg.wasm",this.startLoading.bind(this))}}else{this.startLoading()}};Player.prototype.startLoading=function(){this.source.start();if(this.autoplay){this.play()}};Player.prototype.showHide=function(ev){if(document.visibilityState==="hidden"){this.unpauseOnShow=this.wantsToPlay;this.pause()}else if(this.unpauseOnShow){this.play()}};Player.prototype.play=function(ev){if(this.animationId){return}this.animationId=requestAnimationFrame(this.update.bind(this));this.wantsToPlay=true;this.paused=false};Player.prototype.pause=function(ev){if(this.paused){return}cancelAnimationFrame(this.animationId);this.animationId=null;this.wantsToPlay=false;this.isPlaying=false;this.paused=true;if(this.audio&&this.audio.canPlay){this.audioOut.stop();this.seek(this.currentTime)}if(this.options.onPause){this.options.onPause(this)}};Player.prototype.getVolume=function(){return this.audioOut?this.audioOut.volume:0};Player.prototype.setVolume=function(volume){if(this.audioOut){this.audioOut.volume=volume}};Player.prototype.stop=function(ev){this.pause();this.seek(0);if(this.video&&this.options.decodeFirstFrame!==false){this.video.decode()}};Player.prototype.destroy=function(){this.pause();this.source.destroy();this.video&&this.video.destroy();this.renderer&&this.renderer.destroy();this.audio&&this.audio.destroy();this.audioOut&&this.audioOut.destroy()};Player.prototype.seek=function(time){var startOffset=this.audio&&this.audio.canPlay?this.audio.startTime:this.video.startTime;if(this.video){this.video.seek(time+startOffset)}if(this.audio){this.audio.seek(time+startOffset)}this.startTime=JSMpeg.Now()-time};Player.prototype.getCurrentTime=function(){return this.audio&&this.audio.canPlay?this.audio.currentTime-this.audio.startTime:this.video.currentTime-this.video.startTime};Player.prototype.setCurrentTime=function(time){this.seek(time)};Player.prototype.update=function(){this.animationId=requestAnimationFrame(this.update.bind(this));if(!this.source.established){if(this.renderer){this.renderer.renderProgress(this.source.progress)}return}if(!this.isPlaying){this.isPlaying=true;this.startTime=JSMpeg.Now()-this.currentTime;if(this.options.onPlay){this.options.onPlay(this)}}if(this.options.streaming){this.updateForStreaming()}else{this.updateForStaticFile()}};Player.prototype.updateForStreaming=function(){if(this.video){this.video.decode()}if(this.audio){var decoded=false;do{if(this.audioOut.enqueuedTime>this.maxAudioLag){this.audioOut.resetEnqueuedTime();this.audioOut.enabled=false}decoded=this.audio.decode()}while(decoded);this.audioOut.enabled=true}};Player.prototype.nextFrame=function(){if(this.source.established&&this.video){return this.video.decode()}return false};Player.prototype.updateForStaticFile=function(){var notEnoughData=false,headroom=0;if(this.audio&&this.audio.canPlay){while(!notEnoughData&&this.audio.decodedTime-this.audio.currentTime<.25){notEnoughData=!this.audio.decode()}if(this.video&&this.video.currentTime<this.audio.currentTime){notEnoughData=!this.video.decode()}headroom=this.demuxer.currentTime-this.audio.currentTime}else if(this.video){var targetTime=JSMpeg.Now()-this.startTime+this.video.startTime,lateTime=targetTime-this.video.currentTime,frameTime=1/this.video.frameRate;if(this.video&&lateTime>0){if(lateTime>frameTime*2){this.startTime+=lateTime}notEnoughData=!this.video.decode()}headroom=this.demuxer.currentTime-targetTime}this.source.resume(headroom);if(notEnoughData&&this.source.completed){if(this.loop){this.seek(0)}else{this.pause();if(this.options.onEnded){this.options.onEnded(this)}}}else if(notEnoughData&&this.options.onStalled){this.options.onStalled(this)}};return Player}();JSMpeg.BitBuffer=function(){"use strict";var BitBuffer=function(bufferOrLength,mode){if(typeof bufferOrLength==="object"){this.bytes=bufferOrLength instanceof Uint8Array?bufferOrLength:new Uint8Array(bufferOrLength);this.byteLength=this.bytes.length}else{this.bytes=new Uint8Array(bufferOrLength||1024*1024);this.byteLength=0}this.mode=mode||BitBuffer.MODE.EXPAND;this.index=0};BitBuffer.prototype.resize=function(size){var newBytes=new Uint8Array(size);if(this.byteLength!==0){this.byteLength=Math.min(this.byteLength,size);newBytes.set(this.bytes,0,this.byteLength)}this.bytes=newBytes;this.index=Math.min(this.index,this.byteLength<<3)};BitBuffer.prototype.evict=function(sizeNeeded){var bytePos=this.index>>3,available=this.bytes.length-this.byteLength;if(this.index===this.byteLength<<3||sizeNeeded>available+bytePos){this.byteLength=0;this.index=0;return}else if(bytePos===0){return}if(this.bytes.copyWithin){this.bytes.copyWithin(0,bytePos,this.byteLength)}else{this.bytes.set(this.bytes.subarray(bytePos,this.byteLength))}this.byteLength=this.byteLength-bytePos;this.index-=bytePos<<3;return};BitBuffer.prototype.write=function(buffers){var isArrayOfBuffers=typeof buffers[0]==="object",totalLength=0,available=this.bytes.length-this.byteLength;if(isArrayOfBuffers){var totalLength=0;for(var i=0;i<buffers.length;i++){totalLength+=buffers[i].byteLength}}else{totalLength=buffers.byteLength}if(totalLength>available){if(this.mode===BitBuffer.MODE.EXPAND){var newSize=Math.max(this.bytes.length*2,totalLength-available);this.resize(newSize)}else{this.evict(totalLength)}}if(isArrayOfBuffers){for(var i=0;i<buffers.length;i++){this.appendSingleBuffer(buffers[i])}}else{this.appendSingleBuffer(buffers)}return totalLength};BitBuffer.prototype.appendSingleBuffer=function(buffer){buffer=buffer instanceof Uint8Array?buffer:new Uint8Array(buffer);this.bytes.set(buffer,this.byteLength);this.byteLength+=buffer.length};BitBuffer.prototype.findNextStartCode=function(){for(var i=this.index+7>>3;i<this.byteLength;i++){if(this.bytes[i]==0&&this.bytes[i+1]==0&&this.bytes[i+2]==1){this.index=i+4<<3;return this.bytes[i+3]}}this.index=this.byteLength<<3;return-1};BitBuffer.prototype.findStartCode=function(code){var current=0;while(true){current=this.findNextStartCode();if(current===code||current===-1){return current}}return-1};BitBuffer.prototype.nextBytesAreStartCode=function(){var i=this.index+7>>3;return i>=this.byteLength||this.bytes[i]==0&&this.bytes[i+1]==0&&this.bytes[i+2]==1};BitBuffer.prototype.peek=function(count){var offset=this.index;var value=0;while(count){var currentByte=this.bytes[offset>>3],remaining=8-(offset&7),read=remaining<count?remaining:count,shift=remaining-read,mask=255>>8-read;value=value<<read|(currentByte&mask<<shift)>>shift;offset+=read;count-=read}return value};BitBuffer.prototype.read=function(count){var value=this.peek(count);this.index+=count;return value};BitBuffer.prototype.skip=function(count){return this.index+=count};BitBuffer.prototype.rewind=function(count){this.index=Math.max(this.index-count,0)};BitBuffer.prototype.has=function(count){return(this.byteLength<<3)-this.index>=count};BitBuffer.MODE={EVICT:1,EXPAND:2};return BitBuffer}();JSMpeg.Source.Ajax=function(){"use strict";var AjaxSource=function(url,options){this.url=url;this.destination=null;this.request=null;this.streaming=false;this.completed=false;this.established=false;this.progress=0;this.onEstablishedCallback=options.onSourceEstablished;this.onCompletedCallback=options.onSourceCompleted};AjaxSource.prototype.connect=function(destination){this.destination=destination};AjaxSource.prototype.start=function(){this.request=new XMLHttpRequest;this.request.onreadystatechange=function(){if(this.request.readyState===this.request.DONE&&this.request.status===200){this.onLoad(this.request.response)}}.bind(this);this.request.onprogress=this.onProgress.bind(this);this.request.open("GET",this.url);this.request.responseType="arraybuffer";this.request.send()};AjaxSource.prototype.resume=function(secondsHeadroom){};AjaxSource.prototype.destroy=function(){this.request.abort()};AjaxSource.prototype.onProgress=function(ev){this.progress=ev.loaded/ev.total};AjaxSource.prototype.onLoad=function(data){this.established=true;this.completed=true;this.progress=1;if(this.onEstablishedCallback){this.onEstablishedCallback(this)}if(this.onCompletedCallback){this.onCompletedCallback(this)}if(this.destination){this.destination.write(data)}};return AjaxSource}();JSMpeg.Source.Fetch=function(){"use strict";var FetchSource=function(url,options){this.url=url;this.destination=null;this.request=null;this.streaming=true;this.completed=false;this.established=false;this.progress=0;this.aborted=false;this.onEstablishedCallback=options.onSourceEstablished;this.onCompletedCallback=options.onSourceCompleted};FetchSource.prototype.connect=function(destination){this.destination=destination};FetchSource.prototype.start=function(){var params={method:"GET",headers:new Headers,cache:"default"};self.fetch(this.url,params).then(function(res){if(res.ok&&(res.status>=200&&res.status<=299)){this.progress=1;this.established=true;return this.pump(res.body.getReader())}else{}}.bind(this)).catch(function(err){throw err})};FetchSource.prototype.pump=function(reader){return reader.read().then(function(result){if(result.done){this.completed=true}else{if(this.aborted){return reader.cancel()}if(this.destination){this.destination.write(result.value.buffer)}return this.pump(reader)}}.bind(this)).catch(function(err){throw err})};FetchSource.prototype.resume=function(secondsHeadroom){};FetchSource.prototype.abort=function(){this.aborted=true};return FetchSource}();JSMpeg.Source.AjaxProgressive=function(){"use strict";var AjaxProgressiveSource=function(url,options){this.url=url;this.destination=null;this.request=null;this.streaming=false;this.completed=false;this.established=false;this.progress=0;this.fileSize=0;this.loadedSize=0;this.chunkSize=options.chunkSize||1024*1024;this.isLoading=false;this.loadStartTime=0;this.throttled=options.throttled!==false;this.aborted=false;this.onEstablishedCallback=options.onSourceEstablished;this.onCompletedCallback=options.onSourceCompleted};AjaxProgressiveSource.prototype.connect=function(destination){this.destination=destination};AjaxProgressiveSource.prototype.start=function(){this.request=new XMLHttpRequest;this.request.onreadystatechange=function(){if(this.request.readyState===this.request.DONE){this.fileSize=parseInt(this.request.getResponseHeader("Content-Length"));this.loadNextChunk()}}.bind(this);this.request.onprogress=this.onProgress.bind(this);this.request.open("HEAD",this.url);this.request.send()};AjaxProgressiveSource.prototype.resume=function(secondsHeadroom){if(this.isLoading||!this.throttled){return}var worstCaseLoadingTime=this.loadTime*8+2;if(worstCaseLoadingTime>secondsHeadroom){this.loadNextChunk()}};AjaxProgressiveSource.prototype.destroy=function(){this.request.abort();this.aborted=true};AjaxProgressiveSource.prototype.loadNextChunk=function(){var start=this.loadedSize,end=Math.min(this.loadedSize+this.chunkSize-1,this.fileSize-1);if(start>=this.fileSize||this.aborted){this.completed=true;if(this.onCompletedCallback){this.onCompletedCallback(this)}return}this.isLoading=true;this.loadStartTime=JSMpeg.Now();this.request=new XMLHttpRequest;this.request.onreadystatechange=function(){if(this.request.readyState===this.request.DONE&&this.request.status>=200&&this.request.status<300){this.onChunkLoad(this.request.response)}else if(this.request.readyState===this.request.DONE){if(this.loadFails++<3){this.loadNextChunk()}}}.bind(this);if(start===0){this.request.onprogress=this.onProgress.bind(this)}this.request.open("GET",this.url+"?"+start+"-"+end);this.request.setRequestHeader("Range","bytes="+start+"-"+end);this.request.responseType="arraybuffer";this.request.send()};AjaxProgressiveSource.prototype.onProgress=function(ev){this.progress=ev.loaded/ev.total};AjaxProgressiveSource.prototype.onChunkLoad=function(data){var isFirstChunk=!this.established;this.established=true;this.progress=1;this.loadedSize+=data.byteLength;this.loadFails=0;this.isLoading=false;if(isFirstChunk&&this.onEstablishedCallback){this.onEstablishedCallback(this)}if(this.destination){this.destination.write(data)}this.loadTime=JSMpeg.Now()-this.loadStartTime;if(!this.throttled){this.loadNextChunk()}};return AjaxProgressiveSource}();JSMpeg.Source.WebSocket=function(){"use strict";var WSSource=function(url,options){this.url=url;this.options=options;this.socket=null;this.streaming=true;this.callbacks={connect:[],data:[]};this.destination=null;this.reconnectInterval=options.reconnectInterval!==undefined?options.reconnectInterval:5;this.shouldAttemptReconnect=!!this.reconnectInterval;this.completed=false;this.established=false;this.progress=0;this.reconnectTimeoutId=0;this.onEstablishedCallback=options.onSourceEstablished;this.onCompletedCallback=options.onSourceCompleted};WSSource.prototype.connect=function(destination){this.destination=destination};WSSource.prototype.destroy=function(){clearTimeout(this.reconnectTimeoutId);this.shouldAttemptReconnect=false;this.socket.close()};WSSource.prototype.start=function(){this.shouldAttemptReconnect=!!this.reconnectInterval;this.progress=0;this.established=false;this.socket=new WebSocket(this.url,this.options.protocols||null);this.socket.binaryType="arraybuffer";this.socket.onmessage=this.onMessage.bind(this);this.socket.onopen=this.onOpen.bind(this);this.socket.onerror=this.onClose.bind(this);this.socket.onclose=this.onClose.bind(this)};WSSource.prototype.resume=function(secondsHeadroom){};WSSource.prototype.onOpen=function(){this.progress=1};WSSource.prototype.onClose=function(){if(this.shouldAttemptReconnect){clearTimeout(this.reconnectTimeoutId);this.reconnectTimeoutId=setTimeout(function(){this.start()}.bind(this),this.reconnectInterval*1e3)}};WSSource.prototype.onMessage=function(ev){var isFirstChunk=!this.established;this.established=true;if(isFirstChunk&&this.onEstablishedCallback){this.onEstablishedCallback(this)}if(this.destination){this.destination.write(ev.data)}};return WSSource}();JSMpeg.Demuxer.TS=function(){"use strict";var TS=function(options){this.bits=null;this.leftoverBytes=null;this.guessVideoFrameEnd=true;this.pidsToStreamIds={};this.pesPacketInfo={};this.startTime=0;this.currentTime=0};TS.prototype.connect=function(streamId,destination){this.pesPacketInfo[streamId]={destination:destination,currentLength:0,totalLength:0,pts:0,buffers:[]}};TS.prototype.write=function(buffer){if(this.leftoverBytes){var totalLength=buffer.byteLength+this.leftoverBytes.byteLength;this.bits=new JSMpeg.BitBuffer(totalLength);this.bits.write([this.leftoverBytes,buffer])}else{this.bits=new JSMpeg.BitBuffer(buffer)}while(this.bits.has(188<<3)&&this.parsePacket()){}var leftoverCount=this.bits.byteLength-(this.bits.index>>3);this.leftoverBytes=leftoverCount>0?this.bits.bytes.subarray(this.bits.index>>3):null};TS.prototype.parsePacket=function(){if(this.bits.read(8)!==71){if(!this.resync()){return false}}var end=(this.bits.index>>3)+187;var transportError=this.bits.read(1),payloadStart=this.bits.read(1),transportPriority=this.bits.read(1),pid=this.bits.read(13),transportScrambling=this.bits.read(2),adaptationField=this.bits.read(2),continuityCounter=this.bits.read(4);var streamId=this.pidsToStreamIds[pid];if(payloadStart&&streamId){var pi=this.pesPacketInfo[streamId];if(pi&&pi.currentLength){this.packetComplete(pi)}}if(adaptationField&1){if(adaptationField&2){var adaptationFieldLength=this.bits.read(8);this.bits.skip(adaptationFieldLength<<3)}if(payloadStart&&this.bits.nextBytesAreStartCode()){this.bits.skip(24);streamId=this.bits.read(8);this.pidsToStreamIds[pid]=streamId;var packetLength=this.bits.read(16);this.bits.skip(8);var ptsDtsFlag=this.bits.read(2);this.bits.skip(6);var headerLength=this.bits.read(8);var payloadBeginIndex=this.bits.index+(headerLength<<3);var pi=this.pesPacketInfo[streamId];if(pi){var pts=0;if(ptsDtsFlag&2){this.bits.skip(4);var p32_30=this.bits.read(3);this.bits.skip(1);var p29_15=this.bits.read(15);this.bits.skip(1);var p14_0=this.bits.read(15);this.bits.skip(1);pts=(p32_30*1073741824+p29_15*32768+p14_0)/9e4;this.currentTime=pts;if(this.startTime===-1){this.startTime=pts}}var payloadLength=packetLength?packetLength-headerLength-3:0;this.packetStart(pi,pts,payloadLength)}this.bits.index=payloadBeginIndex}if(streamId){var pi=this.pesPacketInfo[streamId];if(pi){var start=this.bits.index>>3;var complete=this.packetAddData(pi,start,end);var hasPadding=!payloadStart&&adaptationField&2;if(complete||this.guessVideoFrameEnd&&hasPadding){this.packetComplete(pi)}}}}this.bits.index=end<<3;return true};TS.prototype.resync=function(){if(!this.bits.has(188*6<<3)){return false}var byteIndex=this.bits.index>>3;for(var i=0;i<187;i++){if(this.bits.bytes[byteIndex+i]===71){var foundSync=true;for(var j=1;j<5;j++){if(this.bits.bytes[byteIndex+i+188*j]!==71){foundSync=false;break}}if(foundSync){this.bits.index=byteIndex+i+1<<3;return true}}}console.warn("JSMpeg: Possible garbage data. Skipping.");this.bits.skip(187<<3);return false};TS.prototype.packetStart=function(pi,pts,payloadLength){pi.totalLength=payloadLength;pi.currentLength=0;pi.pts=pts};TS.prototype.packetAddData=function(pi,start,end){pi.buffers.push(this.bits.bytes.subarray(start,end));pi.currentLength+=end-start;var complete=pi.totalLength!==0&&pi.currentLength>=pi.totalLength;return complete};TS.prototype.packetComplete=function(pi){pi.destination.write(pi.pts,pi.buffers);pi.totalLength=0;pi.currentLength=0;pi.buffers=[]};TS.STREAM={PACK_HEADER:186,SYSTEM_HEADER:187,PROGRAM_MAP:188,PRIVATE_1:189,PADDING:190,PRIVATE_2:191,AUDIO_1:192,VIDEO_1:224,DIRECTORY:255};return TS}();JSMpeg.Decoder.Base=function(){"use strict";var BaseDecoder=function(options){this.destination=null;this.canPlay=false;this.collectTimestamps=!options.streaming;this.bytesWritten=0;this.timestamps=[];this.timestampIndex=0;this.startTime=0;this.decodedTime=0;Object.defineProperty(this,"currentTime",{get:this.getCurrentTime})};BaseDecoder.prototype.destroy=function(){};BaseDecoder.prototype.connect=function(destination){this.destination=destination};BaseDecoder.prototype.bufferGetIndex=function(){return this.bits.index};BaseDecoder.prototype.bufferSetIndex=function(index){this.bits.index=index};BaseDecoder.prototype.bufferWrite=function(buffers){return this.bits.write(buffers)};BaseDecoder.prototype.write=function(pts,buffers){if(this.collectTimestamps){if(this.timestamps.length===0){this.startTime=pts;this.decodedTime=pts}this.timestamps.push({index:this.bytesWritten<<3,time:pts})}this.bytesWritten+=this.bufferWrite(buffers);this.canPlay=true};BaseDecoder.prototype.seek=function(time){if(!this.collectTimestamps){return}this.timestampIndex=0;for(var i=0;i<this.timestamps.length;i++){if(this.timestamps[i].time>time){break}this.timestampIndex=i}var ts=this.timestamps[this.timestampIndex];if(ts){this.bufferSetIndex(ts.index);this.decodedTime=ts.time}else{this.bufferSetIndex(0);this.decodedTime=this.startTime}};BaseDecoder.prototype.decode=function(){this.advanceDecodedTime(0)};BaseDecoder.prototype.advanceDecodedTime=function(seconds){if(this.collectTimestamps){var newTimestampIndex=-1;var currentIndex=this.bufferGetIndex();for(var i=this.timestampIndex;i<this.timestamps.length;i++){if(this.timestamps[i].index>currentIndex){break}newTimestampIndex=i}if(newTimestampIndex!==-1&&newTimestampIndex!==this.timestampIndex){this.timestampIndex=newTimestampIndex;this.decodedTime=this.timestamps[this.timestampIndex].time;return}}this.decodedTime+=seconds};BaseDecoder.prototype.getCurrentTime=function(){return this.decodedTime};return BaseDecoder}();JSMpeg.Decoder.MPEG1Video=function(){"use strict";var MPEG1=function(options){JSMpeg.Decoder.Base.call(this,options);this.onDecodeCallback=options.onVideoDecode;var bufferSize=options.videoBufferSize||512*1024;var bufferMode=options.streaming?JSMpeg.BitBuffer.MODE.EVICT:JSMpeg.BitBuffer.MODE.EXPAND;this.bits=new JSMpeg.BitBuffer(bufferSize,bufferMode);this.customIntraQuantMatrix=new Uint8Array(64);this.customNonIntraQuantMatrix=new Uint8Array(64);this.blockData=new Int32Array(64);this.currentFrame=0;this.decodeFirstFrame=options.decodeFirstFrame!==false};MPEG1.prototype=Object.create(JSMpeg.Decoder.Base.prototype);MPEG1.prototype.constructor=MPEG1;MPEG1.prototype.write=function(pts,buffers){JSMpeg.Decoder.Base.prototype.write.call(this,pts,buffers);if(!this.hasSequenceHeader){if(this.bits.findStartCode(MPEG1.START.SEQUENCE)===-1){return false}this.decodeSequenceHeader();if(this.decodeFirstFrame){this.decode()}}};MPEG1.prototype.decode=function(){var startTime=JSMpeg.Now();if(!this.hasSequenceHeader){return false}if(this.bits.findStartCode(MPEG1.START.PICTURE)===-1){var bufferedBytes=this.bits.byteLength-(this.bits.index>>3);return false}this.decodePicture();this.advanceDecodedTime(1/this.frameRate);var elapsedTime=JSMpeg.Now()-startTime;if(this.onDecodeCallback){this.onDecodeCallback(this,elapsedTime)}return true};MPEG1.prototype.readHuffman=function(codeTable){var state=0;do{state=codeTable[state+this.bits.read(1)]}while(state>=0&&codeTable[state]!==0);return codeTable[state+2]};MPEG1.prototype.frameRate=30;MPEG1.prototype.decodeSequenceHeader=function(){var newWidth=this.bits.read(12),newHeight=this.bits.read(12);this.bits.skip(4);this.frameRate=MPEG1.PICTURE_RATE[this.bits.read(4)];this.bits.skip(18+1+10+1);if(newWidth!==this.width||newHeight!==this.height){this.width=newWidth;this.height=newHeight;this.initBuffers();if(this.destination){this.destination.resize(newWidth,newHeight)}}if(this.bits.read(1)){for(var i=0;i<64;i++){this.customIntraQuantMatrix[MPEG1.ZIG_ZAG[i]]=this.bits.read(8)}this.intraQuantMatrix=this.customIntraQuantMatrix}if(this.bits.read(1)){for(var i=0;i<64;i++){var idx=MPEG1.ZIG_ZAG[i];this.customNonIntraQuantMatrix[idx]=this.bits.read(8)}this.nonIntraQuantMatrix=this.customNonIntraQuantMatrix}this.hasSequenceHeader=true};MPEG1.prototype.initBuffers=function(){this.intraQuantMatrix=MPEG1.DEFAULT_INTRA_QUANT_MATRIX;this.nonIntraQuantMatrix=MPEG1.DEFAULT_NON_INTRA_QUANT_MATRIX;this.mbWidth=this.width+15>>4;this.mbHeight=this.height+15>>4;this.mbSize=this.mbWidth*this.mbHeight;this.codedWidth=this.mbWidth<<4;this.codedHeight=this.mbHeight<<4;this.codedSize=this.codedWidth*this.codedHeight;this.halfWidth=this.mbWidth<<3;this.halfHeight=this.mbHeight<<3;this.currentY=new Uint8ClampedArray(this.codedSize);this.currentY32=new Uint32Array(this.currentY.buffer);this.currentCr=new Uint8ClampedArray(this.codedSize>>2);this.currentCr32=new Uint32Array(this.currentCr.buffer);this.currentCb=new Uint8ClampedArray(this.codedSize>>2);this.currentCb32=new Uint32Array(this.currentCb.buffer);this.forwardY=new Uint8ClampedArray(this.codedSize);this.forwardY32=new Uint32Array(this.forwardY.buffer);this.forwardCr=new Uint8ClampedArray(this.codedSize>>2);this.forwardCr32=new Uint32Array(this.forwardCr.buffer);this.forwardCb=new Uint8ClampedArray(this.codedSize>>2);this.forwardCb32=new Uint32Array(this.forwardCb.buffer)};MPEG1.prototype.currentY=null;MPEG1.prototype.currentCr=null;MPEG1.prototype.currentCb=null;MPEG1.prototype.pictureType=0;MPEG1.prototype.forwardY=null;MPEG1.prototype.forwardCr=null;MPEG1.prototype.forwardCb=null;MPEG1.prototype.fullPelForward=false;MPEG1.prototype.forwardFCode=0;MPEG1.prototype.forwardRSize=0;MPEG1.prototype.forwardF=0;MPEG1.prototype.decodePicture=function(skipOutput){this.currentFrame++;this.bits.skip(10);this.pictureType=this.bits.read(3);this.bits.skip(16);if(this.pictureType<=0||this.pictureType>=MPEG1.PICTURE_TYPE.B){return}if(this.pictureType===MPEG1.PICTURE_TYPE.PREDICTIVE){this.fullPelForward=this.bits.read(1);this.forwardFCode=this.bits.read(3);if(this.forwardFCode===0){return}this.forwardRSize=this.forwardFCode-1;this.forwardF=1<<this.forwardRSize}var code=0;do{code=this.bits.findNextStartCode()}while(code===MPEG1.START.EXTENSION||code===MPEG1.START.USER_DATA);while(code>=MPEG1.START.SLICE_FIRST&&code<=MPEG1.START.SLICE_LAST){this.decodeSlice(code&255);code=this.bits.findNextStartCode()}if(code!==-1){this.bits.rewind(32)}if(this.destination){this.destination.render(this.currentY,this.currentCr,this.currentCb,true)}if(this.pictureType===MPEG1.PICTURE_TYPE.INTRA||this.pictureType===MPEG1.PICTURE_TYPE.PREDICTIVE){var tmpY=this.forwardY,tmpY32=this.forwardY32,tmpCr=this.forwardCr,tmpCr32=this.forwardCr32,tmpCb=this.forwardCb,tmpCb32=this.forwardCb32;this.forwardY=this.currentY;this.forwardY32=this.currentY32;this.forwardCr=this.currentCr;this.forwardCr32=this.currentCr32;this.forwardCb=this.currentCb;this.forwardCb32=this.currentCb32;this.currentY=tmpY;this.currentY32=tmpY32;this.currentCr=tmpCr;this.currentCr32=tmpCr32;this.currentCb=tmpCb;this.currentCb32=tmpCb32}};MPEG1.prototype.quantizerScale=0;MPEG1.prototype.sliceBegin=false;MPEG1.prototype.decodeSlice=function(slice){this.sliceBegin=true;this.macroblockAddress=(slice-1)*this.mbWidth-1;this.motionFwH=this.motionFwHPrev=0;this.motionFwV=this.motionFwVPrev=0;this.dcPredictorY=128;this.dcPredictorCr=128;this.dcPredictorCb=128;this.quantizerScale=this.bits.read(5);while(this.bits.read(1)){this.bits.skip(8)}do{this.decodeMacroblock()}while(!this.bits.nextBytesAreStartCode())};MPEG1.prototype.macroblockAddress=0;MPEG1.prototype.mbRow=0;MPEG1.prototype.mbCol=0;MPEG1.prototype.macroblockType=0;MPEG1.prototype.macroblockIntra=false;MPEG1.prototype.macroblockMotFw=false;MPEG1.prototype.motionFwH=0;MPEG1.prototype.motionFwV=0;MPEG1.prototype.motionFwHPrev=0;MPEG1.prototype.motionFwVPrev=0;MPEG1.prototype.decodeMacroblock=function(){var increment=0,t=this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);while(t===34){t=this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT)}while(t===35){increment+=33;t=this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT)}increment+=t;if(this.sliceBegin){this.sliceBegin=false;this.macroblockAddress+=increment}else{if(this.macroblockAddress+increment>=this.mbSize){return}if(increment>1){this.dcPredictorY=128;this.dcPredictorCr=128;this.dcPredictorCb=128;if(this.pictureType===MPEG1.PICTURE_TYPE.PREDICTIVE){this.motionFwH=this.motionFwHPrev=0;this.motionFwV=this.motionFwVPrev=0}}while(increment>1){this.macroblockAddress++;this.mbRow=this.macroblockAddress/this.mbWidth|0;this.mbCol=this.macroblockAddress%this.mbWidth;this.copyMacroblock(this.motionFwH,this.motionFwV,this.forwardY,this.forwardCr,this.forwardCb);increment--}this.macroblockAddress++}this.mbRow=this.macroblockAddress/this.mbWidth|0;this.mbCol=this.macroblockAddress%this.mbWidth;var mbTable=MPEG1.MACROBLOCK_TYPE[this.pictureType];this.macroblockType=this.readHuffman(mbTable);this.macroblockIntra=this.macroblockType&1;this.macroblockMotFw=this.macroblockType&8;if((this.macroblockType&16)!==0){this.quantizerScale=this.bits.read(5)}if(this.macroblockIntra){this.motionFwH=this.motionFwHPrev=0;this.motionFwV=this.motionFwVPrev=0}else{this.dcPredictorY=128;this.dcPredictorCr=128;this.dcPredictorCb=128;this.decodeMotionVectors();this.copyMacroblock(this.motionFwH,this.motionFwV,this.forwardY,this.forwardCr,this.forwardCb)}var cbp=(this.macroblockType&2)!==0?this.readHuffman(MPEG1.CODE_BLOCK_PATTERN):this.macroblockIntra?63:0;for(var block=0,mask=32;block<6;block++){if((cbp&mask)!==0){this.decodeBlock(block)}mask>>=1}};MPEG1.prototype.decodeMotionVectors=function(){var code,d,r=0;if(this.macroblockMotFw){code=this.readHuffman(MPEG1.MOTION);if(code!==0&&this.forwardF!==1){r=this.bits.read(this.forwardRSize);d=(Math.abs(code)-1<<this.forwardRSize)+r+1;if(code<0){d=-d}}else{d=code}this.motionFwHPrev+=d;if(this.motionFwHPrev>(this.forwardF<<4)-1){this.motionFwHPrev-=this.forwardF<<5}else if(this.motionFwHPrev<-this.forwardF<<4){this.motionFwHPrev+=this.forwardF<<5}this.motionFwH=this.motionFwHPrev;if(this.fullPelForward){this.motionFwH<<=1}code=this.readHuffman(MPEG1.MOTION);if(code!==0&&this.forwardF!==1){r=this.bits.read(this.forwardRSize);d=(Math.abs(code)-1<<this.forwardRSize)+r+1;if(code<0){d=-d}}else{d=code}this.motionFwVPrev+=d;if(this.motionFwVPrev>(this.forwardF<<4)-1){this.motionFwVPrev-=this.forwardF<<5}else if(this.motionFwVPrev<-this.forwardF<<4){this.motionFwVPrev+=this.forwardF<<5}this.motionFwV=this.motionFwVPrev;if(this.fullPelForward){this.motionFwV<<=1}}else if(this.pictureType===MPEG1.PICTURE_TYPE.PREDICTIVE){this.motionFwH=this.motionFwHPrev=0;this.motionFwV=this.motionFwVPrev=0}};MPEG1.prototype.copyMacroblock=function(motionH,motionV,sY,sCr,sCb){var width,scan,H,V,oddH,oddV,src,dest,last;var dY=this.currentY32,dCb=this.currentCb32,dCr=this.currentCr32;width=this.codedWidth;scan=width-16;H=motionH>>1;V=motionV>>1;oddH=(motionH&1)===1;oddV=(motionV&1)===1;src=((this.mbRow<<4)+V)*width+(this.mbCol<<4)+H;dest=this.mbRow*width+this.mbCol<<2;last=dest+(width<<2);var x,y1,y2,y;if(oddH){if(oddV){while(dest<last){y1=sY[src]+sY[src+width];src++;for(x=0;x<4;x++){y2=sY[src]+sY[src+width];src++;y=y1+y2+2>>2&255;y1=sY[src]+sY[src+width];src++;y|=y1+y2+2<<6&65280;y2=sY[src]+sY[src+width];src++;y|=y1+y2+2<<14&16711680;y1=sY[src]+sY[src+width];src++;y|=y1+y2+2<<22&4278190080;dY[dest++]=y}dest+=scan>>2;src+=scan-1}}else{while(dest<last){y1=sY[src++];for(x=0;x<4;x++){y2=sY[src++];y=y1+y2+1>>1&255;y1=sY[src++];y|=y1+y2+1<<7&65280;y2=sY[src++];y|=y1+y2+1<<15&16711680;y1=sY[src++];y|=y1+y2+1<<23&4278190080;dY[dest++]=y}dest+=scan>>2;src+=scan-1}}}else{if(oddV){while(dest<last){for(x=0;x<4;x++){y=sY[src]+sY[src+width]+1>>1&255;src++;y|=sY[src]+sY[src+width]+1<<7&65280;src++;y|=sY[src]+sY[src+width]+1<<15&16711680;src++;y|=sY[src]+sY[src+width]+1<<23&4278190080;src++;dY[dest++]=y}dest+=scan>>2;src+=scan}}else{while(dest<last){for(x=0;x<4;x++){y=sY[src];src++;y|=sY[src]<<8;src++;y|=sY[src]<<16;src++;y|=sY[src]<<24;src++;dY[dest++]=y}dest+=scan>>2;src+=scan}}}width=this.halfWidth;scan=width-8;H=motionH/2>>1;V=motionV/2>>1;oddH=(motionH/2&1)===1;oddV=(motionV/2&1)===1;src=((this.mbRow<<3)+V)*width+(this.mbCol<<3)+H;dest=this.mbRow*width+this.mbCol<<1;last=dest+(width<<1);var cr1,cr2,cr,cb1,cb2,cb;if(oddH){if(oddV){while(dest<last){cr1=sCr[src]+sCr[src+width];cb1=sCb[src]+sCb[src+width];src++;for(x=0;x<2;x++){cr2=sCr[src]+sCr[src+width];cb2=sCb[src]+sCb[src+width];src++;cr=cr1+cr2+2>>2&255;cb=cb1+cb2+2>>2&255;cr1=sCr[src]+sCr[src+width];cb1=sCb[src]+sCb[src+width];src++;cr|=cr1+cr2+2<<6&65280;cb|=cb1+cb2+2<<6&65280;cr2=sCr[src]+sCr[src+width];cb2=sCb[src]+sCb[src+width];src++;cr|=cr1+cr2+2<<14&16711680;cb|=cb1+cb2+2<<14&16711680;cr1=sCr[src]+sCr[src+width];cb1=sCb[src]+sCb[src+width];src++;cr|=cr1+cr2+2<<22&4278190080;cb|=cb1+cb2+2<<22&4278190080;dCr[dest]=cr;dCb[dest]=cb;dest++}dest+=scan>>2;src+=scan-1}}else{while(dest<last){cr1=sCr[src];cb1=sCb[src];src++;for(x=0;x<2;x++){cr2=sCr[src];cb2=sCb[src++];cr=cr1+cr2+1>>1&255;cb=cb1+cb2+1>>1&255;cr1=sCr[src];cb1=sCb[src++];cr|=cr1+cr2+1<<7&65280;cb|=cb1+cb2+1<<7&65280;cr2=sCr[src];cb2=sCb[src++];cr|=cr1+cr2+1<<15&16711680;cb|=cb1+cb2+1<<15&16711680;cr1=sCr[src];cb1=sCb[src++];cr|=cr1+cr2+1<<23&4278190080;cb|=cb1+cb2+1<<23&4278190080;dCr[dest]=cr;dCb[dest]=cb;dest++}dest+=scan>>2;src+=scan-1}}}else{if(oddV){while(dest<last){for(x=0;x<2;x++){cr=sCr[src]+sCr[src+width]+1>>1&255;cb=sCb[src]+sCb[src+width]+1>>1&255;src++;cr|=sCr[src]+sCr[src+width]+1<<7&65280;cb|=sCb[src]+sCb[src+width]+1<<7&65280;src++;cr|=sCr[src]+sCr[src+width]+1<<15&16711680;cb|=sCb[src]+sCb[src+width]+1<<15&16711680;src++;cr|=sCr[src]+sCr[src+width]+1<<23&4278190080;cb|=sCb[src]+sCb[src+width]+1<<23&4278190080;src++;dCr[dest]=cr;dCb[dest]=cb;dest++}dest+=scan>>2;src+=scan}}else{while(dest<last){for(x=0;x<2;x++){cr=sCr[src];cb=sCb[src];src++;cr|=sCr[src]<<8;cb|=sCb[src]<<8;src++;cr|=sCr[src]<<16;cb|=sCb[src]<<16;src++;cr|=sCr[src]<<24;cb|=sCb[src]<<24;src++;dCr[dest]=cr;dCb[dest]=cb;dest++}dest+=scan>>2;src+=scan}}}};MPEG1.prototype.dcPredictorY=0;MPEG1.prototype.dcPredictorCr=0;MPEG1.prototype.dcPredictorCb=0;MPEG1.prototype.blockData=null;MPEG1.prototype.decodeBlock=function(block){var n=0,quantMatrix;if(this.macroblockIntra){var predictor,dctSize;if(block<4){predictor=this.dcPredictorY;dctSize=this.readHuffman(MPEG1.DCT_DC_SIZE_LUMINANCE)}else{predictor=block===4?this.dcPredictorCr:this.dcPredictorCb;dctSize=this.readHuffman(MPEG1.DCT_DC_SIZE_CHROMINANCE)}if(dctSize>0){var differential=this.bits.read(dctSize);if((differential&1<<dctSize-1)!==0){this.blockData[0]=predictor+differential}else{this.blockData[0]=predictor+(-1<<dctSize|differential+1)}}else{this.blockData[0]=predictor}if(block<4){this.dcPredictorY=this.blockData[0]}else if(block===4){this.dcPredictorCr=this.blockData[0]}else{this.dcPredictorCb=this.blockData[0]}this.blockData[0]<<=3+5;quantMatrix=this.intraQuantMatrix;n=1}else{quantMatrix=this.nonIntraQuantMatrix}var level=0;while(true){var run=0,coeff=this.readHuffman(MPEG1.DCT_COEFF);if(coeff===1&&n>0&&this.bits.read(1)===0){break}if(coeff===65535){run=this.bits.read(6);level=this.bits.read(8);if(level===0){level=this.bits.read(8)}else if(level===128){level=this.bits.read(8)-256}else if(level>128){level=level-256}}else{run=coeff>>8;level=coeff&255;if(this.bits.read(1)){level=-level}}n+=run;var dezigZagged=MPEG1.ZIG_ZAG[n];n++;level<<=1;if(!this.macroblockIntra){level+=level<0?-1:1}level=level*this.quantizerScale*quantMatrix[dezigZagged]>>4;if((level&1)===0){level-=level>0?1:-1}if(level>2047){level=2047}else if(level<-2048){level=-2048}this.blockData[dezigZagged]=level*MPEG1.PREMULTIPLIER_MATRIX[dezigZagged]}var destArray,destIndex,scan;if(block<4){destArray=this.currentY;scan=this.codedWidth-8;destIndex=this.mbRow*this.codedWidth+this.mbCol<<4;if((block&1)!==0){destIndex+=8}if((block&2)!==0){destIndex+=this.codedWidth<<3}}else{destArray=block===4?this.currentCb:this.currentCr;scan=(this.codedWidth>>1)-8;destIndex=(this.mbRow*this.codedWidth<<2)+(this.mbCol<<3)}if(this.macroblockIntra){if(n===1){MPEG1.CopyValueToDestination(this.blockData[0]+128>>8,destArray,destIndex,scan);this.blockData[0]=0}else{MPEG1.IDCT(this.blockData);MPEG1.CopyBlockToDestination(this.blockData,destArray,destIndex,scan);JSMpeg.Fill(this.blockData,0)}}else{if(n===1){MPEG1.AddValueToDestination(this.blockData[0]+128>>8,destArray,destIndex,scan);this.blockData[0]=0}else{MPEG1.IDCT(this.blockData);MPEG1.AddBlockToDestination(this.blockData,destArray,destIndex,scan);JSMpeg.Fill(this.blockData,0)}}n=0};MPEG1.CopyBlockToDestination=function(block,dest,index,scan){for(var n=0;n<64;n+=8,index+=scan+8){dest[index+0]=block[n+0];dest[index+1]=block[n+1];dest[index+2]=block[n+2];dest[index+3]=block[n+3];dest[index+4]=block[n+4];dest[index+5]=block[n+5];dest[index+6]=block[n+6];dest[index+7]=block[n+7]}};MPEG1.AddBlockToDestination=function(block,dest,index,scan){for(var n=0;n<64;n+=8,index+=scan+8){dest[index+0]+=block[n+0];dest[index+1]+=block[n+1];dest[index+2]+=block[n+2];dest[index+3]+=block[n+3];dest[index+4]+=block[n+4];dest[index+5]+=block[n+5];dest[index+6]+=block[n+6];dest[index+7]+=block[n+7]}};MPEG1.CopyValueToDestination=function(value,dest,index,scan){for(var n=0;n<64;n+=8,index+=scan+8){dest[index+0]=value;dest[index+1]=value;dest[index+2]=value;dest[index+3]=value;dest[index+4]=value;dest[index+5]=value;dest[index+6]=value;dest[index+7]=value}};MPEG1.AddValueToDestination=function(value,dest,index,scan){for(var n=0;n<64;n+=8,index+=scan+8){dest[index+0]+=value;dest[index+1]+=value;dest[index+2]+=value;dest[index+3]+=value;dest[index+4]+=value;dest[index+5]+=value;dest[index+6]+=value;dest[index+7]+=value}};MPEG1.IDCT=function(block){var b1,b3,b4,b6,b7,tmp1,tmp2,m0,x0,x1,x2,x3,x4,y3,y4,y5,y6,y7;for(var i=0;i<8;++i){b1=block[4*8+i];b3=block[2*8+i]+block[6*8+i];b4=block[5*8+i]-block[3*8+i];tmp1=block[1*8+i]+block[7*8+i];tmp2=block[3*8+i]+block[5*8+i];b6=block[1*8+i]-block[7*8+i];b7=tmp1+tmp2;m0=block[0*8+i];x4=(b6*473-b4*196+128>>8)-b7;x0=x4-((tmp1-tmp2)*362+128>>8);x1=m0-b1;x2=((block[2*8+i]-block[6*8+i])*362+128>>8)-b3;x3=m0+b1;y3=x1+x2;y4=x3+b3;y5=x1-x2;y6=x3-b3;y7=-x0-(b4*473+b6*196+128>>8);block[0*8+i]=b7+y4;block[1*8+i]=x4+y3;block[2*8+i]=y5-x0;block[3*8+i]=y6-y7;block[4*8+i]=y6+y7;block[5*8+i]=x0+y5;block[6*8+i]=y3-x4;block[7*8+i]=y4-b7}for(var i=0;i<64;i+=8){b1=block[4+i];b3=block[2+i]+block[6+i];b4=block[5+i]-block[3+i];tmp1=block[1+i]+block[7+i];tmp2=block[3+i]+block[5+i];b6=block[1+i]-block[7+i];b7=tmp1+tmp2;m0=block[0+i];x4=(b6*473-b4*196+128>>8)-b7;x0=x4-((tmp1-tmp2)*362+128>>8);x1=m0-b1;x2=((block[2+i]-block[6+i])*362+128>>8)-b3;x3=m0+b1;y3=x1+x2;y4=x3+b3;y5=x1-x2;y6=x3-b3;y7=-x0-(b4*473+b6*196+128>>8);block[0+i]=b7+y4+128>>8;block[1+i]=x4+y3+128>>8;block[2+i]=y5-x0+128>>8;block[3+i]=y6-y7+128>>8;block[4+i]=y6+y7+128>>8;block[5+i]=x0+y5+128>>8;block[6+i]=y3-x4+128>>8;block[7+i]=y4-b7+128>>8}};MPEG1.PICTURE_RATE=[0,23.976,24,25,29.97,30,50,59.94,60,0,0,0,0,0,0,0];MPEG1.ZIG_ZAG=new Uint8Array([0,1,8,16,9,2,3,10,17,24,32,25,18,11,4,5,12,19,26,33,40,48,41,34,27,20,13,6,7,14,21,28,35,42,49,56,57,50,43,36,29,22,15,23,30,37,44,51,58,59,52,45,38,31,39,46,53,60,61,54,47,55,62,63]);MPEG1.DEFAULT_INTRA_QUANT_MATRIX=new Uint8Array([8,16,19,22,26,27,29,34,16,16,22,24,27,29,34,37,19,22,26,27,29,34,34,38,22,22,26,27,29,34,37,40,22,26,27,29,32,35,40,48,26,27,29,32,35,40,48,58,26,27,29,34,38,46,56,69,27,29,35,38,46,56,69,83]);MPEG1.DEFAULT_NON_INTRA_QUANT_MATRIX=new Uint8Array([16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16]);MPEG1.PREMULTIPLIER_MATRIX=new Uint8Array([32,44,42,38,32,25,17,9,44,62,58,52,44,35,24,12,42,58,55,49,42,33,23,12,38,52,49,44,38,30,20,10,32,44,42,38,32,25,17,9,25,35,33,30,25,20,14,7,17,24,23,20,17,14,9,5,9,12,12,10,9,7,5,2]);MPEG1.MACROBLOCK_ADDRESS_INCREMENT=new Int16Array([1*3,2*3,0,3*3,4*3,0,0,0,1,5*3,6*3,0,7*3,8*3,0,9*3,10*3,0,11*3,12*3,0,0,0,3,0,0,2,13*3,14*3,0,15*3,16*3,0,0,0,5,0,0,4,17*3,18*3,0,19*3,20*3,0,0,0,7,0,0,6,21*3,22*3,0,23*3,24*3,0,25*3,26*3,0,27*3,28*3,0,-1,29*3,0,-1,30*3,0,31*3,32*3,0,33*3,34*3,0,35*3,36*3,0,37*3,38*3,0,0,0,9,0,0,8,39*3,40*3,0,41*3,42*3,0,43*3,44*3,0,45*3,46*3,0,0,0,15,0,0,14,0,0,13,0,0,12,0,0,11,0,0,10,47*3,-1,0,-1,48*3,0,49*3,50*3,0,51*3,52*3,0,53*3,54*3,0,55*3,56*3,0,57*3,58*3,0,59*3,60*3,0,61*3,-1,0,-1,62*3,0,63*3,64*3,0,65*3,66*3,0,67*3,68*3,0,69*3,70*3,0,71*3,72*3,0,73*3,74*3,0,0,0,21,0,0,20,0,0,19,0,0,18,0,0,17,0,0,16,0,0,35,0,0,34,0,0,33,0,0,32,0,0,31,0,0,30,0,0,29,0,0,28,0,0,27,0,0,26,0,0,25,0,0,24,0,0,23,0,0,22]);MPEG1.MACROBLOCK_TYPE_INTRA=new Int8Array([1*3,2*3,0,-1,3*3,0,0,0,1,0,0,17]);MPEG1.MACROBLOCK_TYPE_PREDICTIVE=new Int8Array([1*3,2*3,0,3*3,4*3,0,0,0,10,5*3,6*3,0,0,0,2,7*3,8*3,0,0,0,8,9*3,10*3,0,11*3,12*3,0,-1,13*3,0,0,0,18,0,0,26,0,0,1,0,0,17]);MPEG1.MACROBLOCK_TYPE_B=new Int8Array([1*3,2*3,0,3*3,5*3,0,4*3,6*3,0,8*3,7*3,0,0,0,12,9*3,10*3,0,0,0,14,13*3,14*3,0,12*3,11*3,0,0,0,4,0,0,6,18*3,16*3,0,15*3,17*3,0,0,0,8,0,0,10,-1,19*3,0,0,0,1,20*3,21*3,0,0,0,30,0,0,17,0,0,22,0,0,26]);MPEG1.MACROBLOCK_TYPE=[null,MPEG1.MACROBLOCK_TYPE_INTRA,MPEG1.MACROBLOCK_TYPE_PREDICTIVE,MPEG1.MACROBLOCK_TYPE_B];MPEG1.CODE_BLOCK_PATTERN=new Int16Array([2*3,1*3,0,3*3,6*3,0,4*3,5*3,0,8*3,11*3,0,12*3,13*3,0,9*3,7*3,0,10*3,14*3,0,20*3,19*3,0,18*3,16*3,0,23*3,17*3,0,27*3,25*3,0,21*3,28*3,0,15*3,22*3,0,24*3,26*3,0,0,0,60,35*3,40*3,0,44*3,48*3,0,38*3,36*3,0,42*3,47*3,0,29*3,31*3,0,39*3,32*3,0,0,0,32,45*3,46*3,0,33*3,41*3,0,43*3,34*3,0,0,0,4,30*3,37*3,0,0,0,8,0,0,16,0,0,44,50*3,56*3,0,0,0,28,0,0,52,0,0,62,61*3,59*3,0,52*3,60*3,0,0,0,1,55*3,54*3,0,0,0,61,0,0,56,57*3,58*3,0,0,0,2,0,0,40,51*3,62*3,0,0,0,48,64*3,63*3,0,49*3,53*3,0,0,0,20,0,0,12,80*3,83*3,0,0,0,63,77*3,75*3,0,65*3,73*3,0,84*3,66*3,0,0,0,24,0,0,36,0,0,3,69*3,87*3,0,81*3,79*3,0,68*3,71*3,0,70*3,78*3,0,67*3,76*3,0,72*3,74*3,0,86*3,85*3,0,88*3,82*3,0,-1,94*3,0,95*3,97*3,0,0,0,33,0,0,9,106*3,110*3,0,102*3,116*3,0,0,0,5,0,0,10,93*3,89*3,0,0,0,6,0,0,18,0,0,17,0,0,34,113*3,119*3,0,103*3,104*3,0,90*3,92*3,0,109*3,107*3,0,117*3,118*3,0,101*3,99*3,0,98*3,96*3,0,100*3,91*3,0,114*3,115*3,0,105*3,108*3,0,112*3,111*3,0,121*3,125*3,0,0,0,41,0,0,14,0,0,21,124*3,122*3,0,120*3,123*3,0,0,0,11,0,0,19,0,0,7,0,0,35,0,0,13,0,0,50,0,0,49,0,0,58,0,0,37,0,0,25,0,0,45,0,0,57,0,0,26,0,0,29,0,0,38,0,0,53,0,0,23,0,0,43,0,0,46,0,0,42,0,0,22,0,0,54,0,0,51,0,0,15,0,0,30,0,0,39,0,0,47,0,0,55,0,0,27,0,0,59,0,0,31]);MPEG1.MOTION=new Int16Array([1*3,2*3,0,4*3,3*3,0,0,0,0,6*3,5*3,0,8*3,7*3,0,0,0,-1,0,0,1,9*3,10*3,0,12*3,11*3,0,0,0,2,0,0,-2,14*3,15*3,0,16*3,13*3,0,20*3,18*3,0,0,0,3,0,0,-3,17*3,19*3,0,-1,23*3,0,27*3,25*3,0,26*3,21*3,0,24*3,22*3,0,32*3,28*3,0,29*3,31*3,0,-1,33*3,0,36*3,35*3,0,0,0,-4,30*3,34*3,0,0,0,4,0,0,-7,0,0,5,37*3,41*3,0,0,0,-5,0,0,7,38*3,40*3,0,42*3,39*3,0,0,0,-6,0,0,6,51*3,54*3,0,50*3,49*3,0,45*3,46*3,0,52*3,47*3,0,43*3,53*3,0,44*3,48*3,0,0,0,10,0,0,9,0,0,8,0,0,-8,57*3,66*3,0,0,0,-9,60*3,64*3,0,56*3,61*3,0,55*3,62*3,0,58*3,63*3,0,0,0,-10,59*3,65*3,0,0,0,12,0,0,16,0,0,13,0,0,14,0,0,11,0,0,15,0,0,-16,0,0,-12,0,0,-14,0,0,-15,0,0,-11,0,0,-13]);MPEG1.DCT_DC_SIZE_LUMINANCE=new Int8Array([2*3,1*3,0,6*3,5*3,0,3*3,4*3,0,0,0,1,0,0,2,9*3,8*3,0,7*3,10*3,0,0,0,0,12*3,11*3,0,0,0,4,0,0,3,13*3,14*3,0,0,0,5,0,0,6,16*3,15*3,0,17*3,-1,0,0,0,7,0,0,8]);MPEG1.DCT_DC_SIZE_CHROMINANCE=new Int8Array([2*3,1*3,0,4*3,3*3,0,6*3,5*3,0,8*3,7*3,0,0,0,2,0,0,1,0,0,0,10*3,9*3,0,0,0,3,12*3,11*3,0,0,0,4,14*3,13*3,0,0,0,5,16*3,15*3,0,0,0,6,17*3,-1,0,0,0,7,0,0,8]);MPEG1.DCT_COEFF=new Int32Array([1*3,2*3,0,4*3,3*3,0,0,0,1,7*3,8*3,0,6*3,5*3,0,13*3,9*3,0,11*3,10*3,0,14*3,12*3,0,0,0,257,20*3,22*3,0,18*3,21*3,0,16*3,19*3,0,0,0,513,17*3,15*3,0,0,0,2,0,0,3,27*3,25*3,0,29*3,31*3,0,24*3,26*3,0,32*3,30*3,0,0,0,1025,23*3,28*3,0,0,0,769,0,0,258,0,0,1793,0,0,65535,0,0,1537,37*3,36*3,0,0,0,1281,35*3,34*3,0,39*3,38*3,0,33*3,42*3,0,40*3,41*3,0,52*3,50*3,0,54*3,53*3,0,48*3,49*3,0,43*3,45*3,0,46*3,44*3,0,0,0,2049,0,0,4,0,0,514,0,0,2305,51*3,47*3,0,55*3,57*3,0,60*3,56*3,0,59*3,58*3,0,61*3,62*3,0,0,0,2561,0,0,3329,0,0,6,0,0,259,0,0,5,0,0,770,0,0,2817,0,0,3073,76*3,75*3,0,67*3,70*3,0,73*3,71*3,0,78*3,74*3,0,72*3,77*3,0,69*3,64*3,0,68*3,63*3,0,66*3,65*3,0,81*3,87*3,0,91*3,80*3,0,82*3,79*3,0,83*3,86*3,0,93*3,92*3,0,84*3,85*3,0,90*3,94*3,0,88*3,89*3,0,0,0,515,0,0,260,0,0,7,0,0,1026,0,0,1282,0,0,4097,0,0,3841,0,0,3585,105*3,107*3,0,111*3,114*3,0,104*3,97*3,0,125*3,119*3,0,96*3,98*3,0,-1,123*3,0,95*3,101*3,0,106*3,121*3,0,99*3,102*3,0,113*3,103*3,0,112*3,116*3,0,110*3,100*3,0,124*3,115*3,0,117*3,122*3,0,109*3,118*3,0,120*3,108*3,0,127*3,136*3,0,139*3,140*3,0,130*3,126*3,0,145*3,146*3,0,128*3,129*3,0,0,0,2050,132*3,134*3,0,155*3,154*3,0,0,0,8,137*3,133*3,0,143*3,144*3,0,151*3,138*3,0,142*3,141*3,0,0,0,10,0,0,9,0,0,11,0,0,5377,0,0,1538,0,0,771,0,0,5121,0,0,1794,0,0,4353,0,0,4609,0,0,4865,148*3,152*3,0,0,0,1027,153*3,150*3,0,0,0,261,131*3,135*3,0,0,0,516,149*3,147*3,0,172*3,173*3,0,162*3,158*3,0,170*3,161*3,0,168*3,166*3,0,157*3,179*3,0,169*3,167*3,0,174*3,171*3,0,178*3,177*3,0,156*3,159*3,0,164*3,165*3,0,183*3,182*3,0,175*3,176*3,0,0,0,263,0,0,2562,0,0,2306,0,0,5633,0,0,5889,0,0,6401,0,0,6145,0,0,1283,0,0,772,0,0,13,0,0,12,0,0,14,0,0,15,0,0,517,0,0,6657,0,0,262,180*3,181*3,0,160*3,163*3,0,196*3,199*3,0,0,0,27,203*3,185*3,0,202*3,201*3,0,0,0,19,0,0,22,197*3,207*3,0,0,0,18,191*3,192*3,0,188*3,190*3,0,0,0,20,184*3,194*3,0,0,0,21,186*3,193*3,0,0,0,23,204*3,198*3,0,0,0,25,0,0,24,200*3,205*3,0,0,0,31,0,0,30,0,0,28,0,0,29,0,0,26,0,0,17,0,0,16,189*3,206*3,0,187*3,195*3,0,218*3,211*3,0,0,0,37,215*3,216*3,0,0,0,36,210*3,212*3,0,0,0,34,213*3,209*3,0,221*3,222*3,0,219*3,208*3,0,217*3,214*3,0,223*3,220*3,0,0,0,35,0,0,267,0,0,40,0,0,268,0,0,266,0,0,32,0,0,264,0,0,265,0,0,38,0,0,269,0,0,270,0,0,33,0,0,39,0,0,7937,0,0,6913,0,0,7681,0,0,4098,0,0,7425,0,0,7169,0,0,271,0,0,274,0,0,273,0,0,272,0,0,1539,0,0,2818,0,0,3586,0,0,3330,0,0,3074,0,0,3842]);MPEG1.PICTURE_TYPE={INTRA:1,PREDICTIVE:2,B:3};MPEG1.START={SEQUENCE:179,SLICE_FIRST:1,SLICE_LAST:175,PICTURE:0,EXTENSION:181,USER_DATA:178};return MPEG1}();JSMpeg.Decoder.MPEG1VideoWASM=function(){"use strict";var MPEG1WASM=function(options){JSMpeg.Decoder.Base.call(this,options);this.onDecodeCallback=options.onVideoDecode;this.module=options.wasmModule;this.bufferSize=options.videoBufferSize||512*1024;this.bufferMode=options.streaming?JSMpeg.BitBuffer.MODE.EVICT:JSMpeg.BitBuffer.MODE.EXPAND;this.decodeFirstFrame=options.decodeFirstFrame!==false;this.hasSequenceHeader=false};MPEG1WASM.prototype=Object.create(JSMpeg.Decoder.Base.prototype);MPEG1WASM.prototype.constructor=MPEG1WASM;MPEG1WASM.prototype.initializeWasmDecoder=function(){if(!this.module.instance){console.warn("JSMpeg: WASM module not compiled yet");return}this.instance=this.module.instance;this.functions=this.module.instance.exports;this.decoder=this.functions._mpeg1_decoder_create(this.bufferSize,this.bufferMode)};MPEG1WASM.prototype.destroy=function(){if(!this.decoder){return}this.functions._mpeg1_decoder_destroy(this.decoder)};MPEG1WASM.prototype.bufferGetIndex=function(){if(!this.decoder){return}return this.functions._mpeg1_decoder_get_index(this.decoder)};MPEG1WASM.prototype.bufferSetIndex=function(index){if(!this.decoder){return}this.functions._mpeg1_decoder_set_index(this.decoder,index)};MPEG1WASM.prototype.bufferWrite=function(buffers){if(!this.decoder){this.initializeWasmDecoder()}var totalLength=0;for(var i=0;i<buffers.length;i++){totalLength+=buffers[i].length}var ptr=this.functions._mpeg1_decoder_get_write_ptr(this.decoder,totalLength);for(var i=0;i<buffers.length;i++){this.instance.heapU8.set(buffers[i],ptr);ptr+=buffers[i].length}this.functions._mpeg1_decoder_did_write(this.decoder,totalLength);return totalLength};MPEG1WASM.prototype.write=function(pts,buffers){JSMpeg.Decoder.Base.prototype.write.call(this,pts,buffers);if(!this.hasSequenceHeader&&this.functions._mpeg1_decoder_has_sequence_header(this.decoder)){this.loadSequnceHeader()}};MPEG1WASM.prototype.loadSequnceHeader=function(){this.hasSequenceHeader=true;this.frameRate=this.functions._mpeg1_decoder_get_frame_rate(this.decoder);this.codedSize=this.functions._mpeg1_decoder_get_coded_size(this.decoder);if(this.destination){var w=this.functions._mpeg1_decoder_get_width(this.decoder);var h=this.functions._mpeg1_decoder_get_height(this.decoder);this.destination.resize(w,h)}if(this.decodeFirstFrame){this.decode()}};MPEG1WASM.prototype.decode=function(){var startTime=JSMpeg.Now();if(!this.decoder){return false}var didDecode=this.functions._mpeg1_decoder_decode(this.decoder);if(!didDecode){return false}if(this.destination){var ptrY=this.functions._mpeg1_decoder_get_y_ptr(this.decoder),ptrCr=this.functions._mpeg1_decoder_get_cr_ptr(this.decoder),ptrCb=this.functions._mpeg1_decoder_get_cb_ptr(this.decoder);var dy=this.instance.heapU8.subarray(ptrY,ptrY+this.codedSize);var dcr=this.instance.heapU8.subarray(ptrCr,ptrCr+(this.codedSize>>2));var dcb=this.instance.heapU8.subarray(ptrCb,ptrCb+(this.codedSize>>2));this.destination.render(dy,dcr,dcb,false)}this.advanceDecodedTime(1/this.frameRate);var elapsedTime=JSMpeg.Now()-startTime;if(this.onDecodeCallback){this.onDecodeCallback(this,elapsedTime)}return true};return MPEG1WASM}();JSMpeg.Decoder.MP2Audio=function(){"use strict";var MP2=function(options){JSMpeg.Decoder.Base.call(this,options);this.onDecodeCallback=options.onAudioDecode;var bufferSize=options.audioBufferSize||128*1024;var bufferMode=options.streaming?JSMpeg.BitBuffer.MODE.EVICT:JSMpeg.BitBuffer.MODE.EXPAND;this.bits=new JSMpeg.BitBuffer(bufferSize,bufferMode);this.left=new Float32Array(1152);this.right=new Float32Array(1152);this.sampleRate=44100;this.D=new Float32Array(1024);this.D.set(MP2.SYNTHESIS_WINDOW,0);this.D.set(MP2.SYNTHESIS_WINDOW,512);this.V=[new Float32Array(1024),new Float32Array(1024)];this.U=new Int32Array(32);this.VPos=0;this.allocation=[new Array(32),new Array(32)];this.scaleFactorInfo=[new Uint8Array(32),new Uint8Array(32)];this.scaleFactor=[new Array(32),new Array(32)];this.sample=[new Array(32),new Array(32)];for(var j=0;j<2;j++){for(var i=0;i<32;i++){this.scaleFactor[j][i]=[0,0,0];this.sample[j][i]=[0,0,0]}}};MP2.prototype=Object.create(JSMpeg.Decoder.Base.prototype);MP2.prototype.constructor=MP2;MP2.prototype.decode=function(){var startTime=JSMpeg.Now();var pos=this.bits.index>>3;if(pos>=this.bits.byteLength){return false}var decoded=this.decodeFrame(this.left,this.right);this.bits.index=pos+decoded<<3;if(!decoded){return false}if(this.destination){this.destination.play(this.sampleRate,this.left,this.right)}this.advanceDecodedTime(this.left.length/this.sampleRate);var elapsedTime=JSMpeg.Now()-startTime;if(this.onDecodeCallback){this.onDecodeCallback(this,elapsedTime)}return true};MP2.prototype.getCurrentTime=function(){var enqueuedTime=this.destination?this.destination.enqueuedTime:0;return this.decodedTime-enqueuedTime};MP2.prototype.decodeFrame=function(left,right){var sync=this.bits.read(11),version=this.bits.read(2),layer=this.bits.read(2),hasCRC=!this.bits.read(1);if(sync!==MP2.FRAME_SYNC||version!==MP2.VERSION.MPEG_1||layer!==MP2.LAYER.II){return 0}var bitrateIndex=this.bits.read(4)-1;if(bitrateIndex>13){return 0}var sampleRateIndex=this.bits.read(2);var sampleRate=MP2.SAMPLE_RATE[sampleRateIndex];if(sampleRateIndex===3){return 0}if(version===MP2.VERSION.MPEG_2){sampleRateIndex+=4;bitrateIndex+=14}var padding=this.bits.read(1),privat=this.bits.read(1),mode=this.bits.read(2);var bound=0;if(mode===MP2.MODE.JOINT_STEREO){bound=this.bits.read(2)+1<<2}else{this.bits.skip(2);bound=mode===MP2.MODE.MONO?0:32}this.bits.skip(4);if(hasCRC){this.bits.skip(16)}var bitrate=MP2.BIT_RATE[bitrateIndex],sampleRate=MP2.SAMPLE_RATE[sampleRateIndex],frameSize=144e3*bitrate/sampleRate+padding|0;var tab3=0;var sblimit=0;if(version===MP2.VERSION.MPEG_2){tab3=2;sblimit=30}else{var tab1=mode===MP2.MODE.MONO?0:1;var tab2=MP2.QUANT_LUT_STEP_1[tab1][bitrateIndex];tab3=MP2.QUANT_LUT_STEP_2[tab2][sampleRateIndex];sblimit=tab3&63;tab3>>=6}if(bound>sblimit){bound=sblimit}for(var sb=0;sb<bound;sb++){this.allocation[0][sb]=this.readAllocation(sb,tab3);this.allocation[1][sb]=this.readAllocation(sb,tab3)}for(var sb=bound;sb<sblimit;sb++){this.allocation[0][sb]=this.allocation[1][sb]=this.readAllocation(sb,tab3)}var channels=mode===MP2.MODE.MONO?1:2;for(var sb=0;sb<sblimit;sb++){for(ch=0;ch<channels;ch++){if(this.allocation[ch][sb]){this.scaleFactorInfo[ch][sb]=this.bits.read(2)}}if(mode===MP2.MODE.MONO){this.scaleFactorInfo[1][sb]=this.scaleFactorInfo[0][sb]}}for(var sb=0;sb<sblimit;sb++){for(var ch=0;ch<channels;ch++){if(this.allocation[ch][sb]){var sf=this.scaleFactor[ch][sb];switch(this.scaleFactorInfo[ch][sb]){case 0:sf[0]=this.bits.read(6);sf[1]=this.bits.read(6);sf[2]=this.bits.read(6);break;case 1:sf[0]=sf[1]=this.bits.read(6);sf[2]=this.bits.read(6);break;case 2:sf[0]=sf[1]=sf[2]=this.bits.read(6);break;case 3:sf[0]=this.bits.read(6);sf[1]=sf[2]=this.bits.read(6);break}}}if(mode===MP2.MODE.MONO){this.scaleFactor[1][sb][0]=this.scaleFactor[0][sb][0];this.scaleFactor[1][sb][1]=this.scaleFactor[0][sb][1];this.scaleFactor[1][sb][2]=this.scaleFactor[0][sb][2]}}var outPos=0;for(var part=0;part<3;part++){for(var granule=0;granule<4;granule++){for(var sb=0;sb<bound;sb++){this.readSamples(0,sb,part);this.readSamples(1,sb,part)}for(var sb=bound;sb<sblimit;sb++){this.readSamples(0,sb,part);this.sample[1][sb][0]=this.sample[0][sb][0];this.sample[1][sb][1]=this.sample[0][sb][1];this.sample[1][sb][2]=this.sample[0][sb][2]}for(var sb=sblimit;sb<32;sb++){this.sample[0][sb][0]=0;this.sample[0][sb][1]=0;this.sample[0][sb][2]=0;this.sample[1][sb][0]=0;this.sample[1][sb][1]=0;this.sample[1][sb][2]=0}for(var p=0;p<3;p++){this.VPos=this.VPos-64&1023;for(var ch=0;ch<2;ch++){MP2.MatrixTransform(this.sample[ch],p,this.V[ch],this.VPos);JSMpeg.Fill(this.U,0);var dIndex=512-(this.VPos>>1);var vIndex=this.VPos%128>>1;while(vIndex<1024){for(var i=0;i<32;++i){this.U[i]+=this.D[dIndex++]*this.V[ch][vIndex++]}vIndex+=128-32;dIndex+=64-32}vIndex=128-32+1024-vIndex;dIndex-=512-32;while(vIndex<1024){for(var i=0;i<32;++i){this.U[i]+=this.D[dIndex++]*this.V[ch][vIndex++]}vIndex+=128-32;dIndex+=64-32}var outChannel=ch===0?left:right;for(var j=0;j<32;j++){outChannel[outPos+j]=this.U[j]/2147418112}}outPos+=32}}}this.sampleRate=sampleRate;return frameSize};MP2.prototype.readAllocation=function(sb,tab3){var tab4=MP2.QUANT_LUT_STEP_3[tab3][sb];var qtab=MP2.QUANT_LUT_STEP4[tab4&15][this.bits.read(tab4>>4)];return qtab?MP2.QUANT_TAB[qtab-1]:0};MP2.prototype.readSamples=function(ch,sb,part){var q=this.allocation[ch][sb],sf=this.scaleFactor[ch][sb][part],sample=this.sample[ch][sb],val=0;if(!q){sample[0]=sample[1]=sample[2]=0;return}if(sf===63){sf=0}else{var shift=sf/3|0;sf=MP2.SCALEFACTOR_BASE[sf%3]+(1<<shift>>1)>>shift}var adj=q.levels;if(q.group){val=this.bits.read(q.bits);sample[0]=val%adj;val=val/adj|0;sample[1]=val%adj;sample[2]=val/adj|0}else{sample[0]=this.bits.read(q.bits);sample[1]=this.bits.read(q.bits);sample[2]=this.bits.read(q.bits)}var scale=65536/(adj+1)|0;adj=(adj+1>>1)-1;val=(adj-sample[0])*scale;sample[0]=val*(sf>>12)+(val*(sf&4095)+2048>>12)>>12;val=(adj-sample[1])*scale;sample[1]=val*(sf>>12)+(val*(sf&4095)+2048>>12)>>12;val=(adj-sample[2])*scale;sample[2]=val*(sf>>12)+(val*(sf&4095)+2048>>12)>>12};MP2.MatrixTransform=function(s,ss,d,dp){var t01,t02,t03,t04,t05,t06,t07,t08,t09,t10,t11,t12,t13,t14,t15,t16,t17,t18,t19,t20,t21,t22,t23,t24,t25,t26,t27,t28,t29,t30,t31,t32,t33;t01=s[0][ss]+s[31][ss];t02=(s[0][ss]-s[31][ss])*.500602998235;t03=s[1][ss]+s[30][ss];t04=(s[1][ss]-s[30][ss])*.505470959898;t05=s[2][ss]+s[29][ss];t06=(s[2][ss]-s[29][ss])*.515447309923;t07=s[3][ss]+s[28][ss];t08=(s[3][ss]-s[28][ss])*.53104259109;t09=s[4][ss]+s[27][ss];t10=(s[4][ss]-s[27][ss])*.553103896034;t11=s[5][ss]+s[26][ss];t12=(s[5][ss]-s[26][ss])*.582934968206;t13=s[6][ss]+s[25][ss];t14=(s[6][ss]-s[25][ss])*.622504123036;t15=s[7][ss]+s[24][ss];t16=(s[7][ss]-s[24][ss])*.674808341455;t17=s[8][ss]+s[23][ss];t18=(s[8][ss]-s[23][ss])*.744536271002;t19=s[9][ss]+s[22][ss];t20=(s[9][ss]-s[22][ss])*.839349645416;t21=s[10][ss]+s[21][ss];t22=(s[10][ss]-s[21][ss])*.972568237862;t23=s[11][ss]+s[20][ss];t24=(s[11][ss]-s[20][ss])*1.16943993343;t25=s[12][ss]+s[19][ss];t26=(s[12][ss]-s[19][ss])*1.48416461631;t27=s[13][ss]+s[18][ss];t28=(s[13][ss]-s[18][ss])*2.05778100995;t29=s[14][ss]+s[17][ss];t30=(s[14][ss]-s[17][ss])*3.40760841847;t31=s[15][ss]+s[16][ss];t32=(s[15][ss]-s[16][ss])*10.1900081235;t33=t01+t31;t31=(t01-t31)*.502419286188;t01=t03+t29;t29=(t03-t29)*.52249861494;t03=t05+t27;t27=(t05-t27)*.566944034816;t05=t07+t25;t25=(t07-t25)*.64682178336;t07=t09+t23;t23=(t09-t23)*.788154623451;t09=t11+t21;t21=(t11-t21)*1.06067768599;t11=t13+t19;t19=(t13-t19)*1.72244709824;t13=t15+t17;t17=(t15-t17)*5.10114861869;t15=t33+t13;t13=(t33-t13)*.509795579104;t33=t01+t11;t01=(t01-t11)*.601344886935;t11=t03+t09;t09=(t03-t09)*.899976223136;t03=t05+t07;t07=(t05-t07)*2.56291544774;t05=t15+t03;t15=(t15-t03)*.541196100146;t03=t33+t11;t11=(t33-t11)*1.30656296488;t33=t05+t03;t05=(t05-t03)*.707106781187;t03=t15+t11;t15=(t15-t11)*.707106781187;t03+=t15;t11=t13+t07;t13=(t13-t07)*.541196100146;t07=t01+t09;t09=(t01-t09)*1.30656296488;t01=t11+t07;t07=(t11-t07)*.707106781187;t11=t13+t09;t13=(t13-t09)*.707106781187;t11+=t13;t01+=t11;t11+=t07;t07+=t13;t09=t31+t17;t31=(t31-t17)*.509795579104;t17=t29+t19;t29=(t29-t19)*.601344886935;t19=t27+t21;t21=(t27-t21)*.899976223136;t27=t25+t23;t23=(t25-t23)*2.56291544774;t25=t09+t27;t09=(t09-t27)*.541196100146;t27=t17+t19;t19=(t17-t19)*1.30656296488;t17=t25+t27;t27=(t25-t27)*.707106781187;t25=t09+t19;t19=(t09-t19)*.707106781187;t25+=t19;t09=t31+t23;t31=(t31-t23)*.541196100146;t23=t29+t21;t21=(t29-t21)*1.30656296488;t29=t09+t23;t23=(t09-t23)*.707106781187;t09=t31+t21;t31=(t31-t21)*.707106781187;t09+=t31;t29+=t09;t09+=t23;t23+=t31;t17+=t29;t29+=t25;t25+=t09;t09+=t27;t27+=t23;t23+=t19;t19+=t31;t21=t02+t32;t02=(t02-t32)*.502419286188;t32=t04+t30;t04=(t04-t30)*.52249861494;t30=t06+t28;t28=(t06-t28)*.566944034816;t06=t08+t26;t08=(t08-t26)*.64682178336;t26=t10+t24;t10=(t10-t24)*.788154623451;t24=t12+t22;t22=(t12-t22)*1.06067768599;t12=t14+t20;t20=(t14-t20)*1.72244709824;t14=t16+t18;t16=(t16-t18)*5.10114861869;t18=t21+t14;t14=(t21-t14)*.509795579104;t21=t32+t12;t32=(t32-t12)*.601344886935;t12=t30+t24;t24=(t30-t24)*.899976223136;t30=t06+t26;t26=(t06-t26)*2.56291544774;t06=t18+t30;t18=(t18-t30)*.541196100146;t30=t21+t12;t12=(t21-t12)*1.30656296488;t21=t06+t30;t30=(t06-t30)*.707106781187;t06=t18+t12;t12=(t18-t12)*.707106781187;t06+=t12;t18=t14+t26;t26=(t14-t26)*.541196100146;t14=t32+t24;t24=(t32-t24)*1.30656296488;t32=t18+t14;t14=(t18-t14)*.707106781187;t18=t26+t24;t24=(t26-t24)*.707106781187;t18+=t24;t32+=t18;t18+=t14;t26=t14+t24;t14=t02+t16;t02=(t02-t16)*.509795579104;t16=t04+t20;t04=(t04-t20)*.601344886935;t20=t28+t22;t22=(t28-t22)*.899976223136;t28=t08+t10;t10=(t08-t10)*2.56291544774;t08=t14+t28;t14=(t14-t28)*.541196100146;t28=t16+t20;t20=(t16-t20)*1.30656296488;t16=t08+t28;t28=(t08-t28)*.707106781187;t08=t14+t20;t20=(t14-t20)*.707106781187;t08+=t20;t14=t02+t10;t02=(t02-t10)*.541196100146;t10=t04+t22;t22=(t04-t22)*1.30656296488;t04=t14+t10;t10=(t14-t10)*.707106781187;t14=t02+t22;t02=(t02-t22)*.707106781187;t14+=t02;t04+=t14;t14+=t10;t10+=t02;t16+=t04;t04+=t08;t08+=t14;t14+=t28;t28+=t10;t10+=t20;t20+=t02;t21+=t16;t16+=t32;t32+=t04;t04+=t06;t06+=t08;t08+=t18;t18+=t14;t14+=t30;t30+=t28;t28+=t26;t26+=t10;t10+=t12;t12+=t20;t20+=t24;t24+=t02;d[dp+48]=-t33;d[dp+49]=d[dp+47]=-t21;d[dp+50]=d[dp+46]=-t17;d[dp+51]=d[dp+45]=-t16;d[dp+52]=d[dp+44]=-t01;d[dp+53]=d[dp+43]=-t32;d[dp+54]=d[dp+42]=-t29;d[dp+55]=d[dp+41]=-t04;d[dp+56]=d[dp+40]=-t03;d[dp+57]=d[dp+39]=-t06;d[dp+58]=d[dp+38]=-t25;d[dp+59]=d[dp+37]=-t08;d[dp+60]=d[dp+36]=-t11;d[dp+61]=d[dp+35]=-t18;d[dp+62]=d[dp+34]=-t09;d[dp+63]=d[dp+33]=-t14;d[dp+32]=-t05;d[dp+0]=t05;d[dp+31]=-t30;d[dp+1]=t30;d[dp+30]=-t27;d[dp+2]=t27;d[dp+29]=-t28;d[dp+3]=t28;d[dp+28]=-t07;d[dp+4]=t07;d[dp+27]=-t26;d[dp+5]=t26;d[dp+26]=-t23;d[dp+6]=t23;d[dp+25]=-t10;d[dp+7]=t10;d[dp+24]=-t15;d[dp+8]=t15;d[dp+23]=-t12;d[dp+9]=t12;d[dp+22]=-t19;d[dp+10]=t19;d[dp+21]=-t20;d[dp+11]=t20;d[dp+20]=-t13;d[dp+12]=t13;d[dp+19]=-t24;d[dp+13]=t24;d[dp+18]=-t31;d[dp+14]=t31;d[dp+17]=-t02;d[dp+15]=t02;d[dp+16]=0};MP2.FRAME_SYNC=2047;MP2.VERSION={MPEG_2_5:0,MPEG_2:2,MPEG_1:3};MP2.LAYER={III:1,II:2,I:3};MP2.MODE={STEREO:0,JOINT_STEREO:1,DUAL_CHANNEL:2,MONO:3};MP2.SAMPLE_RATE=new Uint16Array([44100,48e3,32e3,0,22050,24e3,16e3,0]);MP2.BIT_RATE=new Uint16Array([32,48,56,64,80,96,112,128,160,192,224,256,320,384,8,16,24,32,40,48,56,64,80,96,112,128,144,160]);MP2.SCALEFACTOR_BASE=new Uint32Array([33554432,26632170,21137968]);MP2.SYNTHESIS_WINDOW=new Float32Array([0,-.5,-.5,-.5,-.5,-.5,-.5,-1,-1,-1,-1,-1.5,-1.5,-2,-2,-2.5,-2.5,-3,-3.5,-3.5,-4,-4.5,-5,-5.5,-6.5,-7,-8,-8.5,-9.5,-10.5,-12,-13,-14.5,-15.5,-17.5,-19,-20.5,-22.5,-24.5,-26.5,-29,-31.5,-34,-36.5,-39.5,-42.5,-45.5,-48.5,-52,-55.5,-58.5,-62.5,-66,-69.5,-73.5,-77,-80.5,-84.5,-88,-91.5,-95,-98,-101,-104,106.5,109,111,112.5,113.5,114,114,113.5,112,110.5,107.5,104,100,94.5,88.5,81.5,73,63.5,53,41.5,28.5,14.5,-1,-18,-36,-55.5,-76.5,-98.5,-122,-147,-173.5,-200.5,-229.5,-259.5,-290.5,-322.5,-355.5,-389.5,-424,-459.5,-495.5,-532,-568.5,-605,-641.5,-678,-714,-749,-783.5,-817,-849,-879.5,-908.5,-935,-959.5,-981,-1000.5,-1016,-1028.5,-1037.5,-1042.5,-1043.5,-1040,-1031.5,1018.5,1e3,976,946.5,911,869.5,822,767.5,707,640,565.5,485,397,302.5,201,92.5,-22.5,-144,-272.5,-407,-547.5,-694,-846,-1003,-1165,-1331.5,-1502,-1675.5,-1852.5,-2031.5,-2212.5,-2394,-2576.5,-2758.5,-2939.5,-3118.5,-3294.5,-3467.5,-3635.5,-3798.5,-3955,-4104.5,-4245.5,-4377.5,-4499,-4609.5,-4708,-4792.5,-4863.5,-4919,-4958,-4979.5,-4983,-4967.5,-4931.5,-4875,-4796,-4694.5,-4569.5,-4420,-4246,-4046,-3820,-3567,3287,2979.5,2644,2280.5,1888,1467.5,1018.5,541,35,-499,-1061,-1650,-2266.5,-2909,-3577,-4270,-4987.5,-5727.5,-6490,-7274,-8077.5,-8899.5,-9739,-10594.5,-11464.5,-12347,-13241,-14144.5,-15056,-15973.5,-16895.5,-17820,-18744.5,-19668,-20588,-21503,-22410.5,-23308.5,-24195,-25068.5,-25926.5,-26767,-27589,-28389,-29166.5,-29919,-30644.5,-31342,-32009.5,-32645,-33247,-33814.5,-34346,-34839.5,-35295,-35710,-36084.5,-36417.5,-36707.5,-36954,-37156.5,-37315,-37428,-37496,37519,37496,37428,37315,37156.5,36954,36707.5,36417.5,36084.5,35710,35295,34839.5,34346,33814.5,33247,32645,32009.5,31342,30644.5,29919,29166.5,28389,27589,26767,25926.5,25068.5,24195,23308.5,22410.5,21503,20588,19668,18744.5,17820,16895.5,15973.5,15056,14144.5,13241,12347,11464.5,10594.5,9739,8899.5,8077.5,7274,6490,5727.5,4987.5,4270,3577,2909,2266.5,1650,1061,499,-35,-541,-1018.5,-1467.5,-1888,-2280.5,-2644,-2979.5,3287,3567,3820,4046,4246,4420,4569.5,4694.5,4796,4875,4931.5,4967.5,4983,4979.5,4958,4919,4863.5,4792.5,4708,4609.5,4499,4377.5,4245.5,4104.5,3955,3798.5,3635.5,3467.5,3294.5,3118.5,2939.5,2758.5,2576.5,2394,2212.5,2031.5,1852.5,1675.5,1502,1331.5,1165,1003,846,694,547.5,407,272.5,144,22.5,-92.5,-201,-302.5,-397,-485,-565.5,-640,-707,-767.5,-822,-869.5,-911,-946.5,-976,-1e3,1018.5,1031.5,1040,1043.5,1042.5,1037.5,1028.5,1016,1000.5,981,959.5,935,908.5,879.5,849,817,783.5,749,714,678,641.5,605,568.5,532,495.5,459.5,424,389.5,355.5,322.5,290.5,259.5,229.5,200.5,173.5,147,122,98.5,76.5,55.5,36,18,1,-14.5,-28.5,-41.5,-53,-63.5,-73,-81.5,-88.5,-94.5,-100,-104,-107.5,-110.5,-112,-113.5,-114,-114,-113.5,-112.5,-111,-109,106.5,104,101,98,95,91.5,88,84.5,80.5,77,73.5,69.5,66,62.5,58.5,55.5,52,48.5,45.5,42.5,39.5,36.5,34,31.5,29,26.5,24.5,22.5,20.5,19,17.5,15.5,14.5,13,12,10.5,9.5,8.5,8,7,6.5,5.5,5,4.5,4,3.5,3.5,3,2.5,2.5,2,2,1.5,1.5,1,1,1,1,.5,.5,.5,.5,.5,.5]);MP2.QUANT_LUT_STEP_1=[[0,0,1,1,1,2,2,2,2,2,2,2,2,2],[0,0,0,0,0,0,1,1,1,2,2,2,2,2]];MP2.QUANT_TAB={A:27|64,B:30|64,C:8,D:12};MP2.QUANT_LUT_STEP_2=[[MP2.QUANT_TAB.C,MP2.QUANT_TAB.C,MP2.QUANT_TAB.D],[MP2.QUANT_TAB.A,MP2.QUANT_TAB.A,MP2.QUANT_TAB.A],[MP2.QUANT_TAB.B,MP2.QUANT_TAB.A,MP2.QUANT_TAB.B]];MP2.QUANT_LUT_STEP_3=[[68,68,52,52,52,52,52,52,52,52,52,52],[67,67,67,66,66,66,66,66,66,66,66,49,49,49,49,49,49,49,49,49,49,49,49,32,32,32,32,32,32,32],[69,69,69,69,52,52,52,52,52,52,52,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36]];MP2.QUANT_LUT_STEP4=[[0,1,2,17],[0,1,2,3,4,5,6,17],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,17],[0,1,3,5,6,7,8,9,10,11,12,13,14,15,16,17],[0,1,2,4,5,6,7,8,9,10,11,12,13,14,15,17],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]];MP2.QUANT_TAB=[{levels:3,group:1,bits:5},{levels:5,group:1,bits:7},{levels:7,group:0,bits:3},{levels:9,group:1,bits:10},{levels:15,group:0,bits:4},{levels:31,group:0,bits:5},{levels:63,group:0,bits:6},{levels:127,group:0,bits:7},{levels:255,group:0,bits:8},{levels:511,group:0,bits:9},{levels:1023,group:0,bits:10},{levels:2047,group:0,bits:11},{levels:4095,group:0,bits:12},{levels:8191,group:0,bits:13},{levels:16383,group:0,bits:14},{levels:32767,group:0,bits:15},{levels:65535,group:0,bits:16}];return MP2}();JSMpeg.Decoder.MP2AudioWASM=function(){"use strict";var MP2WASM=function(options){JSMpeg.Decoder.Base.call(this,options);this.onDecodeCallback=options.onAudioDecode;this.module=options.wasmModule;this.bufferSize=options.audioBufferSize||128*1024;this.bufferMode=options.streaming?JSMpeg.BitBuffer.MODE.EVICT:JSMpeg.BitBuffer.MODE.EXPAND;this.sampleRate=0};MP2WASM.prototype=Object.create(JSMpeg.Decoder.Base.prototype);MP2WASM.prototype.constructor=MP2WASM;MP2WASM.prototype.initializeWasmDecoder=function(){if(!this.module.instance){console.warn("JSMpeg: WASM module not compiled yet");return}this.instance=this.module.instance;this.functions=this.module.instance.exports;this.decoder=this.functions._mp2_decoder_create(this.bufferSize,this.bufferMode)};MP2WASM.prototype.destroy=function(){if(!this.decoder){return}this.functions._mp2_decoder_destroy(this.decoder)};MP2WASM.prototype.bufferGetIndex=function(){if(!this.decoder){return}return this.functions._mp2_decoder_get_index(this.decoder)};MP2WASM.prototype.bufferSetIndex=function(index){if(!this.decoder){return}this.functions._mp2_decoder_set_index(this.decoder,index)};MP2WASM.prototype.bufferWrite=function(buffers){if(!this.decoder){this.initializeWasmDecoder()}var totalLength=0;for(var i=0;i<buffers.length;i++){totalLength+=buffers[i].length}var ptr=this.functions._mp2_decoder_get_write_ptr(this.decoder,totalLength);for(var i=0;i<buffers.length;i++){this.instance.heapU8.set(buffers[i],ptr);ptr+=buffers[i].length}this.functions._mp2_decoder_did_write(this.decoder,totalLength);return totalLength};MP2WASM.prototype.decode=function(){var startTime=JSMpeg.Now();if(!this.decoder){return false}var decodedBytes=this.functions._mp2_decoder_decode(this.decoder);if(decodedBytes===0){return false}if(!this.sampleRate){this.sampleRate=this.functions._mp2_decoder_get_sample_rate(this.decoder)}if(this.destination){var leftPtr=this.functions._mp2_decoder_get_left_channel_ptr(this.decoder),rightPtr=this.functions._mp2_decoder_get_right_channel_ptr(this.decoder);var leftOffset=leftPtr/Float32Array.BYTES_PER_ELEMENT,rightOffset=rightPtr/Float32Array.BYTES_PER_ELEMENT;var left=this.instance.heapF32.subarray(leftOffset,leftOffset+MP2WASM.SAMPLES_PER_FRAME),right=this.instance.heapF32.subarray(rightOffset,rightOffset+MP2WASM.SAMPLES_PER_FRAME);this.destination.play(this.sampleRate,left,right)}this.advanceDecodedTime(MP2WASM.SAMPLES_PER_FRAME/this.sampleRate);var elapsedTime=JSMpeg.Now()-startTime;if(this.onDecodeCallback){this.onDecodeCallback(this,elapsedTime)}return true};MP2WASM.prototype.getCurrentTime=function(){var enqueuedTime=this.destination?this.destination.enqueuedTime:0;return this.decodedTime-enqueuedTime};MP2WASM.SAMPLES_PER_FRAME=1152;return MP2WASM}();JSMpeg.Renderer.WebGL=function(){"use strict";var WebGLRenderer=function(options){this.canvas=options.canvas||document.createElement("canvas");this.width=this.canvas.width;this.height=this.canvas.height;this.enabled=true;this.hasTextureData={};var contextCreateOptions={preserveDrawingBuffer:!!options.preserveDrawingBuffer,alpha:false,depth:false,stencil:false,antialias:false,premultipliedAlpha:false};this.gl=this.canvas.getContext("webgl",contextCreateOptions)||this.canvas.getContext("experimental-webgl",contextCreateOptions);if(!this.gl){throw new Error("Failed to get WebGL Context")}var gl=this.gl;var vertexAttr=null;gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);this.vertexBuffer=gl.createBuffer();var vertexCoords=new Float32Array([0,0,0,1,1,0,1,1]);gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,vertexCoords,gl.STATIC_DRAW);this.program=this.createProgram(WebGLRenderer.SHADER.VERTEX_IDENTITY,WebGLRenderer.SHADER.FRAGMENT_YCRCB_TO_RGBA);vertexAttr=gl.getAttribLocation(this.program,"vertex");gl.enableVertexAttribArray(vertexAttr);gl.vertexAttribPointer(vertexAttr,2,gl.FLOAT,false,0,0);this.textureY=this.createTexture(0,"textureY");this.textureCb=this.createTexture(1,"textureCb");this.textureCr=this.createTexture(2,"textureCr");this.loadingProgram=this.createProgram(WebGLRenderer.SHADER.VERTEX_IDENTITY,WebGLRenderer.SHADER.FRAGMENT_LOADING);vertexAttr=gl.getAttribLocation(this.loadingProgram,"vertex");gl.enableVertexAttribArray(vertexAttr);gl.vertexAttribPointer(vertexAttr,2,gl.FLOAT,false,0,0);this.shouldCreateUnclampedViews=!this.allowsClampedTextureData()};WebGLRenderer.prototype.destroy=function(){var gl=this.gl;this.deleteTexture(gl.TEXTURE0,this.textureY);this.deleteTexture(gl.TEXTURE1,this.textureCb);this.deleteTexture(gl.TEXTURE2,this.textureCr);gl.useProgram(null);gl.deleteProgram(this.program);gl.deleteProgram(this.loadingProgram);gl.bindBuffer(gl.ARRAY_BUFFER,null);gl.deleteBuffer(this.vertexBuffer);gl.getExtension("WEBGL_lose_context").loseContext();this.canvas.remove()};WebGLRenderer.prototype.resize=function(width,height){this.width=width|0;this.height=height|0;this.canvas.width=this.width;this.canvas.height=this.height;this.gl.useProgram(this.program);var codedWidth=this.width+15>>4<<4;this.gl.viewport(0,0,codedWidth,this.height)};WebGLRenderer.prototype.createTexture=function(index,name){var gl=this.gl;var texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(gl.getUniformLocation(this.program,name),index);return texture};WebGLRenderer.prototype.createProgram=function(vsh,fsh){var gl=this.gl;var program=gl.createProgram();gl.attachShader(program,this.compileShader(gl.VERTEX_SHADER,vsh));gl.attachShader(program,this.compileShader(gl.FRAGMENT_SHADER,fsh));gl.linkProgram(program);gl.useProgram(program);return program};WebGLRenderer.prototype.compileShader=function(type,source){var gl=this.gl;var shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){throw new Error(gl.getShaderInfoLog(shader))}return shader};WebGLRenderer.prototype.allowsClampedTextureData=function(){var gl=this.gl;var texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,1,1,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,new Uint8ClampedArray([0]));return gl.getError()===0};WebGLRenderer.prototype.renderProgress=function(progress){var gl=this.gl;gl.useProgram(this.loadingProgram);var loc=gl.getUniformLocation(this.loadingProgram,"progress");gl.uniform1f(loc,progress);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)};WebGLRenderer.prototype.render=function(y,cb,cr,isClampedArray){if(!this.enabled){return}var gl=this.gl;var w=this.width+15>>4<<4,h=this.height,w2=w>>1,h2=h>>1;if(isClampedArray&&this.shouldCreateUnclampedViews){y=new Uint8Array(y.buffer),cb=new Uint8Array(cb.buffer),cr=new Uint8Array(cr.buffer)}gl.useProgram(this.program);this.updateTexture(gl.TEXTURE0,this.textureY,w,h,y);this.updateTexture(gl.TEXTURE1,this.textureCb,w2,h2,cb);this.updateTexture(gl.TEXTURE2,this.textureCr,w2,h2,cr);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)};WebGLRenderer.prototype.updateTexture=function(unit,texture,w,h,data){var gl=this.gl;gl.activeTexture(unit);gl.bindTexture(gl.TEXTURE_2D,texture);if(this.hasTextureData[unit]){gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,w,h,gl.LUMINANCE,gl.UNSIGNED_BYTE,data)}else{this.hasTextureData[unit]=true;gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,w,h,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,data)}};WebGLRenderer.prototype.deleteTexture=function(unit,texture){var gl=this.gl;gl.activeTexture(unit);gl.bindTexture(gl.TEXTURE_2D,null);gl.deleteTexture(texture)};WebGLRenderer.IsSupported=function(){try{if(!window.WebGLRenderingContext){return false}var canvas=document.createElement("canvas");return!!(canvas.getContext("webgl")||canvas.getContext("experimental-webgl"))}catch(err){return false}};WebGLRenderer.SHADER={FRAGMENT_YCRCB_TO_RGBA:["precision mediump float;","uniform sampler2D textureY;","uniform sampler2D textureCb;","uniform sampler2D textureCr;","varying vec2 texCoord;","mat4 rec601 = mat4(","1.16438,  0.00000,  1.59603, -0.87079,","1.16438, -0.39176, -0.81297,  0.52959,","1.16438,  2.01723,  0.00000, -1.08139,","0, 0, 0, 1",");","void main() {","float y = texture2D(textureY, texCoord).r;","float cb = texture2D(textureCb, texCoord).r;","float cr = texture2D(textureCr, texCoord).r;","gl_FragColor = vec4(y, cr, cb, 1.0) * rec601;","}"].join("\n"),FRAGMENT_LOADING:["precision mediump float;","uniform float progress;","varying vec2 texCoord;","void main() {","float c = ceil(progress-(1.0-texCoord.y));","gl_FragColor = vec4(c,c,c,1);","}"].join("\n"),VERTEX_IDENTITY:["attribute vec2 vertex;","varying vec2 texCoord;","void main() {","texCoord = vertex;","gl_Position = vec4((vertex * 2.0 - 1.0) * vec2(1, -1), 0.0, 1.0);","}"].join("\n")};return WebGLRenderer}();JSMpeg.Renderer.Canvas2D=function(){"use strict";var CanvasRenderer=function(options){this.canvas=options.canvas||document.createElement("canvas");this.width=this.canvas.width;this.height=this.canvas.height;this.enabled=true;this.context=this.canvas.getContext("2d")};CanvasRenderer.prototype.destroy=function(){};CanvasRenderer.prototype.resize=function(width,height){this.width=width|0;this.height=height|0;this.canvas.width=this.width;this.canvas.height=this.height;this.imageData=this.context.getImageData(0,0,this.width,this.height);JSMpeg.Fill(this.imageData.data,255)};CanvasRenderer.prototype.renderProgress=function(progress){var w=this.canvas.width,h=this.canvas.height,ctx=this.context;ctx.fillStyle="#222";ctx.fillRect(0,0,w,h);ctx.fillStyle="#fff";ctx.fillRect(0,h-h*progress,w,h*progress)};CanvasRenderer.prototype.render=function(y,cb,cr){this.YCbCrToRGBA(y,cb,cr,this.imageData.data);this.context.putImageData(this.imageData,0,0)};CanvasRenderer.prototype.YCbCrToRGBA=function(y,cb,cr,rgba){if(!this.enabled){return}var w=this.width+15>>4<<4,w2=w>>1;var yIndex1=0,yIndex2=w,yNext2Lines=w+(w-this.width);var cIndex=0,cNextLine=w2-(this.width>>1);var rgbaIndex1=0,rgbaIndex2=this.width*4,rgbaNext2Lines=this.width*4;var cols=this.width>>1,rows=this.height>>1;var ccb,ccr,r,g,b;for(var row=0;row<rows;row++){for(var col=0;col<cols;col++){ccb=cb[cIndex];ccr=cr[cIndex];cIndex++;r=ccb+(ccb*103>>8)-179;g=(ccr*88>>8)-44+(ccb*183>>8)-91;b=ccr+(ccr*198>>8)-227;var y1=y[yIndex1++];var y2=y[yIndex1++];rgba[rgbaIndex1]=y1+r;rgba[rgbaIndex1+1]=y1-g;rgba[rgbaIndex1+2]=y1+b;rgba[rgbaIndex1+4]=y2+r;rgba[rgbaIndex1+5]=y2-g;rgba[rgbaIndex1+6]=y2+b;rgbaIndex1+=8;var y3=y[yIndex2++];var y4=y[yIndex2++];rgba[rgbaIndex2]=y3+r;rgba[rgbaIndex2+1]=y3-g;rgba[rgbaIndex2+2]=y3+b;rgba[rgbaIndex2+4]=y4+r;rgba[rgbaIndex2+5]=y4-g;rgba[rgbaIndex2+6]=y4+b;rgbaIndex2+=8}yIndex1+=yNext2Lines;yIndex2+=yNext2Lines;rgbaIndex1+=rgbaNext2Lines;rgbaIndex2+=rgbaNext2Lines;cIndex+=cNextLine}};return CanvasRenderer}();JSMpeg.AudioOutput.WebAudio=function(){"use strict";var WebAudioOut=function(options){this.context=WebAudioOut.CachedContext=WebAudioOut.CachedContext||new(window.AudioContext||window.webkitAudioContext);this.gain=this.context.createGain();this.destination=this.gain;this.gain.connect(this.context.destination);this.context._connections=(this.context._connections||0)+1;this.startTime=0;this.buffer=null;this.wallclockStartTime=0;this.volume=1;this.enabled=true;this.unlocked=!WebAudioOut.NeedsUnlocking();Object.defineProperty(this,"enqueuedTime",{get:this.getEnqueuedTime})};WebAudioOut.prototype.destroy=function(){this.gain.disconnect();this.context._connections--;if(this.context._connections===0){this.context.close();WebAudioOut.CachedContext=null}};WebAudioOut.prototype.play=function(sampleRate,left,right){if(!this.enabled){return}if(!this.unlocked){var ts=JSMpeg.Now();if(this.wallclockStartTime<ts){this.wallclockStartTime=ts}this.wallclockStartTime+=left.length/sampleRate;return}this.gain.gain.value=this.volume;var buffer=this.context.createBuffer(2,left.length,sampleRate);buffer.getChannelData(0).set(left);buffer.getChannelData(1).set(right);var source=this.context.createBufferSource();source.buffer=buffer;source.connect(this.destination);var now=this.context.currentTime;var duration=buffer.duration;if(this.startTime<now){this.startTime=now;this.wallclockStartTime=JSMpeg.Now()}source.start(this.startTime);this.startTime+=duration;this.wallclockStartTime+=duration};WebAudioOut.prototype.stop=function(){this.gain.gain.value=0};WebAudioOut.prototype.getEnqueuedTime=function(){return Math.max(this.wallclockStartTime-JSMpeg.Now(),0)};WebAudioOut.prototype.resetEnqueuedTime=function(){this.startTime=this.context.currentTime;this.wallclockStartTime=JSMpeg.Now()};WebAudioOut.prototype.unlock=function(callback){if(this.unlocked){if(callback){callback()}return}this.unlockCallback=callback;var buffer=this.context.createBuffer(1,1,22050);var source=this.context.createBufferSource();source.buffer=buffer;source.connect(this.destination);source.start(0);setTimeout(this.checkIfUnlocked.bind(this,source,0),0)};WebAudioOut.prototype.checkIfUnlocked=function(source,attempt){if(source.playbackState===source.PLAYING_STATE||source.playbackState===source.FINISHED_STATE){this.unlocked=true;if(this.unlockCallback){this.unlockCallback();this.unlockCallback=null}}else if(attempt<10){setTimeout(this.checkIfUnlocked.bind(this,source,attempt+1),100)}};WebAudioOut.NeedsUnlocking=function(){return/iPhone|iPad|iPod/i.test(navigator.userAgent)};WebAudioOut.IsSupported=function(){return window.AudioContext||window.webkitAudioContext};WebAudioOut.CachedContext=null;return WebAudioOut}();JSMpeg.WASMModule=function(){"use strict";var WASM=function(){this.stackSize=5*1024*1024;this.pageSize=64*1024;this.onInitCallback=null;this.ready=false};WASM.prototype.write=function(buffer){this.loadFromBuffer(buffer,this.onInitCallback)};WASM.prototype.loadFromFile=function(url,callback){this.onInitCallback=callback;var ajax=new JSMpeg.Source.Ajax(url,{});ajax.connect(this);ajax.start()};WASM.prototype.loadFromBuffer=function(buffer,callback){this.moduleInfo=this.readDylinkSection(buffer);if(!this.moduleInfo){this.callback&&this.callback(null);return}this.memory=new WebAssembly.Memory({initial:256});var env={memory:this.memory,memoryBase:0,__memory_base:0,table:new WebAssembly.Table({initial:this.moduleInfo.tableSize,element:"anyfunc"}),tableBase:0,__table_base:0,abort:this.c_abort.bind(this),___assert_fail:this.c_assertFail.bind(this),_sbrk:this.c_sbrk.bind(this)};this.brk=this.align(this.moduleInfo.memorySize+this.stackSize);WebAssembly.instantiate(buffer,{env:env}).then(function(results){this.instance=results.instance;if(this.instance.exports.__post_instantiate){this.instance.exports.__post_instantiate()}this.createHeapViews();this.ready=true;callback&&callback(this)}.bind(this))};WASM.prototype.createHeapViews=function(){this.instance.heapU8=new Uint8Array(this.memory.buffer);this.instance.heapU32=new Uint32Array(this.memory.buffer);this.instance.heapF32=new Float32Array(this.memory.buffer)};WASM.prototype.align=function(addr){var a=Math.pow(2,this.moduleInfo.memoryAlignment);return Math.ceil(addr/a)*a};WASM.prototype.c_sbrk=function(size){var previousBrk=this.brk;this.brk+=size;if(this.brk>this.memory.buffer.byteLength){var bytesNeeded=this.brk-this.memory.buffer.byteLength;var pagesNeeded=Math.ceil(bytesNeeded/this.pageSize);this.memory.grow(pagesNeeded);this.createHeapViews()}return previousBrk};WASM.prototype.c_abort=function(size){console.warn("JSMPeg: WASM abort",arguments)};WASM.prototype.c_assertFail=function(size){console.warn("JSMPeg: WASM ___assert_fail",arguments)};WASM.prototype.readDylinkSection=function(buffer){var bytes=new Uint8Array(buffer);var next=0;var readVarUint=function(){var ret=0;var mul=1;while(1){var byte=bytes[next++];ret+=(byte&127)*mul;mul*=128;if(!(byte&128)){return ret}}};var matchNextBytes=function(expected){for(var i=0;i<expected.length;i++){var b=typeof expected[i]==="string"?expected[i].charCodeAt(0):expected[i];if(bytes[next++]!==b){return false}}return true};if(!matchNextBytes([0,"a","s","m"])){console.warn("JSMpeg: WASM header not found");return null}var next=9;var sectionSize=readVarUint();if(!matchNextBytes([6,"d","y","l","i","n","k"])){console.warn("JSMpeg: No dylink section found in WASM");return null}return{memorySize:readVarUint(),memoryAlignment:readVarUint(),tableSize:readVarUint(),tableAlignment:readVarUint()}};WASM.IsSupported=function(){return!!window.WebAssembly};WASM.GetModule=function(){WASM.CACHED_MODULE=WASM.CACHED_MODULE||new WASM;return WASM.CACHED_MODULE};return WASM}();JSMpeg.WASM_BINARY_INLINED="AGFzbQEAAAAADwZkeWxpbmuA0MACBAAAAAE0CWAEf39/fwBgAX8Bf2ACf38Bf2ABfwBgAn9/AGABfwF9YAZ/f39/f38AYAN/f38Bf2AAAAJGBANlbnYOX19fYXNzZXJ0X2ZhaWwAAANlbnYFX3NicmsAAQNlbnYNX19tZW1vcnlfYmFzZQN/AANlbnYGbWVtb3J5AgCAAgM9PAIDAgEEBAMBBQEBAQEBAQEDBAMGAwQAAwAAAAIDAgEEBAEBAQEBAAACAwIBAgECAQEBAQMEAwMCBwcHCAYLAn8BQQALfwFBAAsHggYfEl9fcG9zdF9pbnN0YW50aWF0ZQA9BV9mcmVlADgHX21hbGxvYwAxB19tZW1jcHkAOghfbWVtbW92ZQA7B19tZW1zZXQAPBNfbXAyX2RlY29kZXJfY3JlYXRlAB0TX21wMl9kZWNvZGVyX2RlY29kZQAmFF9tcDJfZGVjb2Rlcl9kZXN0cm95AB4WX21wMl9kZWNvZGVyX2RpZF93cml0ZQAiFl9tcDJfZGVjb2Rlcl9nZXRfaW5kZXgAICFfbXAyX2RlY29kZXJfZ2V0X2xlZnRfY2hhbm5lbF9wdHIAJCJfbXAyX2RlY29kZXJfZ2V0X3JpZ2h0X2NoYW5uZWxfcHRyACUcX21wMl9kZWNvZGVyX2dldF9zYW1wbGVfcmF0ZQAjGl9tcDJfZGVjb2Rlcl9nZXRfd3JpdGVfcHRyAB8WX21wMl9kZWNvZGVyX3NldF9pbmRleAAhFV9tcGVnMV9kZWNvZGVyX2NyZWF0ZQACFV9tcGVnMV9kZWNvZGVyX2RlY29kZQARFl9tcGVnMV9kZWNvZGVyX2Rlc3Ryb3kAAxhfbXBlZzFfZGVjb2Rlcl9kaWRfd3JpdGUABxlfbXBlZzFfZGVjb2Rlcl9nZXRfY2JfcHRyABAdX21wZWcxX2RlY29kZXJfZ2V0X2NvZGVkX3NpemUACxlfbXBlZzFfZGVjb2Rlcl9nZXRfY3JfcHRyAA8dX21wZWcxX2RlY29kZXJfZ2V0X2ZyYW1lX3JhdGUAChlfbXBlZzFfZGVjb2Rlcl9nZXRfaGVpZ2h0AA0YX21wZWcxX2RlY29kZXJfZ2V0X2luZGV4AAUYX21wZWcxX2RlY29kZXJfZ2V0X3dpZHRoAAwcX21wZWcxX2RlY29kZXJfZ2V0X3dy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BQJ/IANBzQBHDQIgACgCgAFBBhAwIQMCQAJAIAAoAoABQQgQMCIEIgYEQCAGQYABRgRADAIFDAMLAAsgACgCgAFBCBAwDAILIAAoAoABQQgQMEGAfmoMAQsgBEGAfmogBCAEQYABShsLCyEEDAELIAZB/wFxIgNBACADayAAKAKAAUEBEDBFGyEEIAZBCHUhAwsgAiADaiIGIwBBQGtqLQAAIgMgBWotAAAgACgCREEAIARBAXQiAkEfdUEBciAAKAJcGyACamxsIgJBBHVBAEEBQX8gAkEPShsgAkEQcRtrIgJBgHAgAkGAcEobIQIgAEGcAWogA0ECdGogAyMAQZA1amotAAAgAkH/DyACQf8PSBtsNgIAIAZBAWohAgwBCwsgAUEESARAIABBhAFqIQUgAUEDdEEIcSAAKAJUIAAoAhgiAyAAKAJQbGpBBHRyIANBA3RBACABQQJxG2ohBAUgAEGMAWogAEGIAWogAUEERhshBSAAKAJQIAAoAhgiAUECdGwgACgCVEEDdGohBCABQQF1IQMLIANBeGohAyAFKAIAIQUgAkEBRiECIABBnAFqIQEgACgCXARAIAIEQCABKAIAQYABakEIdSAFIAQgAxAYIAFBADYCAAUgARAZIAEgBSAEIAMQGiABQQBBgAIQPBoLBSACBEAgASgCAEGAAWpBCHUgBSAEIAMQGyABQQA2AgAFIAEQGSABIAUgBCADEBwgAUEAQYACEDwaCwsL7AYAIAEgAmogAEEAIABBAEobIgBB/wEgAEH/AUgbQf8BcSIAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAACABIAIgA0EIaiIDaiICaiAAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAACABIAIgA2oiAmogADoAACABIAJBAWpqIAA6AAAgASACQQJqaiAAOgAAIAEgAkEDamogADoAACABIAJBBGpqIAA6AAAgASACQQVqaiAAOgAAIAEgAkEGamogADoAACABIAJBB2pqIAA6AAAgASACIANqIgJqIAA6AAAgASACQQFqaiAAOgAAIAEgAkECamogADoAACABIAJBA2pqIAA6AAAgASACQQRqaiAAOgAAIAEgAkEFamogADoAACABIAJBBmpqIAA6AAAgASACQQdqaiAAOgAAIAEgAiADaiICaiAAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAACABIAIgA2oiAmogADoAACABIAJBAWpqIAA6AAAgASACQQJqaiAAOgAAIAEgAkEDamogADoAACABIAJBBGpqIAA6AAAgASACQQVqaiAAOgAAIAEgAkEGamogADoAACABIAJBB2pqIAA6AAAgASACIANqIgJqIAA6AAAgASACQQFqaiAAOgAAIAEgAkECamogADoAACABIAJBA2pqIAA6AAAgASACQQRqaiAAOgAAIAEgAkEFamogADoAACABIAJBBmpqIAA6AAAgASACQQdqaiAAOgAAIAEgAiADaiICaiAAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAAAubBgEUfwNAIAFBEGpBAnQgAGoiBygCACIGIAFBMGpBAnQgAGoiDSgCACIJaiEFIAFBCGpBAnQgAGoiDigCACICIAFBOGpBAnQgAGoiDygCACIDaiEEIAIgA2siEEHZA2wgAUEoakECdCAAaiIKKAIAIgIgAUEYakECdCAAaiIRKAIAIgNrIgtBvH5sQYABampBCHUgBCACIANqIghqIgJrIgMgBCAIa0HqAmxBgAFqQQh1ayEEIAFBAnQgAGoiCCgCACIMIAFBIGpBAnQgAGoiEigCACITayIUIAYgCWtB6gJsQYABakEIdSAFayIJaiEGIAggAiAMIBNqIgggBWoiDGo2AgAgDiADIAZqNgIAIAcgFCAJayIHIARrNgIAIBEgC0HZA2xBgAFqIBBBxAFsakEIdSAEaiIJIAggBWsiBWo2AgAgEiAFIAlrNgIAIAogBCAHajYCACANIAYgA2s2AgAgDyAMIAJr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aiABQQxsaiAAKAIIQQYQMCICNgLUAiAAIANBgANsaiABQQxsaiACNgLQAiAFIAI2AgAMAgsgBSAAKAIIQQYQMDYCACAAIANBgANsaiABQQxsaiAAKAIIQQYQMCICNgLUAiAAIANBgANsaiABQQxsaiACNgLQAgsLCyADQQFqIgMgCEkNAAsgAUEBaiIBIAtHDQALCwsLaiALQSBJIRsgAEHMtgFqIQQgAEHMCGohHCAAQcz2AGohHSAAQcwLaiEeIABBzJYBaiEfA0BBACEWIBQhAwNAIBgEQEEAIQEDQCAAQQAgASAOECggAEEBIAEgDhAoIAFBAWoiASANSA0ACwsgGQRAIA0hAQNAIABBACABIA4QKCAAQcwLaiABQQxsaiAAQcwIaiABQQxsaigCADYCACAAIAFBDGxqQdALaiAAIAFBDGxqQdAIaigCADYCACAAIAFBDGxqQdQLaiAAIAFBDGxqQdQIaigCADYCACABQQFqIgEgC0gNAAsLIBsEQCALIQEDQCAAQcwIaiABQQxsakEANgIAIAAgAUEMbGpB0AhqQQA2AgAgACABQQxsakHUCGpBADYCACAAQcwLaiABQQxsakEANgIAIAAgAUEMbGpB0AtqQQA2AgAgACABQQxsakHUC2pBADYCACABQQFqIgFBIEcNAAsLIAAoAgQhASADIRFBACESA0AgACABQcAHakH/B3EiATYCBCAcIBIgHSABECkgBEIANwIAIARCADcCCCAEQgA3AhAgBEIANwIYIARCADcCICAEQgA3AiggBEIANwIwIARCADcCOCAEQUBrQgA3AgAgBEIANwJIIARCADcCUCAEQgA3AlggBEIANwJgIARCADcCaCAEQgA3AnAgBEIANwJ4IAAoAgQiD0EBdSETQf8HIA9BgAFvQQF1IgxrIgFBgH9xIRUgAUEHdkEGdEHABGohEEGABCATayEGIAwhAQNAIAYhB0EAIQkgASECA0AgB0EBaiEIIAJBAWohBSAAQcy2AWogCUECdGoiCiAAQczWAGogB0ECdGoqAgAgAEHM9gBqIAJBAnRqKgIAlCAKKAIAspKoNgIAIAlBAWoiCUEgRwRAIAghByAFIQIMAQsLIAFBgAFqIQIgBkFAayEGIAFBgAdIBEAgAiEBDAELC0HgByAMIBVqayIBQYAISARAIBAgE2tBoHxqIQYD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IkogWCBLk7tEujBFka7n9D+itiJLk7tEuEt/Zp6g5j+itiI6kiEqIANBMGpBAnQgAmogTSA8kow4AgAgA0EvakECdCACaiApICiSIEwgSZIgJJIiKJKMIik4AgAgA0ExakECdCACaiApOAIAIANBLmpBAnQgAmogRiBFkiAjkowiKTgCACADQTJqQQJ0IAJqICk4AgAgA0EtakECdCACaiAwIC2SIEAgPpIgJpIiKZIiPCAokowiKDgCACADQTNqQQJ0IAJqICg4AgAgA0EsakECdCACaiA2IE+SIFEgUJIgNZIiKJKMIjY4AgAgA0E0akECdCACaiA2OAIAIANBK2pBAnQgAmogPCA/IDiSIDOSIjwgJJIiJJKMIjY4AgAgA0E1akECdCACaiA2OAIAIANBKmpBAnQgAmogPSBSkiA7kiI9ICOSjCIjOAIAIANBNmpBAnQgAmogIzgCACADQSlqQQJ0IAJqIEsgSpIgOpIiIyAkkowiJDgCACADQTdqQQJ0IAJqICQ4AgAgA0EoakECdCACaiBIIE6SIDGSjCIkOAIAIANBOGpBAnQgAmogJDgCACADQSdqQQJ0IAJqICMgPCArkiIjkowiJDgCACADQTlqQQJ0IAJqICQ4AgAgA0EmakECdCACaiA9ICeSjCIkOAIAIANBOmpBAnQgAmogJDgCACADQSVqQQJ0IAJqICkgLSAwk7tEuEt/Zp6g5j+itiIpkiItICOSjCIjOAIAIANBO2pBAnQgAmogIzgCACADQSRqQQJ0IAJqICggR5KMIiM4AgAgA0E8akECdCACaiAjOAIAIANBI2pBAnQgAmogLSArIDKSIiOSjCIoOAIAIANBPWpBAnQgAmogKDgCACADQSJqQQJ0IAJqICcgU5KMIic4AgAgA0E+akECdCACaiAnOAIAIANBIWpBAnQgAmogIyBCkowiIzgCACADQT9qQQJ0IAJqICM4AgAgA0EgakECdCACaiA0jDgCACADQQJ0IAJqIDQ4AgAgA0EfakECdCACaiAsjDgCACADQQFqQQJ0IAJqICw4AgAgA0EeakECdCACaiA5jDgCACADQQJqQQJ0IAJqIDk4AgAgA0EdakECdCACaiApICaSIjQgQZIiI4w4AgAgA0EDakECdCACaiAjOAIAIANBHGpBAnQgAmogL4w4AgAgA0EEakECdCACaiAvOAIAIANBG2pBAnQgAmogNCA3IDOSIjSSIi+MOAIAIANBBWpBAnQgAmogLzgCACADQRpqQQJ0IAJqIEQgO5IiL4w4AgAgA0EGakECdCACaiAvOAIAIANBGWpBAnQgAmogNCA6kiI0jDgCACADQQdqQQJ0IAJqIDQ4AgAgA0EYakECdCACaiAxjDgCACADQQhqQQJ0IAJqIDE4AgAgA0EXakECdCACaiAqjDgCACADQQlqQQJ0IAJqICo4AgAgA0EWakECdCACaiA7IC6SIjGMOAIAIANBCmpBAnQgAmogMTgCACADQRVqQQJ0IAJqIEMgJpIiMYw4AgAgA0ELakECdCACaiAxOAIAIANBFGpBAnQgAmogNYw4AgAgA0EMakECdCACaiA1OAIAIANBE2pBAnQgAmogJiAlkiImjDgCACADQQ1qQQJ0IAJqICY4AgAgA0ESakECdCACaiAujDgCACADQQ5qQQJ0IAJqIC44AgAgA0ERakECdCACaiAljDgCACADQQ9qQQJ0IAJqICU4AgAgA0EQakECdCACakMAAAAAOAIACy8BAX9BFBAxIgIgATYCECACIAAQMTYCACACIAA2AgggAkEANgIMIAJBADYCBCACCw0AIAAoAgAQOCAAEDgL6QEBBH8gACgCCCIDIAAoAgwiAmsiBCABSQRAAkAgACgCEEECRgRAIAAgACgCACABIARrIANBAXQiAiACIARqIAFJGyIBEDk2AgAgACABNgIIIAAoAgQgACgCDCIBQQN0IgJNDQEgACACNgIEDAELIAIgACgCBCIFQQN2IgNGIAMgBGogAUlyBEAgAEEANgIMIABBADYCBEEAIQEMAQsgAwRAIAAoAgAiASABIANqIAIgA2sQOxogACAAKAIMIANrIgE2AgwgACAAKAIEIAVBeHFrNgIEBSACIQELCwUgAiEBCyAAKAIAIAFqC40BAQR/IAAoAgRBB2pBA3YiASAAKAIMIgRJBEACQCAAKAIAIQIDQAJAIAFBAWohAyABIAJqLAAARQRAIAIgA2osAABFBEAgAiABQQJqaiwAAEEBRg0CCwsgAyAETw0CIAMhAQwBCwsgACABQQN0QSBqNgIEIAIgAUEDamotAAAPCwsgACAEQQN0NgIEQX8LqQEBBH8gACgCBEEHakEDdiICIAAoAgwiBUkEQAJAIAAoAgAh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aiIGQRBLDQALIAMgCWohAyAIayECIQEMAgsgAyABKAIAIgU6AAAgAyABLAABOgABIAJBbGpBcHEiCEESaiIJIAFqIAJBbmogA0ECaiEEIAJBfmohBiABQQJqIQIgBSEBA0AgBCACKAICIgVBEHQgAUEQdnI2AgAgBCACKAIGIgFBEHQgBUEQdnI2AgQgBCACKAIKIgVBEHQgAUEQdnI2AgggBCACKAIOIgFBEHQgBUEQdnI2AgwgAkEQaiECIARBEGohBCAGQXBqIgZBEUsNAAsgAyAJaiEDIAhrIQIhAQwBCyADIAEoAgAiBToAACACQWxqQXBxIghBEWoiCSABaiACQW9qIANBAWohBCACQX9qIQYgAUEBaiECIAUhAQNAIAQgAigCAyIFQRh0IAFBCHZyNgIAIAQgAigCByIBQRh0IAVBCHZyNgIEIAQgAigCCyIFQRh0IAFBCHZyNgIIIAQgAigCDyIBQRh0IAVBCHZyNgIMIAJBEGohAiAEQRBqIQQgBkFwaiIGQRJLDQALIAMgCWohAyAIayECIQELCyACQRBxBEAgAyABLAAAOgAAIAMgASwAAToAASADIAEsAAI6AAIgAyABLAADOgADIAMgASwABDoABCADIAEsAAU6AAUgAyABLAAGOgAGIAMgASwABzoAByADIAEsAAg6AAggAyABLAAJOgAJIAMgASwACjoACiADIAEsAAs6AAsgAyABLAAMOgAMIAMgASwADToADSADIAEsAA46AA4gAyABLAAPOgAPIANBEGohAyABQRBqIQELIAJBCHEEQCADIAEsAAA6AAAgAyABLAABOgABIAMgASwAAjoAAiADIAEsAAM6AAMgAyABLAAEOgAEIAMgASwABToABSADIAEsAAY6AAYgAyABLAAHOgAHIANBCGohAyABQQhqIQELIAJBBHEEQCADIAEsAAA6AAAgAyABLAABOgABIAMgASwAAjoAAiADIAEsAAM6AAMgA0EEaiEDIAFBBGohAQsgAkECcQRAIAMgASwAADoAACADIAEsAAE6AAEgA0ECaiEDIAFBAmohAQsgAkEBcUUEQCAADwsgAyABLAAAOgAAIAALwAMBBn8gACABRgRAIAAPCyABIAJqIABLIAAgAmoiBSABS3FFBEAgACABIAIQOhogAA8LIAEgACIDc0EDcUUhBCADIAFJBH8g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JCQkJCQkJCQkJCQkJCQkJCQAAAABAhEAAAAAAAAAAAAAAAAAAQIDBAUGEQAAAAAAAAAAAAECAwQFBgcICQoLDA0OEQABAwUGBwgJCgsMDQ4PEBEAAQIEBQYHCAkKCwwNDg8RAAECAwQFBgcICQoLDA0ODwMAAQUFAAEHBwAAAwkAAQoPAAAEHwAABT8AAAZ/AAAH/wAACP8BAAn/AwAK/wcAC/8PAAz/HwAN/z8ADv9/AA///wAQAAAAAAAAAAAAAAAAAAAAAupflgEwikIBCAgMW1tbXltec2l6ZSA+IDAAL2hvbWUvZG9taW5pYy9wcm9qZWN0cy9lbXNkay9mYXN0Y29tcC9lbXNjcmlwdGVuLy9zeXN0ZW0vbGliL2VtbWFsbG9jLmNwcABnZXRGcmVlTGlzdEluZGV4AE1JTl9GUkVFTElTVF9JTkRFWCA8PSBpbmRleCAmJiBpbmRleCA8IE1BWF9GUkVFTElTVF9JTkRFWABnZXRBZnRlcihyZWdpb24pIDw9IHNicmsoMCkAZW1tYWxsb2NfbWFsbG9jAHJlZ2lvbi0+Z2V0VXNlZCgpAGdldFBheWxvYWQAKGNoYXIqKWV4dHJhUHRyID09IChjaGFyKilwdHIgKyBzYnJrU2l6ZQBhbGxvY2F0ZVJlZ2lvbgAhbGFzdFJlZ2lvbgAhZmlyc3RSZWdpb24AZmlyc3RSZWdpb24AcHRyID09IGdldEFmdGVyKGxhc3RSZWdpb24pAGV4dGVuZExhc3RSZWdpb24AYWRkVG9GcmVlTGlzdABnZXRCaWdFbm91Z2hGcmVlTGlzdEluZGV4AHBheWxvYWRTaXplID49IHNpemUAcG9zc2libHlTcGxpdFJlbWFpbmRlcgBleHRyYSA+PSBNSU5fUkVHSU9OX1NJWkUAdG90YWxTcGxpdFNpemUgPj0gTUlOX1JFR0lPTl9TSVpFAG1lcmdlSW50b0V4aXN0aW5nRnJlZVJlZ2lvbgByZWdpb24gPT0gbGFzdFJlZ2lvbgBlbW1hbGxvY19yZWFsbG9j";

//---------------------------------------JSMpeg-----------------------------------

function UUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r :r & 3 | 8;
        return v.toString(16);
    });
}

function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
    }
    return false;
}

(function(jQuery) {
    function fullScreen(state) {
        var e, func, doc;
        if (!this.length) return this;
        e = this[0];
        if (e.ownerDocument) {
            doc = e.ownerDocument;
        } else {
            doc = e;
            e = doc.documentElement;
        }
        if (state == null) {
            if (!(doc["exitFullscreen"] || doc["webkitExitFullscreen"] || doc["webkitCancelFullScreen"] || doc["msExitFullscreen"] || doc["mozCancelFullScreen"])) {
                return null;
            }
            state = fullScreenState(doc);
            if (!state) return state;
            return doc["fullscreenElement"] || doc["webkitFullscreenElement"] || doc["webkitCurrentFullScreenElement"] || doc["msFullscreenElement"] || doc["mozFullScreenElement"] || state;
        }
        if (state) {
            func = e["requestFullscreen"] || e["webkitRequestFullscreen"] || e["webkitRequestFullScreen"] || e["msRequestFullscreen"] || e["mozRequestFullScreen"];
            if (func) {
                func.call(e);
            }
            return this;
        } else {
            func = doc["exitFullscreen"] || doc["webkitExitFullscreen"] || doc["webkitCancelFullScreen"] || doc["msExitFullscreen"] || doc["mozCancelFullScreen"];
            if (func && fullScreenState(doc)) func.call(doc);
            return this;
        }
    }
    function fullScreenState(doc) {
        return !!(doc["fullscreenElement"] || doc["msFullscreenElement"] || doc["webkitIsFullScreen"] || doc["mozFullScreen"]);
    }
    function toggleFullScreen() {
        return fullScreen.call(this, !fullScreen.call(this));
    }
    function fullScreenChangeHandler(event) {
        jQuery(document).trigger(new jQuery.Event("fullscreenchange"));
    }
    function fullScreenErrorHandler(event) {
        jQuery(document).trigger(new jQuery.Event("fullscreenerror"));
    }
    function installFullScreenHandlers() {
        var fullscreenchange = "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange";
        $(document).on(fullscreenchange, function(event) {});
        var fullscreenerror = "webkitfullscreenerror mozfullscreenerror fullscreenerror MSFullscreenError";
        $(document).on(fullscreenerror, function(event) {});
    }
    jQuery.fn["fullScreen"] = fullScreen;
    jQuery.fn["toggleFullScreen"] = toggleFullScreen;
    installFullScreenHandlers();
})(jQuery);

function wsConnect(host, clientId, times) {
    if (!times) {
        times = 3000;
    }
    var topObj = {
        videos:{},
        clientId:clientId,
		connectTimes:0,
		closeFlag: false
    };
    function closeByUrl(data) {
        for (var key in topObj.videos) {
            topObj.videos[key]._closeByUrl(data);
        }
	}
	function closeVideo(){
		for (var key in topObj.videos) {
            topObj.videos[key].close();
        }
	}
    function protocolOrder() {
        var iesup = isIE();
        var protocol = 0;
        if (iesup) {
            protocol = 1;
        }
        var order = {
            order:2,
            protocol:protocol
        };
        return order;
    }
    var wsObj = {};
    wsObj.init = function() {
        var wss = null;
        var ishttps = "https:" == document.location.protocol ? true :false;
        if (ishttps) {
            wss = new WebSocket("wss://" + host + "/video/" + clientId);
        } else {
            wss = new WebSocket("ws://" + host + "/video/" + clientId);
        }
        wsObj.wss = wss;
        wss.onopen = function(evt) {
            console.log("WS Connection Success ...");
            topObj.connectTimes = 0;
            wss.send(JSON.stringify(protocolOrder()));
        };
        wss.onmessage = function(event) {
            var data = JSON.parse(event.data);
            if (data.order == 2 && data.obj.clientId == clientId) {
                closeByUrl(data);
                return;
            }
            var video = topObj.videos[data.callbackId];
            if (video) {
                if (data.order == 0) {
                    video._toPlay(data);
                } else if (data.order == 1) {
					// video._close(data); 
                } else if (data.order == 2) {
                    console.log(data.lines);
                }
            } else {
                console.log(data.callbackId + ":对象不存在!");
            }
        };
        wss.onclose = function(evt) {
            if (topObj.connectTimes >= times||topObj.closeFlag) {
                return;
            }
			topObj.connectTimes++;
			topObj.reconTime =  setTimeout(function(){ 
				onClose();
			},5000)
        };
    };
    function onClose() { 
		if(!topObj.closeFlag){
			console.log("WS Disconnected, trying to reconnect...");
			wsObj.init(); // 断线重连
		}
    }
    wsObj.init();
    topObj.set = function(key, video) {
        topObj.videos[key] = video;
	};
	topObj.destroy =function(){
		// 关闭所有视频流
		closeVideo()
		if(topObj.reconTime){
			clearTimeout(topObj.reconTime)
		}
		if(this.wsObj.wss) {
			topObj.closeFlag = true
			this.wsObj.wss.close()
		}
		console.log('关闭流媒体服务Socket连接!')
	}
    topObj.wsObj = wsObj;
    return topObj;
}

$.fn.extend({
    video:function(wssConn,cid,key,isAudio,videoChangerCallBack) {
        var dom = this;
        var topObj = {
            key:key,
            width:$(dom).width(), // $(dom).width()
            height:$(dom).height(), // $(dom).height()
            playerStatus:1,
            voice:0,
            theme:null,
            closeStatus:false,
            mute:false,
            firstVideo:false,
            isIEState:false,
			_doClose:false,
			isAudio: isAudio, // 是否为播放音频
			videoChangerCallBack:videoChangerCallBack
        };
        topObj.isIEState = isIE();
		// topObj.cid = "c_" + topObj.key;
		topObj.ckId = UUID()
		topObj.cid = cid
        wssConn.set(topObj.key, topObj);
        topObj._closeByUrl = function(data) {
            var url = topObj.url;
            if (!url) {
                return;
            }
            if (topObj.url == data.obj.url && !topObj._doClose) {
                delete wssConn.videos[topObj.key];
                // alert("打开视频[" + topObj.url + "]流失败，请查看控制台");
				console.log(data.lines);
				console.log(data.msg);
            }
            if (url == data.obj.url && !topObj.closeStatus && !topObj.firstVideo) {
                topObj.closeStatus = true;
                topObj.close();
            }
		};
		// 未知
        function ckClose() {
            topObj.firstVideo = true;
            // 加载完成后回到
            if (topObj.closeStatus) {
                topObj.close();
                if (!topObj.isIEState) {
                    topObj.jsmpeg.destroy();
                } else {
                    topObj.player.videoClear();
                }
            }
        }
        topObj._toPlay = function(data) {
            if (topObj.openCallback) {
                topObj.openCallback(data.ok);
            }
            if (!data.ok) {
				this.close();
                console.log(data.msg);
                return;
            }
			console.log('转码完成,准备播放!');
			console.log(data)
            var obj = data.obj; 
            var ishttps = "https:" == document.location.protocol ? true :false;
            var url = null;
            if (ishttps) {
                url = "wss://" + obj.wsIp + ":" + obj.wsPort + "/" + obj.theme;
            } else {
                url = "ws://" + obj.wsIp + ":" + obj.wsPort + "/" + obj.theme;
            }
            topObj.theme = obj.theme;
            topObj.browser = getExplorerInfo();
            if (topObj.isIEState) {
                url = "rtmp://" + obj.wsIp + ":" + obj.wsPort + "/" + obj.theme;
                var videoObject = {
                    width:topObj.width,
                    height:topObj.height,
                    playerID:topObj.ckId,
                    container:"#" + topObj.ckId,
                    variable:"player",
                    autoplay:true,
                    live:true,
                    volume:0,
                    loaded:"loadedHandler",
                    video:url
                };
                topObj.player = new ckplayer(videoObject);
                if (!topObj.firstVideo) {
                    ckClose();
                }
            } else {
				let options = {}
				// 播放音频
				if(this.isAudio){
					console.log('音频解码!')
					options ={
						canvas:null,
						autoplay:true,
						video:false,
					}
				}
				else{
					var canvas = document.getElementById(topObj.cid);
					options= {
						canvas:canvas,
						// disableGl:true,
						audio:false,
						preserveDrawingBuffer:true,
						onSourceEstablished:function(){
							ckClose()
							setTimeout(function(){
								console.log('jsmpeg---开始解码播放!')
								if(canvas){
									canvas.style.display ='block'
								}
							},500)
						}
					}
				}
                var jsmpeg = new JSMpeg.Player(url, options);
				if(!this.isAudio&&canvas){
					canvas.style.display ='none'
					console.log('jsmpeg---解码准备!')
				}
                topObj.jsmpeg = jsmpeg;
                topObj.jsmpeg.volume = 50;
            }
        };
        topObj._close = function(data) {
            topObj._doClose = true;
            // if (topObj.firstVideo) {
                delete wssConn.videos[topObj.key];
                if (topObj.isIEState && topObj.player) {
					topObj.player.videoClear();
					topObj.player = null
				}
				else if(topObj.jsmpeg){
						topObj.jsmpeg.destroy()
						topObj.jsmpeg = null
				} 
				initMain(); // 重新预初始化播放容器
				console.log("停止解码,关闭播放器!");
				if(topObj.closeCallback){
					topObj.closeCallback(true)
				}
            // }
        };
        topObj.close = function(closeCallback) {
			topObj.closeCallback = closeCallback
            if (topObj.firstVideo) {
                var order = {
                    callbackId:topObj.key,
                    order:1,
                    payload:{
                        clientId:wssConn.clientId,
                        theme:topObj.theme
                    }
                };
				wssConn.wsObj.wss.send(JSON.stringify(order)); 
            } else {
                topObj.closeStatus = true;
			}
			this._close();
        };
        topObj.play = function(option, openCallback) {
			if(wssConn.wsObj.wss.readyState === 3){
				if(openCallback){openCallback(false)}
				return
			} 
            var order = {
                callbackId:topObj.key,
                order:0,
                payload:{
                    clientId:wssConn.clientId,
                    url:option.url,
                    userName:option.userName,
                    passWord:option.passWord,
                    width:option.width,
                    height:option.height,
					type:option.type
                }
            };
            topObj.openCallback = openCallback;
            topObj.url = option.url;
            wssConn.wsObj.wss.send(JSON.stringify(order));
			console.log('发送转码请求');
			console.log(order);
		}; 
		topObj.switchPlay = function (){
			switchPlay()
		}
		topObj.fullScreen = function (exitFullCallBack){
			topObj.exitFullCallBack = exitFullCallBack
			launchIntoFullscreen(document.getElementById(topObj.cid).parentElement);
			return this.openSreen
		}
		topObj.exitScreen = function (){
			doEsc()
			return this.openSreen
		}
		topObj.setSize = function (w,h){
			topObj.width = w  
			topObj.height =h  
			if(topObj.isIEState){
				const _ckDom= $(dom).find('.Ckplayer')
				if(_ckDom){
					_ckDom.width(topObj.width)
					_ckDom.height(topObj.height)
				}
			}
			else{
				$("#" + topObj.cid).width(topObj.width );
            	$("#" + topObj.cid).height(topObj.height);
			}
		}

		topObj.setVolume = function (val){
			topObj.jsmpeg.volume = val;
		}

		topObj.takePhoto = function (){
			const t = topObj.player.screenshot()
			 
			console.error(t)
			// let gl = document.getElementById(topObj.cid).getContext('experimental-webgl',{preserveDrawingBuffer:true});
			// const {drawingBufferWidth:w, drawingBufferHeight:h} = gl
			// const pixels= new Uint8Array(w*h*4)
			// gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,pixels)
			// var b = ''
			// for(var i =0;i<pixels.byteLength;i++){
			// 	b+=String.fromCharCode(pixels[i])
			// }
			// const f= window.btoa(b)
			// // const file= new Blob([pixels],{type:'image/png'})
			// // const img = URL.createObjectURL(file)
			// // file.readAsArrayBuffer(pixels)
			// debugger
			// // const base64Img = new Buffer(pixels ,'binary').toString('base64')
			// debugger
			// // let data = _canvas.toDataURL("image/png"); // 将转码的base64 传出去展示出来
        	// savePicture(data);
		}
		/** 内部方法 */
		// 初始化jsmpeg 播放容器
        function initPlayerContainer() { 
			// $(dom).html(null);
			const pc = $('#'+topObj.cid)
			if(pc.length>0){
				pc.width(topObj.width)
				pc.height(topObj.height)
				return
			}
            var htmls = [];
            htmls.push("<canvas id='" + topObj.cid + "'");
            htmls.push("width='" + topObj.width + "' height='");
            htmls.push(topObj.height + "' style='display:none;width:" + topObj.width + "px;height:" + topObj.height + "px'></canvas>");
            $(dom).append(htmls.join(""));
		}
		// 初始化ckplayer 播放容器
        function initCkplayerContainer() {
			// $(dom).html(null);
			const _ckDom= $(dom).find('.Ckplayer')
			if(_ckDom){
				_ckDom.remove()
			}
			console.error($(dom).find('.Ckplayer').length)
			var htmls = [];
            htmls.push('<div class="Ckplayer" style="position: absolute;top:0px;width:' + topObj.width + "px;height:" + topObj.height + 'px;"><div id="' + topObj.ckId + '" style="width:' + topObj.width + "px;height:" + topObj.height + 'px;"  width="' + topObj.width + '" height="' + topObj.height + '" ref="video_ck"></div>	</div>');
            $(dom).append(htmls.join(""));
		}
		// 暂停/播放切换
        function switchPlay() { 
            if (topObj.playerStatus == 1) {
				if(topObj.jsmpeg){
					topObj.jsmpeg.pause();
				} 
				if(topObj.player){
					topObj.player.videoPause()
				}
                topObj.playerStatus = 0; 
            } else {
				if(topObj.jsmpeg){
					topObj.jsmpeg.play();
				} 
				if(topObj.player){
					topObj.pmplayer.videoPlay()
				}
                topObj.playerStatus = 1; 
            }
        }
        var version = [ "81.0.4044.92", "74.0.3729.131", "77.0.3865.75", "61.0.3163.79" ];
        function exitFullscreen() {
			if(checkFull()){
				const el = document
                if (el.exitFullscreen) {
                    el.exitFullscreen();
                } else if (el.mozCancelFullScreen) {
                    el.mozCancelFullScreen();
                } else if (el.webkitExitFullscreen) {
                    el.webkitExitFullscreen();
				}
			} 
			if (topObj.browser && topObj.browser.type == "Chrome" && topObj.openSreen) {
				setTimeout(function() {
					$("#" + topObj.cid).height(topObj.initHeight);
                	$("#" + topObj.cid).width(topObj.initWidth);
				}, 100);
			} 
			topObj.openSreen = false;
        }
        function launchIntoFullscreen(element) {
            if (topObj.browser != null && topObj.browser.type == "Chrome") {
                topObj.openSreen = true;
                topObj.initWidth = $("#" + topObj.cid).width();
                topObj.initHeight = $("#" + topObj.cid).height();
                var h = window.screen.height;
                var w = window.screen.width;
                $("#" + topObj.cid).width(w);
                $("#" + topObj.cid).height(h);
            }
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            window.onresize = function() {
                if (!checkFull()) {
					doEsc();
					if(topObj.exitFullCallBack){
						topObj.exitFullCallBack()
					}
                }
            };
        }
        function getExplorerInfo() {
            var explorer = window.navigator.userAgent.toLowerCase();
            // ie
            if (explorer.indexOf("msie") >= 0) {
                var ver = explorer.match(/msie ([\d.]+)/)[1];
                return {
                    type:"IE",
                    version:ver
                };
            } else if (explorer.indexOf("firefox") >= 0) {
                var ver = explorer.match(/firefox\/([\d.]+)/)[1];
                return {
                    type:"Firefox",
                    version:ver
                };
            } else if (explorer.indexOf("chrome") >= 0) {
                var ver = explorer.match(/chrome\/([\d.]+)/)[1];
                return {
                    type:"Chrome",
                    version:ver
                };
            } else if (explorer.indexOf("opera") >= 0) {
                var ver = explorer.match(/opera.([\d.]+)/)[1];
                return {
                    type:"Opera",
                    version:ver
                };
            } else if (explorer.indexOf("Safari") >= 0) {
                var ver = explorer.match(/version\/([\d.]+)/)[1];
                return {
                    type:"Safari",
                    version:ver
                };
            }
        }
        function fullScreen(event) {
            $("#" + topObj.cid).fullScreen(true);
        }
        function doEsc() {
            exitFullscreen();
        }
        function setVoiceHtml() {
            var v_voice = "#tools_" + topObj.cid + " .v-voice label";
            if (parseInt(topObj.voice) > 100) {
                topObj.voice = 100;
            }
            $(v_voice).html(parseInt(topObj.voice) + "%");
        }
        function checkFull() {
            return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false;
		}
	 /**
     * 抓拍时 图片保存在本地
     */
    function savePicture(data){
        let base64ToBlob = function (code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for(let i = 0; i < rawLength; ++i) {
               uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {
                type: contentType
            });
        };
        let aLink = document.createElement('a');
        let blob = base64ToBlob(data);
        let evt = document.createEvent('HTMLEvents');
        evt.initEvent("click", true , true);
        aLink.download = Math.ceil(Math.random()*100000000);
        aLink.href = URL.createObjectURL(blob);
        aLink.click();
	}
	
        function initMain() {
			if(!topObj.isAudio){
				if (!topObj.isIEState) {
					initPlayerContainer();
				} else {
					initCkplayerContainer();
				}
			} 
		}
		initMain();
        return topObj;
    }
}); 

!function (){
	if(isIE()){
		window.addEventListener('mousedown',function(e){
			if(e.button==2&&typeof(e.currentTarget) ==='object'){ 
			  if(e.stopPropagation) e.stopPropagation()
			  if(e.preventDefault) e.preventDefault()
			  if(e.preeventCapture) e.preeventCapture()
			}
		  },true)
	}
}()