(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[19],{593:function(e,t,c){"use strict";var a=c(0),n=c(84),i=c.n(n),o=c(8),s=c(177),l=(c(598),c(4)),r=function(e){var t=e.children,c=void 0===t?null:t,a=e.style,n=void 0===a?{}:a,o=e.contentClass,s=void 0===o?"":o;return Object(l.jsx)("div",{className:i()("content",s),style:n,"data-v-7ac98d1b":"",children:c})},d=(c(599),function(e){var t=e.title,c=void 0===t?"":t,a=e.toggleModal,n=void 0===a?o.b:a,i=e.forceRenderTitleBar,s=void 0!==i&&i,r=e.hideXBtn,d=void 0!==r&&r;return c||s?Object(l.jsxs)("div",{className:"head","data-v-a440211e":"",children:[Object(l.jsx)("p",{className:"head-title","data-v-a440211e":"",children:c}),!d&&Object(l.jsx)("div",{className:"head-close",onClick:n,"data-v-a440211e":"",children:Object(l.jsx)("i",{className:"fas fa-times","data-v-a440211e":""})})]}):null}),u=(c(600),{borderRadius:"15px"});t.a=function(e){var t=e.modalOpen,c=void 0!==t&&t,n=e.toggleModal,b=e.modalTitle,j=void 0===b?"":b,f=e.children,v=e.contentStyle,p=void 0===v?o.c:v,O=e.disableBackdropClose,h=void 0!==O&&O,m=e.forceRenderTitleBar,x=void 0!==m&&m,g=e.hideXBtn,C=void 0!==g&&g,k=e.noFullWidth,y=void 0!==k&&k,N=e.blueBtn,S=void 0===N?"":N,w=e.disableBlueBtn,_=void 0!==w&&w,B=e.onClickBlueBtn,R=void 0===B?o.b:B,D=e.redBtn,I=void 0===D?"":D,P=e.disableRedBtn,T=void 0!==P&&P,E=e.onClickRedBtn,U=void 0===E?o.b:E,A=e.contentClass,H=void 0===A?"":A,M=e.error,K=void 0===M?"":M,W=e.textIfLoading,F=void 0===W?"":W,z=Object(a.useCallback)((function(){n()}),[n]),L=Object(a.useCallback)((function(){h||n()}),[h,n]);return Object(l.jsxs)("div",{className:i()({modal:!0,open:c}),"data-v-f18f7976":"",children:[Object(l.jsx)("div",{className:"backdrop",onClick:L,"data-v-f18f7976":""}),Object(l.jsxs)("div",{className:i()({container:!0,"container-no-full-width":y}),"data-v-f18f7976":"",children:[F&&Object(l.jsx)(s.a,{overlay:!0,style:u,text:F,"data-v-f18f7976":""}),Object(l.jsx)(d,{title:j,toggleModal:z,forceRenderTitleBar:x,hideXBtn:C,"data-v-f18f7976":""}),K&&Object(l.jsx)("div",{className:"form-error form-error-margin","data-v-f18f7976":"",children:K}),Object(l.jsx)(r,{style:p,contentClass:H,"data-v-f18f7976":"",children:"string"===typeof f?Object(l.jsx)("p",{className:"text-align-center","data-v-f18f7976":"",children:f}):f}),Object(l.jsxs)("div",{className:"color-buttons","data-v-f18f7976":"",children:[S&&Object(l.jsx)("button",{disabled:_,className:i()("color-btn","blue-btn"),onClick:R,"data-v-f18f7976":"",children:S}),I&&Object(l.jsx)("button",{disabled:T,className:i()("color-btn","red-btn"),onClick:U,"data-v-f18f7976":"",children:I})]})]})]})}},598:function(e,t,c){},599:function(e,t,c){},600:function(e,t,c){},606:function(e,t,c){"use strict";var a=c(58),n=c(4);t.a=function(){return Object(n.jsxs)("div",{className:"bottom-nav-container",children:[Object(n.jsx)(a.c,{className:"bottom-nav-btn",to:"/overview",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-wallet"})}),Object(n.jsx)(a.c,{className:"bottom-nav-btn",to:"/chat",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-chat"})}),Object(n.jsx)(a.c,{className:"bottom-nav-btn",to:"/profile",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-profile"})}),Object(n.jsx)(a.c,{className:"bottom-nav-btn",to:"/feed",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-feed"})})]})}},609:function(e,t,c){"use strict";var a=c(0),n=c(4);t.a=function(e){var t=e.color,c=e.length,i=e.type,o=e.width,s=Object(a.useMemo)((function(){return"vertical"===i?{borderLeftStyle:"solid",borderLeftWidth:"".concat(o/2,"px"),borderLeftColor:t,borderRightStyle:"solid",borderRightWidth:"".concat(o/2,"px"),borderRightColor:t,height:c}:"horizontal"===i?{borderTopStyle:"solid",borderTopWidth:o/2,borderTopColor:t,borderBottomStyle:"solid",borderBottomWidth:o/2,borderBottomColor:t,width:c}:{}}),[t,c,i,o]);return Object(n.jsx)("div",{style:s})}},613:function(e,t,c){"use strict";var a=c(17),n=c(0),i=c(84),o=c.n(i),s=(c(614),c(4));t.a=function(e){var t=e.label,c=void 0===t?null:t,i=e.icon,l=void 0===i?null:i,r=e.iconURL,d=void 0===r?null:r,u=e.onClick,b=void 0===u?void 0:u,j=e.nestedMode,f=void 0!==j&&j,v=e.large,p=void 0!==v&&v,O=e.small,h=void 0!==O&&O,m=e.relative,x=void 0!==m&&m,g=e.children,C=void 0===g?null:g,k=e.style,y=void 0===k?{}:k,N=Object(n.useState)(!1),S=Object(a.a)(N,2),w=S[0],_=S[1],B=Object(n.useCallback)((function(){f&&_(!w)}),[w,f]),R=Object(n.useMemo)((function(){return d?Object(s.jsx)("img",{src:d,className:"add-btn-icon",alt:"","data-v-7baa91b1":""}):Object(s.jsx)("i",{className:"fas fa-".concat(null!==l&&void 0!==l?l:"plus"),"data-v-7baa91b1":""})}),[l,d]),D=Object(n.useMemo)((function(){return c?Object(s.jsx)("p",{className:"add-btn-label","data-v-7baa91b1":"",children:c}):null}),[c]);return Object(s.jsxs)("div",{className:o()({"add-btn-container":!0,"add-btn-round-container":!c,"add-btn-large":p,"add-btn-small":h}),"data-v-7baa91b1":"",children:[Object(s.jsxs)("div",{className:o()({"add-btn":!0,"add-btn-round":!c,"add-btn-extended":!!c,"add-btn-relative":x,"add-btn-open":w,"add-btn-nested":f}),onClick:null!==b&&void 0!==b?b:B,style:y,"data-v-7baa91b1":"",children:[R,D]}),C?Object(s.jsx)("div",{className:o()({"add-btn-options":!0,"add-btn-options-open":w}),"data-v-7baa91b1":"",children:C}):null]})}},614:function(e,t,c){},639:function(e,t,c){"use strict";var a=c(84),n=c.n(a),i=c(592),o=c(609),s=c(640),l=c.n(s),r=c(4);t.a=function(e){var t=e.onChange,c=e.selected,a=e.showContentBtn;return Object(r.jsxs)("div",{className:n()(i.E,i.A,i.B,i.x,l.a.container),children:[Object(r.jsx)("span",{className:n()(i.D,"posts"===c?l.a.selected:l.a.unselected),onClick:function(){t("posts")},children:"Posts"}),Object(r.jsx)("div",{className:n()(i.a,a&&l.a["left-line"]),children:Object(r.jsx)(o.a,{color:"white",length:16,type:"vertical",width:2})}),Object(r.jsx)("span",{className:n()(i.D,"services"===c?l.a.selected:l.a.unselected),onClick:function(){t("services")},children:"Services"}),a&&Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("div",{className:n()(i.a,l.a["right-line"]),children:Object(r.jsx)(o.a,{color:"white",length:16,type:"vertical",width:2})}),Object(r.jsx)("span",{className:n()(i.D,"content"===c?l.a.selected:l.a.unselected),onClick:function(){t("content")},children:"Content"})]})]})}},640:function(e,t,c){e.exports={container:"ProfileDivider_container__3ob9k",selected:"ProfileDivider_selected__3U98y",unselected:"ProfileDivider_unselected__1Z_qd","left-line":"ProfileDivider_left-line__2xjlN","right-line":"ProfileDivider_right-line__1d2KH"}},641:function(e,t,c){"use strict";t.a=c.p+"static/media/clipboard.beb19e1e.svg"},642:function(e,t,c){"use strict";t.a=c.p+"static/media/qrcode.69103c6c.svg"},746:function(e,t,c){e.exports={container:"ContentHostInputView_container__1CVAn","uri-or-token-input":"ContentHostInputView_uri-or-token-input__3vg5h","plus-or-paste-btn":"ContentHostInputView_plus-or-paste-btn__3z_k0"}},747:function(e,t,c){e.exports={"container-base":"Host_container-base__r5EJP","remove-or-cancel":"Host_remove-or-cancel__2sHhe Host_container-base__r5EJP",container:"Host_container__2hPww Host_container-base__r5EJP",pill:"Host_pill__1WzlY","display-name-or-uri":"Host_display-name-or-uri__2eaUy","price-and-status":"Host_price-and-status__3Q4n3",price:"Host_price__2oEgL",red:"Host_red__1kS00",yellow:"Host_yellow__3DLEG",blue:"Host_blue__3m2Kb"}},748:function(e,t,c){},890:function(e,t,c){"use strict";c.r(t);var a=c(46),n=c(3),i=c.n(n),o=c(6),s=c(17),l=c(0),r=c.n(l),d=c(37),u=c(638),b=c.n(u),j=c(58),f=c(84),v=c.n(f),p=c(9),O=c(8),h=c(113),m=c(592),x=c(606),g=c(613),C=c(593),k=c(177),y=c(594),N=c(27),S=c(20),w=c(59),_=c(29),B=c(746),R=c.n(B),D=c(747),I=c.n(D),P=c(4),T=function(e){var t=e.error,c=e.isBeingAddedOrDeleted,a=e.isDefault,n=e.onClickRemove,i=e.onClickWarning,o=e.price,r=e.publicKey,d=e.URI,u=S.useSelector(S.selectUser(r)),b=Object(l.useState)(!1),j=Object(s.a)(b,2),f=j[0],O=j[1],h=Object(l.useCallback)((function(){O((function(e){return!e}))}),[]),x=Object(l.useCallback)((function(){i(r||d)}),[i,r,d]),g=Object(l.useCallback)((function(){n(r||d)}),[n,r,d]),C=t&&c||r&&d||!r&&!d,k=t;return C&&(k="Malformed host provided to <Host />, it must have either a public key or an URI (though not both), and it must not have both truthy error and isAdding props at the same time: ".concat(JSON.stringify(C))),f?Object(P.jsxs)("div",{className:v()(m.A,m.e,m.E),children:[Object(P.jsx)("button",{onClick:g,className:v()(m.p),children:"Remove"}),Object(P.jsx)("button",{onClick:h,className:v()(m.p),children:"Cancel"})]}):Object(P.jsxs)("div",{className:v()(m.A,m.C,m.g,I.a.container),children:[Object(P.jsxs)("div",{className:v()(m.A,m.C,m.i,I.a.pill),children:[r?Object(P.jsx)(y.a,{height:24,publicKey:r}):Object(P.jsx)("i",{className:v()("fas fa-globe")}),Object(P.jsx)("span",{className:I.a["display-name-or-uri"],children:d&&d.toLowerCase()||u.displayName||p.g(r)}),c||k?Object(P.jsx)("div",{}):Object(P.jsx)("span",{className:"fas fa-times",onClick:h,style:{fontSize:12}})]}),Object(P.jsxs)("div",{className:v()(m.q,m.g,I.a["price-and-status"]),children:[Object(P.jsxs)("span",{className:v()(m.q,I.a.price),children:[o," sats"]}),k?Object(P.jsx)("i",{className:v()("fas fa-exclamation-triangle",m.r,I.a.yellow),onClick:x}):c?Object(P.jsx)("i",{className:v()("fas fa-hourglass-half",m.r,I.a.yellow)}):a?Object(P.jsx)("i",{className:v()("fas fa-check",m.r,I.a.blue)}):Object(P.jsx)("i",{className:v()("fas fa-link",m.r,I.a.blue)})]})]})},E=(v()(m.A,m.E,m.e,m.f,m.x),function(e){var t,c=e.hosts,a=e.onAddHost,n=e.onRemoveHost,i=e.onRetryHost,o=Object(l.useState)({publicKeyOrServerURI:"",URIHostAwaitingForToken:""}),r=Object(s.a)(o,2),d=r[0],u=d.publicKeyOrServerURI,b=d.URIHostAwaitingForToken,j=r[1],f=Object(l.useState)(""),p=Object(s.a)(f,2),h=p[0],x=p[1],g=Object(l.useState)(!1),k=Object(s.a)(g,2),y=k[0],S=k[1],w=Object(l.useRef)(null),B=Object(l.useState)(!1),D=Object(s.a)(B,2),I=D[0],E=D[1],U=Object(l.useState)(""),A=Object(s.a)(U,2),H=A[0],M=A[1],K=Object(l.useRef)(null),W=Object(l.useState)(!1),F=Object(s.a)(W,2),z=F[0],L=F[1],q=Object(l.useMemo)((function(){return c.slice().sort((function(e,t){return t.dateAdded-e.dateAdded}))}),[c]),J=Object(l.useMemo)((function(){return q.filter((function(e){return e.isDefault}))}),[q]),V=Object(l.useMemo)((function(){return q.filter((function(e){return!e.isDefault}))}),[q]),G=Object(l.useMemo)((function(){return[].concat(Object(N.a)(J),Object(N.a)(V))}),[J,V]),X=Object(l.useCallback)((function(){S(!0)}),[]),$=Object(l.useCallback)((function(){I||(navigator.clipboard?(E(!0),navigator.clipboard.readText().then((function(e){j(Object(_.a)((function(t){t.publicKeyOrServerURI=e})))})).catch((function(e){alert("Could not paste: ".concat(e.message))})).finally((function(){E(!1)}))):w.current&&(w.current.focus(),document.execCommand("paste"),w.current.blur()))}),[I,E]),Y=Object(l.useCallback)((function(){j(Object(_.a)((function(e){var t=O.g(e.publicKeyOrServerURI);t&&(e.publicKeyOrServerURI=t,e.URIHostAwaitingForToken=t)}))),O.g(u)||a(u)}),[j,u,a]),Q=Object(l.useCallback)((function(){z||(navigator.clipboard?(L(!0),navigator.clipboard.readText().then((function(e){M(e)})).catch((function(e){alert("Could not paste: ".concat(e.message))})).finally((function(){L(!1)}))):K.current&&(K.current.focus(),document.execCommand("paste"),K.current.blur()))}),[z,L,M]),Z=Object(l.useCallback)((function(){j(Object(_.a)((function(e){e.publicKeyOrServerURI="",e.URIHostAwaitingForToken=""}))),a(u,H)}),[j,a,u,H]),ee=Object(l.useCallback)((function(e){n(e)}),[n]),te=Object(l.useCallback)((function(){x("")}),[x]),ce=Object(l.useCallback)((function(){n(h),te()}),[n,h,te]),ae=Object(l.useCallback)((function(){i(h),x("")}),[i,h,x]);return Object(P.jsxs)(P.Fragment,{children:[Object(P.jsxs)("div",{className:v()(m.j,m.E,R.a.container),children:[Object(P.jsxs)("div",{className:(m.z,m.e),children:[Object(P.jsx)("input",{className:v()("input-field",R.a["uri-or-token-input"]),onChange:function(e){j(Object(_.a)((function(t){t.publicKeyOrServerURI=e.target.value,t.URIHostAwaitingForToken=""}))),M("")},type:"text",value:u,onKeyUp:function(e){"Enter"!==e.key&&13!==e.keyCode||Y()},autoCapitalize:"off",autoCorrect:"none",placeholder:"Provider Pubkey or Server URI (include https or http)",ref:w,onFocus:X}),0===u.length&&Object(P.jsx)("button",{className:v()(m.o,R.a["plus-or-paste-btn"]),disabled:I,onClick:$,children:Object(P.jsx)("i",{className:"fas fa-paste"})}),u.length>0&&u!==b&&Object(P.jsx)("button",{className:v()(m.o,R.a["plus-or-paste-btn"]),disabled:0===u.length,onClick:Y,children:"+"})]}),u.length>0&&u===b&&Object(P.jsxs)("div",{className:(m.z,m.e),children:[Object(P.jsx)("input",{className:v()("input-field",R.a["uri-or-token-input"]),onChange:function(e){M(e.target.value)},type:"text",value:H,onKeyUp:function(e){"Enter"!==e.key&&13!==e.keyCode||Z()},autoCapitalize:"off",autoCorrect:"none",placeholder:"Token (required)",ref:K}),0===H.length&&Object(P.jsx)("button",{className:v()(m.o,R.a["plus-or-paste-btn"]),disabled:z,onClick:Q,children:Object(P.jsx)("i",{className:"fas fa-paste"})}),H.length>0&&Object(P.jsx)("button",{className:v()(m.o,R.a["plus-or-paste-btn"]),disabled:0===H.length,onClick:Z,children:"+"})]}),Object(P.jsx)("div",{className:v()(m.j),children:(y?G:J).map((function(e){return Object(P.jsx)(T,{URI:e.URI,dateAdded:0,error:e.error,isBeingAddedOrDeleted:e.isBeingAddedOrDeleted,isDefault:e.isDefault,onClickRemove:ee,onClickWarning:x,price:e.price,publicKey:e.publicKey,token:e.token},e.publicKey||e.URI)}))})]}),Object(P.jsx)(C.a,{modalOpen:!!h,forceRenderTitleBar:!0,toggleModal:te,blueBtn:"Retry",onClickBlueBtn:ae,redBtn:"Remove",onClickRedBtn:ce,noFullWidth:!0,contentClass:"p-1",hideXBtn:!0,children:Object(P.jsx)("p",{className:"text-align-center",children:null===(t=G.find((function(e){return e.publicKey===h||e.URI===h})))||void 0===t?void 0:t.error})})]})}),U=c(30),A=function(){var e=Object(d.b)(),t=S.useSelector((function(e){return e.content.seedProviderPub})),c=S.useSelector((function(e){return e.userProfiles})),a=S.useSelector((function(e){return e.content.seedInfo})),n=a.seedUrl,i=a.seedToken,o=Object(l.useState)([]),r=Object(s.a)(o,2),u=r[0],b=r[1],j=Object(l.useState)(null),f=Object(s.a)(j,2),v=f[0],p=f[1],h=Object(l.useState)(""),m=Object(s.a)(h,2),x=m[0],g=m[1],C=Object(l.useState)(0),k=Object(s.a)(C,2),y=k[0],_=k[1],B=Object(l.useState)(""),R=Object(s.a)(B,2),D=R[0],I=R[1];Object(l.useEffect)((function(){var e=c[t];e?v&&e.avatar===v.avatar&&e.offerSeedService===v.offerSeedService||p(e):p(null)}),[c,t,v,p]),Object(l.useEffect)((function(){if(v){var e=v.offerSeedService;e!==x&&g(e)}}),[v,x,g]),Object(l.useEffect)((function(){var e=[];n&&i&&e.push({URI:n,token:i,price:0,isBeingAddedOrDeleted:!1,dateAdded:Date.now(),isDefault:!0,error:null,publicKey:null}),t&&v&&e.push({dateAdded:Date.now(),isBeingAddedOrDeleted:!0,isDefault:!0,publicKey:t,price:0,URI:null,token:null,error:null}),b(e)}),[n,i,t,v,b]),Object(l.useEffect)((function(){x&&O.d.get("/api/gun/otheruser/".concat(t,"/load/offeredServices>").concat(x)).then((function(e){var t=e.data.data;_(t.servicePrice)})).catch((function(e){I(e)}))}),[x,t,_,I]),Object(l.useEffect)((function(){var e=Object(N.a)(u),t=e.findIndex((function(e){return!e.URI}));-1!==t&&e[t].price!==y&&(e[t].isBeingAddedOrDeleted=!1,e[t].price=y,b(e))}),[y,_,u,b]),Object(l.useEffect)((function(){var e=D.message||D,t=Object(N.a)(u),c=t.findIndex((function(e){return!e.URI}));-1!==c&&e!==t[c].error&&(t[c].isBeingAddedOrDeleted=!1,t[c].error=e,b(t))}),[D,I,u,b]);var T=Object(l.useCallback)((function(t,c){try{t.startsWith("http")?Object(U.k)(t,c)(e):Object(U.l)(t)(e)}catch(a){alert("Could not add host: ".concat(a.message)),O.f.error("Could not add host: ",a)}}),[e]),A=Object(l.useCallback)((function(t){try{t.startsWith("http")?Object(U.k)("","")(e):Object(U.l)("")(e)}catch(c){alert("Could not remove host: ".concat(c.message)),O.f.error("Could not remove host: ",c)}}),[e]);Object(l.useEffect)((function(){return e(Object(w.b)(t))}),[t,e]);var H=Object(l.useMemo)((function(){return u.filter((function(e){return e}))}),[u]);return Object(P.jsx)(E,{hosts:H,onAddHost:T,onRemoveHost:A,onRetryHost:function(){}})},H=c(639),M=c(591),K=c(641),W=c.p+"static/media/logo-alone.512c5854.png",F=c(642),z=c(14),L=(c(748),c(35)),q=c(43),J=r.a.lazy((function(){return Promise.all([c.e(2),c.e(1),c.e(9)]).then(c.bind(null,636))})),V=r.a.lazy((function(){return Promise.all([c.e(2),c.e(1),c.e(3),c.e(5),c.e(17)]).then(c.bind(null,876))})),G=["https://shock.pub","https://shock.page","https://lightning.page","https://satoshi.watch"],X={src:W,height:36,width:36,excavate:!0};t.default=function(){var e,t=S.useDispatch(),c=Object(l.useState)(!1),n=Object(s.a)(c,2),r=n[0],u=n[1],f=Object(l.useState)(null),N=Object(s.a)(f,2),w=N[0],_=N[1],B=Object(l.useState)(!1),R=Object(s.a)(B,2),D=R[0],I=R[1],T=S.useSelector((function(e){return e.node.publicKey})),E=S.useSelector(S.selectPostsNewestToOldest(T)),U=S.useSelector((function(e){return e.node.hostIP})),W=(S.useSelector(S.selectAllPosts),S.useSelector((function(e){return e.orders.myServices}))),$=Object(l.useState)("posts"),Y=Object(s.a)($,2),Q=Y[0],Z=Y[1],ee=Object(d.c)(S.selectSelfUser);Object(l.useEffect)((function(){if(console.log(ee),ee.offerSeedService){var e=Object(h.e)(ee.offerSeedService)(t);return Object(z.c)(e)}}),[t]),Object(l.useEffect)((function(){return t(Object(L.q)(T))}),[t,T]),Object(l.useEffect)((function(){return t(Object(L.n)(T))}),[t,T]);var te=Object(l.useCallback)((function(){u(!r)}),[r]),ce=Object(l.useState)(!1),ae=Object(s.a)(ce,2),ne=ae[0],ie=ae[1],oe=S.useSelector((function(e){return e.node.webClientPrefix})),se=Object(l.useState)(oe),le=Object(s.a)(se,2),re=le[0],de=le[1],ue=Object(l.useCallback)((function(){if(navigator.clipboard)navigator.clipboard.writeText(re+"/"+T);else{var e=document.querySelector("#web-client-url-holder");e.style.display="block",e.select(),document.execCommand("copy"),e.blur(),e.style.display="none"}}),[re,T]),be=Object(l.useCallback)((function(){console.debug("Subbing to webclient prefix on hostIP --| ".concat(U," |-- and public key --| ").concat(T," |--"));var e=Object(z.b)({query:"$user::Profile>webClientPrefix::on",onData:function(e){"string"===typeof e&&e!==oe&&Object(q.f)(e)(t)},onError:function(e){console.error("There was an error fetching web client prefix: ".concat(e))}});return Object(z.c)(e)}),[oe,t,U,T]);Object(l.useEffect)((function(){return be()}),[be]);var je=Object(l.useCallback)((function(e){Z(e)}),[]),fe=re!==oe,ve=Object(l.useCallback)((function(){ie((function(e){return!e})),de(oe)}),[oe]),pe=(Object(l.useCallback)((function(){ve()}),[ve]),Object(l.useCallback)((function(){re!==oe&&(Object(q.f)(re)(t),O.d.post("/api/gun/put",{path:"$user>Profile>webClientPrefix",value:re}).catch((function(e){alert("There was an error setting your web client prefix: ".concat(e.message))}))),ve()}),[re,oe,ve,t]),Object(l.useRef)(null)),Oe=Object(l.useState)(!1),he=Object(s.a)(Oe,2),me=he[0],xe=he[1],ge=function(){var e=Object(o.a)(i.a.mark((function e(t){var c,a,n,o,l,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,t.preventDefault(),!me){e.next=4;break}return e.abrupt("return");case 4:if(xe(!0),c=t.target,0!==(a=c.files).length){e.next=8;break}return e.abrupt("return");case 8:if(1===a.length){e.next=12;break}return O.f.error("Profile -> files.length !== 1"),alert("An error occurred while trying to set a header. This has been logged."),e.abrupt("return");case 12:return n=Object(s.a)(a,1),o=n[0],e.next=15,O.i(o,800,.9);case 15:return l=e.sent,"data:image/jpeg;base64,",r=l.slice("data:image/jpeg;base64,".length),e.next=20,O.d.post("/api/gun/put",{path:"$user>profileBinary>header",value:r});case 20:e.next=27;break;case 22:e.prev=22,e.t0=e.catch(0),O.f.error("Error while trying to load new header."),O.f.error(e.t0),alert("There was an error loading the new header: ".concat(e.t0.message));case 27:return e.prev=27,xe(!1),e.finish(27);case 30:case"end":return e.stop()}}),e,null,[[0,22,27,30]])})));return function(t){return e.apply(this,arguments)}}(),Ce=Object(l.useCallback)((function(e){e.preventDefault();var t=pe.current;t||(O.f.error("File input element for avatar is falsy."),alert("There was an error and it was logged.")),t.click()}),[]),ke=Object(l.useCallback)((function(e){console.log(e),!w&&e||_(null),_(e)}),[w]),ye=Object(l.useCallback)((function(){_(null)}),[]),Ne=Object(l.useCallback)(Object(o.a)(i.a.mark((function e(){var c;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,w&&w.id){e.next=3;break}return e.abrupt("return");case 3:return I(!0),console.log("deleting:"),console.log(w),c=w.shared?"sharedPosts":"posts",e.next=9,O.d.post("/api/gun/put",{path:"$user>".concat(c,">").concat(w.id),value:null});case 9:t(Object(L.c)({id:w.id,authorId:T})),ke(null),I(!0),e.next=20;break;case 14:e.prev=14,e.t0=e.catch(0),I(!0),console.log("Error when deleting post:"),console.log(e.t0),alert("Could not delete post: ".concat(e.t0.message));case 20:case"end":return e.stop()}}),e,null,[[0,14]])}))),[w,t,T,ke,I]),Se=Object(l.useCallback)((function(){try{if(navigator.clipboard){var e="".concat(oe,"/").concat(T);navigator.clipboard.writeText(e)}else{var t=document.querySelector("#public-key-holder");t.style.display="block",t.select(),document.execCommand("copy"),t.blur(),t.style.display="none",u(!1)}}catch(c){alert("Could not copy to clipboard: ".concat(c.message))}}),[oe,T]),we=Object(l.useState)(!1),_e=Object(s.a)(we,2),Be=_e[0],Re=_e[1],De=ee.displayName,Ie=Object(l.useState)(ee.displayName||"Anon"),Pe=Object(s.a)(Ie,2),Te=Pe[0],Ee=Pe[1],Ue=Object(l.useState)(null),Ae=Object(s.a)(Ue,2),He=Ae[0],Me=Ae[1],Ke=Object(l.useCallback)((function(e){""!==e&&(Me(e),O.d.put("/api/gun/me",{displayName:e}).catch((function(e){Me(null),alert("There was an error setting a new display name: ".concat(e.message))})))}),[]);Object(l.useEffect)((function(){He===De&&(console.debug("Got display name round trip from api."),Me(null))}),[He,De]);var We=Object(l.useCallback)((function(){Ee(De),Re((function(e){return!e}))}),[De]),Fe=Object(l.useCallback)((function(){Te!==De&&Ke(Te),We()}),[De,Te,Ke,We]),ze=Object(l.useMemo)((function(){return{padding:"12px 24px"}}),[]),Le=ee.bio,qe=Object(l.useState)(!1),Je=Object(s.a)(qe,2),Ve=Je[0],Ge=Je[1],Xe=Object(l.useState)(Le||"bio"),$e=Object(s.a)(Xe,2),Ye=$e[0],Qe=$e[1],Ze=Object(l.useState)(null),et=Object(s.a)(Ze,2),tt=et[0],ct=et[1],at=Object(l.useCallback)((function(e){""!==e&&(ct(e),O.d.put("/api/gun/me",{bio:e}).catch((function(e){ct(null),alert("There was an error setting a new bio: ".concat(e.message))})))}),[]);Object(l.useEffect)((function(){tt===Le&&(console.debug("Got bio round trip from api."),ct(null))}),[tt,Le]);var nt=Object(l.useCallback)((function(){Qe(Le),Ge((function(e){return!e}))}),[Le]),it=Object(l.useCallback)((function(){Ye!==Le&&at(Ye),nt()}),[Le,Ye,at,nt]),ot=Object(l.useMemo)((function(){return{padding:"12px 24px"}}),[]);return Object(P.jsxs)(P.Fragment,{children:[Object(P.jsxs)("div",{className:"page-container profile-page","data-v-c7c77311":"",children:[Object(P.jsxs)("div",{className:"profile-container","data-v-c7c77311":"",children:[Object(P.jsxs)("div",{className:v()((e={"profile-cover":!0},Object(a.a)(e,m.y,!0),Object(a.a)(e,"profile-cover-has-cover",!!ee.header),e)),onClick:Ce,"data-v-c7c77311":"",children:[ee.header&&Object(P.jsx)("img",{alt:"User set profile header.",src:"data:image/jpeg;base64,".concat(ee.header),"data-v-c7c77311":""}),Object(P.jsx)("i",{className:v()(m.b,"fas","fa-pencil-alt","cover-pencil"),"data-v-c7c77311":""})]}),Object(P.jsxs)("div",{className:"profile-info-container","data-v-c7c77311":"",children:[Object(P.jsx)("div",{className:"profile-avatar",style:{height:"".concat(122,"px"),width:"".concat(122,"px")},"data-v-c7c77311":"",children:Object(P.jsx)(y.a,{height:122,publicKey:T,setsAvatar:!0,greyBorder:!0,disableOnlineRing:!0,"data-v-c7c77311":""})}),Object(P.jsxs)("div",{className:"profile-info","data-v-c7c77311":"",children:[Object(P.jsxs)("p",{className:v()(m.D,"profile-name"),onClick:We,"data-v-c7c77311":"",children:[He||De,Object(P.jsx)("i",{className:"fas fa-pencil-alt pencil-btn","data-v-c7c77311":""})]}),Object(P.jsxs)("p",{className:v()(m.D,"profile-desc"),onClick:nt,"data-v-c7c77311":"",children:[tt||ee.bio||"Lightning.Page user",Object(P.jsx)("i",{className:"fas fa-pencil-alt pencil-btn","data-v-c7c77311":""})]}),Object(P.jsxs)("div",{className:"config-btn",onClick:ve,"data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"config-btn-icon icon-solid-spending-rule","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"config-btn-text","data-v-c7c77311":"",children:"Config"})]})]})]}),Object(P.jsxs)("div",{"data-v-c7c77311":"",children:[Object(P.jsx)(j.b,{to:"/goLive",className:"profile-choice-container","data-v-c7c77311":"",children:Object(P.jsxs)("div",{style:{backgroundColor:"red",color:"white",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"0.2em 0.5em",borderRadius:"0.7em",fontSize:"16px",fontWeight:600},"data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"fas fa-video","data-v-c7c77311":""}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:"GO LIVE"})]})}),Object(P.jsxs)(j.b,{to:"/createPost",className:"profile-choice-container","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"profile-choice-icon fas fa-pen-square","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-choice-text","data-v-c7c77311":"",children:"Create Post"})]}),Object(P.jsxs)(j.b,{to:"/publishContent",className:"profile-choice-container","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"profile-choice-icon fab fa-youtube","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-choice-text","data-v-c7c77311":"",children:"Publish Content"})]}),Object(P.jsxs)("button",{className:"profile-choice-container","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"profile-choice-icon fas fa-shopping-cart","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-choice-text","data-v-c7c77311":"",children:"Offer a Product"})]}),Object(P.jsxs)(j.b,{to:"/offerService",className:"profile-choice-container","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"profile-choice-icon fas fa-running","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-choice-text","data-v-c7c77311":"",children:"Offer a Service"})]})]}),Object(P.jsx)(H.a,{onChange:je,selected:Q,"data-v-c7c77311":""}),Object(P.jsxs)("div",{className:"","data-v-c7c77311":"",children:["posts"===Q&&E.map((function(e){return p.o(e)?Object(P.jsx)(l.Suspense,{fallback:Object(P.jsx)(k.a,{"data-v-c7c77311":""}),"data-v-c7c77311":"",children:Object(P.jsx)(V,{postID:e.originalPostID,sharerPublicKey:e.sharedBy,openTipModal:O.b,openUnlockModal:O.b,openDeleteModal:ke,openShareModal:null,"data-v-c7c77311":""})},e.shareID):Object(P.jsx)(l.Suspense,{fallback:Object(P.jsx)(k.a,{"data-v-c7c77311":""}),"data-v-c7c77311":"",children:Object(P.jsx)(J,{id:e.id,publicKey:e.authorId,openTipModal:O.b,openUnlockModal:O.b,openDeleteModal:ke,openShareModal:null,"data-v-c7c77311":""})},e.id)})),"services"===Q&&function(){if(ee.offerSeedService)return Object.entries(W).filter((function(e){var t=Object(s.a)(e,2),c=t[0];return!!t[1]&&ee.offerSeedService===c})).map((function(e){var c=Object(s.a)(e,2),a=c[0],n=c[1];return Object(P.jsxs)("div",{className:"post","data-v-c7c77311":"",children:[Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service ID"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:a}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Tpe"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.serviceType||""}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Title"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.serviceTitle||""}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Description"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.serviceDescription||""}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Condition"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.serviceCondition||""}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Price"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.servicePrice||""}),Object(P.jsx)("button",{onClick:function(){console.log("delete wtf"),Object(h.d)(a)(t)},"data-v-c7c77311":"",children:"DELETE SERVICE"})]},a)}))}()]}),Object(P.jsx)(M.a,{amt:200,"data-v-c7c77311":""}),Object(P.jsxs)(C.a,{toggleModal:te,modalOpen:r,contentStyle:{padding:"40px 30px"},noFullWidth:!0,"data-v-c7c77311":"",children:[Object(P.jsx)(b.a,{bgColor:"#23282d",fgColor:"#64bbff",value:"".concat(oe,"/").concat(T),size:180,className:"profile-qrcode",imageSettings:X,"data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-qrcode-desc","data-v-c7c77311":"",children:"Other users can scan this code to contact you"}),!navigator.clipboard&&Object(P.jsx)("input",{className:"hidden-input",id:"public-key-holder",readOnly:!0,type:"text",value:"".concat(oe,"/").concat(T),"data-v-c7c77311":""}),Object(P.jsxs)("div",{className:"profile-clipboard-container",onClick:Se,"data-v-c7c77311":"",children:[Object(P.jsx)("img",{src:K.a,className:"profile-clipboard-icon",alt:"","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-clipboard-text","data-v-c7c77311":"",children:"Tap to copy to clipboard"})]})]}),Object(P.jsxs)(C.a,{toggleModal:ve,modalOpen:ne,contentClass:"p-2",forceRenderTitleBar:!0,blueBtn:fe&&"Save","data-v-c7c77311":"",children:[Object(P.jsx)("label",{htmlFor:"new-web-client-prefix","data-v-c7c77311":"",children:"Web Client"}),Object(P.jsxs)("div",{className:"web-client-prefix-picker","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"far fa-copy",onClick:ue,style:{fontSize:24},"data-v-c7c77311":""}),Object(P.jsx)("select",{onChange:function(e){de(e.target.value)},name:"new-web-client-prefix",id:"new-web-client-prefix",value:re,"data-v-c7c77311":"",children:G.map((function(e){return Object(P.jsx)("option",{value:e,"data-v-c7c77311":"",children:e},e)}))}),Object(P.jsx)("span",{"data-v-c7c77311":"",children:"/"}),Object(P.jsx)("span",{style:{fontSize:12},"data-v-c7c77311":"",children:T})]}),!navigator.clipboard&&Object(P.jsx)("input",{className:"hidden-input",id:"web-client-url-holder",readOnly:!0,type:"text",value:re+"/"+T,"data-v-c7c77311":""}),Object(P.jsx)("br",{"data-v-c7c77311":""}),Object(P.jsx)("label",{htmlFor:"content-host","data-v-c7c77311":"",children:"Content Host"}),Object(P.jsx)(A,{"data-v-c7c77311":""})]}),Object(P.jsxs)(C.a,{toggleModal:ke,modalOpen:w,contentStyle:{padding:"2em 2em"},blueBtn:!D&&"Cancel",disableBlueBtn:D,onClickBlueBtn:ye,redBtn:!D&&"Delete",disableRedBtn:D,onClickRedBtn:Ne,noFullWidth:!0,"data-v-c7c77311":"",children:[!D&&Object(P.jsx)("span",{className:"text-align-center","data-v-c7c77311":"",children:"Are you sure?"}),D&&Object(P.jsx)(k.a,{"data-v-c7c77311":""})]}),Object(P.jsx)(g.a,{onClick:te,large:!0,iconURL:F.a,icon:null,label:null,"data-v-c7c77311":""})]}),Object(P.jsx)(x.a,{"data-v-c7c77311":""})]}),Object(P.jsx)("input",{type:"file",id:"avatar-file",ref:pe,hidden:!0,accept:"image/*",onChange:ge,"data-v-c7c77311":""}),Object(P.jsx)(C.a,{contentStyle:ze,modalOpen:Be,toggleModal:We,blueBtn:"Save",disableBlueBtn:Te===De||""===Te,onClickBlueBtn:Fe,noFullWidth:!0,modalTitle:"NEW DISPLAY NAME","data-v-c7c77311":"",children:Object(P.jsx)("input",{autoCapitalize:"none",autoCorrect:"off",type:"text",className:"input-field",placeholder:"New display name",name:"newDisplayName",onChange:function(e){var t=e.target.value;Ee(t)},value:Te,"data-v-c7c77311":""})}),Object(P.jsx)(C.a,{contentStyle:ot,modalOpen:Ve,toggleModal:nt,modalTitle:"NEW BIO",blueBtn:"Save",onClickBlueBtn:it,disableBlueBtn:Ye===Le||""===Ye,forceRenderTitleBar:!0,noFullWidth:!0,"data-v-c7c77311":"",children:Object(P.jsx)("input",{autoCapitalize:"none",autoCorrect:"off",type:"text",className:"input-field",placeholder:"New bio",name:"newBio",onChange:function(e){var t=e.target.value;Qe(t)},value:Ye,"data-v-c7c77311":""})})]})}}}]);
//# sourceMappingURL=19.6c680cce.chunk.js.map