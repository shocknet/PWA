(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[16],{439:function(a,e,c){"use strict";var t=c(3),n=c(74),d=c.n(n),s=(c(447),c(4)),l=function(a){var e=a.children,c=a.style;return Object(s.jsx)("div",{className:"content",style:c,"data-v-76030584":"",children:e})},i=(c(448),function(a){var e=a.title,c=a.toggleModal;return e?Object(s.jsxs)("div",{className:"head","data-v-ba532abb":"",children:[Object(s.jsx)("p",{className:"head-title","data-v-ba532abb":"",children:e}),Object(s.jsx)("div",{className:"head-close",onClick:c,"data-v-ba532abb":"",children:Object(s.jsx)("i",{className:"fas fa-times","data-v-ba532abb":""})})]}):null});c(449),e.a=function(a){var e=a.modalOpen,c=void 0!==e&&e,n=a.toggleModal,o=a.modalTitle,r=void 0===o?"":o,b=a.children,v=a.contentStyle,u=void 0===v?{}:v,j=Object(t.useCallback)((function(){n()}),[n]);return Object(s.jsxs)("div",{className:d()({modal:!0,open:c}),"data-v-953db23b":"",children:[Object(s.jsx)("div",{className:"backdrop",onClick:j,"data-v-953db23b":""}),Object(s.jsxs)("div",{className:"container","data-v-953db23b":"",children:[Object(s.jsx)(i,{title:r,toggleModal:j,"data-v-953db23b":""}),Object(s.jsx)(l,{style:u,"data-v-953db23b":"",children:b})]})]})}},443:function(a,e,c){"use strict";var t=c(27),n=c(74),d=c.n(n),s=(c(450),c(4));e.a=function(a){var e=a.label,c=a.name,n=a.onChange,l=a.inputAction,i=a.actionIcon,o=a.value,r=a.inputMode,b=void 0===r?"text":r,v=a.type,u=void 0===v?"text":v,j=a.element,O=void 0===j?"input":j,m=a.small,h=void 0!==m&&m,f=a.disabled;return Object(s.jsxs)("div",{className:d()({group:!0,"group-disabled":f,"group-small":h}),"data-v-6272e6eb":"",children:[e?Object(s.jsx)("p",{className:"group-label","data-v-6272e6eb":"",children:e}):null,Object(s.jsxs)("div",{className:d()({"group-input-container":!0,"group-input-textarea-container":"textarea"===O}),"data-v-6272e6eb":"",children:["textarea"===O?Object(s.jsx)("textarea",{className:"group-input group-input-textarea",name:c,onChange:n,inputMode:b,value:o,disabled:f,"data-v-6272e6eb":""}):Object(s.jsx)("input",{className:"group-input",type:u,name:c,onChange:n,inputMode:b,value:o,disabled:f,"data-v-6272e6eb":""}),l&&i?Object(s.jsx)("div",{className:"group-input-action",onClick:l,"data-v-6272e6eb":"",children:Object(s.jsx)("i",{className:d()(Object(t.a)({"group-input-action-icon":!0,fas:!0},i,!0)),onClick:l,"data-v-6272e6eb":""})}):null]})]})}},445:function(a,e,c){"use strict";var t=c(3),n=c(74),d=c.n(n),s=(c(446),c(41)),l=c(46),i=c(77),o=c(442),r=c(13),b=c(4);e.a=function(a){var e=a.pageTitle,c=a.absolute,n=void 0!==c&&c,v=a.solid,u=void 0!==v&&v,j=a.enableBackButton,O=void 0!==j&&j,m=a.onHeight,h=void 0===m?l.a:m,f=Object(s.b)(),p=Object(t.useCallback)((function(){window.history.back()}),[]),x=Object(t.useCallback)((function(){f(Object(i.c)())}),[f]),N=Object(r.useSelector)((function(a){return a.node.publicKey})),g=Object(t.useCallback)((function(a){if(a)try{h(a.getBoundingClientRect().height)}catch(e){console.log("Error inside onHeight mechanism in MainNav:"),console.log(e)}}),[h]);return Object(b.jsxs)("div",{className:d()({"main-nav-container":!0,"main-nav-absolute":n,"main-nav-solid":u}),ref:g,"data-v-f82c4bad":"",children:[O?Object(b.jsx)("div",{className:"main-nav-back",onClick:p,"data-v-f82c4bad":"",children:Object(b.jsx)("i",{className:"icon icon-thin-back","data-v-f82c4bad":""})}):Object(b.jsx)(o.a,{height:40,publicKey:N,"data-v-f82c4bad":""}),Object(b.jsx)("p",{className:"main-nav-title unselectable","data-v-f82c4bad":"",children:e}),Object(b.jsxs)("div",{className:"main-nav-menu-btn",onClick:x,"data-v-f82c4bad":"",children:[Object(b.jsx)("div",{className:"main-nav-menu-dash","data-v-f82c4bad":""}),Object(b.jsx)("div",{className:"main-nav-menu-dash","data-v-f82c4bad":""}),Object(b.jsx)("div",{className:"main-nav-menu-dash","data-v-f82c4bad":""})]})]})}},446:function(a,e,c){},447:function(a,e,c){},448:function(a,e,c){},449:function(a,e,c){},450:function(a,e,c){},456:function(a,e,c){"use strict";c.d(e,"b",(function(){return o})),c.d(e,"a",(function(){return r}));var t=c(12),n=c(154),d=c.n(n),s=/(\d+)(\d{3})/gi,l=1e8,i=function a(e){return s.test(e)?a(e.replace(s,"$1,$2")):e},o=function(){var a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=a.split("."),c=Object(t.a)(e,2),n=c[0],d=c[1],s=i(n),l=d?"."+d:"";return s+l},r=function(a){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"0",c=d()(a).div(l).toString();return d()((null===e||void 0===e?void 0:e.toString())||"0").times(c)}},457:function(a,e,c){"use strict";var t=c(12),n=c(3),d=c(74),s=c.n(d),l=(c(458),c(4));e.a=function(a){var e=a.label,c=void 0===e?null:e,d=a.icon,i=void 0===d?null:d,o=a.iconURL,r=void 0===o?null:o,b=a.onClick,v=void 0===b?void 0:b,u=a.nestedMode,j=void 0!==u&&u,O=a.large,m=void 0!==O&&O,h=a.small,f=void 0!==h&&h,p=a.relative,x=void 0!==p&&p,N=a.children,g=void 0===N?null:N,k=a.style,y=void 0===k?{}:k,C=Object(n.useState)(!1),S=Object(t.a)(C,2),_=S[0],M=S[1],w=Object(n.useCallback)((function(){j&&M(!_)}),[_,j]),D=Object(n.useMemo)((function(){return r?Object(l.jsx)("img",{src:r,className:"add-btn-icon",alt:"","data-v-0a6a09c4":""}):Object(l.jsx)("i",{className:"fas fa-".concat(null!==i&&void 0!==i?i:"plus"),"data-v-0a6a09c4":""})}),[i,r]),E=Object(n.useMemo)((function(){return c?Object(l.jsx)("p",{className:"add-btn-label","data-v-0a6a09c4":"",children:c}):null}),[c]);return Object(l.jsxs)("div",{className:s()({"add-btn-container":!0,"add-btn-round-container":!c,"add-btn-large":m,"add-btn-small":f}),"data-v-0a6a09c4":"",children:[Object(l.jsxs)("div",{className:s()({"add-btn":!0,"add-btn-round":!c,"add-btn-extended":!!c,"add-btn-relative":x,"add-btn-open":_,"add-btn-nested":j}),onClick:null!==v&&void 0!==v?v:w,style:y,"data-v-0a6a09c4":"",children:[D,E]}),g?Object(l.jsx)("div",{className:s()({"add-btn-options":!0,"add-btn-options-open":_}),"data-v-0a6a09c4":"",children:g}):null]})}},458:function(a,e,c){},571:function(a,e,c){},572:function(a,e,c){},573:function(a,e,c){},574:function(a,e,c){},575:function(a,e,c){},576:function(a,e,c){},719:function(a,e,c){"use strict";c.r(e);var t=c(12),n=c(3),d=c(41),s=c(74),l=c.n(s),i=c(30),o=c(456),r=c(445),b=c(457),v=c(110),u=(c(571),c(4)),j=function(a){var e=a.hash,c=a.value,t=a.date,n=a.unconfirmed,s=Object(d.c)((function(a){var e;return null!==(e=a.wallet.USDRate)&&void 0!==e?e:"0"})),l=c.replace(/,/g,""),i=Object(o.b)(Object(o.a)(l,s).toFixed(2)),r=t?v.DateTime.fromSeconds(parseInt(t,10)).toRelative():"unknown";return Object(u.jsxs)("div",{className:"advanced-transaction-container","data-v-7fd0d3ee":"",children:[Object(u.jsxs)("div",{className:"advanced-transaction-info","data-v-7fd0d3ee":"",children:[Object(u.jsx)("div",{className:"advanced-transaction-avatar","data-v-7fd0d3ee":""}),Object(u.jsxs)("div",{className:"advanced-transaction-author","data-v-7fd0d3ee":"",children:[Object(u.jsx)("p",{className:"advanced-transaction-author-name","data-v-7fd0d3ee":"",children:e}),Object(u.jsxs)("div",{style:{display:"flex"},"data-v-7fd0d3ee":"",children:[Object(u.jsx)("p",{className:"advanced-transaction-type","data-v-7fd0d3ee":"",children:"Payment"}),n&&Object(u.jsx)("i",{className:"far fa-clock",style:{marginLeft:"0.5rem",color:"red"},"data-v-7fd0d3ee":""})]})]})]}),Object(u.jsxs)("div",{className:"advanced-transaction-value-container","data-v-7fd0d3ee":"",children:[Object(u.jsx)("p",{className:"advanced-transaction-time","data-v-7fd0d3ee":"",children:r}),Object(u.jsx)("p",{className:"advanced-transaction-value","data-v-7fd0d3ee":"",children:c}),Object(u.jsxs)("p",{className:"advanced-transaction-usd","data-v-7fd0d3ee":"",children:[i," USD"]})]})]})},O=(c(572),function(a){var e=a.address,c=a.sendable,t=a.receivable,d=a.active,s=a.pendingStatus,i=void 0===s?"":s,r=Object(n.useMemo)((function(){return Object(o.b)(c)}),[c]),b=Object(n.useMemo)((function(){return Object(o.b)(t)}),[t]);return Object(u.jsxs)("div",{className:"advanced-channel-container","data-v-09281f57":"",children:[Object(u.jsxs)("div",{className:"advanced-channel-name-container","data-v-09281f57":"",children:[Object(u.jsx)("div",{className:l()({"advanced-channel-status":!0,"advanced-channel-status-offline":!d}),"data-v-09281f57":""}),Object(u.jsx)("p",{style:{marginLeft:"0.5rem"},"data-v-09281f57":"",children:i})]}),Object(u.jsxs)("p",{className:"advanced-channel-address","data-v-09281f57":"",children:["Address: ",e]}),Object(u.jsxs)("div",{className:"advanced-channel-capacity-container","data-v-09281f57":"",children:[Object(u.jsxs)("div",{className:"advanced-channel-capacity","data-v-09281f57":"",children:["Sendable: ",r," sats"]}),Object(u.jsxs)("div",{className:"advanced-channel-capacity","data-v-09281f57":"",children:["Receivable: ",b," sats"]})]})]})}),m=(c(573),function(a){var e=a.sent,c=a.received,t=a.address,n=a.publicKey,d=Object(o.b)(e.toString()),s=Object(o.b)(c.toString());return Object(u.jsxs)("div",{className:"advanced-transaction-container","data-v-bf48d65a":"",children:[Object(u.jsxs)("div",{className:"advanced-transaction-info","data-v-bf48d65a":"",children:[Object(u.jsx)("div",{className:"advanced-transaction-avatar","data-v-bf48d65a":""}),Object(u.jsxs)("div",{className:"advanced-transaction-author","data-v-bf48d65a":"",children:[Object(u.jsx)("p",{className:"advanced-peer-address","data-v-bf48d65a":"",children:t}),Object(u.jsx)("p",{className:"advanced-peer-public-key","data-v-bf48d65a":"",children:null!==n&&void 0!==n?n:"Unknown public key"})]})]}),Object(u.jsxs)("div",{className:"advanced-peer-value-container","data-v-bf48d65a":"",children:[Object(u.jsxs)("p",{className:"advanced-peer-value","data-v-bf48d65a":"",children:[Object(u.jsx)("span",{className:"peer-value-title","data-v-bf48d65a":"",children:"Sent:"})," ",d]}),Object(u.jsxs)("p",{className:"advanced-peer-value","data-v-bf48d65a":"",children:[Object(u.jsx)("span",{className:"peer-value-title","data-v-bf48d65a":"",children:"Received:"})," ",s]})]})]})}),h=c(2),f=c.n(h),p=c(6),x=c(439),N=c(443),g=(c(574),c(148)),k=function(a){var e=a.open,c=void 0!==e&&e,s=a.toggleModal,l=Object(d.b)(),o=Object(n.useState)(!1),r=Object(t.a)(o,2),b=r[0],v=r[1],j=Object(n.useState)(""),O=Object(t.a)(j,2),m=O[0],h=O[1],k=Object(n.useState)(""),y=Object(t.a)(k,2),C=y[0],S=y[1],_=Object(n.useState)(""),M=Object(t.a)(_,2),w=M[0],D=M[1],E=Object(n.useCallback)((function(a){var e=a.target,c=e.name,t=e.value;"publicKey"===c&&S(t),"host"===c&&h(t)}),[]),A=Object(n.useCallback)(function(){var a=Object(p.a)(f.a.mark((function a(e){var c;return f.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return e.preventDefault(),v(!0),a.prev=2,a.next=5,l(Object(i.c)({publicKey:C,host:m}));case 5:s(),a.next=11;break;case 8:a.prev=8,a.t0=a.catch(2),D(null!==(c=null===a.t0||void 0===a.t0?void 0:a.t0.errorMessage)&&void 0!==c?c:null===a.t0||void 0===a.t0?void 0:a.t0.message);case 11:return a.prev=11,v(!1),a.finish(11);case 14:case"end":return a.stop()}}),a,null,[[2,8,11,14]])})));return function(e){return a.apply(this,arguments)}}(),[l,C,m,s]);return Object(u.jsx)(x.a,{toggleModal:s,modalOpen:c,modalTitle:"ADD PEER","data-v-8f2f2217":"",children:Object(u.jsxs)("form",{className:"modal-form",onSubmit:A,"data-v-8f2f2217":"",children:[w?Object(u.jsx)("div",{className:"form-error","data-v-8f2f2217":"",children:w}):null,b?Object(u.jsx)(g.a,{overlay:!0,text:"Adding Peer...","data-v-8f2f2217":""}):null,Object(u.jsx)(N.a,{onChange:E,name:"publicKey",label:"Public Key",value:C,small:!0,"data-v-8f2f2217":""}),Object(u.jsx)(N.a,{onChange:E,name:"host",label:"Host IP",value:m,small:!0,"data-v-8f2f2217":""}),Object(u.jsx)("div",{className:"modal-submit-container","data-v-8f2f2217":"",children:Object(u.jsx)("button",{className:"modal-submit-btn",type:"submit","data-v-8f2f2217":"",children:"ADD PEER"})})]})})},y=(c(575),c(88)),C=function(a){var e=a.open,c=void 0!==e&&e,s=a.toggleModal,l=Object(d.b)(),o=Object(n.useState)(!1),r=Object(t.a)(o,2),b=r[0],v=r[1],j=Object(n.useState)(""),O=Object(t.a)(j,2),m=O[0],h=O[1],k=Object(n.useState)(""),C=Object(t.a)(k,2),S=C[0],_=C[1],M=Object(n.useState)(""),w=Object(t.a)(M,2),D=w[0],E=w[1],A=Object(n.useState)(""),P=Object(t.a)(A,2),K=P[0],R=P[1],B=Object(n.useCallback)((function(a){var e=a.target,c=e.name,t=e.value;"publicKey"===c&&E(t),"pushAmount"===c&&_(t),"channelCapacity"===c&&h(t)}),[]),T=Object(n.useCallback)(function(){var a=Object(p.a)(f.a.mark((function a(e){var c;return f.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return e.preventDefault(),v(!0),a.prev=2,a.next=5,l(Object(y.b)());case 5:return a.next=7,l(Object(i.k)({publicKey:D,channelCapacity:m,pushAmount:S}));case 7:s(),a.next=13;break;case 10:a.prev=10,a.t0=a.catch(2),R(null!==(c=null===a.t0||void 0===a.t0?void 0:a.t0.errorMessage)&&void 0!==c?c:null===a.t0||void 0===a.t0?void 0:a.t0.message);case 13:return a.prev=13,v(!1),a.finish(13);case 16:case"end":return a.stop()}}),a,null,[[2,10,13,16]])})));return function(e){return a.apply(this,arguments)}}(),[l,D,m,S,s]);return Object(u.jsx)(x.a,{toggleModal:s,modalOpen:c,modalTitle:"OPEN CHANNEL","data-v-d67c1cb0":"",children:Object(u.jsxs)("form",{className:"modal-form",onSubmit:T,"data-v-d67c1cb0":"",children:[K?Object(u.jsx)("div",{className:"form-error","data-v-d67c1cb0":"",children:K}):null,b?Object(u.jsx)(g.a,{overlay:!0,text:"Adding Peer...","data-v-d67c1cb0":""}):null,Object(u.jsx)(N.a,{onChange:B,name:"publicKey",label:"Node Public Key",value:D,small:!0,"data-v-d67c1cb0":""}),Object(u.jsx)(N.a,{onChange:B,name:"channelCapacity",label:"Channel Capacity (sats)",value:m,inputMode:"number",small:!0,"data-v-d67c1cb0":""}),Object(u.jsx)(N.a,{onChange:B,name:"pushAmount",label:"Push Amount (sats)",value:S,inputMode:"number",small:!0,"data-v-d67c1cb0":""}),Object(u.jsx)("div",{className:"modal-submit-container","data-v-d67c1cb0":"",children:Object(u.jsx)("button",{className:"modal-submit-btn",type:"submit","data-v-d67c1cb0":"",children:"OPEN CHANNEL"})})]})})},S=c(16),_=c(13);c(576),e.default=function(){var a=Object(n.useState)("transactions"),e=Object(t.a)(a,2),c=e[0],s=e[1],v=Object(n.useState)(1),h=Object(t.a)(v,1)[0],f=Object(n.useState)(!1),p=Object(t.a)(f,2),x=p[0],N=p[1],g=Object(n.useState)(!1),y=Object(t.a)(g,2),M=y[0],w=y[1],D=Object(n.useState)([]),E=Object(t.a)(D,2),A=E[0],P=E[1],K=Object(d.b)(),R=_.useSelector((function(a){return a.wallet.confirmedBalance})),B=_.useSelector((function(a){return a.wallet.channelBalance})),T=_.useSelector((function(a){return a.wallet.transactions})),U=_.useSelector((function(a){return a.wallet.channels})),H=_.useSelector((function(a){return a.wallet.peers})),L=_.useSelector((function(a){return a.wallet.USDRate}));Object(n.useEffect)((function(){var a=1===h;K(Object(i.g)({page:h,reset:a})),K(Object(i.e)({page:h,reset:a})),K(Object(i.d)()),K(Object(i.f)())}),[h,K]),Object(n.useEffect)((function(){S.a.get("/api/lnd/pendingchannels").then((function(a){var e=a.data;console.log("pending channels:"),console.log(e);var c=function(a,e){return{remote_pubkey:a.remote_node_pub,remote_balance:a.remote_balance,local_balance:a.local_balance,ip:"",active:!1,pendingStatus:e}},t=[];e.pending_open_channels.forEach((function(a){var e=a.channel;t.push(c(e,"Pending Open"))})),e.waiting_close_channels.forEach((function(a){var e=a.channel;t.push(c(e,"Pending Close"))})),e.pending_force_closing_channels.forEach((function(a){var e=a.channel;t.push(c(e,"Pending Force Close"))})),P(t)}))}),[]);var F=Object(n.useMemo)((function(){return Object(o.b)(Object(o.a)(R,L).toFixed(2))}),[L,R]),I=Object(n.useMemo)((function(){return Object(o.b)(Object(o.a)(B,L).toFixed(2))}),[L,B]),J=Object(n.useCallback)((function(a){s(a)}),[]),$=Object(n.useCallback)((function(){N(!x)}),[x]),V=Object(n.useCallback)((function(){w(!M)}),[M]),q=Object(n.useCallback)((function(){J("transactions")}),[J]),z=Object(n.useCallback)((function(){J("peers")}),[J]),G=Object(n.useCallback)((function(){J("channels")}),[J]);return Object(u.jsxs)("div",{className:"page-container advanced-page","data-v-22152e4c":"",children:[Object(u.jsxs)("div",{className:"advanced-header","data-v-22152e4c":"",children:[Object(u.jsx)(r.a,{absolute:!0,pageTitle:"ADVANCED",enableBackButton:!1,"data-v-22152e4c":""}),Object(u.jsxs)("div",{className:"advanced-balance-container","data-v-22152e4c":"",children:[Object(u.jsx)("div",{className:"advanced-balance-icon-container","data-v-22152e4c":"",children:Object(u.jsx)("i",{className:"advanced-balance-icon fas fa-link","data-v-22152e4c":""})}),Object(u.jsxs)("div",{className:"advanced-balance-btc-container","data-v-22152e4c":"",children:[Object(u.jsx)("p",{className:"advanced-balance-btc","data-v-22152e4c":"",children:Object(o.b)(R)}),Object(u.jsxs)("p",{className:"advanced-balance-usd","data-v-22152e4c":"",children:[F," USD"]})]})]}),Object(u.jsxs)("div",{className:"advanced-balance-container",style:{paddingBottom:25},"data-v-22152e4c":"",children:[Object(u.jsx)("div",{className:"advanced-balance-icon-container","data-v-22152e4c":"",children:Object(u.jsx)("i",{className:"advanced-balance-icon fas fa-bolt","data-v-22152e4c":""})}),Object(u.jsxs)("div",{className:"advanced-balance-btc-container","data-v-22152e4c":"",children:[Object(u.jsx)("p",{className:"advanced-balance-btc","data-v-22152e4c":"",children:Object(o.b)(B)}),Object(u.jsxs)("p",{className:"advanced-balance-usd","data-v-22152e4c":"",children:[I," USD"]})]})]})]}),Object(u.jsxs)("div",{className:"advanced-accordions-container","data-v-22152e4c":"",children:[Object(u.jsxs)("div",{className:l()({"advanced-accordion-container":!0,"accordion-open":"transactions"===c}),"data-v-22152e4c":"",children:[Object(u.jsx)("div",{className:"advanced-accordion-header",onClick:q,"data-v-22152e4c":"",children:Object(u.jsx)("p",{className:"advanced-accordion-title","data-v-22152e4c":"",children:"Transactions"})}),Object(u.jsx)("div",{className:"advanced-accordion-content-container","data-v-22152e4c":"",children:Object(u.jsx)("div",{className:"advanced-accordion-content","data-v-22152e4c":"",children:T.content.map((function(a){return Object(u.jsx)(j,{date:a.time_stamp,hash:a.tx_hash,value:Object(o.b)(a.amount),unconfirmed:0===a.num_confirmations,"data-v-22152e4c":""},a.tx_hash)}))})})]}),Object(u.jsxs)("div",{className:l()({"advanced-accordion-container":!0,"accordion-open":"peers"===c}),"data-v-22152e4c":"",children:[Object(u.jsx)("div",{className:"advanced-accordion-header",onClick:z,"data-v-22152e4c":"",children:Object(u.jsx)("p",{className:"advanced-accordion-title","data-v-22152e4c":"",children:"Peers"})}),Object(u.jsxs)("div",{className:"advanced-accordion-content-container","data-v-22152e4c":"",children:[Object(u.jsx)("div",{className:"advanced-accordion-content","data-v-22152e4c":"",children:H.map((function(a){return Object(u.jsx)(m,{address:a.address,publicKey:a.pub_key,sent:a.sat_sent,received:a.sat_recv,"data-v-22152e4c":""},a.address+a.pub_key)}))}),Object(u.jsx)(b.a,{nestedMode:!0,relative:!0,"data-v-22152e4c":"",children:Object(u.jsx)(b.a,{label:"ADD PEER",onClick:$,icon:"link","data-v-22152e4c":""})})]})]}),Object(u.jsxs)("div",{className:l()({"advanced-accordion-container":!0,"accordion-open":"channels"===c}),"data-v-22152e4c":"",children:[Object(u.jsx)("div",{className:"advanced-accordion-header",onClick:G,"data-v-22152e4c":"",children:Object(u.jsx)("p",{className:"advanced-accordion-title","data-v-22152e4c":"",children:"Channels"})}),Object(u.jsx)("div",{className:"advanced-accordion-content-container","data-v-22152e4c":"",children:Object(u.jsxs)("div",{className:"advanced-accordion-content","data-v-22152e4c":"",children:[U.map((function(a){return Object(u.jsx)(O,{address:a.remote_pubkey,receivable:a.remote_balance,sendable:a.local_balance,active:a.active,"data-v-22152e4c":""},a.chan_id)})),A.map((function(a){return Object(u.jsx)(O,{address:a.remote_pubkey,receivable:a.remote_balance,sendable:a.local_balance,active:a.active,pendingStatus:a.pendingStatus,"data-v-22152e4c":""},a.chan_id)})),Object(u.jsx)(b.a,{nestedMode:!0,relative:!0,"data-v-22152e4c":"",children:Object(u.jsx)(b.a,{label:"ADD CHANNEL",small:!0,onClick:V,icon:"exchange-alt","data-v-22152e4c":""})})]})})]})]}),Object(u.jsx)(k,{open:x,toggleModal:$,"data-v-22152e4c":""}),Object(u.jsx)(C,{open:M,toggleModal:V,"data-v-22152e4c":""})]})}}}]);
//# sourceMappingURL=16.f71e7080.chunk.js.map