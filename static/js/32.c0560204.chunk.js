(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[32],{603:function(e,a,c){"use strict";var t=c(0),n=c(84),i=c.n(n),s=(c(604),c(37)),d=c(8),l=c(87),o=c(594),b=c(20),r=c(4);a.a=function(e){var a=e.pageTitle,c=e.absolute,n=void 0!==c&&c,u=e.solid,j=void 0!==u&&u,f=e.enableBackButton,v=void 0!==f&&f,h=e.onHeight,O=void 0===h?d.b:h,p=Object(s.b)(),m=Object(t.useCallback)((function(){window.history.back()}),[]),k=Object(t.useCallback)((function(){p(Object(l.c)())}),[p]),x=Object(b.useSelector)((function(e){return e.node.publicKey})),g=Object(t.useCallback)((function(e){if(e)try{O(e.getBoundingClientRect().height)}catch(a){console.log("Error inside onHeight mechanism in MainNav:"),console.log(a)}}),[O]);return Object(r.jsxs)("div",{className:i()({"main-nav-container":!0,"main-nav-absolute":n,"main-nav-solid":j}),ref:g,"data-v-5ce4274c":"",children:[v?Object(r.jsx)("div",{className:"main-nav-back",onClick:m,"data-v-5ce4274c":"",children:Object(r.jsx)("i",{className:"icon icon-thin-back","data-v-5ce4274c":""})}):Object(r.jsx)(o.a,{height:40,publicKey:x,"data-v-5ce4274c":""}),Object(r.jsx)("p",{className:"main-nav-title unselectable","data-v-5ce4274c":"",children:a}),Object(r.jsxs)("div",{className:"main-nav-menu-btn",onClick:k,"data-v-5ce4274c":"",children:[Object(r.jsx)("div",{className:"main-nav-menu-dash","data-v-5ce4274c":""}),Object(r.jsx)("div",{className:"main-nav-menu-dash","data-v-5ce4274c":""}),Object(r.jsx)("div",{className:"main-nav-menu-dash","data-v-5ce4274c":""})]})]})}},604:function(e,a,c){},874:function(e,a,c){},884:function(e,a,c){"use strict";c.r(a);var t=c(17),n=c(0),i=c(603),s=(c(874),c(23)),d=c(20),l=c(4);a.default=function(){var e=Object(n.useState)(""),a=Object(t.a)(e,2),c=a[0],o=a[1],b=Object(n.useState)(null),r=Object(t.a)(b,2),u=r[0],j=r[1],f=Object(n.useState)(!1),v=Object(t.a)(f,2),h=v[0],O=v[1],p=d.useSelector((function(e){return e.wallet.lightningInfo})).identity_pubkey,m=d.useSelector((function(e){return e.node.publicKey}));Object(n.useEffect)((function(){s.a.get("/api/gun/user/once/seedBackup",{headers:{"public-key-for-decryption":m}}).then((function(e){var a=e.data.data;o(a)}))}),[]),Object(n.useEffect)((function(){s.a.get("/api/gun/user/once/channelsBackup",{headers:{"public-key-for-decryption":m}}).then((function(e){var a=e.data.data;j(a)}))}),[]);var k=Object(n.useCallback)((function(){navigator.clipboard.writeText(JSON.stringify(u)),O(!0)}),[u]);return Object(l.jsxs)("div",{className:"moonPayContainer","data-v-227f59f1":"",children:[Object(l.jsx)(i.a,{pageTitle:"BACKUPS",enableBackButton:!0,"data-v-227f59f1":""}),Object(l.jsxs)("div",{className:"backupsContainer","data-v-227f59f1":"",children:[Object(l.jsxs)("div",{className:"innerContainer","data-v-227f59f1":"",children:[Object(l.jsx)("h1",{"data-v-227f59f1":"",children:"Lightning Public Key"}),Object(l.jsx)("h3",{"data-v-227f59f1":"",children:p})]}),Object(l.jsxs)("div",{className:"innerContainer","data-v-227f59f1":"",children:[Object(l.jsx)("h1",{"data-v-227f59f1":"",children:"Seed Backup"}),c&&Object(l.jsx)("h3",{"data-v-227f59f1":"",children:c}),!c&&Object(l.jsx)("h3",{"data-v-227f59f1":"",children:"backup not available on this node"})]}),Object(l.jsxs)("div",{className:"innerContainer","data-v-227f59f1":"",children:[Object(l.jsx)("h2",{"data-v-227f59f1":"",children:"Channels Backups"}),u&&Object(l.jsxs)("div",{className:"copyContainer","data-v-227f59f1":"",children:[Object(l.jsx)("p",{"data-v-227f59f1":"",children:"copy channel backups: "}),h&&Object(l.jsx)("i",{className:"fas fa-check",onClick:k,"data-v-227f59f1":""}),!h&&Object(l.jsx)("i",{className:"fas fa-copy",onClick:k,"data-v-227f59f1":""})]}),!u&&Object(l.jsx)("h3",{"data-v-227f59f1":"",children:"backup not available on this node"})]})]})]})}}}]);
//# sourceMappingURL=32.c0560204.chunk.js.map