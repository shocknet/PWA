(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[25,36],{596:function(a,e,t){"use strict";t.d(e,"a",(function(){return d}));var c=t(0),n=t(84),i=t.n(n),s=t(8),o=(t(597),t(4)),d=73,r={minHeight:d};e.b=function(a){var e=a.pageTitle,t=a.drawerVisible,n=void 0!==t&&t,d=a.onHeight,l=void 0===d?s.b:d,b=Object(c.useCallback)((function(){window.history.back()}),[]),j=Object(c.useCallback)((function(a){if(a)try{l(a.getBoundingClientRect().height)}catch(e){console.log("Error inside onHeight mechanism in DialogNav:"),console.log(e)}}),[l]);return Object(o.jsxs)("div",{className:"dialog-nav-container",ref:j,style:r,"data-v-9810b4e3":"",children:[Object(o.jsx)("div",{className:"dialog-nav-back",onClick:b,"data-v-9810b4e3":"",children:Object(o.jsx)("i",{className:"icon icon-thin-back","data-v-9810b4e3":""})}),Object(o.jsx)("p",{className:"dialog-nav-title","data-v-9810b4e3":"",children:e}),Object(o.jsxs)("div",{className:i()({"dialog-nav-menu-btn":!0,"dialog-nav-hidden":!n}),"data-v-9810b4e3":"",children:[Object(o.jsx)("div",{className:"dialog-nav-menu-dash","data-v-9810b4e3":""}),Object(o.jsx)("div",{className:"dialog-nav-menu-dash","data-v-9810b4e3":""}),Object(o.jsx)("div",{className:"dialog-nav-menu-dash","data-v-9810b4e3":""})]})]})}},597:function(a,e,t){},608:function(a,e,t){"use strict";var c=t(2),n=t(17),i=t(0),s=t(899),o=t(180),d=(t(625),t(609),t(4));e.a=function(a){var e=a.id,t=void 0===e?"":e,r=a.item,l=a.index,b=void 0===l?0:l,j=a.postId,u=void 0===j?"":j,v=a.tipValue,m=void 0===v?0:v,O=a.tipCounter,f=void 0===O?0:O,g=a.hideRibbon,h=void 0!==g&&g,p=a.width,x=void 0===p?null:p,y=a.disableZoom,N=void 0!==y&&y,k=a.style,w=void 0===k?{}:k,C=Object(i.useState)(!1),S=Object(n.a)(C,2),R=S[0],E=S[1],I=Object(i.useState)(!1),T=Object(n.a)(I,2),D=T[0],P=T[1],U=Object(i.useState)(!0),_=Object(n.a)(U,2),B=_[0],H=_[1],J=Object(i.useState)(null),V=Object(n.a)(J,2),Z=V[0],K=V[1],L=Object(i.useCallback)((function(a){if(clearTimeout(Z),E(a),!a&&D){P(!1);var e=setTimeout((function(){H(!0)}),200);K(e)}a&&H(!1)}),[Z,D,E,P,H,K]),M=decodeURIComponent(r.magnetURI.replace(/.*(ws=)/gi,"")),q=Object(c.a)(Object(c.a)({},w),{},{opacity:B?1:0});x&&(q.width=x);var z=Object(d.jsxs)(d.Fragment,{children:[Object(d.jsx)("img",{className:"image torrent-img torrent-img-".concat(u,"-").concat(t),alt:"Post Media","data-torrent":r.magnetURI,"data-file-key":b,style:q,src:M,"data-v-04cf1604":""}),Object(d.jsx)("img",{className:"image enlarged-img enlarged-img-".concat(u,"-").concat(t),alt:"Post Media","data-file-key":b,onLoad:function(){P(!0)},style:{opacity:R?1:0,display:R?"block":"none"},src:M,"data-v-04cf1604":""}),!h&&Object(d.jsx)(o.a,{tipCounter:f,tipValue:m,zoomed:R,"data-v-04cf1604":""})]});return Object(d.jsx)("div",{className:"media-container","data-v-04cf1604":"",children:N?z:Object(d.jsx)(s.a,{isZoomed:R,onZoomChange:L,overlayBgColorStart:"#16191c00",overlayBgColorEnd:"#16191c","data-v-04cf1604":"",children:z})})}},609:function(a,e,t){},611:function(a,e,t){"use strict";t.d(e,"a",(function(){return m}));var c=t(46),n=t(17),i=t(0),s=t.n(i),o=t(84),d=t.n(o),r=t(596),l=t(592),b=t(591),j=t(615),u=t.n(j),v=t(4),m=function(a){var e,t=a.children,i=a.justify,o=a.padding,j=a.paddingBetweenChildren,m=void 0===j?0:j,O=a.pageTitle,f=a.scrolls;if(f&&i)throw new Error('Can not both set "scrolls" and "justify" at <DarkPage />');var g=s.a.useState(r.a),h=Object(n.a)(g,2),p=h[0],x=h[1];return Object(v.jsxs)("div",{className:d()(u.a.container,(e={},Object(c.a)(e,u.a["container-scrolls"],!!f),Object(c.a)(e,b.j,!!i),Object(c.a)(e,b.e,"center"===i),Object(c.a)(e,b.m,!!o),Object(c.a)(e,b.h,48===m),e)),children:[Object(v.jsx)(r.b,{pageTitle:O||"",onHeight:x}),Object(v.jsx)(l.a,{amt:p}),t]})}},615:function(a,e,t){a.exports={container:"DarkPage_container__1so-g","container-scrolls":"DarkPage_container-scrolls__3t0tO"}},874:function(a,e,t){},898:function(a,e,t){"use strict";t.r(e),t.d(e,"default",(function(){return f}));var c=t(17),n=t(0),i=t.n(n),s=t(24),o=t(44),d=t(8),r=t(20),l=t(611),b=t(592),j=t(608),u=t(594),v=t(14),m=t(59),O=(t(874),t(4)),f=function(){var a=r.useDispatch(),e=Object(s.i)(),t=e.id,n=e.publicKey,f=i.a.useState(null),g=Object(c.a)(f,2),h=g[0],p=g[1],x=i.a.useState(""),y=Object(c.a)(x,2),N=y[0],k=y[1],w=r.useSelector(r.selectUser(n));i.a.useEffect((function(){return a(Object(m.b)(n))})),i.a.useEffect((function(){if(N)return function(){};var a=Object(v.b)({query:"".concat(n,"::publishedContentPublic>").concat(t,"::on"),onError:function(a){k(JSON.stringify(a,null,4))},onData:function(a){o.e(a)?p(a):d.e.warn("Invalid/incomplete public published content found for public key ...".concat(n.slice(-8),", might be due to pending replication or was deleted if null: ").concat(JSON.stringify(a,null,4)))}});return function(){a.then((function(a){return a.off()}))}}),[N,t,n]);var C=i.a.useCallback((function(){k("")}),[]);return N?Object(O.jsxs)(l.a,{pageTitle:"Error",justify:"center","data-v-a71aa0cb":"",children:[Object(O.jsx)("span",{"data-v-a71aa0cb":"",children:N}),Object(O.jsx)(b.a,{amt:32,"data-v-a71aa0cb":""}),Object(O.jsx)("button",{className:"submit-btn retry-btn",onClick:C,"data-v-a71aa0cb":"",children:"Retry"})]}):h?Object(O.jsxs)(l.a,{scrolls:!0,"data-v-a71aa0cb":"",children:[Object(O.jsx)("h1",{"data-v-a71aa0cb":"",children:h.title}),"image/embedded"===h.type&&Object(O.jsx)(j.a,{item:h,"data-v-a71aa0cb":""}),"video/embedded"===h.type&&Object(O.jsx)("video",{className:"public-content-item-video",controls:!0,src:decodeURIComponent(h.magnetURI.replace(/.*(ws=)/gi,"")),"data-v-a71aa0cb":""}),Object(O.jsxs)("div",{className:"info","data-v-a71aa0cb":"",children:[Object(O.jsxs)("div",{className:"user-info","data-v-a71aa0cb":"",children:[Object(O.jsx)(u.a,{height:48,publicKey:n,"data-v-a71aa0cb":""}),Object(O.jsx)(b.a,{amt:12,insideRow:!0,"data-v-a71aa0cb":""}),Object(O.jsx)("span",{"data-v-a71aa0cb":"",children:w.displayName})]}),Object(O.jsx)("span",{"data-v-a71aa0cb":"",children:d.d(h.timestamp)})]}),Object(O.jsx)("p",{className:"description","data-v-a71aa0cb":"",children:h.description}),Object(O.jsx)(b.a,{amt:160,"data-v-a71aa0cb":""})]}):Object(O.jsx)(l.a,{pageTitle:"Loading...","data-v-a71aa0cb":""})}}}]);
//# sourceMappingURL=25.1ce2201e.chunk.js.map