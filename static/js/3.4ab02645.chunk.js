(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[3],{675:function(e,t,a){"use strict";a.r(t);var n=a(1),c=a(13),r=a(0),i=a.n(r),o=a(9),s=a(59),u=a(684),l=a(801),d=a(650),b=a(88),v=a.n(b),f=a(796),m=a.n(f),p=a(185),j=a(19),h=a(3),O=a.n(h),x=a(5),g=a(23),y=a(798),k=a.n(y),w=function(){var e=Object(x.a)(O.a.mark((function e(t){var a;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,k.a._init){e.next=4;break}return e.next=4,new Promise((function(e,t){k.a.init("ShockWalletStore").then((function(){return console.log("File cache initialized!"),k.a.persist()})).then((function(a){a.persistent?e(a):t(a)}))}));case 4:return e.next=6,k.a.load(t);case 6:return a=e.sent,e.abrupt("return",a.createURL());case 10:return e.prev=10,e.t0=e.catch(0),console.warn(e.t0),e.abrupt("return",!1);case 14:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(t){return e.apply(this,arguments)}}(),I=function(e,t){var a=document.querySelectorAll(t);return a&&a.length&&a.forEach((function(t){t.src||(t.src=e,t.muted=!0,t.autoplay=!1)})),!!(null===a||void 0===a?void 0:a.length)},N=function(e,t){return k.a.save(e,t)},C=function(e){var t=Promise.resolve();return e.forEach((function(e){t=t.then((function(){return e()}))})),t},R={"video/embedded":{formats:["mp4","webm"],element:"video",options:{autoplay:!1,muted:!0}},"image/embedded":{formats:["jpg","png","webp","jpeg"],element:"img",options:{}}},S=(Object.values(R).reduce((function(e,t){return[].concat(Object(g.a)(e),Object(g.a)(t.formats))}),[]),function(e){var t,a;if(!e)return null;var r=null===(t=e.name)||void 0===t||null===(a=t.split("."))||void 0===a?void 0:a.slice(-1)[0],i=Object.entries(R).filter((function(e){var t=Object(c.a)(e,2);t[0];return t[1].formats.includes(r)})),o=Object(c.a)(i,1)[0];if(o){var s=Object(c.a)(o,2),u=s[0],l=s[1];return Object(n.a)({name:u},l)}return null}),U=null,E=function(){var e=Object(x.a)(O.a.mark((function e(){var t;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(U){e.next=5;break}return e.next=3,Promise.all([a.e(15),a.e(21)]).then(a.t.bind(null,906,7));case 3:t=e.sent,U=new t.default;case 5:return e.abrupt("return",U);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),L=function(e){var t,a,n,c=e.thumbnailFile,r=e.fileType,i=e.item,o=S(c),s="".concat(null!==(t=null===o||void 0===o?void 0:o.element)&&void 0!==t?t:"img",'[data-torrent="').concat(i.magnetURI,'"]'),u='.dynamic-thumbnail[data-torrent="'.concat(i.magnetURI,'"]');c||"video"!==r.element||(null===(a=document.querySelector(s))||void 0===a||a.classList.add("hidden"),null===(n=document.querySelector(u))||void 0===n||n.classList.remove("hidden"))},M=function(e){var t=e.id,a=e.key;return function(e){return"".concat(t,"-").concat(a,"-").concat(e.name)}},T=function(e){var t=e.file,a=e.type,n=e.torrentMode,r=e.torrent,i=a.element,o="".concat(i,'[data-torrent="').concat(r.magnetURI,'"]'),s=document.querySelectorAll(o);console.log("Torrent Elements:",s),s.forEach((function(e){if(!e.classList.contains("hidden")){var i=decodeURIComponent(r.magnetURI.replace(/.*(ws=)/gi,"")),o=a.formats.filter((function(e){return i.toLowerCase().endsWith(".".concat(e.toLowerCase()))})),s=Object(c.a)(o,1)[0];!n&&s?e.setAttribute("src",i):t.renderTo(e,a.options)}}))},P=function(e){var t=e.thumbnailFileNames,a=e.getCacheFileName,n=e.torrentMode;return function(){var e=Object(x.a)(O.a.mark((function e(c){var r,i,o,s,u,l,d,b,v,f,m,p,j;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i=c.fileName,o=c.thumbnails,s=c.item,u=c.fileType,l=i.split(".").slice(0,-1).join("."),d="".concat(l,"-thumb"),b=t.indexOf(d),v=o[b],f=v?S(v):null,m="".concat(null!==(r=null===f||void 0===f?void 0:f.element)&&void 0!==r?r:"img",'[data-torrent="').concat(s.magnetURI,'"]'),"video"!==u.element||!v){e.next=17;break}return e.next=10,w(a(v));case 10:if(j=e.sent,null===(p=document.querySelector(m))||void 0===p||p.classList.remove("hidden"),!j){e.next=15;break}return I(j,m),e.abrupt("return");case 15:return T({file:v,type:f,torrentMode:n,torrent:s}),e.abrupt("return");case 17:if("video"!==u.element||v){e.next=20;break}return L({thumbnailFile:v,fileType:u,item:s}),e.abrupt("return");case 20:return e.abrupt("return",{thumbnailFile:v});case 21:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},V=function(){var e=Object(x.a)(O.a.mark((function e(){var t,a,n,r,i=arguments;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=i.length>0&&void 0!==i[0]?i[0]:[],a=!(i.length>1&&void 0!==i[1])||i[1],e.next=4,Promise.all(t.map(function(){var e=Object(x.a)(O.a.mark((function e(t){var n,r,i,o;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.contentItems,r=t.id,i=Object.entries(n).filter((function(e){var t=Object(c.a)(e,2)[1];return R[t.type]}))){e.next=4;break}return e.abrupt("return",[]);case 4:return e.next=6,E();case 6:return o=e.sent,e.abrupt("return",i.map((function(e){var t=Object(c.a)(e,2),n=t[0],i=t[1];return function(){return new Promise((function(e){var t=M({id:r,key:n});o.get(i.magnetURI)?e(!0):o.add(i.magnetURI,function(){var n=Object(x.a)(O.a.mark((function n(c){var r,s,u,l;return O.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:e(!0),r=c.files.filter((function(e){var t,a,n=null===(t=e.name)||void 0===t||null===(a=t.split("."))||void 0===a?void 0:a.slice(-1)[0],c=Object.values(R).filter((function(e){return e.formats.includes(n)}))[0];return!!c&&c.formats.includes(n)})),s=r.filter((function(e){return e.name.match(/-thumb\.([\w\d]){2,4}$/gi)})),u=s.map((function(e){return e.name.replace(/\.([\w\d]){2,4}$/gi,"")})),l=P({getCacheFileName:t,thumbnailFileNames:u,torrentMode:a}),r.map(function(){var e=Object(x.a)(O.a.mark((function e(n){var c,r,d,b,v,f;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!u.includes(n.name)){e.next=2;break}return e.abrupt("return");case 2:if(c=S(n)){e.next=5;break}return e.abrupt("return");case 5:return r=t(n),d=c.element,b="".concat(d,'[data-torrent="').concat(i.magnetURI,'"]'),e.next=10,w(r);case 10:if(v=e.sent,l({fileName:n.name,thumbnails:s,fileType:c,item:i}),!v){e.next=17;break}return(f=o.get(i.magnetURI))&&f.destroy(),I(v,b),e.abrupt("return");case 17:T({file:n,type:c,torrentMode:a,torrent:i});case 18:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),c.on("done",(function(){r.forEach((function(e){var a=S(e),n=t(e),c=a.element,r="".concat(c,'.torrent-video[data-torrent="').concat(i.magnetURI,'"]');e.getBlob(function(){var e=Object(x.a)(O.a.mark((function e(t,a){var c,i;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=3;break}return console.warn(t),e.abrupt("return");case 3:return console.log("Caching loaded file...",n,a),e.next=6,N(n,a);case 6:if("false"!==(null===(c=document.querySelector(r))||void 0===c?void 0:c.dataset.played)||(null===c||void 0===c?void 0:c.getAttribute("src"))){e.next=12;break}return e.next=10,w(n);case 10:i=e.sent,I(i,r);case 12:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}())}))}));case 7:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())}))}})));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 4:n=e.sent,r=n.reduce((function(e,t){return[].concat(Object(g.a)(e),Object(g.a)(t))}),[]),C(r);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),F=function(){var e=Object(x.a)(O.a.mark((function e(t){var a,n,c;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.magnetURI,e.next=3,E();case 3:if(n=e.sent,!(c=n.get(a))){e.next=8;break}return c.destroy(),e.abrupt("return",!0);case 8:return e.abrupt("return",!1);case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),A=a(36),q=a(187),D=(a(799),a(4)),K=function(e){var t=e.item,a=e.index,n=void 0===a?0:a,i=e.tipValue,o=void 0===i?0:i,s=e.tipCounter,l=void 0===s?0:s,d=e.hideRibbon,b=void 0!==d&&d,f=Object(r.useRef)(null),m=Object(r.useState)(!1),p=Object(c.a)(m,2),j=p[0],h=p[1],O=Object(u.a)({trackVisibility:!1,delay:100,onEnter:function(){f.current&&(h(!0),f.current.play())},onLeave:function(){f.current&&(h(!1),f.current.pause())}}).observe,x=Object(r.useCallback)((function(){var e=!j;if(h(e),f.current){if(!e)return void f.current.pause();console.log("Playing video",e),f.current.play()}}),[j]),g=Object(r.useMemo)((function(){return CSS.supports("aspect-ratio: 16 / 9")?{aspectRatio:"16 / 9"}:{height:400}}),[]),y=Object(r.useCallback)((function(){var e;4===(null===(e=f.current)||void 0===e?void 0:e.readyState)&&h(!1)}),[f]);return Object(D.jsx)("div",{className:"media-container",ref:O,"data-v-d8f05786":"",children:Object(D.jsxs)("div",{className:"video-container",style:g,"data-v-d8f05786":"",children:[Object(D.jsxs)("div",{className:v()({"thumbnail-container":!0,"video-hidden":j}),onClick:x,"data-v-d8f05786":"",children:[Object(D.jsx)("div",{className:"play-btn","data-v-d8f05786":"",children:Object(D.jsx)("i",{className:"fas fa-play","data-v-d8f05786":""})}),Object(D.jsx)("img",{className:"video-thumbnail hidden","data-torrent":t.magnetURI,"data-file-key":n,alt:"Video thumbnail","data-v-d8f05786":""}),Object(D.jsx)("video",{className:"dynamic-thumbnail hidden","data-torrent":t.magnetURI,"data-file-key":n,"data-played":"false",controls:!1,muted:!0,"data-v-d8f05786":""})]}),Object(D.jsx)("video",{className:v()({"torrent-video video-js vjs-default-skin":!0,"video-hidden":!j}),"data-torrent":t.magnetURI,"data-file-key":n,"data-played":"false",controls:!0,ref:f,muted:!0,onPause:y,"data-v-d8f05786":""}),!b&&Object(D.jsx)(q.a,{tipCounter:l,tipValue:o,"data-v-d8f05786":""})]})})},W=Object(r.memo)(K),J=a(632),$=a(295),z=a(610),B=a(608),_=a.p+"static/media/share.8ed36b2d.svg",G=(a(800),function(e){var t=e.id,a=e.publicKey,b=e.openTipModal,f=e.openUnlockModal,h=e.openDeleteModal,O=void 0===h?void 0:h,x=e.openShareModal,g=void 0===x?function(e){}:x,y=j.useDispatch(),k=j.useSelector((function(e){return e.content.unlockedContent})),w=j.useSelector((function(e){return e.auth.authenticated})),I=Object(l.useEmblaCarousel)({slidesToScroll:1,align:"center"}),N=Object(c.a)(I,2),C=N[0],R=N[1],S=j.useSelector(j.selectUser(a)),U=j.useSelector(j.selectSinglePost(a,t)),E=i.a.useMemo((function(){var e=Object.values(U.tips||{});return[e.length,m()(e)]}),[U]),L=Object(c.a)(E,2),M=L[0],T=L[1],P=Object(r.useState)(0),q=Object(c.a)(P,2),K=q[0],G=q[1],H=Object(r.useState)(0),Q=Object(c.a)(H,2),X=Q[0],Y=Q[1],Z=Object(r.useState)(!1),ee=Object(c.a)(Z,2),te=ee[0],ae=ee[1],ne=Object(r.useState)(!1),ce=Object(c.a)(ne,2),re=ce[0],ie=ce[1],oe=Object(r.useState)(!1),se=Object(c.a)(oe,2),ue=se[0],le=se[1],de=Object(u.a)({trackVisibility:!1,delay:100,onEnter:function(){ie(!0)},onLeave:function(){le(!0)}}).observe,be=!0;Object(r.useEffect)((function(){return y(Object(A.l)(a,t))}),[y,t,a]),Object(r.useEffect)((function(){return y(Object(A.m)(a,t))}),[y,t,a]);var ve=i.a.useMemo((function(){var e,t=Object.values(null!==(e=U.contentItems)&&void 0!==e?e:{}).find((function(e){return"stream/embedded"===e.type}));return t?t.liveStatus:null}),[U.contentItems]),fe=i.a.useMemo((function(){var e,t=Object.values(null!==(e=U.contentItems)&&void 0!==e?e:{}).find((function(e){return"stream/embedded"===e.type}));return t&&"live"===t.liveStatus?t.viewersCounter:null}),[U.contentItems]),me=Object(r.useCallback)((function(){var e;return Object.entries(null!==(e=U.contentItems)&&void 0!==e?e:{}).filter((function(e){var t=Object(c.a)(e,2);t[0];return"text/paragraph"!==t[1].type}))}),[U.contentItems]);Object(r.useEffect)((function(){me().forEach((function(e){var t=Object(c.a)(e,2),n=t[0],r=t[1],i="".concat(a,">posts>").concat(n);r.isPrivate&&!k[i]&&ae(!0)}))}),[me,a,k]);var pe=function(e,r){var i=Object(c.a)(e,2),s=i[0],u=i[1];if("text/paragraph"===u.type)return Object(D.jsx)("p",{"data-v-90b80ca3":"",children:u.text},s);var l="";if(u.isPrivate){var d="".concat(a,">posts>").concat(t),b=k[d];if(!b)return Object(D.jsx)("div",{"data-v-90b80ca3":"",children:Object(D.jsx)("i",{className:"fas fa-lock fa-10x","data-v-90b80ca3":""})},s);l=b}return"image/embedded"===u.type?Object(D.jsx)(J.a,{id:s,item:Object(n.a)(Object(n.a)({},u),{},{magnetURI:l||u.magnetURI}),index:r,postId:t,tipCounter:M,tipValue:T,hideRibbon:void 0,width:void 0,"data-v-90b80ca3":""},"".concat(t,"-").concat(r)):"video/embedded"===u.type?Object(D.jsx)(W,{item:Object(n.a)(Object(n.a)({},u),{},{magnetURI:l||u.magnetURI}),index:r,tipCounter:M,tipValue:T,"data-v-90b80ca3":""},"".concat(t,"-").concat(r)):o.k(u)?u.playbackMagnet?Object(D.jsx)(W,{item:Object(n.a)(Object(n.a)({},u),{},{magnetURI:u.playbackMagnet}),index:r,tipCounter:M,tipValue:T,"data-v-90b80ca3":""},"".concat(t,"-").concat(r)):Object(D.jsx)($.a,{item:Object(n.a)(Object(n.a)({},u),{},{magnetURI:l||u.magnetURI}),tipCounter:M,tipValue:T,hideRibbon:void 0,width:void 0,"data-v-90b80ca3":""},"".concat(t,"-").concat(r)):null},je=Object(r.useCallback)((function(){R&&R.canScrollNext()&&R.scrollNext()}),[R]),he=Object(r.useCallback)((function(){R&&R.canScrollPrev()&&R.scrollPrev()}),[R]),Oe=Object(r.useCallback)((function(e){if(0!==K){var t=e.key;"ArrowRight"===t&&je(),"ArrowLeft"===t&&he()}}),[K,he,je]),xe=Object(r.useCallback)((function(){Y(R.selectedScrollSnap())}),[R,Y]);Object(r.useEffect)((function(){if(R)return R.on("scroll",xe),G(R.scrollSnapList().length),window.addEventListener("keydown",Oe),function(){window.removeEventListener("keydown",Oe),R.off("scroll",xe)}}),[R,K,Oe,xe]);var ge=Object(r.useCallback)((function(){b({targetType:"post",postID:t,publicKey:a})}),[t,be,b,a]),ye=Object(r.useCallback)((function(){f({targetType:"unlock",postID:t,publicKey:a})}),[t,be,f,a]),ke=Object(r.useCallback)((function(){O({id:t,shared:!1})}),[t,O]),we=Object(r.useCallback)((function(){if(!w){var e="https://".concat(window.location.host,"/").concat(a,"/post/").concat(t);return navigator.share?void navigator.share({text:"Check out ".concat(S.displayName,"'s post on Lightning.Page!"),url:e}):void navigator.clipboard.writeText(e)}g({targetType:"share",postID:t,publicKey:a})}),[w,g,t,a,S.displayName]);Object(r.useEffect)((function(){try{d.a.rebuild()}catch(e){console.log("Error inside <Post />: ",e)}}),[]),Object(r.useLayoutEffect)((function(){re&&V([U],!1),ue&&Object.entries(U.contentItems).forEach((function(e){var t=Object(c.a)(e,2)[1];"magnetURI"in t&&F({magnetURI:t.magnetURI})}))}),[re,ue,U]);return Object(D.jsxs)("div",{className:"post",ref:de,"data-v-90b80ca3":"",children:[Object(D.jsxs)("div",{className:"head","data-v-90b80ca3":"",children:[Object(D.jsxs)("div",{className:"user","data-v-90b80ca3":"",children:[Object(D.jsx)(z.a,{height:50,publicKey:a,"data-v-90b80ca3":""}),Object(D.jsx)(B.a,{amt:10,insideRow:!0,"data-v-90b80ca3":""}),Object(D.jsxs)("div",{className:"details","data-v-90b80ca3":"",children:[Object(D.jsxs)("div",{className:"username","data-v-90b80ca3":"",children:[Object(D.jsx)(s.b,{to:"/otherUser/".concat(a),"data-v-90b80ca3":"",children:S.displayName}),ve&&Object(D.jsxs)("p",{className:"liveStatus","data-v-90b80ca3":"",children:[{live:"Is Live",waiting:"Waiting",wasLive:"Was Live"}[ve],Object(D.jsx)("i",{className:"fas fa-circle liveStatusIcon ".concat("live"===ve?"liveIcon":""),"data-v-90b80ca3":""}),"live"===ve&&Object(D.jsxs)("span",{"data-v-90b80ca3":"",children:[" | ",fe," watching"]})]})]}),Object(D.jsx)("p",{"data-v-90b80ca3":"",children:p.DateTime.fromMillis(U.date).toRelative()})]})]}),O&&Object(D.jsx)("i",{className:"fas fa-trash trash-icon",onClick:ke,"data-v-90b80ca3":""})]}),Object(D.jsxs)("div",{className:"content","data-v-90b80ca3":"",children:[function(){var e;return Object.entries(null!==(e=U.contentItems)&&void 0!==e?e:{}).filter((function(e){var t=Object(c.a)(e,2);t[0];return"text/paragraph"===t[1].type}))}().map(pe),Object(D.jsxs)("div",{className:"media-content-carousel","data-v-90b80ca3":"",children:[K>1?Object(D.jsxs)("div",{className:"media-carousel-controls-container","data-v-90b80ca3":"",children:[Object(D.jsx)("div",{className:"media-carousel-arrow fas fa-angle-left",onClick:he,"data-v-90b80ca3":""}),Object(D.jsx)("div",{className:"media-carousel-pages","data-v-90b80ca3":"",children:Array.from({length:K}).map((function(e,t){return Object(D.jsx)("div",{className:v()({"media-carousel-page":!0,"active-carousel-page":X===t}),onClick:function(){return null===R||void 0===R?void 0:R.scrollTo(t)},"data-v-90b80ca3":""},t)}))}),Object(D.jsx)("div",{className:"media-carousel-arrow fas fa-angle-right",onClick:je,"data-v-90b80ca3":""})]}):null,Object(D.jsx)("div",{className:"media-content-root",ref:C,"data-v-90b80ca3":"",children:Object(D.jsx)("div",{className:"media-content-container","data-v-90b80ca3":"",children:me().map(pe)})})]})]}),Object(D.jsxs)("div",{className:"actions","data-v-90b80ca3":"",children:[Object(D.jsx)("div",{"data-v-90b80ca3":""}),Object(D.jsx)("div",{className:"icon-tip-btn","data-tip":te?"Unlock this post":"Tip this post",onClick:te?ye:ge,"data-v-90b80ca3":"",children:Object(D.jsx)("div",{className:"tip-icon icon-thin-feed","data-v-90b80ca3":""})}),g&&Object(D.jsx)("div",{className:"icon-tip-btn","data-tip":"share",onClick:we,"data-v-90b80ca3":"",children:Object(D.jsx)("img",{alt:"Share this post",src:_,style:{color:"#4285b9",marginLeft:"auto"},"data-v-90b80ca3":""})}),!g&&Object(D.jsx)("div",{"data-v-90b80ca3":""})]})]})});t.default=Object(r.memo)(G)},799:function(e,t,a){},800:function(e,t,a){}}]);
//# sourceMappingURL=3.4ab02645.chunk.js.map