import{g as ie,E as oe,s as se,v as ue,b as g,d as z,w as b,_ as x,j as s,V as l,x as le,H as ce,f as de,y as P,i as pe,S as me,z as fe,A as he,e as ve,B as ge,X as be,D as xe,F as we,G as ye,J as d,K as u,M as _e,N as Y,O as X,r as B,P as Ee,Q as Ce,U as je,W as Te,Y as Fe,Z as Se,$ as G,a0 as m}from"./vendors.24e6dd6b.js";import{c as A,P as Be,B as C,C as ke,a as Ae,b as k,d as Ne,e as Pe,t as I,T as Oe}from"./common.f4d7fd5e.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const t of a.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&n(t)}).observe(document,{childList:!0,subtree:!0});function r(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=r(i);fetch(i.href,a)}})();var De=`
/* H5 端隐藏 TabBar 空图标（只隐藏没有 src 的图标） */
.weui-tabbar__icon:not([src]),
.weui-tabbar__icon[src=''] {
  display: none !important;
}

.weui-tabbar__item:has(.weui-tabbar__icon:not([src])) .weui-tabbar__label,
.weui-tabbar__item:has(.weui-tabbar__icon[src='']) .weui-tabbar__label {
  margin-top: 0 !important;
}

/* Vite 错误覆盖层无法选择文本的问题 */
vite-error-overlay {
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-user-select: text !important;
}

vite-error-overlay::part(window) {
  max-width: 90vw;
  padding: 10px;
}

.taro_page {
  overflow: auto;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* H5 导航栏页面自动添加顶部间距 */
body.h5-navbar-visible .taro_page {
  padding-top: 44px;
}

body.h5-navbar-visible .toaster[data-position^="top"] {
  top: 44px !important;
}

/* Sheet 组件在 H5 导航栏下的位置修正 */
body.h5-navbar-visible .sheet-content:not([data-side="bottom"]) {
    top: 44px !important;
}

/*
 * H5 端 rem 适配：与小程序 rpx 缩放一致
 * 375px 屏幕：1rem = 16px，小程序 32rpx = 16px
 */
html {
    font-size: 4vw !important;
}

/* H5 端组件默认样式修复 */
taro-view-core {
    display: block;
}

taro-text-core {
    display: inline;
}

taro-input-core {
    display: block;
    width: 100%;
}

taro-input-core input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
}

taro-input-core.taro-otp-hidden-input input {
    color: transparent;
    caret-color: transparent;
    -webkit-text-fill-color: transparent;
}

/* 全局按钮样式重置 */
taro-button-core,
button {
    margin: 0 !important;
    padding: 0 !important;
    line-height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
}

taro-button-core::after,
button::after {
    border: none;
}

taro-textarea-core > textarea,
.taro-textarea,
textarea.taro-textarea {
    resize: none !important;
}
`,He=`
/* PC 宽屏适配 - 基础布局 */
@media (min-width: 769px) {
  html {
    font-size: 15px !important;
  }

  body {
    background-color: #f3f4f6 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    min-height: 100vh !important;
  }
}
`,Re=`
/* PC 宽屏适配 - 手机框样式（有 TabBar 页面） */
@media (min-width: 769px) {
  .taro-tabbar__container {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    transform: translateX(0) !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
  }

  .taro-tabbar__panel {
    height: 100% !important;
    overflow: auto !important;
  }
}

/* PC 宽屏适配 - Toast 定位到手机框范围内 */
@media (min-width: 769px) {
  body .toaster {
    left: 50% !important;
    right: auto !important;
    width: 375px !important;
    max-width: 375px !important;
    transform: translateX(-50%) !important;
    box-sizing: border-box !important;
  }
}

