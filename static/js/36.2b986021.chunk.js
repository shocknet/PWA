(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[36],{608:function(e,t,a){"use strict";var o=a(2),i=a(17),c=a(0),n=a(900),d=a(180),s=(a(626),a(609),a(4));t.a=function(e){var t=e.id,a=void 0===t?"":t,l=e.item,r=e.index,b=void 0===r?0:r,j=e.postId,m=void 0===j?"":j,u=e.tipValue,v=void 0===u?0:u,g=e.tipCounter,p=void 0===g?0:g,O=e.hideRibbon,f=void 0!==O&&O,h=e.width,y=void 0===h?null:h,k=e.disableZoom,w=void 0!==k&&k,x=e.style,C=void 0===x?{}:x,S=Object(c.useState)(!1),I=Object(i.a)(S,2),R=I[0],N=I[1],U=Object(c.useState)(!1),Z=Object(i.a)(U,2),B=Z[0],J=Z[1],M=Object(c.useState)(!0),P=Object(i.a)(M,2),T=P[0],V=P[1],z=Object(c.useState)(null),E=Object(i.a)(z,2),F=E[0],L=E[1],q=Object(c.useCallback)((function(e){if(clearTimeout(F),N(e),!e&&B){J(!1);var t=setTimeout((function(){V(!0)}),200);L(t)}e&&V(!1)}),[F,B,N,J,V,L]),A=decodeURIComponent(l.magnetURI.replace(/.*(ws=)/gi,"")),D=Object(o.a)(Object(o.a)({},C),{},{opacity:T?1:0});y&&(D.width=y);var G=Object(s.jsxs)(s.Fragment,{children:[Object(s.jsx)("img",{className:"image torrent-img torrent-img-".concat(m,"-").concat(a),alt:"Post Media","data-torrent":l.magnetURI,"data-file-key":b,style:D,src:A,"data-v-3b0e18f3":""}),Object(s.jsx)("img",{className:"image enlarged-img enlarged-img-".concat(m,"-").concat(a),alt:"Post Media","data-file-key":b,onLoad:function(){J(!0)},style:{opacity:R?1:0,display:R?"block":"none"},src:A,"data-v-3b0e18f3":""}),!f&&Object(s.jsx)(d.a,{tipCounter:p,tipValue:v,zoomed:R,"data-v-3b0e18f3":""})]});return Object(s.jsx)("div",{className:"media-container","data-v-3b0e18f3":"",children:w?G:Object(s.jsx)(n.a,{isZoomed:R,onZoomChange:q,overlayBgColorStart:"#16191c00",overlayBgColorEnd:"#16191c","data-v-3b0e18f3":"",children:G})})}},609:function(e,t,a){}}]);
//# sourceMappingURL=36.2b986021.chunk.js.map