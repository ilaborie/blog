webpackJsonp([0x67ef26645b2a,60335399758886],{340:function(e,t){e.exports={layoutContext:{}}},428:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(1),s=r(o),a=n(431),u=r(a),l=n(340),c=r(l);t.default=function(e){return s.default.createElement(u.default,i({},e,c.default))},e.exports=t.default},316:function(e,t,n){e.exports={default:n(320),__esModule:!0}},317:function(e,t,n){e.exports={default:n(321),__esModule:!0}},318:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var i=n(316),o=r(i);t.default=o.default||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}},319:function(e,t){"use strict";t.__esModule=!0,t.default=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}},320:function(e,t,n){n(324),e.exports=n(15).Object.assign},321:function(e,t,n){n(325),e.exports=n(15).Object.keys},322:function(e,t,n){"use strict";var r=n(33),i=n(75),o=n(46),s=n(78),a=n(118),u=Object.assign;e.exports=!u||n(27)(function(){var e={},t={},n=Symbol(),r="abcdefghijklmnopqrst";return e[n]=7,r.split("").forEach(function(e){t[e]=e}),7!=u({},e)[n]||Object.keys(u({},t)).join("")!=r})?function(e,t){for(var n=s(e),u=arguments.length,l=1,c=i.f,p=o.f;u>l;)for(var d,f=a(arguments[l++]),h=c?r(f).concat(c(f)):r(f),m=h.length,_=0;m>_;)p.call(f,d=h[_++])&&(n[d]=f[d]);return n}:u},323:function(e,t,n){var r=n(26),i=n(15),o=n(27);e.exports=function(e,t){var n=(i.Object||{})[e]||Object[e],s={};s[e]=t(n),r(r.S+r.F*o(function(){n(1)}),"Object",s)}},324:function(e,t,n){var r=n(26);r(r.S+r.F,"Object",{assign:n(322)})},325:function(e,t,n){var r=n(78),i=n(33);n(323)("keys",function(){return function(e){return i(r(e))}})},467:function(e,t){function n(e){var t=e.target||e.srcElement;t.__resizeRAF__&&i(t.__resizeRAF__),t.__resizeRAF__=r(function(){var n=t.__resizeTrigger__;n.__resizeListeners__.forEach(function(t){t.call(n,e)})})}var r=function(){var e=this,t=e.requestAnimationFrame||e.mozRequestAnimationFrame||e.webkitRequestAnimationFrame||function(t){return e.setTimeout(t,20)};return function(e){return t(e)}}(),i=function(){var e=this,t=e.cancelAnimationFrame||e.mozCancelAnimationFrame||e.webkitCancelAnimationFrame||e.clearTimeout;return function(e){return t(e)}}(),t=function(e,t){function r(){this.contentDocument.defaultView.__resizeTrigger__=this.__resizeElement__,this.contentDocument.defaultView.addEventListener("resize",n)}var i,o=this,s=o.document,a=s.attachEvent;if("undefined"!=typeof navigator&&(i=navigator.userAgent.match(/Trident/)||navigator.userAgent.match(/Edge/)),!e.__resizeListeners__)if(e.__resizeListeners__=[],a)e.__resizeTrigger__=e,e.attachEvent("onresize",n);else{"static"===getComputedStyle(e).position&&(e.style.position="relative");var u=e.__resizeTrigger__=s.createElement("object");u.setAttribute("style","display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; opacity: 0;"),u.setAttribute("class","resize-sensor"),u.__resizeElement__=e,u.onload=r,u.type="text/html",i&&e.appendChild(u),u.data="about:blank",i||e.appendChild(u)}e.__resizeListeners__.push(t)};e.exports="undefined"==typeof window?t:t.bind(window),e.exports.unbind=function(e,t){var r=document.attachEvent;t?e.__resizeListeners__.splice(e.__resizeListeners__.indexOf(t),1):e.__resizeListeners__=[],e.__resizeListeners__.length||(r?e.detachEvent("onresize",n):(e.__resizeTrigger__.contentDocument.defaultView.removeEventListener("resize",n),delete e.__resizeTrigger__.contentDocument.defaultView.__resizeTrigger__,e.__resizeTrigger__=!e.removeChild(e.__resizeTrigger__)),delete e.__resizeListeners__)}},336:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e){return o(C+e)}function o(e){return e.replace(/^\/\//g,"/")}t.__esModule=!0,t.navigateTo=void 0;var s=n(318),a=r(s),u=n(317),l=r(u),c=n(319),p=r(c),d=n(83),f=r(d),h=n(117),m=r(h),_=n(116),y=r(_);t.withPrefix=i;var v=n(1),g=r(v),b=n(129),w=n(5),x=r(w),C="/";C="/blog";var T={activeClassName:x.default.string,activeStyle:x.default.object,exact:x.default.bool,strict:x.default.bool,isActive:x.default.func,location:x.default.object},O=function(e,t){var n=new window.IntersectionObserver(function(r){r.forEach(function(r){e===r.target&&(r.isIntersecting||r.intersectionRatio>0)&&(n.unobserve(e),n.disconnect(),t())})});n.observe(e)},E=function(e){function t(n){(0,f.default)(this,t);var r=(0,m.default)(this,e.call(this)),o=!1;return"undefined"!=typeof window&&window.IntersectionObserver&&(o=!0),r.state={to:i(n.to),IOSupported:o},r.handleRef=r.handleRef.bind(r),r}return(0,y.default)(t,e),t.prototype.componentWillReceiveProps=function(e){this.props.to!==e.to&&(this.setState({to:i(e.to)}),this.state.IOSupported||___loader.enqueue(this.state.to))},t.prototype.componentDidMount=function(){this.state.IOSupported||___loader.enqueue(this.state.to)},t.prototype.handleRef=function(e){var t=this;this.props.innerRef&&this.props.innerRef(e),this.state.IOSupported&&e&&O(e,function(){___loader.enqueue(t.state.to)})},t.prototype.render=function(){var e=this,t=this.props,n=t.onClick,r=(0,p.default)(t,["onClick"]),i=void 0;return i=(0,l.default)(T).some(function(t){return e.props[t]})?b.NavLink:b.Link,g.default.createElement(i,(0,a.default)({onClick:function(t){if(n&&n(t),!(0!==t.button||e.props.target||t.defaultPrevented||t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)){var r=e.state.to;if(r.split("#").length>1&&(r=r.split("#").slice(0,-1).join("")),r===window.location.pathname){var i=e.state.to.split("#").slice(1).join("#"),o=document.getElementById(i);if(null!==o)return o.scrollIntoView(),!0}t.preventDefault(),window.___navigateTo(e.state.to)}return!0}},r,{to:this.state.to,innerRef:this.handleRef}))},t}(g.default.Component);E.propTypes=(0,a.default)({},T,{innerRef:x.default.func,onClick:x.default.func,to:x.default.string.isRequired}),E.contextTypes={router:x.default.object},t.default=E;t.navigateTo=function(e){window.___navigateTo(i(e))}},468:function(e,t){},543:function(e,t,n){for(var r=n(544),i="undefined"==typeof window?{}:window,o=["moz","webkit"],s="AnimationFrame",a=i["request"+s],u=i["cancel"+s]||i["cancelRequest"+s],l=!0,c=0;c<o.length&&!a;c++)a=i[o[c]+"Request"+s],u=i[o[c]+"Cancel"+s]||i[o[c]+"CancelRequest"+s];if(!a||!u){l=!1;var p=0,d=0,f=[],h=1e3/60;a=function(e){if(0===f.length){var t=r(),n=Math.max(0,h-(t-p));p=n+t,setTimeout(function(){var e=f.slice(0);f.length=0;for(var t=0;t<e.length;t++)if(!e[t].cancelled)try{e[t].callback(p)}catch(e){setTimeout(function(){throw e},0)}},Math.round(n))}return f.push({handle:++d,callback:e,cancelled:!1}),d},u=function(e){for(var t=0;t<f.length;t++)f[t].handle===e&&(f[t].cancelled=!0)}}e.exports=function(e){return l?a.call(i,function(){try{e.apply(this,arguments)}catch(e){setTimeout(function(){throw e},0)}}):a.call(i,e)},e.exports.cancel=function(){u.apply(i,arguments)}},544:function(e,t,n){(function(t){(function(){var n,r,i;"undefined"!=typeof performance&&null!==performance&&performance.now?e.exports=function(){return performance.now()}:"undefined"!=typeof t&&null!==t&&t.hrtime?(e.exports=function(){return(n()-i)/1e6},r=t.hrtime,n=function(){var e;return e=r(),1e9*e[0]+e[1]},i=n()):Date.now?(e.exports=function(){return Date.now()-i},i=Date.now()):(e.exports=function(){return(new Date).getTime()-i},i=(new Date).getTime())}).call(this)}).call(t,n(307))},545:function(e,t,n){var r=n(341),i=n(467);e.exports={getInitialState:function(){return void 0!==this.props.initialComponentWidth&&null!==this.props.initialComponentWidth?{componentWidth:this.props.initialComponentWidth}:{}},componentDidMount:function(){this.setState({componentWidth:r.findDOMNode(this).getBoundingClientRect().width}),i(r.findDOMNode(this),this.onResize)},componentDidUpdate:function(){0===r.findDOMNode(this).getElementsByClassName("resize-sensor").length&&i(r.findDOMNode(this),this.onResize)},onResize:function(){this.setState({componentWidth:r.findDOMNode(this).getBoundingClientRect().width})}}},609:function(e,t,n){var r;r=n(610),e.exports={getInitialState:function(){return this.props.initialPageWidth?{pageWidth:this.props.initialPageWidth}:{}},componentDidMount:function(){return r.on(this.onResize)},componentWillUnmount:function(){return r.off(this.onResize)},onResize:function(e){return this.setState({pageWidth:e})}}},610:function(e,t,n){var r,i,o,s,a,u;o=n(543),r=void 0,s=[],a=!1,"undefined"!=typeof window&&null!==window&&(r=window.innerWidth),i=function(){if(!a)return a=!0,o(u)},u=function(){var e,t,n;for(r=window.innerWidth,e=0,t=s.length;e<t;e++)(n=s[e])(r);return a=!1},"undefined"!=typeof window&&null!==window&&window.addEventListener("resize",i),e.exports={on:function(e){return e(r),s.push(e)},off:function(e){return s.splice(s.indexOf(e),1)}}},611:function(e,t,n){var r,i,o,s,a,u;s=n(1),a=n(545),o=n(609),u=n(4),r=s.createClass({displayName:"Breakpoint",mixins:[a],propTypes:{minWidth:s.PropTypes.number,maxWidth:s.PropTypes.number},getDefaultProps:function(){return{minWidth:0,maxWidth:1e21}},renderChildren:function(){return s.Children.map(this.props.children,function(e){return function(t){var n;return"Span"===(null!=t&&null!=(n=t.type)?n.displayName:void 0)?s.cloneElement(t,{context:e.props.context}):t}}(this))},render:function(){var e,t;return e=u({},this.props),delete e.maxWidth,delete e.minWidth,delete e.widthMethod,this.state.componentWidth&&this.props.minWidth<=(t=this.state.componentWidth)&&t<this.props.maxWidth?s.createElement("div",Object.assign({},e),this.renderChildren()):s.createElement("div",null)}}),i=s.createClass({displayName:"Breakpoint",mixins:[o],propTypes:{minWidth:s.PropTypes.number,maxWidth:s.PropTypes.number},getDefaultProps:function(){return{minWidth:0,maxWidth:1e21}},renderChildren:function(){return s.Children.map(this.props.children,function(e){return function(t){var n;return"Span"===(null!=(n=t.type)?n.displayName:void 0)?s.cloneElement(t,{context:e.props.context}):t}}(this))},render:function(){var e,t;return e=u({},this.props),delete e.maxWidth,delete e.minWidth,delete e.widthMethod,this.state.pageWidth&&this.props.minWidth<=(t=this.state.pageWidth)&&t<this.props.maxWidth?s.createElement("div",Object.assign({},e),this.renderChildren()):s.createElement("div",null)}}),e.exports=s.createClass({displayName:"Breakpoint",propTypes:{widthMethod:s.PropTypes.string.isRequired,minWidth:s.PropTypes.number,maxWidth:s.PropTypes.number},getDefaultProps:function(){return{widthMethod:"pageWidth"}},render:function(){return"pageWidth"===this.props.widthMethod?s.createElement(i,Object.assign({},this.props)):"componentWidth"===this.props.widthMethod?s.createElement(r,Object.assign({},this.props)):void 0}})},612:function(e,t,n){var r,i;r=n(1),i=n(4),e.exports=r.createClass({displayName:"Container",render:function(){var e,t,n,o;return t={maxWidth:"960px",marginLeft:"auto",marginRight:"auto"},o=i(t,this.props.style),e=this.props.children,n=i({},this.props),delete n.children,delete n.style,r.createElement("div",Object.assign({},n,{style:o}),e,r.createElement("span",{style:{display:"block",clear:"both"}}," "))}})},613:function(e,t,n){var r,i;r=n(1),i=n(4),e.exports=r.createClass({displayName:"Grid",propTypes:{columns:r.PropTypes.number,gutterRatio:r.PropTypes.number},getDefaultProps:function(){return{columns:12,gutterRatio:.25}},renderChildren:function(){return r.Children.map(this.props.children,function(e){return function(t){var n,i;return"Breakpoint"===(n=null!=(i=t.type)?i.displayName:void 0)||"Span"===n?r.cloneElement(t,{context:{columns:e.props.columns,gutterRatio:e.props.gutterRatio}}):t}}(this))},render:function(){var e;return e=i({},this.props),delete e.gutterRatio,delete e.columns,r.createElement("div",Object.assign({},e),this.renderChildren(),r.createElement("span",{style:{display:"block",clear:"both"}}," "))}})},614:function(e,t,n){var r,i,o;r=n(1),i=n(4),o=n(616),e.exports=r.createClass({displayName:"Span",propTypes:{context:r.PropTypes.object,columns:r.PropTypes.number,at:r.PropTypes.number,pre:r.PropTypes.number,post:r.PropTypes.number,squish:r.PropTypes.number,last:r.PropTypes.bool,break:r.PropTypes.bool},getDefaultProps:function(){return{at:0,pre:0,post:0,squish:0,last:!1,first:!1,break:!1}},renderChildren:function(){return r.Children.map(this.props.children,function(e){return function(t){var n;return"Span"===(null!=t&&null!=(n=t.type)?n.displayName:void 0)?r.cloneElement(t,{context:{columns:e.props.columns,gutterRatio:e.props.context.gutterRatio}}):t}}(this))},render:function(){var e,t;return t=o({contextColumns:this.props.context.columns,gutterRatio:this.props.context.gutterRatio,columns:this.props.columns,at:this.props.at,pre:this.props.pre,post:this.props.post,squish:this.props.squish,last:this.props.last,break:this.props.break}),t=i(t,this.props.style),e=i({},this.props,{style:t}),delete e.at,delete e.break,delete e.columns,delete e.context,delete e.first,delete e.last,delete e.post,delete e.pre,delete e.squish,delete e.style,r.createElement("div",Object.assign({},e,{style:t}),this.renderChildren(),r.createElement("span",{style:{display:"block",clear:"both"}}," "))}})},615:function(e,t,n){t.Container=n(612),t.Grid=n(613),t.Breakpoint=n(611),t.Span=n(614)},616:function(e,t,n){var r;r=n(4),e.exports=function(e){var t,n,i,o,s,a,u,l,c,p;return i={columns:3,at:0,pre:0,post:0,squish:0,contextColumns:12,gutterRatio:.25,first:!1,last:!1},c=r(i,e),l=100/(c.contextColumns+(c.contextColumns-1)*c.gutterRatio),s=c.gutterRatio*l,n=function(e){return l*e+s*(e-1)},t=function(e){return 0===e?0:n(e)+s},p=n(c.columns),a=0===c.at&&0===c.pre&&0===c.squish?0:t(c.at)+t(c.pre)+t(c.squish),c.last&&0===c.post&&0===c.squish?u=0:0!==c.post||0!==c.squish?(u=t(c.post)+t(c.squish),c.last||(u+=s)):u=s,o=c.last?"right":"left",p+="%",a+="%",u+="%",{float:o,marginLeft:a,marginRight:u,width:p,clear:c.break?"both":"none"}}},431:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=n(1),l=r(u),c=n(336),p=r(c),d=n(615),f=n(82);n(468),n(469);var h=function(e){function t(){return i(this,t),o(this,e.apply(this,arguments))}return s(t,e),t.prototype.render=function(){var e=this.props,t=e.location,n=e.children,r=void 0,i="/";return i="/blog/",r=t.pathname===i?l.default.createElement("h1",{style:a({},(0,f.scale)(1.5),{marginBottom:(0,f.rhythm)(1.5),marginTop:0})},l.default.createElement(p.default,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},"Akka, Concurrency, etc.")):l.default.createElement("h3",{style:{fontFamily:"Montserrat, sans-serif",marginTop:0,marginBottom:(0,f.rhythm)(-1)}},l.default.createElement(p.default,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},"Akka, Concurrency, etc.")),l.default.createElement(d.Container,{style:{maxWidth:(0,f.rhythm)(24),padding:(0,f.rhythm)(1.5)+" "+(0,f.rhythm)(.75)}},r,n())},t}(l.default.Component);t.default=h,e.exports=t.default},469:function(e,t){}});
//# sourceMappingURL=component---src-layouts-index-js-eb745b83df7613925712.js.map