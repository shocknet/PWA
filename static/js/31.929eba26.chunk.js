(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[31],{758:function(a,e,t){},759:function(a,e,t){},760:function(a,e,t){},895:function(a,e,t){"use strict";t.r(e);var c=t(17),n=t(0),s=t(84),r=t.n(s),i=t(633),l=(t(758),t(595)),d=(t(759),t(4)),o=function(a){var e=a.onInputChange,t=a.amount,c=a.description;return Object(d.jsxs)("div",{className:"container","data-v-9bf2bfd4":"",children:[Object(d.jsxs)("div",{className:"inputs-group","data-v-9bf2bfd4":"",children:[Object(d.jsx)(l.a,{name:"amount",label:"Enter Amount",onChange:e,value:t,inputMode:"decimal","data-v-9bf2bfd4":""}),Object(d.jsxs)("select",{name:"unit",className:"unit-dropdown",onChange:e,"data-v-9bf2bfd4":"",children:[Object(d.jsx)("option",{value:"sats","data-v-9bf2bfd4":"",children:"Sats"}),Object(d.jsx)("option",{value:"msats","data-v-9bf2bfd4":"",children:"mSats"}),Object(d.jsx)("option",{value:"btc","data-v-9bf2bfd4":"",children:"BTC"})]})]}),Object(d.jsx)(l.a,{name:"description",label:"Description",element:"textarea",onChange:e,value:c,"data-v-9bf2bfd4":""})]})},b=t(3),j=t.n(b),u=t(6),v=t(24),p=t(664),O=t.n(p),h=t(37),m=t(177),x=t(718),f=t(25),g=(t(760),t(670)),k=t(717),N=(t(47),t(592)),C=function(a){var e=a.amount,t=void 0===e?0:e,s=a.description,i=void 0===s?"N/A":s,l=a.unit,o=void 0===l?"":l,b=a.prevStep,p=Object(h.b)(),C=Object(v.g)(),w=Object(n.useState)(""),y=Object(c.a)(w,2),S=y[0],A=y[1],E=Object(n.useState)(""),T=Object(c.a)(E,2),D=T[0],I=T[1],M=Object(n.useState)(!1),q=Object(c.a)(M,2),R=q[0],F=q[1],J=Object(n.useState)(!1),L=Object(c.a)(J,2),U=L[0],z=L[1],B=Object(n.useState)(),Q=Object(c.a)(B,2),W=Q[0],_=Q[1],G=Object(n.useState)(""),H=Object(c.a)(G,2),K=H[0],P=H[1],V=Object(n.useState)(!1),X=Object(c.a)(V,2),Y=X[0],Z=X[1],$=Object(n.useCallback)(Object(u.a)(j.a.mark((function a(){var e,c,n,s;return j.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,F(!0),a.next=4,f.a.post("/api/lnd/addinvoice",{value:t,memo:i,expiry:100});case 4:e=a.sent,c=e.data,A(c.payment_request),a.next=12;break;case 9:a.prev=9,a.t0=a.catch(0),P(null!==(n=null===a.t0||void 0===a.t0||null===(s=a.t0.response)||void 0===s?void 0:s.data.errorMessage)&&void 0!==n?n:"An unknown error has occurred");case 12:return a.prev=12,F(!1),a.finish(12);case 15:case"end":return a.stop()}}),a,null,[[0,9,12,15]])}))),[t,i]),aa=Object(n.useCallback)(Object(u.a)(j.a.mark((function a(){var e,t,c,n;return j.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,F(!0),a.next=4,f.a.post("/api/lnd/newaddress",{type:"p2wkh"});case 4:e=a.sent,t=e.data,I(t.address),a.next=12;break;case 9:a.prev=9,a.t0=a.catch(0),P(null!==(c=null===a.t0||void 0===a.t0||null===(n=a.t0.response)||void 0===n?void 0:n.data.errorMessage)&&void 0!==c?c:"An unknown error has occurred");case 12:return a.prev=12,F(!1),a.finish(12);case 15:case"end":return a.stop()}}),a,null,[[0,9,12,15]])}))),[]),ea=Object(n.useCallback)(function(){var a=Object(u.a)(j.a.mark((function a(e){return j.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:_(e);case 1:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}(),[]);Object(n.useEffect)((function(){Y?$():aa()}),[$,aa,Y]);var ta=Object(n.useCallback)((function(){Z(!Y)}),[Y]),ca=Object(n.useRef)(),na=Object(n.useCallback)((function(){try{var a=Y?S:D;if(navigator.clipboard)navigator.clipboard.writeText(a);else{var e=ca.current;if(!e)throw new ReferenceError("When trying to access the ref for the placeholder input to copy, the ref was null.");e.style.display="block",e.select(),document.execCommand("copy"),e.blur(),e.style.display="none"}}catch(t){console.error(t),P(t.message)}}),[Y,S,D]),sa=Object(n.useCallback)(Object(u.a)(j.a.mark((function a(){var e,t,c;return j.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(W)try{z(!0),z(!1),C.push("/overview")}catch(n){P(null!==(e=null!==(t=null===n||void 0===n||null===(c=n.response)||void 0===c?void 0:c.data.errorMessage)&&void 0!==t?t:null===n||void 0===n?void 0:n.message)&&void 0!==e?e:"An unknown error has occurred"),z(!1)}case 1:case"end":return a.stop()}}),a)}))),[W,S,p,C]);return Object(d.jsxs)("div",{className:"container","data-v-519a83c2":"",children:[U?Object(d.jsx)(m.a,{overlay:!0,text:"Sending Invoice...","data-v-519a83c2":""}):null,Y?W?Object(d.jsx)(g.a,{selected:!0,contact:W,selectContact:ea,"data-v-519a83c2":""}):Object(d.jsx)(k.a,{selectContact:ea,features:["contact"],"data-v-519a83c2":""}):null,Object(d.jsxs)("div",{className:"qr-code-container","data-v-519a83c2":"",children:[Object(d.jsx)("div",{className:"qr-code","data-v-519a83c2":"",children:R?Object(d.jsx)(m.a,{overlay:!0,small:!0,text:"","data-v-519a83c2":""}):Object(d.jsx)(O.a,{value:Y?S:D,size:180,fgColor:Y?"#f5a623":"#4285b9",bgColor:"#001220","data-v-519a83c2":""})}),Object(d.jsxs)("div",{className:r()({mode:!0,"lightning-active":Y}),onClick:ta,"data-v-519a83c2":"",children:[Object(d.jsx)("p",{className:"switch-name on-chain-switch","data-v-519a83c2":"",children:"On-Chain"}),Object(d.jsx)("div",{className:"switch","data-v-519a83c2":"",children:Object(d.jsx)("div",{className:"switch-handle","data-v-519a83c2":""})}),Object(d.jsx)("p",{className:"switch-name lightning-switch","data-v-519a83c2":"",children:"Lightning"})]})]}),Object(d.jsxs)("div",{className:"copy-clipboard-btn",onClick:na,"data-v-519a83c2":"",children:[Object(d.jsx)("i",{className:"fas fa-copy","data-v-519a83c2":""}),Object(d.jsx)("p",{className:"copy-clipboard-btn-text","data-v-519a83c2":"",children:"Copy to Clipboard"})]}),!navigator.clipboard&&Object(d.jsx)("input",{className:N.t,readOnly:!0,ref:ca,type:"text",value:Y?S:D,"data-v-519a83c2":""}),K?Object(d.jsxs)(d.Fragment,{children:[Object(d.jsx)("span",{"data-v-519a83c2":"",children:K}),Object(d.jsx)("br",{"data-v-519a83c2":""}),Object(d.jsx)("span",{className:"inline-link",onClick:P.bind(null,""),"data-v-519a83c2":"",children:"Dismiss"})]}):Object(d.jsxs)(d.Fragment,{children:[Object(d.jsxs)("div",{className:"details","data-v-519a83c2":"",children:[Object(d.jsx)("p",{className:"details-change",onClick:b,"data-v-519a83c2":"",children:"Change"}),Object(d.jsxs)("div",{className:"detail","data-v-519a83c2":"",children:[Object(d.jsx)("p",{className:"detail-title","data-v-519a83c2":"",children:"Amount"}),Object(d.jsxs)("p",{className:"detail-value","data-v-519a83c2":"",children:[t," ",o.toUpperCase()]})]}),Object(d.jsxs)("div",{className:"detail","data-v-519a83c2":"",children:[Object(d.jsx)("p",{className:"detail-title","data-v-519a83c2":"",children:"Description"}),Object(d.jsx)("p",{className:"detail-value","data-v-519a83c2":"",children:i})]})]}),Y&&W?Object(d.jsx)(x.a,{wrapperStyle:{padding:0,marginTop:23},slideText:"SLIDE TO SEND",onSuccess:sa,"data-v-519a83c2":""}):null]})]})},w=Array.from({length:2});e.default=function(){var a=Object(n.useState)(0),e=Object(c.a)(a,2),t=e[0],s=e[1],l=Object(n.useState)(""),b=Object(c.a)(l,2),j=b[0],u=b[1],v=Object(n.useState)(0),p=Object(c.a)(v,2),O=p[0],h=p[1],m=Object(n.useState)("sats"),x=Object(c.a)(m,2),f=x[0],g=x[1],k=Object(n.useCallback)((function(a){"amount"===a.target.name&&s(a.target.value),"description"===a.target.name&&u(a.target.value),"unit"===a.target.name&&g(a.target.value)}),[]),N=Object(n.useCallback)((function(){O<1&&h(O+1)}),[O]),y=Object(n.useCallback)((function(){O>0&&h(O-1)}),[O]),S=Object(n.useCallback)((function(){return 0===O?Object(d.jsx)(o,{amount:t,description:j,onInputChange:k,"data-v-a44dc140":""}):1===O?Object(d.jsx)(C,{amount:t,description:j,unit:f,prevStep:y,"data-v-a44dc140":""}):void 0}),[O,t,j,k,y,f]),A=1===O;return Object(d.jsxs)(i.a,{title:"REQUEST","data-v-a44dc140":"",children:[S(),Object(d.jsxs)("div",{className:"footer","data-v-a44dc140":"",children:[A?null:Object(d.jsxs)("div",{className:"controls","data-v-a44dc140":"",children:[Object(d.jsx)("div",{className:"control",onClick:N,"data-v-a44dc140":"",children:"Skip"}),Object(d.jsx)("div",{className:"control next",onClick:N,"data-v-a44dc140":"",children:"Next"})]}),Object(d.jsx)("div",{className:"indicators","data-v-a44dc140":"",children:w.map((function(a,e){return Object(d.jsx)("div",{className:r()({indicator:!0,"indicator-active":e===O}),"data-v-a44dc140":""},e)}))})]})]})}}}]);
//# sourceMappingURL=31.929eba26.chunk.js.map