(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[16],{435:function(e,a,c){"use strict";var t=c(3),n=c(73),d=c.n(n),s=(c(441),c(7)),l=function(e){var a=e.children,c=e.style;return Object(s.jsx)("div",{className:"content",style:c,"data-v-a1b92a2f":"",children:a})},i=(c(442),function(e){var a=e.title,c=e.toggleModal;return a?Object(s.jsxs)("div",{className:"head","data-v-528e5a72":"",children:[Object(s.jsx)("p",{className:"head-title","data-v-528e5a72":"",children:a}),Object(s.jsx)("div",{className:"head-close",onClick:c,"data-v-528e5a72":"",children:Object(s.jsx)("i",{className:"fas fa-times","data-v-528e5a72":""})})]}):null});c(443),a.a=function(e){var a=e.modalOpen,c=void 0!==a&&a,n=e.toggleModal,o=e.modalTitle,r=void 0===o?"":o,b=e.children,v=e.contentStyle,u=void 0===v?{}:v,j=Object(t.useCallback)((function(){n()}),[n]);return Object(s.jsxs)("div",{className:d()({modal:!0,open:c}),"data-v-07341a5c":"",children:[Object(s.jsx)("div",{className:"backdrop",onClick:j,"data-v-07341a5c":""}),Object(s.jsxs)("div",{className:"container","data-v-07341a5c":"",children:[Object(s.jsx)(i,{title:r,toggleModal:j,"data-v-07341a5c":""}),Object(s.jsx)(l,{style:u,"data-v-07341a5c":"",children:b})]})]})}},439:function(e,a,c){"use strict";var t=c(3),n=c(73),d=c.n(n),s=(c(440),c(40)),l=c(88),i=c(76),o=c(438),r=c(18),b=c(7);a.a=function(e){var a=e.pageTitle,c=e.absolute,n=void 0!==c&&c,v=e.solid,u=void 0!==v&&v,j=e.enableBackButton,O=void 0!==j&&j,m=e.onHeight,h=void 0===m?l.a:m,p=Object(s.b)(),f=Object(t.useCallback)((function(){window.history.back()}),[]),x=Object(t.useCallback)((function(){p(Object(i.c)())}),[p]),N=Object(r.useSelector)((function(e){return e.node.publicKey})),g=Object(t.useCallback)((function(e){if(e)try{h(e.getBoundingClientRect().height)}catch(a){console.log("Error inside onHeight mechanism in MainNav:"),console.log(a)}}),[h]);return Object(b.jsxs)("div",{className:d()({"main-nav-container":!0,"main-nav-absolute":n,"main-nav-solid":u}),ref:g,"data-v-6ecaaffc":"",children:[O?Object(b.jsx)("div",{className:"main-nav-back",onClick:f,"data-v-6ecaaffc":"",children:Object(b.jsx)("i",{className:"icon icon-thin-back","data-v-6ecaaffc":""})}):Object(b.jsx)(o.a,{height:40,publicKey:N,"data-v-6ecaaffc":""}),Object(b.jsx)("p",{className:"main-nav-title unselectable","data-v-6ecaaffc":"",children:a}),Object(b.jsxs)("div",{className:"main-nav-menu-btn",onClick:x,"data-v-6ecaaffc":"",children:[Object(b.jsx)("div",{className:"main-nav-menu-dash","data-v-6ecaaffc":""}),Object(b.jsx)("div",{className:"main-nav-menu-dash","data-v-6ecaaffc":""}),Object(b.jsx)("div",{className:"main-nav-menu-dash","data-v-6ecaaffc":""})]})]})}},440:function(e,a,c){},441:function(e,a,c){},442:function(e,a,c){},443:function(e,a,c){},444:function(e,a,c){"use strict";var t=c(25),n=c(73),d=c.n(n),s=(c(450),c(7));a.a=function(e){var a=e.label,c=e.name,n=e.onChange,l=e.inputAction,i=e.actionIcon,o=e.value,r=e.inputMode,b=void 0===r?"text":r,v=e.type,u=void 0===v?"text":v,j=e.element,O=void 0===j?"input":j,m=e.small,h=void 0!==m&&m,p=e.disabled;return Object(s.jsxs)("div",{className:d()({group:!0,"group-disabled":p,"group-small":h}),"data-v-9f9c9acc":"",children:[a?Object(s.jsx)("p",{className:"group-label","data-v-9f9c9acc":"",children:a}):null,Object(s.jsxs)("div",{className:d()({"group-input-container":!0,"group-input-textarea-container":"textarea"===O}),"data-v-9f9c9acc":"",children:["textarea"===O?Object(s.jsx)("textarea",{className:"group-input group-input-textarea",name:c,onChange:n,inputMode:b,value:o,disabled:p,"data-v-9f9c9acc":""}):Object(s.jsx)("input",{className:"group-input",type:u,name:c,onChange:n,inputMode:b,value:o,disabled:p,"data-v-9f9c9acc":""}),l&&i?Object(s.jsx)("div",{className:"group-input-action",onClick:l,"data-v-9f9c9acc":"",children:Object(s.jsx)("i",{className:d()(Object(t.a)({"group-input-action-icon":!0,fas:!0},i,!0)),onClick:l,"data-v-9f9c9acc":""})}):null]})]})}},450:function(e,a,c){},451:function(e,a,c){"use strict";c.d(a,"b",(function(){return o})),c.d(a,"a",(function(){return r}));var t=c(14),n=c(151),d=c.n(n),s=/(\d+)(\d{3})/gi,l=1e8,i=function e(a){return s.test(a)?e(a.replace(s,"$1,$2")):a},o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",a=e.split("."),c=Object(t.a)(a,2),n=c[0],d=c[1],s=i(n),l=d?"."+d:"";return s+l},r=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"0",c=d()(e).div(l).toString();return d()((null===a||void 0===a?void 0:a.toString())||"0").times(c)}},452:function(e,a,c){"use strict";var t=c(14),n=c(3),d=c(73),s=c.n(d),l=(c(453),c(7));a.a=function(e){var a=e.label,c=void 0===a?null:a,d=e.icon,i=void 0===d?null:d,o=e.iconURL,r=void 0===o?null:o,b=e.onClick,v=void 0===b?void 0:b,u=e.nestedMode,j=void 0!==u&&u,O=e.large,m=void 0!==O&&O,h=e.small,p=void 0!==h&&h,f=e.relative,x=void 0!==f&&f,N=e.children,g=void 0===N?null:N,k=e.style,y=void 0===k?{}:k,C=Object(n.useState)(!1),S=Object(t.a)(C,2),_=S[0],M=S[1],w=Object(n.useCallback)((function(){j&&M(!_)}),[_,j]),D=Object(n.useMemo)((function(){return r?Object(l.jsx)("img",{src:r,className:"add-btn-icon",alt:"","data-v-258365e4":""}):Object(l.jsx)("i",{className:"fas fa-".concat(null!==i&&void 0!==i?i:"plus"),"data-v-258365e4":""})}),[i,r]),E=Object(n.useMemo)((function(){return c?Object(l.jsx)("p",{className:"add-btn-label","data-v-258365e4":"",children:c}):null}),[c]);return Object(l.jsxs)("div",{className:s()({"add-btn-container":!0,"add-btn-round-container":!c,"add-btn-large":m,"add-btn-small":p}),"data-v-258365e4":"",children:[Object(l.jsxs)("div",{className:s()({"add-btn":!0,"add-btn-round":!c,"add-btn-extended":!!c,"add-btn-relative":x,"add-btn-open":_,"add-btn-nested":j}),onClick:null!==v&&void 0!==v?v:w,style:y,"data-v-258365e4":"",children:[D,E]}),g?Object(l.jsx)("div",{className:s()({"add-btn-options":!0,"add-btn-options-open":_}),"data-v-258365e4":"",children:g}):null]})}},453:function(e,a,c){},566:function(e,a,c){},567:function(e,a,c){},568:function(e,a,c){},569:function(e,a,c){},570:function(e,a,c){},571:function(e,a,c){},712:function(e,a,c){"use strict";c.r(a);var t=c(14),n=c(3),d=c(40),s=c(73),l=c.n(s),i=c(29),o=c(451),r=c(439),b=c(452),v=c(108),u=(c(566),c(7)),j=function(e){var a=e.hash,c=e.value,t=e.date,n=e.unconfirmed,s=Object(d.c)((function(e){var a;return null!==(a=e.wallet.USDRate)&&void 0!==a?a:"0"})),l=c.replace(/,/g,""),i=Object(o.b)(Object(o.a)(l,s).toFixed(2)),r=t?v.DateTime.fromSeconds(parseInt(t,10)).toRelative():"unknown";return Object(u.jsxs)("div",{className:"advanced-transaction-container","data-v-309ce65e":"",children:[Object(u.jsxs)("div",{className:"advanced-transaction-info","data-v-309ce65e":"",children:[Object(u.jsx)("div",{className:"advanced-transaction-avatar","data-v-309ce65e":""}),Object(u.jsxs)("div",{className:"advanced-transaction-author","data-v-309ce65e":"",children:[Object(u.jsx)("p",{className:"advanced-transaction-author-name","data-v-309ce65e":"",children:a}),Object(u.jsxs)("div",{style:{display:"flex"},"data-v-309ce65e":"",children:[Object(u.jsx)("p",{className:"advanced-transaction-type","data-v-309ce65e":"",children:"Payment"}),n&&Object(u.jsx)("i",{className:"far fa-clock",style:{marginLeft:"0.5rem",color:"red"},"data-v-309ce65e":""})]})]})]}),Object(u.jsxs)("div",{className:"advanced-transaction-value-container","data-v-309ce65e":"",children:[Object(u.jsx)("p",{className:"advanced-transaction-time","data-v-309ce65e":"",children:r}),Object(u.jsx)("p",{className:"advanced-transaction-value","data-v-309ce65e":"",children:c}),Object(u.jsxs)("p",{className:"advanced-transaction-usd","data-v-309ce65e":"",children:[i," USD"]})]})]})},O=(c(567),function(e){var a=e.address,c=e.sendable,t=e.receivable,d=e.active,s=e.pendingStatus,i=void 0===s?"":s,r=Object(n.useMemo)((function(){return Object(o.b)(c)}),[c]),b=Object(n.useMemo)((function(){return Object(o.b)(t)}),[t]);return Object(u.jsxs)("div",{className:"advanced-channel-container","data-v-ebd124ef":"",children:[Object(u.jsxs)("div",{className:"advanced-channel-name-container","data-v-ebd124ef":"",children:[Object(u.jsx)("div",{className:l()({"advanced-channel-status":!0,"advanced-channel-status-offline":!d}),"data-v-ebd124ef":""}),Object(u.jsx)("p",{style:{marginLeft:"0.5rem"},"data-v-ebd124ef":"",children:i})]}),Object(u.jsxs)("p",{className:"advanced-channel-address","data-v-ebd124ef":"",children:["Address: ",a]}),Object(u.jsxs)("div",{className:"advanced-channel-capacity-container","data-v-ebd124ef":"",children:[Object(u.jsxs)("div",{className:"advanced-channel-capacity","data-v-ebd124ef":"",children:["Sendable: ",r," sats"]}),Object(u.jsxs)("div",{className:"advanced-channel-capacity","data-v-ebd124ef":"",children:["Receivable: ",b," sats"]})]})]})}),m=(c(568),function(e){var a=e.sent,c=e.received,t=e.address,n=e.publicKey,d=Object(o.b)(a.toString()),s=Object(o.b)(c.toString());return Object(u.jsxs)("div",{className:"advanced-transaction-container","data-v-bbbed8b8":"",children:[Object(u.jsxs)("div",{className:"advanced-transaction-info","data-v-bbbed8b8":"",children:[Object(u.jsx)("div",{className:"advanced-transaction-avatar","data-v-bbbed8b8":""}),Object(u.jsxs)("div",{className:"advanced-transaction-author","data-v-bbbed8b8":"",children:[Object(u.jsx)("p",{className:"advanced-peer-address","data-v-bbbed8b8":"",children:t}),Object(u.jsx)("p",{className:"advanced-peer-public-key","data-v-bbbed8b8":"",children:null!==n&&void 0!==n?n:"Unknown public key"})]})]}),Object(u.jsxs)("div",{className:"advanced-peer-value-container","data-v-bbbed8b8":"",children:[Object(u.jsxs)("p",{className:"advanced-peer-value","data-v-bbbed8b8":"",children:[Object(u.jsx)("span",{className:"peer-value-title","data-v-bbbed8b8":"",children:"Sent:"})," ",d]}),Object(u.jsxs)("p",{className:"advanced-peer-value","data-v-bbbed8b8":"",children:[Object(u.jsx)("span",{className:"peer-value-title","data-v-bbbed8b8":"",children:"Received:"})," ",s]})]})]})}),h=c(2),p=c.n(h),f=c(6),x=c(435),N=c(444),g=(c(569),c(145)),k=function(e){var a=e.open,c=void 0!==a&&a,s=e.toggleModal,l=Object(d.b)(),o=Object(n.useState)(!1),r=Object(t.a)(o,2),b=r[0],v=r[1],j=Object(n.useState)(""),O=Object(t.a)(j,2),m=O[0],h=O[1],k=Object(n.useState)(""),y=Object(t.a)(k,2),C=y[0],S=y[1],_=Object(n.useState)(""),M=Object(t.a)(_,2),w=M[0],D=M[1],E=Object(n.useCallback)((function(e){var a=e.target,c=a.name,t=a.value;"publicKey"===c&&S(t),"host"===c&&h(t)}),[]),A=Object(n.useCallback)(function(){var e=Object(f.a)(p.a.mark((function e(a){var c;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),v(!0),e.prev=2,e.next=5,l(Object(i.c)({publicKey:C,host:m}));case 5:s(),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(2),D(null!==(c=null===e.t0||void 0===e.t0?void 0:e.t0.errorMessage)&&void 0!==c?c:null===e.t0||void 0===e.t0?void 0:e.t0.message);case 11:return e.prev=11,v(!1),e.finish(11);case 14:case"end":return e.stop()}}),e,null,[[2,8,11,14]])})));return function(a){return e.apply(this,arguments)}}(),[l,C,m,s]);return Object(u.jsx)(x.a,{toggleModal:s,modalOpen:c,modalTitle:"ADD PEER","data-v-7ed130ab":"",children:Object(u.jsxs)("form",{className:"modal-form",onSubmit:A,"data-v-7ed130ab":"",children:[w?Object(u.jsx)("div",{className:"form-error","data-v-7ed130ab":"",children:w}):null,b?Object(u.jsx)(g.a,{overlay:!0,text:"Adding Peer...","data-v-7ed130ab":""}):null,Object(u.jsx)(N.a,{onChange:E,name:"publicKey",label:"Public Key",value:C,small:!0,"data-v-7ed130ab":""}),Object(u.jsx)(N.a,{onChange:E,name:"host",label:"Host IP",value:m,small:!0,"data-v-7ed130ab":""}),Object(u.jsx)("div",{className:"modal-submit-container","data-v-7ed130ab":"",children:Object(u.jsx)("button",{className:"modal-submit-btn",type:"submit","data-v-7ed130ab":"",children:"ADD PEER"})})]})})},y=(c(570),c(86)),C=function(e){var a=e.open,c=void 0!==a&&a,s=e.toggleModal,l=Object(d.b)(),o=Object(n.useState)(!1),r=Object(t.a)(o,2),b=r[0],v=r[1],j=Object(n.useState)(""),O=Object(t.a)(j,2),m=O[0],h=O[1],k=Object(n.useState)(""),C=Object(t.a)(k,2),S=C[0],_=C[1],M=Object(n.useState)(""),w=Object(t.a)(M,2),D=w[0],E=w[1],A=Object(n.useState)(""),P=Object(t.a)(A,2),K=P[0],R=P[1],B=Object(n.useCallback)((function(e){var a=e.target,c=a.name,t=a.value;"publicKey"===c&&E(t),"pushAmount"===c&&_(t),"channelCapacity"===c&&h(t)}),[]),T=Object(n.useCallback)(function(){var e=Object(f.a)(p.a.mark((function e(a){var c;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a.preventDefault(),v(!0),e.prev=2,e.next=5,l(Object(y.b)());case 5:return e.next=7,l(Object(i.k)({publicKey:D,channelCapacity:m,pushAmount:S}));case 7:s(),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),R(null!==(c=null===e.t0||void 0===e.t0?void 0:e.t0.errorMessage)&&void 0!==c?c:null===e.t0||void 0===e.t0?void 0:e.t0.message);case 13:return e.prev=13,v(!1),e.finish(13);case 16:case"end":return e.stop()}}),e,null,[[2,10,13,16]])})));return function(a){return e.apply(this,arguments)}}(),[l,D,m,S,s]);return Object(u.jsx)(x.a,{toggleModal:s,modalOpen:c,modalTitle:"OPEN CHANNEL","data-v-ede7c970":"",children:Object(u.jsxs)("form",{className:"modal-form",onSubmit:T,"data-v-ede7c970":"",children:[K?Object(u.jsx)("div",{className:"form-error","data-v-ede7c970":"",children:K}):null,b?Object(u.jsx)(g.a,{overlay:!0,text:"Adding Peer...","data-v-ede7c970":""}):null,Object(u.jsx)(N.a,{onChange:B,name:"publicKey",label:"Node Public Key",value:D,small:!0,"data-v-ede7c970":""}),Object(u.jsx)(N.a,{onChange:B,name:"channelCapacity",label:"Channel Capacity (sats)",value:m,inputMode:"number",small:!0,"data-v-ede7c970":""}),Object(u.jsx)(N.a,{onChange:B,name:"pushAmount",label:"Push Amount (sats)",value:S,inputMode:"number",small:!0,"data-v-ede7c970":""}),Object(u.jsx)("div",{className:"modal-submit-container","data-v-ede7c970":"",children:Object(u.jsx)("button",{className:"modal-submit-btn",type:"submit","data-v-ede7c970":"",children:"OPEN CHANNEL"})})]})})},S=c(15),_=c(18);c(571),a.default=function(){var e=Object(n.useState)("transactions"),a=Object(t.a)(e,2),c=a[0],s=a[1],v=Object(n.useState)(1),h=Object(t.a)(v,1)[0],p=Object(n.useState)(!1),f=Object(t.a)(p,2),x=f[0],N=f[1],g=Object(n.useState)(!1),y=Object(t.a)(g,2),M=y[0],w=y[1],D=Object(n.useState)([]),E=Object(t.a)(D,2),A=E[0],P=E[1],K=Object(d.b)(),R=_.useSelector((function(e){return e.wallet.confirmedBalance})),B=_.useSelector((function(e){return e.wallet.channelBalance})),T=_.useSelector((function(e){return e.wallet.transactions})),U=_.useSelector((function(e){return e.wallet.channels})),H=_.useSelector((function(e){return e.wallet.peers})),L=_.useSelector((function(e){return e.wallet.USDRate}));Object(n.useEffect)((function(){var e=1===h;K(Object(i.g)({page:h,reset:e})),K(Object(i.e)({page:h,reset:e})),K(Object(i.d)()),K(Object(i.f)())}),[h,K]),Object(n.useEffect)((function(){S.a.get("/api/lnd/pendingchannels").then((function(e){var a=e.data;console.log("pending channels:"),console.log(a);var c=function(e,a){return{remote_pubkey:e.remote_node_pub,remote_balance:e.remote_balance,local_balance:e.local_balance,ip:"",active:!1,pendingStatus:a}},t=[];a.pending_open_channels.forEach((function(e){var a=e.channel;t.push(c(a,"Pending Open"))})),a.waiting_close_channels.forEach((function(e){var a=e.channel;t.push(c(a,"Pending Close"))})),a.pending_force_closing_channels.forEach((function(e){var a=e.channel;t.push(c(a,"Pending Force Close"))})),P(t)}))}),[]);var F=Object(n.useMemo)((function(){return Object(o.b)(Object(o.a)(R,L).toFixed(2))}),[L,R]),I=Object(n.useMemo)((function(){return Object(o.b)(Object(o.a)(B,L).toFixed(2))}),[L,B]),J=Object(n.useCallback)((function(e){s(e)}),[]),$=Object(n.useCallback)((function(){N(!x)}),[x]),V=Object(n.useCallback)((function(){w(!M)}),[M]),q=Object(n.useCallback)((function(){J("transactions")}),[J]),z=Object(n.useCallback)((function(){J("peers")}),[J]),G=Object(n.useCallback)((function(){J("channels")}),[J]);return Object(u.jsxs)("div",{className:"page-container advanced-page","data-v-6108d8d4":"",children:[Object(u.jsxs)("div",{className:"advanced-header","data-v-6108d8d4":"",children:[Object(u.jsx)(r.a,{absolute:!0,pageTitle:"ADVANCED",enableBackButton:!1,"data-v-6108d8d4":""}),Object(u.jsxs)("div",{className:"advanced-balance-container","data-v-6108d8d4":"",children:[Object(u.jsx)("div",{className:"advanced-balance-icon-container","data-v-6108d8d4":"",children:Object(u.jsx)("i",{className:"advanced-balance-icon fas fa-link","data-v-6108d8d4":""})}),Object(u.jsxs)("div",{className:"advanced-balance-btc-container","data-v-6108d8d4":"",children:[Object(u.jsx)("p",{className:"advanced-balance-btc","data-v-6108d8d4":"",children:Object(o.b)(R)}),Object(u.jsxs)("p",{className:"advanced-balance-usd","data-v-6108d8d4":"",children:[F," USD"]})]})]}),Object(u.jsxs)("div",{className:"advanced-balance-container",style:{paddingBottom:25},"data-v-6108d8d4":"",children:[Object(u.jsx)("div",{className:"advanced-balance-icon-container","data-v-6108d8d4":"",children:Object(u.jsx)("i",{className:"advanced-balance-icon fas fa-bolt","data-v-6108d8d4":""})}),Object(u.jsxs)("div",{className:"advanced-balance-btc-container","data-v-6108d8d4":"",children:[Object(u.jsx)("p",{className:"advanced-balance-btc","data-v-6108d8d4":"",children:Object(o.b)(B)}),Object(u.jsxs)("p",{className:"advanced-balance-usd","data-v-6108d8d4":"",children:[I," USD"]})]})]})]}),Object(u.jsxs)("div",{className:"advanced-accordions-container","data-v-6108d8d4":"",children:[Object(u.jsxs)("div",{className:l()({"advanced-accordion-container":!0,"accordion-open":"transactions"===c}),"data-v-6108d8d4":"",children:[Object(u.jsx)("div",{className:"advanced-accordion-header",onClick:q,"data-v-6108d8d4":"",children:Object(u.jsx)("p",{className:"advanced-accordion-title","data-v-6108d8d4":"",children:"Transactions"})}),Object(u.jsx)("div",{className:"advanced-accordion-content-container","data-v-6108d8d4":"",children:Object(u.jsx)("div",{className:"advanced-accordion-content","data-v-6108d8d4":"",children:T.content.map((function(e){return Object(u.jsx)(j,{date:e.time_stamp,hash:e.tx_hash,value:Object(o.b)(e.amount),unconfirmed:0===e.num_confirmations,"data-v-6108d8d4":""},e.tx_hash)}))})})]}),Object(u.jsxs)("div",{className:l()({"advanced-accordion-container":!0,"accordion-open":"peers"===c}),"data-v-6108d8d4":"",children:[Object(u.jsx)("div",{className:"advanced-accordion-header",onClick:z,"data-v-6108d8d4":"",children:Object(u.jsx)("p",{className:"advanced-accordion-title","data-v-6108d8d4":"",children:"Peers"})}),Object(u.jsxs)("div",{className:"advanced-accordion-content-container","data-v-6108d8d4":"",children:[Object(u.jsx)("div",{className:"advanced-accordion-content","data-v-6108d8d4":"",children:H.map((function(e){return Object(u.jsx)(m,{address:e.address,publicKey:e.pub_key,sent:e.sat_sent,received:e.sat_recv,"data-v-6108d8d4":""},e.address+e.pub_key)}))}),Object(u.jsx)(b.a,{nestedMode:!0,relative:!0,"data-v-6108d8d4":"",children:Object(u.jsx)(b.a,{label:"ADD PEER",onClick:$,icon:"link","data-v-6108d8d4":""})})]})]}),Object(u.jsxs)("div",{className:l()({"advanced-accordion-container":!0,"accordion-open":"channels"===c}),"data-v-6108d8d4":"",children:[Object(u.jsx)("div",{className:"advanced-accordion-header",onClick:G,"data-v-6108d8d4":"",children:Object(u.jsx)("p",{className:"advanced-accordion-title","data-v-6108d8d4":"",children:"Channels"})}),Object(u.jsx)("div",{className:"advanced-accordion-content-container","data-v-6108d8d4":"",children:Object(u.jsxs)("div",{className:"advanced-accordion-content","data-v-6108d8d4":"",children:[U.map((function(e){return Object(u.jsx)(O,{address:e.remote_pubkey,receivable:e.remote_balance,sendable:e.local_balance,active:e.active,"data-v-6108d8d4":""},e.chan_id)})),A.map((function(e){return Object(u.jsx)(O,{address:e.remote_pubkey,receivable:e.remote_balance,sendable:e.local_balance,active:e.active,pendingStatus:e.pendingStatus,"data-v-6108d8d4":""},e.chan_id)})),Object(u.jsx)(b.a,{nestedMode:!0,relative:!0,"data-v-6108d8d4":"",children:Object(u.jsx)(b.a,{label:"ADD CHANNEL",small:!0,onClick:V,icon:"exchange-alt","data-v-6108d8d4":""})})]})})]})]}),Object(u.jsx)(k,{open:x,toggleModal:$,"data-v-6108d8d4":""}),Object(u.jsx)(C,{open:M,toggleModal:V,"data-v-6108d8d4":""})]})}}}]);
//# sourceMappingURL=16.755f9163.chunk.js.map