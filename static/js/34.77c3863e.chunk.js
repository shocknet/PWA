(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[34],{585:function(t,a,n){"use strict";var e=n(2),i=n(83),c=n.n(i),s=(n(586),n(47)),o=n(9),l=n(87),r=n(579),d=n(20),u=n(4);a.a=function(t){var a=t.pageTitle,n=t.absolute,i=void 0!==n&&n,b=t.solid,h=void 0!==b&&b,v=t.enableBackButton,j=void 0!==v&&v,f=t.onHeight,m=void 0===f?o.a:f,O=Object(s.b)(),p=Object(e.useCallback)((function(){window.history.back()}),[]),g=Object(e.useCallback)((function(){O(Object(l.c)())}),[O]),k=Object(d.useSelector)((function(t){return t.node.publicKey})),y=Object(e.useCallback)((function(t){if(t)try{m(t.getBoundingClientRect().height)}catch(a){console.log("Error inside onHeight mechanism in MainNav:"),console.log(a)}}),[m]);return Object(u.jsxs)("div",{className:c()({"main-nav-container":!0,"main-nav-absolute":i,"main-nav-solid":h}),ref:y,"data-v-6024f743":"",children:[j?Object(u.jsx)("div",{className:"main-nav-back",onClick:p,"data-v-6024f743":"",children:Object(u.jsx)("i",{className:"icon icon-thin-back","data-v-6024f743":""})}):Object(u.jsx)(r.a,{height:40,publicKey:k,"data-v-6024f743":""}),Object(u.jsx)("p",{className:"main-nav-title unselectable","data-v-6024f743":"",children:a}),Object(u.jsxs)("div",{className:"main-nav-menu-btn",onClick:g,"data-v-6024f743":"",children:[Object(u.jsx)("div",{className:"main-nav-menu-dash","data-v-6024f743":""}),Object(u.jsx)("div",{className:"main-nav-menu-dash","data-v-6024f743":""}),Object(u.jsx)("div",{className:"main-nav-menu-dash","data-v-6024f743":""})]})]})}},586:function(t,a,n){},828:function(t,a,n){},871:function(t,a,n){"use strict";n.r(a);var e=n(16),i=n(2),c=n(585),s=(n(828),n(17)),o=n(4);a.default=function(){var t=Object(i.useState)(""),a=Object(e.a)(t,2),n=a[0],l=a[1];return Object(i.useEffect)((function(){s.a.post("/api/lnd/newaddress",{type:"p2wkh"}).then((function(t){var a=t.data,n="https://buy-staging.moonpay.io/?apiKey=".concat("pk_test_C8jSPDtsKQqXwP7nkScpqZI5tsaOiQPH","&currencyCode=btc&walletAddress=").concat(a.address);return fetch("https://moon-sign.shock.network/sign",{method:"post",headers:{"Content-type":"application/json"},body:JSON.stringify({originalUrl:n})})})).then((function(t){return t.json()})).then((function(t){t.urlWithSignature&&(l(t.urlWithSignature),console.log("MOONPAY SIGNATURE DONE"+t.urlWithSignature))})).catch((function(t){console.log("Error generating MoonPay signature"),console.log(t)}))}),[]),Object(o.jsxs)("div",{className:"moonPayContainer","data-v-09181774":"",children:[Object(o.jsx)(c.a,{pageTitle:"MOONPAY",enableBackButton:!0,"data-v-09181774":""}),Object(o.jsx)("iframe",{title:"moonpay-iframe",width:"100%",height:"100%",src:n,"data-v-09181774":""})]})}}}]);
//# sourceMappingURL=34.77c3863e.chunk.js.map