/* PC 宽屏适配 - 手机框样式（无 TabBar 页面，通过 JS 添加 no-tabbar 类） */
@media (min-width: 769px) {
  body.no-tabbar #app {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
    transform: translateX(0) !important;
  }

  body.no-tabbar #app .taro_router {
    height: 100% !important;
    overflow: auto !important;
  }
}
`;function Le(){var o=document.createElement("style");o.innerHTML=De+He+Re,document.head.appendChild(o)}function ze(){var o=function(){var n=!!document.querySelector(".taro-tabbar__container");document.body.classList.toggle("no-tabbar",!n)};o();var e=new MutationObserver(o);e.observe(document.body,{childList:!0,subtree:!0})}function Ie(){Le(),ze()}function Ve(){var o=ie();if(o===oe.WEAPP)try{var e=se(),r=e.miniProgram.envVersion;console.log("[Debug] envVersion:",r),r!=="release"&&ue({enableDebug:!0})}catch(n){console.error("[Debug] 开启调试模式失败:",n)}}var Me={visible:!1,title:"",bgColor:"#ffffff",textStyle:"black",navStyle:"default",transparent:"none",leftIcon:"none"},We=function(){var e,r=P();return(r==null||(e=r.config)===null||e===void 0?void 0:e.window)||{}},Ue=function(){var e,r,n=(e=P())===null||e===void 0||(e=e.config)===null||e===void 0?void 0:e.tabBar;return new Set((n==null||(r=n.list)===null||r===void 0?void 0:r.map(function(i){return i.pagePath}))||[])},V=function(){var e,r=P();return(r==null||(e=r.config)===null||e===void 0||(e=e.pages)===null||e===void 0?void 0:e[0])||"pages/index/index"},j=function(e){return e.replace(/^\//,"")},$e=function(e,r,n,i){if(!e)return"none";var a=j(e),t=j(i),v=a===t,c=r.has(a)||r.has("/".concat(a)),f=n>1;return c||v?"none":f?"back":"home"},Ye=function(){var e=g.useState(Me),r=z(e,2),n=r[0],i=r[1],a=g.useState(0),t=z(a,2),v=t[0],c=t[1],f=g.useCallback(function(){var p=b.getCurrentPages();if(p.length===0){i(function(ae){return x(x({},ae),{},{visible:!1})});return}var h=p[p.length-1],H=(h==null?void 0:h.route)||"";if(H){var w=(h==null?void 0:h.config)||{},y=We(),_=Ue(),re=V(),E=j(H),R=j(re),ne=E===R,te=_.has(E)||_.has("/".concat(E)),L=_.size<=1&&p.length<=1&&(ne||te);i({visible:!L,title:document.title||w.navigationBarTitleText||y.navigationBarTitleText||"",bgColor:w.navigationBarBackgroundColor||y.navigationBarBackgroundColor||"#ffffff",textStyle:w.navigationBarTextStyle||y.navigationBarTextStyle||"black",navStyle:w.navigationStyle||y.navigationStyle||"default",transparent:w.transparentTitle||y.transparentTitle||"none",leftIcon:L?"none":$e(E,_,p.length,R)})}},[]);b.useDidShow(function(){f()}),b.usePageScroll(function(p){var h=p.scrollTop;n.transparent==="auto"&&c(Math.min(h/100,1))}),g.useEffect(function(){var p=null,h=new MutationObserver(function(){p&&clearTimeout(p),p=setTimeout(function(){f()},50)});return h.observe(document.head,{subtree:!0,childList:!0,characterData:!0}),f(),function(){h.disconnect(),p&&clearTimeout(p)}},[f]);var S=n.visible&&n.navStyle!=="custom";if(g.useEffect(function(){S?document.body.classList.add("h5-navbar-visible"):document.body.classList.remove("h5-navbar-visible")},[S]),!S)return s.jsx(s.Fragment,{});var D=n.textStyle==="white"?"#fff":"#333",K=n.textStyle==="white"?"text-white":"text-gray-800",Q=function(){return n.transparent==="always"?{backgroundColor:"transparent"}:n.transparent==="auto"?{backgroundColor:n.bgColor,opacity:v}:{backgroundColor:n.bgColor}},Z=function(){return b.navigateBack()},ee=function(){var h=V();b.reLaunch({url:"/".concat(h)})};return s.jsxs(s.Fragment,{children:[s.jsxs(l,{className:"fixed top-0 left-0 right-0 h-11 flex items-center justify-center z-1000",style:Q(),children:[n.leftIcon==="back"&&s.jsx(l,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:Z,children:s.jsx(le,{size:24,color:D})}),n.leftIcon==="home"&&s.jsx(l,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:ee,children:s.jsx(ce,{size:22,color:D})}),s.jsx(de,{className:"text-base font-medium max-w-3/5 truncate ".concat(K),children:n.title})]}),s.jsx(l,{className:"h-11 shrink-0"})]})},Xe=function(e){var r=e.children;return s.jsxs(s.Fragment,{children:[s.jsx(Ye,{}),r]})},Ge=["className","children","orientation"],J=g.forwardRef(function(o,e){var r=o.className,n=o.children,i=o.orientation,a=i===void 0?"vertical":i,t=pe(o,Ge),v=a==="horizontal"||a==="both",c=a==="vertical"||a==="both";return s.jsx(me,x(x({ref:e,className:A("relative",r),scrollY:c,scrollX:v,style:{overflowX:v?"auto":"hidden",overflowY:c?"auto":"hidden"}},t),{},{children:n}))});J.displayName="ScrollArea";var Je={error:null,report:"",source:"",visible:!1,open:!1,timestamp:""},M="hsl(360, 100%, 45%)",W=!1,T=Je,N=new Set,qe=function(){N.forEach(function(e){return e()})},Ke=function(e){return N.add(e),function(){return N.delete(e)}},U=function(){return T},q=function(e){T=e,qe()},Qe=function(){var o=d(u().m(function e(r){var n,i,a,t,v;return u().w(function(c){for(;;)switch(c.p=c.n){case 0:if(typeof window!="undefined"){c.n=1;break}return c.a(2,!1);case 1:if(c.p=1,!((n=navigator.clipboard)!==null&&n!==void 0&&n.writeText)){c.n=3;break}return c.n=2,navigator.clipboard.writeText(r);case 2:return c.a(2,!0);case 3:c.n=5;break;case 4:c.p=4,t=c.v,console.warn("[H5ErrorBoundary] Clipboard API copy failed:",t);case 5:return c.p=5,i=document.createElement("textarea"),i.value=r,i.setAttribute("readonly","true"),i.style.position="fixed",i.style.opacity="0",document.body.appendChild(i),i.select(),a=document.execCommand("copy"),document.body.removeChild(i),c.a(2,a);case 6:return c.p=6,v=c.v,console.warn("[H5ErrorBoundary] Fallback copy failed:",v),c.a(2,!1)}},e,null,[[5,6],[1,4]])}));return function(r){return o.apply(this,arguments)}}(),Ze=function(e){if(e instanceof Error)return e;if(typeof e=="string")return new Error(e);try{return new Error(JSON.stringify(e))}catch(r){return new Error(String(e))}},er=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=["[H5 Runtime Error]","Time: ".concat(new Date().toISOString()),r.source?"Source: ".concat(r.source):"","Name: ".concat(e.name),"Message: ".concat(e.message),e.stack?`Stack:
`.concat(e.stack):"",r.componentStack?`Component Stack:
`.concat(r.componentStack):"",typeof navigator!="undefined"?"User Agent: ".concat(navigator.userAgent):""].filter(Boolean);return n.join(`

