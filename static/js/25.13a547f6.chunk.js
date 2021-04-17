(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[25],{487:function(e,t,n){"use strict";var a=n(26),c=n(73),s=n.n(c),r=(n(496),n(7));t.a=function(e){var t=e.label,n=e.name,c=e.onChange,i=e.inputAction,l=e.actionIcon,o=e.value,u=e.inputMode,d=void 0===u?"text":u,b=e.type,j=void 0===b?"text":b,p=e.element,v=void 0===p?"input":p,m=e.small,O=void 0!==m&&m,h=e.disabled;return Object(r.jsxs)("div",{className:s()({group:!0,"group-disabled":h,"group-small":O}),children:[t?Object(r.jsx)("p",{className:"group-label",children:t}):null,Object(r.jsxs)("div",{className:s()({"group-input-container":!0,"group-input-textarea-container":"textarea"===v}),children:["textarea"===v?Object(r.jsx)("textarea",{className:"group-input group-input-textarea",name:n,onChange:c,inputMode:d,value:o,disabled:h}):Object(r.jsx)("input",{className:"group-input",type:j,name:n,onChange:c,inputMode:d,value:o,disabled:h}),i&&l?Object(r.jsx)("div",{className:"group-input-action",onClick:i,children:Object(r.jsx)("i",{className:s()(Object(a.a)({"group-input-action-icon":!0,fas:!0},l,!0)),onClick:i})}):null]})]})}},488:function(e,t,n){"use strict";var a=n(3),c=n(73),s=n.n(c),r=(n(489),n(7));t.a=function(e){var t=e.pageTitle,n=e.drawerVisible,c=Object(a.useCallback)((function(){window.history.back()}),[]);return Object(r.jsxs)("div",{className:"dialog-nav-container",children:[Object(r.jsx)("div",{className:"dialog-nav-back",onClick:c,children:Object(r.jsx)("i",{className:"icon icon-thin-back"})}),Object(r.jsx)("p",{className:"dialog-nav-title",children:t}),Object(r.jsxs)("div",{className:s()({"dialog-nav-menu-btn":!0,"dialog-nav-hidden":!n}),children:[Object(r.jsx)("div",{className:"dialog-nav-menu-dash"}),Object(r.jsx)("div",{className:"dialog-nav-menu-dash"}),Object(r.jsx)("div",{className:"dialog-nav-menu-dash"})]})]})}},489:function(e,t,n){},496:function(e,t,n){},748:function(e,t,n){"use strict";n.r(t);var a=n(2),c=n.n(a),s=n(5),r=n(17),i=n(3),l=n(37),o=n(488),u=n(150),d=n(487),b=n(105),j=n(21),p=n(7);t.default=function(){var e=Object(l.c)(),t=Object(j.g)(),n=Object(l.d)((function(e){return e.content.seedInfo})),a=n.seedUrl,v=n.seedToken,m=Object(i.useState)(!1),O=Object(r.a)(m,2),h=O[0],x=O[1],f=Object(i.useState)(null),g=Object(r.a)(f,2),k=g[0],N=g[1],C=Object(i.useState)("torrentSeed"),y=Object(r.a)(C,2),w=y[0],S=y[1],T=Object(i.useState)(0),D=Object(r.a)(T,2),I=D[0],M=D[1],A=Object(i.useCallback)((function(e){var t=e.target,n=t.value,a=t.name;switch(e.preventDefault(),a){case"type":return void S(n);case"price":return void M(n);default:return}}),[S,M]),J=Object(i.useCallback)(function(){var n=Object(s.a)(c.a.mark((function n(s){var r,i,l;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(s.preventDefault(),a&&v){n.next=4;break}return N("seed url and token are not set in config"),n.abrupt("return");case 4:if(!(I<=0)){n.next=7;break}return N("service price must be greater than 0"),n.abrupt("return");case 7:return n.prev=7,x(!0),r={serviceType:w,serviceTitle:"Content Seeding",serviceDescription:"",serviceCondition:"",servicePrice:I},i={serviceSeedUrl:a,serviceSeedToken:v},n.next=13,Object(b.c)(r,i)(e);case 13:l=n.sent,console.log(l),x(!1),t.push("/profile"),n.next=23;break;case 19:n.prev=19,n.t0=n.catch(7),x(!1),N(n.t0.message||n.t0);case 23:case"end":return n.stop()}}),n,null,[[7,19]])})));return function(e){return n.apply(this,arguments)}}(),[w,I,t]),P=Object(i.useCallback)(function(){var e=Object(s.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault(),N(null),S("torrentSeed"),M(0);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[N,S,M]);return Object(p.jsxs)("div",{className:"publish-content-form-container m-1",style:{overflow:"auto"},children:[h?Object(p.jsx)(u.a,{overlay:!0,fullScreen:!0,text:"Creating service..."}):null,Object(p.jsx)(o.a,{drawerVisible:!1,pageTitle:""}),Object(p.jsxs)("form",{className:"publish-content-form",onSubmit:J,onReset:P,children:[Object(p.jsx)("div",{style:{display:"flex",justifyContent:"center",marginBottom:"1rem"},children:Object(p.jsxs)("div",{children:[Object(p.jsx)("h2",{children:"Offer service"}),Object(p.jsx)("div",{className:"line"})]})}),Object(p.jsxs)("div",{children:[Object(p.jsx)("select",{name:"type",value:w,onChange:A,children:Object(p.jsx)("option",{value:"torrentSeed",children:"Content Seeding"})}),Object(p.jsx)(d.a,{label:"Service Price",name:"price",type:"number",actionIcon:null,value:I,onChange:A,disabled:!1,inputAction:null})]}),k?Object(p.jsx)("p",{className:"error-container",children:k}):null,Object(p.jsxs)("div",{className:"flex-center",children:[Object(p.jsx)("input",{type:"reset",value:"reset",className:"shock-form-button m-1"}),Object(p.jsx)("input",{type:"submit",value:"submit",className:"shock-form-button-confirm m-1"})]})]})]})}}}]);
//# sourceMappingURL=25.13a547f6.chunk.js.map