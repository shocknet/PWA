(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[31],{759:function(e,a,t){},760:function(e,a,t){},761:function(e,a,t){},896:function(e,a,t){"use strict";t.r(a);var c=t(17),n=t(0),s=t(84),r=t.n(s),i=t(631),l=(t(759),t(595)),d=(t(760),t(4)),o=function(e){var a=e.onInputChange,t=e.amount,c=e.description;return Object(d.jsxs)("div",{className:"container","data-v-cc5bfb03":"",children:[Object(d.jsxs)("div",{className:"inputs-group","data-v-cc5bfb03":"",children:[Object(d.jsx)(l.a,{name:"amount",label:"Enter Amount",onChange:a,value:t,inputMode:"decimal","data-v-cc5bfb03":""}),Object(d.jsxs)("select",{name:"unit",className:"unit-dropdown",onChange:a,"data-v-cc5bfb03":"",children:[Object(d.jsx)("option",{value:"sats","data-v-cc5bfb03":"",children:"Sats"}),Object(d.jsx)("option",{value:"msats","data-v-cc5bfb03":"",children:"mSats"}),Object(d.jsx)("option",{value:"btc","data-v-cc5bfb03":"",children:"BTC"})]})]}),Object(d.jsx)(l.a,{name:"description",label:"Description",element:"textarea",onChange:a,value:c,"data-v-cc5bfb03":""})]})},b=t(3),j=t.n(b),u=t(6),v=t(24),p=t(639),O=t.n(p),f=t(37),h=t(177),m=t(719),x=t(25),g=(t(761),t(645)),k=t(718),N=(t(47),t(591)),C=function(e){var a=e.amount,t=void 0===a?0:a,s=e.description,i=void 0===s?"N/A":s,l=e.unit,o=void 0===l?"":l,b=e.prevStep,p=Object(f.b)(),C=Object(v.g)(),w=Object(n.useState)(""),y=Object(c.a)(w,2),S=y[0],A=y[1],E=Object(n.useState)(""),T=Object(c.a)(E,2),D=T[0],I=T[1],M=Object(n.useState)(!1),q=Object(c.a)(M,2),R=q[0],F=q[1],J=Object(n.useState)(!1),L=Object(c.a)(J,2),U=L[0],z=L[1],B=Object(n.useState)(),Q=Object(c.a)(B,2),W=Q[0],_=Q[1],G=Object(n.useState)(""),H=Object(c.a)(G,2),K=H[0],P=H[1],V=Object(n.useState)(!1),X=Object(c.a)(V,2),Y=X[0],Z=X[1],$=Object(n.useCallback)(Object(u.a)(j.a.mark((function e(){var a,c,n,s;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,F(!0),e.next=4,x.a.post("/api/lnd/addinvoice",{value:t,memo:i,expiry:100});case 4:a=e.sent,c=a.data,A(c.payment_request),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),P(null!==(n=null===e.t0||void 0===e.t0||null===(s=e.t0.response)||void 0===s?void 0:s.data.errorMessage)&&void 0!==n?n:"An unknown error has occurred");case 12:return e.prev=12,F(!1),e.finish(12);case 15:case"end":return e.stop()}}),e,null,[[0,9,12,15]])}))),[t,i]),ee=Object(n.useCallback)(Object(u.a)(j.a.mark((function e(){var a,t,c,n;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,F(!0),e.next=4,x.a.post("/api/lnd/newaddress",{type:"p2wkh"});case 4:a=e.sent,t=a.data,I(t.address),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),P(null!==(c=null===e.t0||void 0===e.t0||null===(n=e.t0.response)||void 0===n?void 0:n.data.errorMessage)&&void 0!==c?c:"An unknown error has occurred");case 12:return e.prev=12,F(!1),e.finish(12);case 15:case"end":return e.stop()}}),e,null,[[0,9,12,15]])}))),[]),ae=Object(n.useCallback)(function(){var e=Object(u.a)(j.a.mark((function e(a){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:_(a);case 1:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}(),[]);Object(n.useEffect)((function(){Y?$():ee()}),[$,ee,Y]);var te=Object(n.useCallback)((function(){Z(!Y)}),[Y]),ce=Object(n.useRef)(),ne=Object(n.useCallback)((function(){try{var e=Y?S:D;if(navigator.clipboard)navigator.clipboard.writeText(e);else{var a=ce.current;if(!a)throw new ReferenceError("When trying to access the ref for the placeholder input to copy, the ref was null.");a.style.display="block",a.select(),document.execCommand("copy"),a.blur(),a.style.display="none"}}catch(t){console.error(t),P(t.message)}}),[Y,S,D]),se=Object(n.useCallback)(Object(u.a)(j.a.mark((function e(){var a,t,c;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(W)try{z(!0),z(!1),C.push("/overview")}catch(n){P(null!==(a=null!==(t=null===n||void 0===n||null===(c=n.response)||void 0===c?void 0:c.data.errorMessage)&&void 0!==t?t:null===n||void 0===n?void 0:n.message)&&void 0!==a?a:"An unknown error has occurred"),z(!1)}case 1:case"end":return e.stop()}}),e)}))),[W,S,p,C]);return Object(d.jsxs)("div",{className:"container","data-v-910f3351":"",children:[U?Object(d.jsx)(h.a,{overlay:!0,text:"Sending Invoice...","data-v-910f3351":""}):null,Y?W?Object(d.jsx)(g.a,{selected:!0,contact:W,selectContact:ae,"data-v-910f3351":""}):Object(d.jsx)(k.a,{selectContact:ae,features:["contact"],"data-v-910f3351":""}):null,Object(d.jsxs)("div",{className:"qr-code-container","data-v-910f3351":"",children:[Object(d.jsx)("div",{className:"qr-code","data-v-910f3351":"",children:R?Object(d.jsx)(h.a,{overlay:!0,small:!0,text:"","data-v-910f3351":""}):Object(d.jsx)(O.a,{value:Y?S:D,size:180,fgColor:Y?"#f5a623":"#4285b9",bgColor:"#001220","data-v-910f3351":""})}),Object(d.jsxs)("div",{className:r()({mode:!0,"lightning-active":Y}),onClick:te,"data-v-910f3351":"",children:[Object(d.jsx)("p",{className:"switch-name on-chain-switch","data-v-910f3351":"",children:"On-Chain"}),Object(d.jsx)("div",{className:"switch","data-v-910f3351":"",children:Object(d.jsx)("div",{className:"switch-handle","data-v-910f3351":""})}),Object(d.jsx)("p",{className:"switch-name lightning-switch","data-v-910f3351":"",children:"Lightning"})]})]}),Object(d.jsxs)("div",{className:"copy-clipboard-btn",onClick:ne,"data-v-910f3351":"",children:[Object(d.jsx)("i",{className:"fas fa-copy","data-v-910f3351":""}),Object(d.jsx)("p",{className:"copy-clipboard-btn-text","data-v-910f3351":"",children:"Copy to Clipboard"})]}),!navigator.clipboard&&Object(d.jsx)("input",{className:N.s,readOnly:!0,ref:ce,type:"text",value:Y?S:D,"data-v-910f3351":""}),K?Object(d.jsxs)(d.Fragment,{children:[Object(d.jsx)("span",{"data-v-910f3351":"",children:K}),Object(d.jsx)("br",{"data-v-910f3351":""}),Object(d.jsx)("span",{className:"inline-link",onClick:P.bind(null,""),"data-v-910f3351":"",children:"Dismiss"})]}):Object(d.jsxs)(d.Fragment,{children:[Object(d.jsxs)("div",{className:"details","data-v-910f3351":"",children:[Object(d.jsx)("p",{className:"details-change",onClick:b,"data-v-910f3351":"",children:"Change"}),Object(d.jsxs)("div",{className:"detail","data-v-910f3351":"",children:[Object(d.jsx)("p",{className:"detail-title","data-v-910f3351":"",children:"Amount"}),Object(d.jsxs)("p",{className:"detail-value","data-v-910f3351":"",children:[t," ",o.toUpperCase()]})]}),Object(d.jsxs)("div",{className:"detail","data-v-910f3351":"",children:[Object(d.jsx)("p",{className:"detail-title","data-v-910f3351":"",children:"Description"}),Object(d.jsx)("p",{className:"detail-value","data-v-910f3351":"",children:i})]})]}),Y&&W?Object(d.jsx)(m.a,{wrapperStyle:{padding:0,marginTop:23},slideText:"SLIDE TO SEND",onSuccess:se,"data-v-910f3351":""}):null]})]})},w=Array.from({length:2});a.default=function(){var e=Object(n.useState)(0),a=Object(c.a)(e,2),t=a[0],s=a[1],l=Object(n.useState)(""),b=Object(c.a)(l,2),j=b[0],u=b[1],v=Object(n.useState)(0),p=Object(c.a)(v,2),O=p[0],f=p[1],h=Object(n.useState)("sats"),m=Object(c.a)(h,2),x=m[0],g=m[1],k=Object(n.useCallback)((function(e){"amount"===e.target.name&&s(e.target.value),"description"===e.target.name&&u(e.target.value),"unit"===e.target.name&&g(e.target.value)}),[]),N=Object(n.useCallback)((function(){O<1&&f(O+1)}),[O]),y=Object(n.useCallback)((function(){O>0&&f(O-1)}),[O]),S=Object(n.useCallback)((function(){return 0===O?Object(d.jsx)(o,{amount:t,description:j,onInputChange:k,"data-v-a44dc140":""}):1===O?Object(d.jsx)(C,{amount:t,description:j,unit:x,prevStep:y,"data-v-a44dc140":""}):void 0}),[O,t,j,k,y,x]),A=1===O;return Object(d.jsxs)(i.a,{title:"REQUEST","data-v-a44dc140":"",children:[S(),Object(d.jsxs)("div",{className:"footer","data-v-a44dc140":"",children:[A?null:Object(d.jsxs)("div",{className:"controls","data-v-a44dc140":"",children:[Object(d.jsx)("div",{className:"control",onClick:N,"data-v-a44dc140":"",children:"Skip"}),Object(d.jsx)("div",{className:"control next",onClick:N,"data-v-a44dc140":"",children:"Next"})]}),Object(d.jsx)("div",{className:"indicators","data-v-a44dc140":"",children:w.map((function(e,a){return Object(d.jsx)("div",{className:r()({indicator:!0,"indicator-active":a===O}),"data-v-a44dc140":""},a)}))})]})]})}}}]);
//# sourceMappingURL=31.dc14bcf7.chunk.js.map