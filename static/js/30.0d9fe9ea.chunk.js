(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[30,34,36],{606:function(e,t,a){"use strict";var c=a(2),i=a(17),n=a(0),o=a(899),s=a(179),d=(a(623),a(607),a(4));t.a=function(e){var t=e.id,a=void 0===t?"":t,l=e.item,r=e.index,b=void 0===r?0:r,u=e.postId,v=void 0===u?"":u,j=e.tipValue,m=void 0===j?0:j,f=e.tipCounter,O=void 0===f?0:f,p=e.hideRibbon,h=void 0!==p&&p,x=e.width,g=void 0===x?null:x,y=e.disableZoom,k=void 0!==y&&y,I=e.style,C=void 0===I?{}:I,N=Object(n.useState)(!1),w=Object(i.a)(N,2),S=w[0],R=w[1],U=Object(n.useState)(!1),M=Object(i.a)(U,2),E=M[0],T=M[1],L=Object(n.useState)(!0),P=Object(i.a)(L,2),V=P[0],D=P[1],K=Object(n.useState)(null),A=Object(i.a)(K,2),Z=A[0],z=A[1],B=Object(n.useCallback)((function(e){if(clearTimeout(Z),R(e),!e&&E){T(!1);var t=setTimeout((function(){D(!0)}),200);z(t)}e&&D(!1)}),[Z,E,R,T,D,z]),J=decodeURIComponent(l.magnetURI.replace(/.*(ws=)/gi,"")),W=Object(c.a)(Object(c.a)({},C),{},{opacity:V?1:0});g&&(W.width=g);var F=Object(d.jsxs)(d.Fragment,{children:[Object(d.jsx)("img",{className:"image torrent-img torrent-img-".concat(v,"-").concat(a),alt:"Post Media","data-torrent":l.magnetURI,"data-file-key":b,style:W,src:J,"data-v-5fc5c25f":""}),Object(d.jsx)("img",{className:"image enlarged-img enlarged-img-".concat(v,"-").concat(a),alt:"Post Media","data-file-key":b,onLoad:function(){T(!0)},style:{opacity:S?1:0,display:S?"block":"none"},src:J,"data-v-5fc5c25f":""}),!h&&Object(d.jsx)(s.a,{tipCounter:O,tipValue:m,zoomed:S,"data-v-5fc5c25f":""})]});return Object(d.jsx)("div",{className:"media-container","data-v-5fc5c25f":"",children:k?F:Object(d.jsx)(o.a,{isZoomed:S,onZoomChange:B,overlayBgColorStart:"#16191c00",overlayBgColorEnd:"#16191c","data-v-5fc5c25f":"",children:F})})}},607:function(e,t,a){},619:function(e,t,a){},620:function(e,t,a){},632:function(e,t,a){"use strict";a.r(t);var c=a(2),i=a(17),n=a(0),o=a.n(n),s=a(9),d=a(57),l=a(662),r=a(631),b=a(85),u=a.n(b),v=a(661),j=a.n(v),m=a(180),f=a(20),O=a(594),p=a(591),h=a(35),x=a(608),g=a(179),y=(a(619),a(4)),k=function(e){var t=e.id,a=void 0===t?"":t,c=e.item,i=e.index,o=void 0===i?0:i,s=e.postId,d=void 0===s?"":s,l=e.tipValue,r=void 0===l?0:l,b=e.tipCounter,u=void 0===b?0:b,v=e.hideRibbon,j=void 0!==v&&v,m=e.width,f=void 0===m?null:m,O=Object(n.useMemo)((function(){var e=c.magnetURI.replace(/.*(ws=)/gi,"");return Object(x.b)({url:e})?decodeURIComponent(e):null}),[c.magnetURI]),p={};return f&&(p.width=f),Object(y.jsx)("div",{className:"media-container","data-v-bfdedc9a":"",children:Object(y.jsxs)("div",{className:"video-container",style:{cursor:"pointer"},"data-v-bfdedc9a":"",children:[Object(y.jsx)("video",{style:p,className:"torrent-video torrent-video-".concat(d,"-").concat(a),"data-torrent":c.magnetURI,"data-file-key":o,controls:!0,"data-played":"false",src:O,"data-v-bfdedc9a":""}),!j&&Object(y.jsx)(g.a,{tipCounter:u,tipValue:r,zoomed:!1,"data-v-bfdedc9a":""})]})})},I=a(606),C=a(181),N=(a(620),a.p+"static/media/share.8ed36b2d.svg");t.default=function(e){var t=e.id,a=e.publicKey,b=e.openTipModal,v=e.openUnlockModal,x=e.openDeleteModal,g=void 0===x?void 0:x,w=e.openShareModal,S=void 0===w?function(e){}:w,R=f.useDispatch(),U=f.useSelector((function(e){return e.content.unlockedContent})),M=Object(l.useEmblaCarousel)({slidesToScroll:1,align:"center"}),E=Object(i.a)(M,2),T=E[0],L=E[1],P=f.useSelector(f.selectUser(a)),V=f.useSelector(f.selectSinglePost(a,t)),D=o.a.useMemo((function(){var e=Object.values(V.tips||{});return[e.length,j()(e)]}),[V]),K=Object(i.a)(D,2),A=K[0],Z=K[1],z=Object(n.useState)(0),B=Object(i.a)(z,2),J=B[0],W=B[1],F=Object(n.useState)(0),q=Object(i.a)(F,2),G=q[0],H=q[1],Q=Object(n.useState)(!1),X=Object(i.a)(Q,2),Y=X[0],$=X[1],_=!0;Object(n.useEffect)((function(){return R(Object(h.l)(a,t))}),[R,t,a]),Object(n.useEffect)((function(){return R(Object(h.m)(a,t))}),[R,t,a]);var ee=o.a.useMemo((function(){var e,t=Object.values(null!==(e=V.contentItems)&&void 0!==e?e:{}).find((function(e){return"stream/embedded"===e.type}));return t?t.liveStatus:null}),[V.contentItems]),te=o.a.useMemo((function(){var e,t=Object.values(null!==(e=V.contentItems)&&void 0!==e?e:{}).find((function(e){return"stream/embedded"===e.type}));return t&&"live"===t.liveStatus?t.viewersCounter:null}),[V.contentItems]),ae=Object(n.useCallback)((function(){var e;return Object.entries(null!==(e=V.contentItems)&&void 0!==e?e:{}).filter((function(e){var t=Object(i.a)(e,2);t[0];return"text/paragraph"!==t[1].type}))}),[V.contentItems]);Object(n.useEffect)((function(){ae().forEach((function(e){var t=Object(i.a)(e,2),c=t[0],n=t[1],o="".concat(a,">posts>").concat(c);n.isPrivate&&!U[o]&&$(!0)}))}),[ae,a,U]);var ce=function(e,n){var o=Object(i.a)(e,2),d=o[0],l=o[1];if("text/paragraph"===l.type)return Object(y.jsx)("p",{"data-v-90ce35b3":"",children:l.text},d);var r="";if(l.isPrivate){var b="".concat(a,">posts>").concat(t),u=U[b];if(!u)return Object(y.jsx)("div",{"data-v-90ce35b3":"",children:Object(y.jsx)("i",{className:"fas fa-lock fa-10x","data-v-90ce35b3":""})},d);r=u}return"image/embedded"===l.type?Object(y.jsx)(I.a,{id:d,item:Object(c.a)(Object(c.a)({},l),{},{magnetURI:r||l.magnetURI}),index:n,postId:t,tipCounter:A,tipValue:Z,hideRibbon:void 0,width:void 0,"data-v-90ce35b3":""},"".concat(t,"-").concat(n)):"video/embedded"===l.type?Object(y.jsx)(k,{id:d,item:Object(c.a)(Object(c.a)({},l),{},{magnetURI:r||l.magnetURI}),index:n,postId:t,tipCounter:A,tipValue:Z,hideRibbon:void 0,width:void 0,"data-v-90ce35b3":""},"".concat(t,"-").concat(n)):s.k(l)?l.playbackMagnet?Object(y.jsx)(k,{id:d,item:Object(c.a)(Object(c.a)({},l),{},{magnetURI:l.playbackMagnet}),index:n,postId:t,tipCounter:A,tipValue:Z,hideRibbon:void 0,width:void 0,"data-v-90ce35b3":""},"".concat(t,"-").concat(n)):Object(y.jsx)(C.a,{id:d,item:Object(c.a)(Object(c.a)({},l),{},{magnetURI:r||l.magnetURI}),index:n,postId:t,tipCounter:A,tipValue:Z,hideRibbon:void 0,width:void 0,"data-v-90ce35b3":""},"".concat(t,"-").concat(n)):null},ie=Object(n.useCallback)((function(){L&&L.canScrollNext()&&L.scrollNext()}),[L]),ne=Object(n.useCallback)((function(){L&&L.canScrollPrev()&&L.scrollPrev()}),[L]),oe=Object(n.useCallback)((function(e){if(0!==J){var t=e.key;"ArrowRight"===t&&ie(),"ArrowLeft"===t&&ne()}}),[J,ne,ie]),se=Object(n.useCallback)((function(){H(L.selectedScrollSnap())}),[L,H]);Object(n.useEffect)((function(){if(L)return L.on("scroll",se),W(L.scrollSnapList().length),window.addEventListener("keydown",oe),function(){window.removeEventListener("keydown",oe),L.off("scroll",se)}}),[L,J,oe,se]);var de=Object(n.useCallback)((function(){b({targetType:"post",postID:t,publicKey:a})}),[t,_,b,a]),le=Object(n.useCallback)((function(){v({targetType:"unlock",postID:t,publicKey:a})}),[t,_,v,a]),re=Object(n.useCallback)((function(){g({id:t,shared:!1})}),[t,g]),be=Object(n.useCallback)((function(){S({targetType:"share",postID:t,publicKey:a})}),[a,t,S]);Object(n.useEffect)((function(){try{r.a.rebuild()}catch(e){console.log("Error inside <Post />: ",e)}}),[]);return Object(y.jsxs)("div",{className:"post","data-v-90ce35b3":"",children:[Object(y.jsxs)("div",{className:"head","data-v-90ce35b3":"",children:[Object(y.jsxs)("div",{className:"user","data-v-90ce35b3":"",children:[Object(y.jsx)(O.a,{height:50,publicKey:a,"data-v-90ce35b3":""}),Object(y.jsx)(p.a,{amt:10,insideRow:!0,"data-v-90ce35b3":""}),Object(y.jsxs)("div",{className:"details","data-v-90ce35b3":"",children:[Object(y.jsxs)("div",{className:"username","data-v-90ce35b3":"",children:[Object(y.jsx)(d.b,{to:"/otherUser/".concat(a),"data-v-90ce35b3":"",children:P.displayName}),ee&&Object(y.jsxs)("p",{className:"liveStatus","data-v-90ce35b3":"",children:[{live:"Is Live",waiting:"Waiting",wasLive:"Was Live"}[ee],Object(y.jsx)("i",{className:"fas fa-circle liveStatusIcon ".concat("live"===ee?"liveIcon":""),"data-v-90ce35b3":""}),"live"===ee&&Object(y.jsxs)("span",{"data-v-90ce35b3":"",children:[" | ",te," watching"]})]})]}),Object(y.jsx)("p",{"data-v-90ce35b3":"",children:m.DateTime.fromMillis(V.date).toRelative()})]})]}),g&&Object(y.jsx)("i",{className:"fas fa-trash trash-icon",onClick:re,"data-v-90ce35b3":""})]}),Object(y.jsxs)("div",{className:"content","data-v-90ce35b3":"",children:[function(){var e;return Object.entries(null!==(e=V.contentItems)&&void 0!==e?e:{}).filter((function(e){var t=Object(i.a)(e,2);t[0];return"text/paragraph"===t[1].type}))}().map(ce),Object(y.jsxs)("div",{className:"media-content-carousel","data-v-90ce35b3":"",children:[J>1?Object(y.jsxs)("div",{className:"media-carousel-controls-container","data-v-90ce35b3":"",children:[Object(y.jsx)("div",{className:"media-carousel-arrow fas fa-angle-left",onClick:ne,"data-v-90ce35b3":""}),Object(y.jsx)("div",{className:"media-carousel-pages","data-v-90ce35b3":"",children:Array.from({length:J}).map((function(e,t){return Object(y.jsx)("div",{className:u()({"media-carousel-page":!0,"active-carousel-page":G===t}),onClick:function(){return null===L||void 0===L?void 0:L.scrollTo(t)},"data-v-90ce35b3":""},t)}))}),Object(y.jsx)("div",{className:"media-carousel-arrow fas fa-angle-right",onClick:ie,"data-v-90ce35b3":""})]}):null,Object(y.jsx)("div",{className:"media-content-root",ref:T,"data-v-90ce35b3":"",children:Object(y.jsx)("div",{className:"media-content-container","data-v-90ce35b3":"",children:ae().map(ce)})})]})]}),Object(y.jsxs)("div",{className:"actions","data-v-90ce35b3":"",children:[Object(y.jsx)("div",{"data-v-90ce35b3":""}),Object(y.jsx)("div",{className:"icon-tip-btn","data-tip":Y?"Unlock this post":"Tip this post",onClick:Y?le:de,"data-v-90ce35b3":"",children:Object(y.jsx)("div",{className:"tip-icon icon-thin-feed","data-v-90ce35b3":""})}),S&&Object(y.jsx)("div",{className:"icon-tip-btn","data-tip":"share",onClick:be,"data-v-90ce35b3":"",children:Object(y.jsx)("img",{alt:"Share this post",src:N,style:{color:"#4285b9",marginLeft:"auto"},"data-v-90ce35b3":""})}),!S&&Object(y.jsx)("div",{"data-v-90ce35b3":""})]})]})}}}]);
//# sourceMappingURL=30.0d9fe9ea.chunk.js.map