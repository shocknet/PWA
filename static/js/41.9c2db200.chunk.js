(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[41],{615:function(e,t,a){"use strict";var o=a(0),i=a(13),c=a(1),n=a(922),d=a(186),s=(a(639),a(623),a(4));t.a=function(e){var t=e.id,a=void 0===t?"":t,l=e.item,r=e.index,b=void 0===r?0:r,j=e.postId,m=void 0===j?"":j,u=e.tipValue,v=void 0===u?0:u,f=e.tipCounter,g=void 0===f?0:f,p=e.hideRibbon,O=void 0!==p&&p,h=e.width,y=void 0===h?null:h,k=e.disableZoom,w=void 0!==k&&k,x=e.style,C=void 0===x?{}:x,S=Object(c.useState)(!1),I=Object(i.a)(S,2),R=I[0],N=I[1],U=Object(c.useState)(!1),Z=Object(i.a)(U,2),B=Z[0],J=Z[1],M=Object(c.useState)(!0),P=Object(i.a)(M,2),T=P[0],V=P[1],z=Object(c.useState)(null),E=Object(i.a)(z,2),F=E[0],L=E[1],q=Object(c.useCallback)((function(e){if(clearTimeout(F),N(e),!e&&B){J(!1);var t=setTimeout((function(){V(!0)}),200);L(t)}e&&V(!1)}),[F,B,N,J,V,L]),A=decodeURIComponent(l.magnetURI.replace(/.*(ws=)/gi,"")),D=Object(o.a)(Object(o.a)({},C),{},{opacity:T?1:0});y&&(D.width=y);var G=Object(s.jsxs)(s.Fragment,{children:[Object(s.jsx)("img",{className:"image torrent-img torrent-img-".concat(m,"-").concat(a),alt:"Post Media","data-torrent":l.magnetURI,"data-file-key":b,style:D,src:A,"data-v-e5022f5f":""}),Object(s.jsx)("img",{className:"image enlarged-img enlarged-img-".concat(m,"-").concat(a),alt:"Post Media","data-file-key":b,onLoad:function(){J(!0)},style:{opacity:R?1:0,display:R?"block":"none"},src:A,"data-v-e5022f5f":""}),!O&&Object(s.jsx)(d.a,{tipCounter:g,tipValue:v,zoomed:R,"data-v-e5022f5f":""})]});return Object(s.jsx)("div",{className:"media-container","data-v-e5022f5f":"",children:w?G:Object(s.jsx)(n.a,{isZoomed:R,onZoomChange:q,overlayBgColorStart:"#16191c00",overlayBgColorEnd:"#16191c","data-v-e5022f5f":"",children:G})})}},623:function(e,t,a){}}]);
//# sourceMappingURL=41.9c2db200.chunk.js.map