(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[28],{445:function(a,e,t){"use strict";var n=t(3),c=t(74),d=t.n(c),i=(t(446),t(41)),s=t(46),l=t(77),o=t(442),b=t(13),r=t(4);e.a=function(a){var e=a.pageTitle,t=a.absolute,c=void 0!==t&&t,u=a.solid,j=void 0!==u&&u,v=a.enableBackButton,h=void 0!==v&&v,f=a.onHeight,O=void 0===f?s.a:f,p=Object(i.b)(),m=Object(n.useCallback)((function(){window.history.back()}),[]),k=Object(n.useCallback)((function(){p(Object(l.c)())}),[p]),x=Object(b.useSelector)((function(a){return a.node.publicKey})),g=Object(n.useCallback)((function(a){if(a)try{O(a.getBoundingClientRect().height)}catch(e){console.log("Error inside onHeight mechanism in MainNav:"),console.log(e)}}),[O]);return Object(r.jsxs)("div",{className:d()({"main-nav-container":!0,"main-nav-absolute":c,"main-nav-solid":j}),ref:g,"data-v-6a91f0fd":"",children:[h?Object(r.jsx)("div",{className:"main-nav-back",onClick:m,"data-v-6a91f0fd":"",children:Object(r.jsx)("i",{className:"icon icon-thin-back","data-v-6a91f0fd":""})}):Object(r.jsx)(o.a,{height:40,publicKey:x,"data-v-6a91f0fd":""}),Object(r.jsx)("p",{className:"main-nav-title unselectable","data-v-6a91f0fd":"",children:e}),Object(r.jsxs)("div",{className:"main-nav-menu-btn",onClick:k,"data-v-6a91f0fd":"",children:[Object(r.jsx)("div",{className:"main-nav-menu-dash","data-v-6a91f0fd":""}),Object(r.jsx)("div",{className:"main-nav-menu-dash","data-v-6a91f0fd":""}),Object(r.jsx)("div",{className:"main-nav-menu-dash","data-v-6a91f0fd":""})]})]})}},446:function(a,e,t){},699:function(a,e,t){},715:function(a,e,t){"use strict";t.r(e);var n=t(12),c=t(3),d=t(445),i=(t(699),t(16)),s=t(13),l=t(4);e.default=function(){var a=Object(c.useState)(""),e=Object(n.a)(a,2),t=e[0],o=e[1],b=Object(c.useState)(null),r=Object(n.a)(b,2),u=r[0],j=r[1],v=Object(c.useState)(!1),h=Object(n.a)(v,2),f=h[0],O=h[1],p=s.useSelector((function(a){return a.wallet.lightningInfo})).identity_pubkey,m=s.useSelector((function(a){return a.node.publicKey}));Object(c.useEffect)((function(){i.a.get("/api/gun/user/once/seedBackup",{headers:{"public-key-for-decryption":m}}).then((function(a){var e=a.data.data;o(e)}))}),[]),Object(c.useEffect)((function(){i.a.get("/api/gun/user/once/channelsBackup",{headers:{"public-key-for-decryption":m}}).then((function(a){var e=a.data.data;j(e)}))}),[]);var k=Object(c.useCallback)((function(){navigator.clipboard.writeText(JSON.stringify(u)),O(!0)}),[u]);return Object(l.jsxs)("div",{className:"moonPayContainer","data-v-d82208d3":"",children:[Object(l.jsx)(d.a,{pageTitle:"BACKUPS",enableBackButton:!0,"data-v-d82208d3":""}),Object(l.jsxs)("div",{className:"backupsContainer","data-v-d82208d3":"",children:[Object(l.jsxs)("div",{className:"innerContainer","data-v-d82208d3":"",children:[Object(l.jsx)("h1",{"data-v-d82208d3":"",children:"Lightning Public Key"}),Object(l.jsx)("h3",{"data-v-d82208d3":"",children:p})]}),Object(l.jsxs)("div",{className:"innerContainer","data-v-d82208d3":"",children:[Object(l.jsx)("h1",{"data-v-d82208d3":"",children:"Seed Backup"}),t&&Object(l.jsx)("h3",{"data-v-d82208d3":"",children:t}),!t&&Object(l.jsx)("h3",{"data-v-d82208d3":"",children:"backup not available on this node"})]}),Object(l.jsxs)("div",{className:"innerContainer","data-v-d82208d3":"",children:[Object(l.jsx)("h2",{"data-v-d82208d3":"",children:"Channels Backups"}),u&&Object(l.jsxs)("div",{className:"copyContainer","data-v-d82208d3":"",children:[Object(l.jsx)("p",{"data-v-d82208d3":"",children:"copy channel backups: "}),f&&Object(l.jsx)("i",{className:"fas fa-check",onClick:k,"data-v-d82208d3":""}),!f&&Object(l.jsx)("i",{className:"fas fa-copy",onClick:k,"data-v-d82208d3":""})]}),!u&&Object(l.jsx)("h3",{"data-v-d82208d3":"",children:"backup not available on this node"})]})]})]})}}}]);
//# sourceMappingURL=28.b52d0089.chunk.js.map