(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[5,34],{619:function(e,t,a){},620:function(e,t,a){},632:function(e,t,a){"use strict";a.r(t);var c=a(2),d=a(17),i=a(0),n=a.n(i),s=a(9),o=a(58),r=a(662),l=a(631),u=a(84),v=a.n(u),b=a(661),j=a.n(b),p=a(179),f=a(20),O=a(594),h=a(591),m=a(35),x=a(608),g=a(180),k=(a(619),a(4)),N=function(e){var t=e.id,a=void 0===t?"":t,c=e.item,d=e.index,n=void 0===d?0:d,s=e.postId,o=void 0===s?"":s,r=e.tipValue,l=void 0===r?0:r,u=e.tipCounter,v=void 0===u?0:u,b=e.hideRibbon,j=void 0!==b&&b,p=e.width,f=void 0===p?null:p,O=Object(i.useMemo)((function(){var e=c.magnetURI.replace(/.*(ws=)/gi,"");return Object(x.b)({url:e})?decodeURIComponent(e):null}),[c.magnetURI]),h={};return f&&(h.width=f),Object(k.jsx)("div",{className:"media-container","data-v-811ad886":"",children:Object(k.jsxs)("div",{className:"video-container",style:{cursor:"pointer"},"data-v-811ad886":"",children:[Object(k.jsx)("video",{style:h,className:"torrent-video torrent-video-".concat(o,"-").concat(a),"data-torrent":c.magnetURI,"data-file-key":n,controls:!0,"data-played":"false",src:O,"data-v-811ad886":""}),!j&&Object(k.jsx)(g.a,{tipCounter:v,tipValue:l,zoomed:!1,"data-v-811ad886":""})]})})},y=a(606),w=a(181),C=(a(620),a.p+"static/media/share.8ed36b2d.svg");t.default=function(e){var t=e.id,a=e.publicKey,u=e.openTipModal,b=e.openUnlockModal,x=e.openDeleteModal,g=void 0===x?void 0:x,S=e.openShareModal,I=void 0===S?function(e){}:S,M=f.useDispatch(),R=f.useSelector((function(e){return e.content.unlockedContent})),E=Object(r.useEmblaCarousel)({slidesToScroll:1,align:"center"}),U=Object(d.a)(E,2),A=U[0],D=U[1],T=f.useSelector(f.selectUser(a)),L=f.useSelector(f.selectSinglePost(a,t)),P=n.a.useMemo((function(){var e=Object.values(L.tips||{});return[e.length,j()(e)]}),[L]),K=Object(d.a)(P,2),V=K[0],J=K[1],W=Object(i.useState)(0),z=Object(d.a)(W,2),q=z[0],B=z[1],F=Object(i.useState)(0),G=Object(d.a)(F,2),H=G[0],Q=G[1],X=Object(i.useState)(!1),Y=Object(d.a)(X,2),Z=Y[0],$=Y[1],_=!0;Object(i.useEffect)((function(){return M(Object(m.l)(a,t))}),[M,t,a]),Object(i.useEffect)((function(){return M(Object(m.m)(a,t))}),[M,t,a]);var ee=n.a.useMemo((function(){var e,t=Object.values(null!==(e=L.contentItems)&&void 0!==e?e:{}).find((function(e){return"stream/embedded"===e.type}));return t?t.liveStatus:null}),[L.contentItems]),te=n.a.useMemo((function(){var e,t=Object.values(null!==(e=L.contentItems)&&void 0!==e?e:{}).find((function(e){return"stream/embedded"===e.type}));return t&&"live"===t.liveStatus?t.viewersCounter:null}),[L.contentItems]),ae=Object(i.useCallback)((function(){var e;return Object.entries(null!==(e=L.contentItems)&&void 0!==e?e:{}).filter((function(e){var t=Object(d.a)(e,2);t[0];return"text/paragraph"!==t[1].type}))}),[L.contentItems]);Object(i.useEffect)((function(){ae().forEach((function(e){var t=Object(d.a)(e,2),c=t[0],i=t[1],n="".concat(a,">posts>").concat(c);i.isPrivate&&!R[n]&&$(!0)}))}),[ae,a,R]);var ce=function(e,i){var n=Object(d.a)(e,2),o=n[0],r=n[1];if("text/paragraph"===r.type)return Object(k.jsx)("p",{"data-v-213d124d":"",children:r.text},o);var l=r;if(r.isPrivate){var u="".concat(a,">posts>").concat(t),v=R[u];if(!v)return Object(k.jsx)("div",{"data-v-213d124d":"",children:Object(k.jsx)("i",{className:"fas fa-lock fa-10x","data-v-213d124d":""})},o);l.magnetURI=v}return"image/embedded"===r.type?Object(k.jsx)(y.a,{id:o,item:l,index:i,postId:t,tipCounter:V,tipValue:J,hideRibbon:void 0,width:void 0,"data-v-213d124d":""},"".concat(t,"-").concat(i)):"video/embedded"===r.type?Object(k.jsx)(N,{id:o,item:l,index:i,postId:t,tipCounter:V,tipValue:J,hideRibbon:void 0,width:void 0,"data-v-213d124d":""},"".concat(t,"-").concat(i)):s.k(l)?r.playbackMagnet?Object(k.jsx)(N,{id:o,item:Object(c.a)(Object(c.a)({},l),{},{magnetURI:l.playbackMagnet}),index:i,postId:t,tipCounter:V,tipValue:J,hideRibbon:void 0,width:void 0,"data-v-213d124d":""},"".concat(t,"-").concat(i)):Object(k.jsx)(w.a,{id:o,item:l,index:i,postId:t,tipCounter:V,tipValue:J,hideRibbon:void 0,width:void 0,"data-v-213d124d":""},"".concat(t,"-").concat(i)):null},de=Object(i.useCallback)((function(){D&&D.canScrollNext()&&D.scrollNext()}),[D]),ie=Object(i.useCallback)((function(){D&&D.canScrollPrev()&&D.scrollPrev()}),[D]),ne=Object(i.useCallback)((function(e){if(0!==q){var t=e.key;"ArrowRight"===t&&de(),"ArrowLeft"===t&&ie()}}),[q,ie,de]),se=Object(i.useCallback)((function(){Q(D.selectedScrollSnap())}),[D,Q]);Object(i.useEffect)((function(){if(D)return D.on("scroll",se),B(D.scrollSnapList().length),window.addEventListener("keydown",ne),function(){window.removeEventListener("keydown",ne),D.off("scroll",se)}}),[D,q,ne,se]);var oe=Object(i.useCallback)((function(){u({targetType:"post",postID:t,publicKey:a})}),[t,_,u,a]),re=Object(i.useCallback)((function(){b({targetType:"unlock",postID:t,publicKey:a})}),[t,_,b,a]),le=Object(i.useCallback)((function(){g({id:t,shared:!1})}),[t,g]),ue=Object(i.useCallback)((function(){I({targetType:"share",postID:t,publicKey:a})}),[a,t,I]);Object(i.useEffect)((function(){try{l.a.rebuild()}catch(e){console.log("Error inside <Post />: ",e)}}),[]);return Object(k.jsxs)("div",{className:"post","data-v-213d124d":"",children:[Object(k.jsxs)("div",{className:"head","data-v-213d124d":"",children:[Object(k.jsxs)("div",{className:"user","data-v-213d124d":"",children:[Object(k.jsx)(O.a,{height:50,publicKey:a,"data-v-213d124d":""}),Object(k.jsx)(h.a,{amt:10,insideRow:!0,"data-v-213d124d":""}),Object(k.jsxs)("div",{className:"details","data-v-213d124d":"",children:[Object(k.jsxs)("div",{className:"username","data-v-213d124d":"",children:[Object(k.jsx)(o.b,{to:"/otherUser/".concat(a),"data-v-213d124d":"",children:T.displayName}),ee&&Object(k.jsxs)("p",{className:"liveStatus","data-v-213d124d":"",children:[{live:"Is Live",waiting:"Waiting",wasLive:"Was Live"}[ee],Object(k.jsx)("i",{className:"fas fa-circle liveStatusIcon ".concat("live"===ee?"liveIcon":""),"data-v-213d124d":""}),"live"===ee&&Object(k.jsxs)("span",{"data-v-213d124d":"",children:[" | ",te," watching"]})]})]}),Object(k.jsx)("p",{"data-v-213d124d":"",children:p.DateTime.fromMillis(L.date).toRelative()})]})]}),g&&Object(k.jsx)("i",{className:"fas fa-trash trash-icon",onClick:le,"data-v-213d124d":""})]}),Object(k.jsxs)("div",{className:"content","data-v-213d124d":"",children:[function(){var e;return Object.entries(null!==(e=L.contentItems)&&void 0!==e?e:{}).filter((function(e){var t=Object(d.a)(e,2);t[0];return"text/paragraph"===t[1].type}))}().map(ce),Object(k.jsxs)("div",{className:"media-content-carousel","data-v-213d124d":"",children:[q>1?Object(k.jsxs)("div",{className:"media-carousel-controls-container","data-v-213d124d":"",children:[Object(k.jsx)("div",{className:"media-carousel-arrow fas fa-angle-left",onClick:ie,"data-v-213d124d":""}),Object(k.jsx)("div",{className:"media-carousel-pages","data-v-213d124d":"",children:Array.from({length:q}).map((function(e,t){return Object(k.jsx)("div",{className:v()({"media-carousel-page":!0,"active-carousel-page":H===t}),onClick:function(){return null===D||void 0===D?void 0:D.scrollTo(t)},"data-v-213d124d":""},t)}))}),Object(k.jsx)("div",{className:"media-carousel-arrow fas fa-angle-right",onClick:de,"data-v-213d124d":""})]}):null,Object(k.jsx)("div",{className:"media-content-root",ref:A,"data-v-213d124d":"",children:Object(k.jsx)("div",{className:"media-content-container","data-v-213d124d":"",children:ae().map(ce)})})]})]}),Object(k.jsxs)("div",{className:"actions","data-v-213d124d":"",children:[Object(k.jsx)("div",{"data-v-213d124d":""}),Object(k.jsx)("div",{className:"icon-tip-btn","data-tip":Z?"Unlock this post":"Tip this post",onClick:Z?re:oe,"data-v-213d124d":"",children:Object(k.jsx)("div",{className:"tip-icon icon-thin-feed","data-v-213d124d":""})}),I&&Object(k.jsx)("div",{className:"icon-tip-btn","data-tip":"share",onClick:ue,"data-v-213d124d":"",children:Object(k.jsx)("img",{alt:"Share this post",src:C,style:{color:"#4285b9",marginLeft:"auto"},"data-v-213d124d":""})}),!I&&Object(k.jsx)("div",{"data-v-213d124d":""})]})]})}},876:function(e,t,a){"use strict";a.r(t);var c=a(3),d=a.n(c),i=a(6),n=a(0),s=a.n(n),o=a(179),r=a(631),l=a(632),u=a(20),v=a(8),b=a(177),j=a(594),p=a(591),f=a(608),O=a(35),h=a(59),m=(a(877),a(4));t.default=function(e){var t=e.postID,a=e.sharerPublicKey,c=e.openTipModal,x=e.openUnlockModal,g=e.openDeleteModal,k=void 0===g?v.b:g,N=e.openShareModal,y=void 0===N?v.b:N,w=u.useDispatch(),C=u.useSelector(u.selectUser(a)),S=u.useSelector(u.selectSharedPost(a,t)),I=u.useSelector(u.selectSinglePost(S.originalAuthor,t)),M=Object(n.useCallback)(Object(i.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:I&&Object(f.a)([I],!1);case 1:case"end":return e.stop()}}),e)}))),[I]),R=Object(n.useCallback)((function(){k({id:I.id,shared:!0})}),[I,k]);return s.a.useEffect((function(){return w(Object(h.b)(S.originalAuthor))}),[w,S.originalAuthor]),s.a.useEffect((function(){return w(Object(h.b)(a))}),[w,a]),s.a.useEffect((function(){return w(Object(O.o)(S.originalAuthor,t))}),[w,t,S.originalAuthor]),s.a.useEffect((function(){return w(Object(O.l)(S.originalAuthor,t))}),[w,t,S.originalAuthor]),Object(n.useLayoutEffect)((function(){r.a.rebuild(),M()}),[M]),Object(m.jsxs)("div",{className:"post shared-post","data-v-d6758b27":"",children:[Object(m.jsxs)("div",{className:"head","data-v-d6758b27":"",children:[Object(m.jsxs)("div",{className:"user","data-v-d6758b27":"",children:[Object(m.jsx)(j.a,{height:50,publicKey:a,"data-v-d6758b27":""}),Object(m.jsx)(p.a,{amt:10,insideRow:!0,"data-v-d6758b27":""}),Object(m.jsxs)("div",{className:"details","data-v-d6758b27":"",children:[Object(m.jsx)("p",{"data-v-d6758b27":"",children:null===C||void 0===C?void 0:C.displayName}),Object(m.jsxs)("p",{"data-v-d6758b27":"",children:["Shared ",o.DateTime.fromMillis(S.shareDate).toRelative()]})]})]}),k&&Object(m.jsx)("i",{className:"fas fa-trash",onClick:R,"data-v-d6758b27":""})]}),Object(m.jsx)("div",{className:"shared-content","data-v-d6758b27":"",children:I?Object(m.jsx)(l.default,{id:I.id,publicKey:S.originalAuthor,openTipModal:c,openUnlockModal:x,openShareModal:y,"data-v-d6758b27":""}):Object(m.jsx)(b.a,{text:"Loading Post...","data-v-d6758b27":""})})]})}},877:function(e,t,a){}}]);
//# sourceMappingURL=5.48e585e8.chunk.js.map