`)},$=function(e){T.visible&&q(x(x({},T),{},{open:e}))},O=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(typeof window!="undefined"){var n=Ze(e),i=er(n,r),a=new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});q({error:n,report:i,source:r.source||"runtime",timestamp:a,visible:!0,open:!1}),console.error("[H5ErrorOverlay] Showing error overlay:",n,r)}},rr=function(e){var r=e.error||new Error(e.message||"Unknown H5 runtime error");O(r,{source:"window.error"})},nr=function(e){O(e.reason,{source:"window.unhandledrejection"})},tr=function(){typeof window=="undefined"||W||(W=!0,window.addEventListener("error",rr),window.addEventListener("unhandledrejection",nr))},ar=function(){var e,r,n=g.useSyncExternalStore(Ke,U,U);if(!n.visible)return null;var i=((e=n.error)===null||e===void 0?void 0:e.name)||"Error";return s.jsx(Be,{children:s.jsxs(l,{className:"pointer-events-none fixed inset-0 z-[2147483646]",children:[s.jsx(l,{className:"pointer-events-auto fixed bottom-5 left-5",children:s.jsx(C,{variant:"outline",size:"icon",className:A("h-11 w-11 rounded-full shadow-md transition-transform"),style:{backgroundColor:"hsl(359, 100%, 97%)",borderColor:"hsl(359, 100%, 94%)",color:M},onClick:function(){return $(!n.open)},children:s.jsx(ve,{size:22,color:M})})}),n.open&&s.jsx(l,{className:"pointer-events-none fixed inset-0 bg-white bg-opacity-15 supports-[backdrop-filter]:backdrop-blur-md",children:s.jsx(l,{className:"absolute inset-0 flex items-center justify-center px-4 py-4",children:s.jsx(l,{className:"w-full max-w-md",style:{width:"min(calc(100vw - 32px), var(--h5-phone-width, 390px))",height:"min(calc(100vh - 32px), 900px)"},children:s.jsx(ke,{className:A("pointer-events-auto h-full rounded-2xl border border-border bg-background text-foreground shadow-2xl"),children:s.jsxs(l,{className:"relative flex h-full flex-col",children:[s.jsxs(Ae,{className:"gap-2 p-4 pb-2",children:[s.jsxs(l,{className:"flex items-start justify-between gap-3",children:[s.jsxs(l,{className:"flex flex-wrap items-center gap-2",children:[s.jsx(k,{variant:"destructive",className:"border-none bg-red-500 px-3 py-1 text-xs font-medium text-white",children:"Runtime Error"}),s.jsx(k,{variant:"outline",className:"px-3 py-1 text-xs",children:n.source})]}),s.jsxs(l,{className:"flex shrink-0 items-center gap-1",children:[s.jsx(C,{variant:"ghost",size:"icon",className:"h-8 w-8 rounded-full",onClick:function(){return window.location.reload()},children:s.jsx(ge,{size:15,color:"inherit"})}),s.jsx(C,{variant:"ghost",size:"icon",className:"h-8 w-8 rounded-full",onClick:function(){return $(!1)},children:s.jsx(be,{size:17,color:"inherit"})})]})]}),s.jsxs(l,{className:"flex items-center justify-between gap-3",children:[s.jsx(Ne,{className:"text-left text-lg",children:i}),s.jsxs(C,{variant:"outline",size:"sm",className:"shrink-0 rounded-lg",onClick:function(){var a=d(u().m(function v(){var c;return u().w(function(f){for(;;)switch(f.n){case 0:return f.n=1,Qe(n.report);case 1:if(c=f.v,!c){f.n=2;break}return I.success("已复制错误信息",{description:"可发送给 Agent 进行自动修复",position:"top-center"}),f.a(2);case 2:I.warning("复制失败",{description:"请直接选中文本后手动复制。",position:"top-center"});case 3:return f.a(2)}},v)}));function t(){return a.apply(this,arguments)}return t}(),children:[s.jsx(xe,{size:15,color:"inherit"}),s.jsx(l,{children:"复制错误"})]})]})]}),s.jsx(Pe,{className:"min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2",children:s.jsxs(l,{className:"flex h-full min-h-0 flex-col gap-2",children:[s.jsxs(l,{className:"flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border px-3 py-2 text-sm",children:[s.jsxs(l,{className:"flex items-center gap-2",children:[s.jsx(l,{className:"text-muted-foreground",children:"Error"}),s.jsx(l,{className:"font-medium text-foreground",children:((r=n.error)===null||r===void 0?void 0:r.name)||"Error"})]}),s.jsx(l,{className:"h-4 w-px bg-border"}),s.jsxs(l,{className:"flex items-center gap-2",children:[s.jsx(l,{className:"text-muted-foreground",children:"Source"}),s.jsx(l,{className:"font-medium text-foreground",children:n.source})]})]}),s.jsxs(l,{className:"min-h-0 flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-black text-white",children:[s.jsxs(l,{className:"flex items-center justify-between border-b border-white border-opacity-10 px-3 py-3",children:[s.jsx(l,{className:"text-xs font-medium uppercase tracking-wide text-zinc-400",children:"Full Report"}),s.jsx(k,{variant:"outline",className:"border-zinc-700 bg-transparent px-2 py-1 text-xs text-zinc-400",children:n.timestamp})]}),s.jsx(J,{className:"min-h-0 flex-1 w-full",orientation:"both",children:s.jsx(l,{className:"inline-block min-w-full whitespace-pre px-3 py-3 pb-8 font-mono text-xs leading-6 text-zinc-200",children:n.report})})]})]})})]})})})})})]})})},ir=function(o){function e(){var r;we(this,e);for(var n=arguments.length,i=new Array(n),a=0;a<n;a++)i[a]=arguments[a];return r=ye(this,e,[].concat(i)),r.state={error:null},r}return fe(e,o),he(e,[{key:"componentDidUpdate",value:function(n){this.state.error&&n.children!==this.props.children&&this.setState({error:null})}},{key:"componentDidCatch",value:function(n,i){O(n,{source:"React Error Boundary",componentStack:i.componentStack||""})}},{key:"render",value:function(){return s.jsxs(s.Fragment,{children:[s.jsx(ar,{}),this.state.error?null:this.props.children]})}}],[{key:"getDerivedStateFromError",value:function(n){return{error:n}}}])}(g.Component),or=function(e){var r=e.children;return s.jsx(ir,{children:r})},sr=function(e){var r=e.children;return tr(),b.useLaunch(function(){Ve(),Ie()}),s.jsx(or,{children:s.jsx(Xe,{children:r})})},ur=function(e){var r=e.children;return s.jsxs(_e,{defaultColor:"#000",defaultSize:24,children:[s.jsx(sr,{children:r}),s.jsx(Oe,{})]})},F=Y.__taroAppConfig={router:{mode:"hash"},pages:["pages/login/index","pages/role-select/index","pages/index/index","pages/order-create/index","pages/users/index","pages/users/edit","pages/user-approval/index","pages/my-tasks/index","pages/map-lock/index","pages/order-execution/index","pages/statistics/index","pages/expense-application/index","pages/invoice-application/index","pages/certificates/index","pages/settings/index"],window:{backgroundTextStyle:"light",navigationBarBackgroundColor:"#fff",navigationBarTitleText:"WeChat",navigationBarTextStyle:"black"}};F.routes=[Object.assign({path:"pages/login/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.20174893.js"),["./index.20174893.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"登录",navigationStyle:"custom"}),Object.assign({path:"pages/role-select/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.198a15c5.js"),["./index.198a15c5.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"选择角色"}),Object.assign({path:"pages/index/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.00df5247.js"),["./index.00df5247.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"陕西叁恒"}),Object.assign({path:"pages/order-create/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.6796023e.js"),["./index.6796023e.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"订单录入"}),Object.assign({path:"pages/users/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.37b6d240.js"),["./index.37b6d240.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"用户管理"}),Object.assign({path:"pages/users/edit",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./edit.d04dd539.js"),["./edit.d04dd539.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{}),Object.assign({path:"pages/user-approval/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.bbb3ea63.js"),["./index.bbb3ea63.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"用户审批"}),Object.assign({path:"pages/my-tasks/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.a754a812.js"),["./index.a754a812.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"我的任务"}),Object.assign({path:"pages/map-lock/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.801ed5f8.js"),["./index.801ed5f8.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"地图标点"}),Object.assign({path:"pages/order-execution/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.a179639d.js"),["./index.a179639d.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"订单执行"}),Object.assign({path:"pages/statistics/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.7d518a39.js"),["./index.7d518a39.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{}),Object.assign({path:"pages/expense-application/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.a4df355f.js"),["./index.a4df355f.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{}),Object.assign({path:"pages/invoice-application/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.b1a09405.js"),["./index.b1a09405.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{}),Object.assign({path:"pages/certificates/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.152563af.js"),["./index.152563af.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{}),Object.assign({path:"pages/settings/index",load:function(){var o=d(u().m(function r(n,i){var a;return u().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,m(()=>import("./index.3a5a55dc.js"),["./index.3a5a55dc.js","./vendors.24e6dd6b.js","../css/vendors.8886af03.css","./common.f4d7fd5e.js"],import.meta.url);case 1:return a=t.v,t.a(2,[a,n,i])}},r)}));function e(r,n){return o.apply(this,arguments)}return e}()},{})];Object.assign(X,{findDOMNode:B.findDOMNode,render:B.render,unstable_batchedUpdates:B.unstable_batchedUpdates});Ee();var lr=Ce(ur,G,X,F),cr=je({window:Y});Te(F);Fe(cr,lr,F,G);Se({designWidth:750,deviceRatio:{375:2,640:1.17,750:1,828:.905},baseFontSize:20,unitPrecision:void 0,targetUnit:void 0});
