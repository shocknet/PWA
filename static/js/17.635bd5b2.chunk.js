(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[17],{441:function(e,a,t){"use strict";var c=t(3),n=t(74),s=t.n(n),i=(t(448),t(4)),d=function(e){var a=e.children,t=e.style;return Object(i.jsx)("div",{className:"content",style:t,"data-v-0dab12c1":"",children:a})},r=(t(449),function(e){var a=e.title,t=e.toggleModal;return a?Object(i.jsxs)("div",{className:"head","data-v-a8ccddfc":"",children:[Object(i.jsx)("p",{className:"head-title","data-v-a8ccddfc":"",children:a}),Object(i.jsx)("div",{className:"head-close",onClick:t,"data-v-a8ccddfc":"",children:Object(i.jsx)("i",{className:"fas fa-times","data-v-a8ccddfc":""})})]}):null});t(450),a.a=function(e){var a=e.modalOpen,t=void 0!==a&&a,n=e.toggleModal,l=e.modalTitle,o=void 0===l?"":l,b=e.children,u=e.contentStyle,v=void 0===u?{}:u,j=Object(c.useCallback)((function(){n()}),[n]);return Object(i.jsxs)("div",{className:s()({modal:!0,open:t}),"data-v-6c59c2e0":"",children:[Object(i.jsx)("div",{className:"backdrop",onClick:j,"data-v-6c59c2e0":""}),Object(i.jsxs)("div",{className:"container","data-v-6c59c2e0":"",children:[Object(i.jsx)(r,{title:o,toggleModal:j,"data-v-6c59c2e0":""}),Object(i.jsx)(d,{style:v,"data-v-6c59c2e0":"",children:b})]})]})}},446:function(e,a,t){"use strict";var c=t(3),n=t(74),s=t.n(n),i=(t(447),t(42)),d=t(33),r=t(77),l=t(443),o=t(16),b=t(4);a.a=function(e){var a=e.pageTitle,t=e.absolute,n=void 0!==t&&t,u=e.solid,v=void 0!==u&&u,j=e.enableBackButton,m=void 0!==j&&j,O=e.onHeight,h=void 0===O?d.a:O,f=Object(i.b)(),p=Object(c.useCallback)((function(){window.history.back()}),[]),x=Object(c.useCallback)((function(){f(Object(r.c)())}),[f]),N=Object(o.useSelector)((function(e){return e.node.publicKey})),g=Object(c.useCallback)((function(e){if(e)try{h(e.getBoundingClientRect().height)}catch(a){console.log("Error inside onHeight mechanism in MainNav:"),console.log(a)}}),[h]);return Object(b.jsxs)("div",{className:s()({"main-nav-container":!0,"main-nav-absolute":n,"main-nav-solid":v}),ref:g,"data-v-5e59b148":"",children:[m?Object(b.jsx)("div",{className:"main-nav-back",onClick:p,"data-v-5e59b148":"",children:Object(b.jsx)("i",{className:"icon icon-thin-back","data-v-5e59b148":""})}):Object(b.jsx)(l.a,{height:40,publicKey:N,"data-v-5e59b148":""}),Object(b.jsx)("p",{className:"main-nav-title unselectable","data-v-5e59b148":"",children:a}),Object(b.jsxs)("div",{className:"main-nav-menu-btn",onClick:x,"data-v-5e59b148":"",children:[Object(b.jsx)("div",{className:"main-nav-menu-dash","data-v-5e59b148":""}),Object(b.jsx)("div",{className:"main-nav-menu-dash","data-v-5e59b148":""}),Object(b.jsx)("div",{className:"main-nav-menu-dash","data-v-5e59b148":""})]})]})}},447:function(e,a,t){},448:function(e,a,t){},449:function(e,a,t){},450:function(e,a,t){},454:function(e,a,t){"use strict";var c=t(55),n=t(4);a.a=function(){return Object(n.jsxs)("div",{className:"bottom-nav-container",children:[Object(n.jsx)(c.c,{className:"bottom-nav-btn",to:"/overview",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-wallet"})}),Object(n.jsx)(c.c,{className:"bottom-nav-btn",to:"/chat",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-chat"})}),Object(n.jsx)(c.c,{className:"bottom-nav-btn",to:"/profile",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-profile"})}),Object(n.jsx)(c.c,{className:"bottom-nav-btn",to:"/feed",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-feed"})})]})}},458:function(e,a,t){"use strict";var c=t(12),n=t(3),s=t(74),i=t.n(s),d=(t(459),t(4));a.a=function(e){var a=e.label,t=void 0===a?null:a,s=e.icon,r=void 0===s?null:s,l=e.iconURL,o=void 0===l?null:l,b=e.onClick,u=void 0===b?void 0:b,v=e.nestedMode,j=void 0!==v&&v,m=e.large,O=void 0!==m&&m,h=e.small,f=void 0!==h&&h,p=e.relative,x=void 0!==p&&p,N=e.children,g=void 0===N?null:N,k=e.style,C=void 0===k?{}:k,y=Object(n.useState)(!1),q=Object(c.a)(y,2),S=q[0],w=q[1],R=Object(n.useCallback)((function(){j&&w(!S)}),[S,j]),E=Object(n.useMemo)((function(){return o?Object(d.jsx)("img",{src:o,className:"add-btn-icon",alt:"","data-v-4adba9c8":""}):Object(d.jsx)("i",{className:"fas fa-".concat(null!==r&&void 0!==r?r:"plus"),"data-v-4adba9c8":""})}),[r,o]),K=Object(n.useMemo)((function(){return t?Object(d.jsx)("p",{className:"add-btn-label","data-v-4adba9c8":"",children:t}):null}),[t]);return Object(d.jsxs)("div",{className:i()({"add-btn-container":!0,"add-btn-round-container":!t,"add-btn-large":O,"add-btn-small":f}),"data-v-4adba9c8":"",children:[Object(d.jsxs)("div",{className:i()({"add-btn":!0,"add-btn-round":!t,"add-btn-extended":!!t,"add-btn-relative":x,"add-btn-open":S,"add-btn-nested":j}),onClick:null!==u&&void 0!==u?u:R,style:C,"data-v-4adba9c8":"",children:[E,K]}),g?Object(d.jsx)("div",{className:i()({"add-btn-options":!0,"add-btn-options-open":S}),"data-v-4adba9c8":"",children:g}):null]})}},459:function(e,a,t){},460:function(e,a,t){"use strict";t.d(a,"a",(function(){return c}));var c=function(){return!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)}},464:function(e,a,t){"use strict";var c=t(475),n=t(460),s=(t(465),t(4)),i={wizard:{title:"SCAN A",target:"QR CODE",description:"Point your camera at a ShockWizard QR Code"},invoice:{title:"SCAN AN",target:"INVOICE",description:"Point your camera at an LND Invoice"}};a.a=function(e){var a=e.mode,t=void 0===a?"wizard":a,d=e.onScan,r=e.onError,l=e.onClose,o=i[t],b={};return Object(n.a)()||(b.facingMode={exact:"environment"}),Object(s.jsxs)("div",{className:"qr-code-scanner-container","data-v-2cb8b575":"",children:[Object(s.jsx)("div",{className:"qr-scanner-top-section","data-v-2cb8b575":"",children:Object(s.jsx)("i",{className:"fas fa-times",onClick:l,"data-v-2cb8b575":""})}),Object(s.jsx)(c.a,{constraints:{video:b},onScan:d,onError:r,"data-v-2cb8b575":""}),Object(s.jsx)("div",{className:"qr-scanner-target","data-v-2cb8b575":""}),Object(s.jsxs)("div",{className:"qr-scanner-bottom-section","data-v-2cb8b575":"",children:[Object(s.jsxs)("p",{className:"qr-scanner-bottom-title","data-v-2cb8b575":"",children:[o.title," ",Object(s.jsx)("span",{className:"qr-scanner-bottom-title-highlight","data-v-2cb8b575":"",children:o.target})]}),Object(s.jsx)("p",{className:"qr-scanner-bottom-description","data-v-2cb8b575":"",children:o.description}),Object(s.jsx)("div",{className:"qr-scanner-btn",onClick:l,"data-v-2cb8b575":"",children:"Cancel Scan"})]})]})}},465:function(e,a,t){},579:function(e,a,t){},580:function(e,a,t){},581:function(e,a,t){},726:function(e,a,t){"use strict";t.r(a);var c=t(21),n=t(2),s=t.n(n),i=t(5),d=t(12),r=t(3),l=t(42),o=t(111),b=t(25),u=t(49),v=t(454),j=t(55),m=t(443),O={height:"55px",width:"55px"},h=t(16),f=(t(579),t(20)),p=t(4),x=function(e){var a=e.subtitle,t=void 0===a?"":a,c=e.time,n=e.publicKey,s=e.chatLoaded,i=void 0!==s&&s,d=Object(l.b)(),o=h.useSelector((function(e){return e.node.publicKey})),u=h.useSelector(h.selectUser(n)),v=Object(r.useCallback)((function(){var e=d(Object(b.i)(o,n));return Object(f.f)(e)}),[d,o,n]);return Object(r.useEffect)((function(){if(i)return v()}),[v,n,i]),Object(p.jsxs)(j.b,{to:"/chat/".concat(n),className:"container","data-v-779ea4bb":"",children:[Object(p.jsxs)("div",{className:"author-container","data-v-779ea4bb":"",children:[Object(p.jsx)("div",{className:"author-avatar",style:O,"data-v-779ea4bb":"",children:Object(p.jsx)(m.a,{publicKey:n,height:55,"data-v-779ea4bb":""})}),Object(p.jsxs)("div",{className:"author-details","data-v-779ea4bb":"",children:[Object(p.jsx)("p",{className:"author-username","data-v-779ea4bb":"",children:u.displayName}),Object(p.jsx)("p",{className:"author-text","data-v-779ea4bb":"",children:t})]})]}),Object(p.jsx)("p",{className:"timestamp","data-v-779ea4bb":"",children:c})]})},N=(t(580),function(e){var a=e.publicKey,t=void 0===a?"":a,c=e.time,n=e.sent,s=h.useSelector(h.selectUser(t));return Object(p.jsxs)(j.b,{to:"/chat/".concat(t),className:"request-container","data-v-d1b7c4f6":"",children:[Object(p.jsxs)("div",{className:"request-author-container","data-v-d1b7c4f6":"",children:[Object(p.jsx)("div",{className:"request-author-avatar",style:O,"data-v-d1b7c4f6":"",children:Object(p.jsx)(m.a,{publicKey:t,height:55,"data-v-d1b7c4f6":""})}),Object(p.jsxs)("div",{className:"request-author-details","data-v-d1b7c4f6":"",children:[Object(p.jsxs)("p",{className:"request-author-username","data-v-d1b7c4f6":"",children:[n?"Sent Request":"Received Request"," - ",s.displayName]}),Object(p.jsx)("p",{className:"request-author-text","data-v-d1b7c4f6":"",children:"Request pending acceptance..."})]})]}),Object(p.jsx)("p",{className:"request-timestamp","data-v-d1b7c4f6":"",children:c})]})}),g=t(446),k=t(458),C=t(149),y=t(69),q=(t(581),t(441)),S=t(464);a.default=function(){var e=Object(l.b)(),a=Object(r.useState)(!1),t=Object(d.a)(a,2),n=t[0],j=t[1],m=Object(r.useState)(""),O=Object(d.a)(m,2),f=O[0],w=O[1],R=Object(r.useState)(!1),E=Object(d.a)(R,2),K=E[0],M=E[1],A=Object(r.useState)(!1),P=Object(d.a)(A,2),T=P[0],D=P[1],U=h.useSelector((function(e){return e.chat.contacts})),Q=h.useSelector((function(e){return e.chat.messages})),I=h.useSelector((function(e){return e.chat.sentRequests})),L=h.useSelector((function(e){return e.chat.receivedRequests})),z=Object(r.useState)(!1),B=Object(d.a)(z,2),W=B[0],H=B[1],J=Object(r.useCallback)(Object(i.a)(s.a.mark((function a(){return s.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,e(Object(b.d)());case 2:D(!0);case 3:case"end":return a.stop()}}),a)}))),[e]);Object(r.useEffect)((function(){J()}),[J]),Object(r.useEffect)((function(){var a=[].concat(Object(c.a)(U),Object(c.a)(I),Object(c.a)(L)).map((function(a){return e(Object(u.b)(a.pk))}));return function(){a.map((function(e){return e()}))}}),[U,I,L,e]);var G=Object(r.useCallback)((function(){j(!n)}),[n]),V=Object(r.useCallback)(function(){var a=Object(i.a)(s.a.mark((function a(t){var c,n,i,d;return s.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(t){a.next=2;break}return a.abrupt("return");case 2:if(a.prev=2,c=t,t.startsWith("https://")&&(n=t.split("/"),c=n[n.length-1]),w(null),M(!0),null===(i=(s=c).startsWith("http")?s.split("/").slice(-1)[0]:s)||void 0===i?void 0:i.length){a.next=10;break}throw new y.a({field:"publicKey",message:"Please specify a public key"});case 10:if(/^[0-9A-Za-z\-_.+/]+[=]{0,3}/.test(i)){a.next=12;break}throw new y.a({field:"publicKey",message:"Invalid public key format specified"});case 12:return a.next=14,e(Object(b.g)(c));case 14:j(!1),a.next=22;break;case 17:a.prev=17,a.t0=a.catch(2),d=a.t0 instanceof y.a?a.t0.message:"An unknown error has occurred",console.error(a.t0),w(d);case 22:return a.prev=22,M(!1),a.finish(22);case 25:case"end":return a.stop()}var s}),a,null,[[2,17,22,25]])})));return function(e){return a.apply(this,arguments)}}(),[e]),Z=Object(r.useCallback)(Object(i.a)(s.a.mark((function e(){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,navigator.clipboard.readText();case 3:return a=e.sent,e.abrupt("return",V(a));case 7:e.prev=7,e.t0=e.catch(0),alert(e.t0.message);case 10:case"end":return e.stop()}}),e,null,[[0,7]])}))),[V]),_=Object(r.useCallback)((function(){H(!0)}),[H]),F=Object(r.useCallback)((function(){H(!1)}),[H]),X=Object(r.useCallback)((function(e){console.log(e),w(e.message)}),[w]),Y=Object(r.useCallback)((function(e){e&&e.text&&(V(e.text),H(!1),console.log(e.text))}),[V,H]);return W?Object(p.jsx)("div",{"data-v-dae09534":"",children:Object(p.jsx)(S.a,{mode:"invoice",onClose:F,onError:X,onScan:Y,"data-v-dae09534":""})}):(console.log(f),Object(p.jsxs)("div",{className:"page-container messages-page","data-v-dae09534":"",children:[Object(p.jsx)(g.a,{solid:!0,pageTitle:"MESSAGES","data-v-dae09534":""}),Object(p.jsxs)("div",{className:"messages-container","data-v-dae09534":"",children:[Object(p.jsxs)("div",{className:"message-list-container","data-v-dae09534":"",children:[I.length>0?Object(p.jsx)("p",{className:"messages-section-title","data-v-dae09534":"",children:"Sent Requests"}):null,I.map((function(e){return Object(p.jsx)(N,{publicKey:e.pk,sent:!0,time:void 0,"data-v-dae09534":""},e.id)})),L.length>0?Object(p.jsx)("p",{className:"messages-section-title","data-v-dae09534":"",children:"Received Requests"}):null,L.map((function(e){return Object(p.jsx)(N,{publicKey:e.pk,sent:!1,time:void 0,"data-v-dae09534":""},e.id)})),U.length>0?Object(p.jsx)("p",{className:"messages-section-title","data-v-dae09534":"",children:"Messages"}):null,U.map((function(e){var a,t=null!==(a=Q[e.pk])&&void 0!==a?a:[],c=function(){var a;return e.didDisconnect?{body:"User disconnected from you.",timestamp:Date.now()}:null!==(a=t[0])&&void 0!==a?a:{body:"Unable to preview last message...",timestamp:Date.now()}}();return Object(p.jsx)(x,{publicKey:e.pk,subtitle:c.body,time:o.DateTime.fromMillis(c.timestamp).toRelative(),chatLoaded:T,"data-v-dae09534":""},e.pk)}))]}),Object(p.jsx)(k.a,{onClick:G,label:"REQUEST","data-v-dae09534":""}),Object(p.jsxs)(q.a,{modalTitle:"SEND REQUEST",toggleModal:G,modalOpen:n,"data-v-dae09534":"",children:[K?Object(p.jsx)(C.a,{text:"Sending Request...",overlay:!0,style:{borderRadius:"0 0 15px 15px"},"data-v-dae09534":""}):null,f?Object(p.jsx)("div",{className:"send-request-error","data-v-dae09534":"",children:f}):null,Object(p.jsxs)("div",{className:"send-request-cards","data-v-dae09534":"",children:[Object(p.jsxs)("div",{className:"send-request-card",onClick:_,"data-v-dae09534":"",children:[Object(p.jsx)("i",{className:"send-request-card-icon fas fa-qrcode","data-v-dae09534":""}),Object(p.jsx)("p",{className:"send-request-card-title","data-v-dae09534":"",children:"SCAN QR"}),Object(p.jsx)("p",{className:"send-request-card-desc","data-v-dae09534":"",children:"Scan another users QR to send a message request."})]}),Object(p.jsxs)("div",{className:"send-request-card",onClick:Z,"data-v-dae09534":"",children:[Object(p.jsx)("i",{className:"send-request-card-icon fas fa-clipboard","data-v-dae09534":""}),Object(p.jsx)("p",{className:"send-request-card-title","data-v-dae09534":"",children:"PASTE CLIPBOARD"}),Object(p.jsx)("p",{className:"send-request-card-desc","data-v-dae09534":"",children:"Paste another users Public Key to send a message request."})]})]})]})]}),Object(p.jsx)(v.a,{"data-v-dae09534":""})]}))}}}]);
//# sourceMappingURL=17.635bd5b2.chunk.js.map