(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[14,8],{440:function(e,t,a){"use strict";var n=a(3),c=a(74),r=a.n(c),s=(a(447),a(4)),o=function(e){var t=e.children,a=e.style;return Object(s.jsx)("div",{className:"content",style:a,"data-v-ed89d39d":"",children:t})},i=(a(448),function(e){var t=e.title,a=e.toggleModal;return t?Object(s.jsxs)("div",{className:"head","data-v-7a8211f5":"",children:[Object(s.jsx)("p",{className:"head-title","data-v-7a8211f5":"",children:t}),Object(s.jsx)("div",{className:"head-close",onClick:a,"data-v-7a8211f5":"",children:Object(s.jsx)("i",{className:"fas fa-times","data-v-7a8211f5":""})})]}):null});a(449),t.a=function(e){var t=e.modalOpen,a=void 0!==t&&t,c=e.toggleModal,l=e.modalTitle,u=void 0===l?"":l,d=e.children,b=e.contentStyle,f=void 0===b?{}:b,v=Object(n.useCallback)((function(){c()}),[c]);return Object(s.jsxs)("div",{className:r()({modal:!0,open:a}),"data-v-6c59c2e0":"",children:[Object(s.jsx)("div",{className:"backdrop",onClick:v,"data-v-6c59c2e0":""}),Object(s.jsxs)("div",{className:"container","data-v-6c59c2e0":"",children:[Object(s.jsx)(i,{title:u,toggleModal:v,"data-v-6c59c2e0":""}),Object(s.jsx)(o,{style:f,"data-v-6c59c2e0":"",children:d})]})]})}},443:function(e,t,a){"use strict";var n=a(27),c=a(74),r=a.n(c),s=(a(450),a(4));t.a=function(e){var t=e.label,a=e.name,c=e.onChange,o=e.inputAction,i=e.actionIcon,l=e.value,u=e.inputMode,d=void 0===u?"text":u,b=e.type,f=void 0===b?"text":b,v=e.element,j=void 0===v?"input":v,p=e.small,m=void 0!==p&&p,O=e.disabled;return Object(s.jsxs)("div",{className:r()({group:!0,"group-disabled":O,"group-small":m}),"data-v-5ffa84b6":"",children:[t?Object(s.jsx)("p",{className:"group-label","data-v-5ffa84b6":"",children:t}):null,Object(s.jsxs)("div",{className:r()({"group-input-container":!0,"group-input-textarea-container":"textarea"===j}),"data-v-5ffa84b6":"",children:["textarea"===j?Object(s.jsx)("textarea",{className:"group-input group-input-textarea",name:a,onChange:c,inputMode:d,value:l,disabled:O,"data-v-5ffa84b6":""}):Object(s.jsx)("input",{className:"group-input",type:f,name:a,onChange:c,inputMode:d,value:l,disabled:O,"data-v-5ffa84b6":""}),o&&i?Object(s.jsx)("div",{className:"group-input-action",onClick:o,"data-v-5ffa84b6":"",children:Object(s.jsx)("i",{className:r()(Object(n.a)({"group-input-action-icon":!0,fas:!0},i,!0)),onClick:o,"data-v-5ffa84b6":""})}):null]})]})}},447:function(e,t,a){},448:function(e,t,a){},449:function(e,t,a){},450:function(e,t,a){},453:function(e,t,a){"use strict";var n=a(54),c=a(4);t.a=function(){return Object(c.jsxs)("div",{className:"bottom-nav-container",children:[Object(c.jsx)(n.c,{className:"bottom-nav-btn",to:"/overview",activeClassName:"active-nav-btn",children:Object(c.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-wallet"})}),Object(c.jsx)(n.c,{className:"bottom-nav-btn",to:"/chat",activeClassName:"active-nav-btn",children:Object(c.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-chat"})}),Object(c.jsx)(n.c,{className:"bottom-nav-btn",to:"/profile",activeClassName:"active-nav-btn",children:Object(c.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-profile"})}),Object(c.jsx)(n.c,{className:"bottom-nav-btn",to:"/feed",activeClassName:"active-nav-btn",children:Object(c.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-feed"})})]})}},455:function(e,t,a){"use strict";a(3),a(489),a(490);var n=a(4);t.a=function(e){var t=e.text,a=void 0===t?"Submit":t,c=e.onClick;return Object(n.jsx)("div",{className:"submit-btn",onClick:c,"data-v-53a583c2":"",children:Object(n.jsx)("p",{className:"submit-btn-text","data-v-53a583c2":"",children:a})})}},488:function(e,t,a){"use strict";var n=a(2),c=a.n(n),r=a(6),s=a(12),o=a(3),i=a(41),l=a(440),u=a(455),d=a(443),b=a(52),f=a(148),v=(a(491),a(4));t.a=function(e){var t=e.tipData,a=e.toggleOpen,n=Object(i.b)(),j=Object(o.useState)(""),p=Object(s.a)(j,2),m=p[0],O=p[1],h=Object(o.useState)(!1),x=Object(s.a)(h,2),g=x[0],N=x[1],k=Object(o.useState)(0),y=Object(s.a)(k,2),S=y[0],w=y[1],C=Object(o.useState)(!1),I=Object(s.a)(C,2),M=I[0],P=I[1],D=Object(o.useCallback)((function(e){"amount"===e.target.name&&w(e.target.value)}),[]),U=Object(o.useCallback)(function(){var e=Object(r.a)(c.a.mark((function e(a){var r,s,o,i;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),e.prev=1,N(!0),e.next=5,n(Object(b.c)({amount:S,publicKey:t.publicKey,postId:t.postID}));case 5:P(!0),e.next=12;break;case 8:e.prev=8,e.t0=e.catch(1),console.error(e.t0),t&&(o=e.t0.message,i=null===(r=e.t0.response)||void 0===r||null===(s=r.data)||void 0===s?void 0:s.errorMessage,O(null!==i&&void 0!==i?i:o));case 12:return e.prev=12,N(!1),e.finish(12);case 15:case"end":return e.stop()}}),e,null,[[1,8,12,15]])})));return function(t){return e.apply(this,arguments)}}(),[n,S,t]);return Object(o.useEffect)((function(){t||(N(!1),O(null),P(!1))}),[t]),Object(v.jsx)(l.a,{toggleModal:a,modalOpen:!!t,modalTitle:"Send Tip","data-v-b9b59913":"",children:M?Object(v.jsxs)("div",{className:"tip-modal-success m-1","data-v-b9b59913":"",children:[Object(v.jsx)("i",{className:"tip-success-icon fas fa-check-circle","data-v-b9b59913":""}),Object(v.jsx)("p",{className:"tip-success-title","data-v-b9b59913":"",children:"Post tipped successfully!"}),Object(v.jsx)("p",{className:"tip-success-desc","data-v-b9b59913":""})]}):Object(v.jsxs)("form",{className:"modal-form tip-form m-1",onSubmit:U,"data-v-b9b59913":"",children:[m?Object(v.jsx)("div",{className:"form-error","data-v-b9b59913":"",children:m}):null,g?Object(v.jsx)(f.a,{overlay:!0,text:"Sending Tip...","data-v-b9b59913":""}):null,Object(v.jsx)("p",{className:"tip-modal-desc m-1","data-v-b9b59913":"",children:"Please specify the amount of sats you'd like to tip this user with below."}),Object(v.jsx)(d.a,{name:"amount",onChange:D,value:S,inputMode:"decimal",small:!0,"data-v-b9b59913":""}),Object(v.jsx)(u.a,{text:"SEND TIP",onClick:U,"data-v-b9b59913":""})]})})}},489:function(e,t,a){},490:function(e,t,a){},491:function(e,t,a){},492:function(e,t,a){"use strict";var n=a(2),c=a.n(n),r=a(6),s=a(12),o=a(3),i=a(41),l=a(440),u=a(455),d=a(148),b=(a(493),a(50)),f=a(4);t.a=function(e){var t=e.shareData,a=e.toggleOpen,n=Object(i.b)(),v=Object(o.useState)(""),j=Object(s.a)(v,2),p=j[0],m=j[1],O=Object(o.useState)(!1),h=Object(s.a)(O,2),x=h[0],g=h[1],N=Object(o.useState)(!1),k=Object(s.a)(N,2),y=k[0],S=k[1],w=Object(o.useCallback)(function(){var e=Object(r.a)(c.a.mark((function e(a){var n,r,s,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),e.prev=1,g(!0),n=t.postID,r=t.publicKey,s={originalAuthor:r,shareDate:Date.now()},e.next=7,b.b.post("/api/gun/put",{path:"$user>sharedPosts>".concat(n),value:s});case 7:o=e.sent,o.data.ok?S(!0):m("Share operation failed"),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(1),console.error(e.t0);case 15:return e.prev=15,g(!1),e.finish(15);case 18:case"end":return e.stop()}}),e,null,[[1,12,15,18]])})));return function(t){return e.apply(this,arguments)}}(),[n,t]);return Object(o.useEffect)((function(){t||(g(!1),m(null),S(!1))}),[t]),Object(f.jsx)(l.a,{toggleModal:a,modalOpen:!!t,modalTitle:"Share post","data-v-7ec224dd":"",children:y?Object(f.jsxs)("div",{className:"tip-modal-success m-1","data-v-7ec224dd":"",children:[Object(f.jsx)("i",{className:"tip-success-icon fas fa-check-circle","data-v-7ec224dd":""}),Object(f.jsx)("p",{className:"tip-success-title","data-v-7ec224dd":"",children:"Post shared successfully!"})]}):Object(f.jsxs)("form",{className:"modal-form tip-form m-1",onSubmit:w,"data-v-7ec224dd":"",children:[p?Object(f.jsx)("div",{className:"form-error","data-v-7ec224dd":"",children:p}):null,x?Object(f.jsx)(d.a,{overlay:!0,text:"Sharing...","data-v-7ec224dd":""}):null,Object(f.jsx)("p",{className:"tip-modal-desc m-1","data-v-7ec224dd":"",children:"This post will be shared on your profile"}),Object(f.jsx)(u.a,{text:"SHARE",onClick:w,"data-v-7ec224dd":""})]})})}},493:function(e,t,a){},494:function(e,t,a){"use strict";var n=a(2),c=a.n(n),r=a(6),s=a(12),o=a(3),i=a(41),l=a(440),u=a(455),d=a(32),b=a(148),f=(a(495),a(4));t.a=function(e){var t=e.unlockData,a=e.toggleOpen,n=Object(i.b)(),v=Object(o.useState)(""),j=Object(s.a)(v,2),p=j[0],m=j[1],O=Object(o.useState)(!1),h=Object(s.a)(O,2),x=h[0],g=h[1],N=Object(o.useState)(!1),k=Object(s.a)(N,2),y=k[0],S=k[1],w=Object(o.useCallback)(function(){var e=Object(r.a)(c.a.mark((function e(a){var r,s,o,i;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),e.prev=1,g(!0),e.next=5,Object(d.m)(100,t.publicKey,t.postID)(n);case 5:S(!0),e.next=12;break;case 8:e.prev=8,e.t0=e.catch(1),console.error(e.t0),t&&(o=e.t0.message,i=null===(r=e.t0.response)||void 0===r||null===(s=r.data)||void 0===s?void 0:s.errorMessage,m(null!==i&&void 0!==i?i:o));case 12:return e.prev=12,g(!1),e.finish(12);case 15:case"end":return e.stop()}}),e,null,[[1,8,12,15]])})));return function(t){return e.apply(this,arguments)}}(),[n,t]);return Object(o.useEffect)((function(){t||(g(!1),m(null),S(!1))}),[t]),Object(f.jsx)(l.a,{toggleModal:a,modalOpen:!!t,modalTitle:"Unlock content","data-v-5baf4590":"",children:y?Object(f.jsxs)("div",{className:"tip-modal-success","data-v-5baf4590":"",children:[Object(f.jsx)("i",{className:"tip-success-icon fas fa-check-circle","data-v-5baf4590":""}),Object(f.jsx)("p",{className:"tip-success-title","data-v-5baf4590":"",children:"Content unlocked successfully!"})]}):Object(f.jsxs)("form",{className:"modal-form tip-form",onSubmit:w,"data-v-5baf4590":"",children:[p?Object(f.jsx)("div",{className:"form-error","data-v-5baf4590":"",children:p}):null,x?Object(f.jsx)(b.a,{overlay:!0,text:"Sending Tip...","data-v-5baf4590":""}):null,Object(f.jsx)("p",{className:"tip-modal-desc","data-v-5baf4590":"",children:"100 sats will be sent to the owner of the post to unlock the content"}),Object(f.jsx)(u.a,{text:"UNLOCK",onClick:w,"data-v-5baf4590":""})]})})}},495:function(e,t,a){},504:function(e,t,a){"use strict";a.d(t,"a",(function(){return x}));var n=a(21),c=a(2),r=a.n(c),s=a(6),o=a(0),i=a(12),l=a(510),u=a.n(l),d=a(558),b=a.n(d),f=function(){var e=Object(s.a)(r.a.mark((function e(t){var a;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,b.a._init){e.next=4;break}return e.next=4,new Promise((function(e,t){b.a.init("ShockWalletStore").then((function(){return console.log("File cache initialized!"),b.a.persist()})).then((function(a){a.persistent?e(a):t(a)}))}));case 4:return e.next=6,b.a.load(t);case 6:return a=e.sent,e.abrupt("return",a.createURL());case 10:return e.prev=10,e.t0=e.catch(0),console.warn(e.t0),e.abrupt("return",!1);case 14:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(t){return e.apply(this,arguments)}}(),v=function(e,t){var a=document.querySelectorAll(t);return a&&a.length&&a.forEach((function(t){t.src||(t.src=e,t.muted=!0,t.autoplay=!0)})),!!(null===a||void 0===a?void 0:a.length)},j=function(e,t){return b.a.save(e,t)},p=function(e){var t=Promise.resolve();return e.forEach((function(e){t=t.then((function(){return e()}))})),t},m={"video/embedded":{formats:["mp4","webm"],element:"video",options:{autoplay:!0,muted:!0}},"image/embedded":{formats:["jpg","png","webp","jpeg"],element:"img",options:{}}},O=function(e){var t,a,n=null===(t=e.name)||void 0===t||null===(a=t.split("."))||void 0===a?void 0:a.slice(-1)[0],c=Object.entries(m).filter((function(e){var t=Object(i.a)(e,2);t[0];return t[1].formats.includes(n)}))[0];if(c){var r=Object(i.a)(c,2),s=r[0],l=r[1];return Object(o.a)({name:s},l)}return null},h=new u.a,x=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=arguments.length>2&&void 0!==arguments[2]&&arguments[2],c=e.map((function(e){var n=e.contentItems,c=e.id;return Object.entries(n).filter((function(e){var t=Object(i.a)(e,2),a=(t[0],t[1]);return m[a.type]})).map((function(e){var n=Object(i.a)(e,2),o=n[0],l=n[1];return function(){return new Promise((function(e){!h.get(l.magnetURI)||a?h.add(l.magnetURI,function(){var a=Object(s.a)(r.a.mark((function a(n){var u;return r.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:e(!0),(u=n.files.filter((function(e){var t,a,n=null===(t=e.name)||void 0===t||null===(a=t.split("."))||void 0===a?void 0:a.slice(-1)[0],c=Object.entries(m).filter((function(e){var t=Object(i.a)(e,2);t[0];return t[1].formats.includes(n)}))[0];return!!c&&Object(i.a)(c,2)[1].formats.includes(n)}))).map(function(){var e=Object(s.a)(r.a.mark((function e(a){var n,s,u,d,b,j;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=O(a)){e.next=3;break}return e.abrupt("return");case 3:return s="".concat(c,"-").concat(o,"-").concat(a.name),u=n.element,d="".concat(u,'[data-torrent="').concat(l.magnetURI,'"]'),e.next=8,f(s);case 8:if(!(b=e.sent)){e.next=14;break}return(j=h.get(l.magnetURI))&&j.destroy(),v(b,d),e.abrupt("return");case 14:document.querySelectorAll(d).forEach((function(e){var c=decodeURIComponent(l.magnetURI.replace(/.*(ws=)/gi,"")),r=n.formats.filter((function(e){return c.toLowerCase().endsWith(".".concat(e.toLowerCase()))})),s=Object(i.a)(r,1)[0],o=e.getAttribute("src");!t&&s||o?e.setAttribute("src",c):a.renderTo(e,n.options)}));case 16:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),n.on("done",(function(){u.map((function(e){var t=O(e),a="".concat(c,"-").concat(o,"-").concat(e.name),n=t.element,i="".concat(n,'[data-torrent="').concat(l.magnetURI,'"]');return e.getBlob(function(){var e=Object(s.a)(r.a.mark((function e(t,n){var c,s;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=3;break}return console.warn(t),e.abrupt("return");case 3:return e.next=5,j(a,n);case 5:if("false"!==(null===(c=document.querySelector(i))||void 0===c?void 0:c.dataset.played)||(null===c||void 0===c?void 0:c.getAttribute("src"))){e.next=11;break}return e.next=9,f(a);case 9:s=e.sent,v(s,i);case 11:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}()),e}))}));case 4:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()):e(!0)}))}}))})).reduce((function(e,t){return[].concat(Object(n.a)(e),Object(n.a)(t))}),[]);p(c)}},513:function(e,t){},516:function(e,t){},517:function(e,t){},518:function(e,t){},520:function(e,t){},521:function(e,t){},528:function(e,t){},529:function(e,t){},535:function(e,t){},536:function(e,t){},538:function(e,t){},539:function(e,t){},540:function(e,t){},541:function(e,t){},542:function(e,t){},543:function(e,t){},544:function(e,t){},545:function(e,t){},548:function(e,t){},549:function(e,t){},550:function(e,t){},557:function(e,t){},671:function(e,t,a){},672:function(e,t,a){e.exports={followed:"Feed_followed__1ZWr5"}},712:function(e,t,a){"use strict";a.r(t);var n=a(21),c=a(12),r=a(3),s=a.n(r),o=a(24),i=a(23),l=a(91),u=a(504),d=a(13),b=a(453),f=a(488),v=a(492),j=a(148),p=a(442),m=a(53),O=(a(671),a(494)),h=a(41),x=a(52),g=a(48),N=a(19),k=a(672),y=a.n(k),S=a(4),w=s.a.lazy((function(){return Promise.all([a.e(1),a.e(5)]).then(a.bind(null,502))})),C=s.a.lazy((function(){return Promise.all([a.e(1),a.e(3)]).then(a.bind(null,709))}));t.default=function(){var e=Object(h.b)(),t=Object(i.g)(),a=d.useSelector(d.selectFollows),s=d.useSelector((function(e){return e.feed.posts})),k=d.useSelector((function(e){return e.userProfiles})),I=Object(r.useState)(null),M=Object(c.a)(I,2),P=M[0],D=M[1],U=Object(r.useState)(null),T=Object(c.a)(U,2),A=T[0],E=T[1],K=Object(r.useState)(null),R=Object(c.a)(K,2),L=R[0],F=R[1],_=d.useSelector(d.selectSelfUser).publicKey;Object(r.useEffect)((function(){return e(Object(x.d)()),function(){e(Object(x.g)())}}),[e]);var q=Object(r.useMemo)((function(){return s?Object.values(s).reduce((function(e,t){return[].concat(Object(n.a)(e),Object(n.a)(t))}),[]).filter((function(e){return Object(m.c)(e)?!!a.find((function(t){return t.user===e.sharerId})):!!a.find((function(t){return t.user===e.authorId}))})).sort((function(e,t){var a=Object(m.c)(e)?e.shareDate:e.date;return(Object(m.c)(t)?t.shareDate:t.date)-a})):[]}),[a,s]),z=Object(r.useCallback)((function(e){console.log(e),!P&&e||D(null),D(e)}),[P]),B=Object(r.useCallback)((function(e){console.log(e),!A&&e||E(null),E(e)}),[A]),V=Object(r.useCallback)((function(e){console.log(e),!L&&e||F(null),F(e)}),[L]);return Object(r.useLayoutEffect)((function(){Object(u.a)(q.filter((function(e){return"post"===e.type})),!1)}),[q]),Object(r.useEffect)((function(){var t=a.map((function(t){var a=e(Object(g.b)(t.user)),n=e(Object(x.f)(t.user)),c=e(Object(x.e)(t.user));return function(){a(),Object(N.f)(n,c)()}}));return function(){t.map((function(e){return e()}))}}),[a,e]),Object(S.jsxs)("div",{className:"page-container feed-page","data-v-4376f6ca":"",children:[Object(S.jsxs)("div",{className:y.a.followed,"data-v-4376f6ca":"",children:[Object(S.jsx)(p.a,{forceAddBtn:!0,height:60,publicKey:_,onPress:Object(r.useCallback)((function(){t.push("/createPost")}),[t]),"data-v-4376f6ca":""}),null===a||void 0===a?void 0:a.map((function(e){return Object(S.jsx)(p.a,{height:60,nameAtBottom:!0,publicKey:e.user,"data-v-4376f6ca":""},e.user)}))]}),Object(S.jsxs)("div",{className:"tabs-holder","data-v-4376f6ca":"",children:[Object(S.jsx)("p",{className:"tab active","data-v-4376f6ca":"",children:"Feed"}),Object(S.jsx)("p",{className:"tab","data-v-4376f6ca":"",children:"Saved"}),Object(S.jsx)("p",{className:"tab","data-v-4376f6ca":"",children:"Videos"})]}),Object(S.jsxs)("div",{className:"posts-holder no-scrollbar","data-v-4376f6ca":"",children:[0===q.length&&Object(S.jsx)(j.a,{text:"loading posts...","data-v-4376f6ca":""}),q.map((function(e,t){if("shared"===e.type){if(!e.originalPost)return null;var a,n,s=Object.entries(e.originalPost.contentItems).find((function(e){var t=Object(c.a)(e,2);t[0];return"stream/embedded"===t[1].type}));if(s){var i=Object(c.a)(s,2);a=i[0],n=i[1]}if(n){if(!n.liveStatus)return null;if("waiting"===n.liveStatus)return null;if("wasLive"===n.liveStatus){if(!n.playbackMagnet)return null;e.originalPost.contentItems[a].type="video/embedded",e.originalPost.contentItems[a].magnetURI=n.playbackMagnet}}var u=k[e.sharerId]||o.e(e.sharerId),d=e.originalAuthor,b=k[d]||o.e(d);return Object(S.jsx)(r.Suspense,{fallback:Object(S.jsx)(j.a,{"data-v-4376f6ca":""}),"data-v-4376f6ca":"",children:Object(S.jsx)(C,{originalPost:e.originalPost,originalPostProfile:b,sharedTimestamp:e.shareDate,sharerProfile:u,postPublicKey:d,openTipModal:z,openUnlockModal:B,openShareModal:V,"data-v-4376f6ca":""})},t)}var f,v,p=Object.entries(e.contentItems).find((function(e){var t=Object(c.a)(e,2);t[0];return"stream/embedded"===t[1].type}));if(p){var m=Object(c.a)(p,2);f=m[0],v=m[1]}if(v){if(!v.liveStatus)return null;if("waiting"===v.liveStatus)return null;if("wasLive"===v.liveStatus){if(!v.playbackMagnet)return null;e.contentItems[f].type="video/embedded",e.contentItems[f].magnetURI=v.playbackMagnet}}var O=k[e.authorId]||o.e(e.authorId);return Object(S.jsx)(r.Suspense,{fallback:Object(S.jsx)(j.a,{"data-v-4376f6ca":""}),"data-v-4376f6ca":"",children:Object(S.jsx)(w,{id:e.id,timestamp:e.date,contentItems:e.contentItems,username:Object(l.c)(null===O||void 0===O?void 0:O.publicKey,null===O||void 0===O?void 0:O.displayName),publicKey:e.authorId,openTipModal:z,openUnlockModal:B,tipCounter:e.tipCounter||0,tipValue:e.tipValue||0,openShareModal:V,"data-v-4376f6ca":""})},t)}))]}),Object(S.jsx)(f.a,{tipData:P,toggleOpen:z,"data-v-4376f6ca":""}),Object(S.jsx)(O.a,{unlockData:A,toggleOpen:B,"data-v-4376f6ca":""}),Object(S.jsx)(v.a,{shareData:L,toggleOpen:V,"data-v-4376f6ca":""}),Object(S.jsx)(b.a,{"data-v-4376f6ca":""})]})}}}]);
//# sourceMappingURL=14.b7f630c5.chunk.js.map