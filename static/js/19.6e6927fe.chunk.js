(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[19],{593:function(e,t,c){"use strict";var a=c(0),n=c(84),o=c.n(n),i=c(8),s=(c(598),c(4)),l=function(e){var t=e.children,c=e.style;return Object(s.jsx)("div",{className:"content",style:c,"data-v-c32085ba":"",children:t})},r=(c(599),function(e){var t=e.title,c=void 0===t?"":t,a=e.toggleModal,n=void 0===a?i.b:a,o=e.forceRenderTitleBar,l=void 0!==o&&o,r=e.hideXBtn,d=void 0!==r&&r;return c||l?Object(s.jsxs)("div",{className:"head","data-v-c3a87749":"",children:[Object(s.jsx)("p",{className:"head-title","data-v-c3a87749":"",children:c}),!d&&Object(s.jsx)("div",{className:"head-close",onClick:n,"data-v-c3a87749":"",children:Object(s.jsx)("i",{className:"fas fa-times","data-v-c3a87749":""})})]}):null});c(600),t.a=function(e){var t=e.modalOpen,c=void 0!==t&&t,n=e.toggleModal,d=e.modalTitle,b=void 0===d?"":d,u=e.children,j=e.contentStyle,f=void 0===j?{}:j,v=e.disableBackdropClose,p=void 0!==v&&v,O=e.forceRenderTitleBar,h=void 0!==O&&O,m=e.hideXBtn,x=void 0!==m&&m,g=e.noFullWidth,C=void 0!==g&&g,k=e.blueBtn,N=void 0===k?"":k,y=e.disableBlueBtn,S=void 0!==y&&y,w=e.onClickBlueBtn,_=void 0===w?i.b:w,R=e.redBtn,D=void 0===R?"":R,B=e.disableRedBtn,I=void 0!==B&&B,P=e.onClickRedBtn,T=void 0===P?i.b:P,E=Object(a.useCallback)((function(){n()}),[n]),U=Object(a.useCallback)((function(){p||n()}),[p,n]);return Object(s.jsxs)("div",{className:o()({modal:!0,open:c}),"data-v-f18f7976":"",children:[Object(s.jsx)("div",{className:"backdrop",onClick:U,"data-v-f18f7976":""}),Object(s.jsxs)("div",{className:o()({container:!0,"container-no-full-width":C}),"data-v-f18f7976":"",children:[Object(s.jsx)(r,{title:b,toggleModal:E,forceRenderTitleBar:h,hideXBtn:x,"data-v-f18f7976":""}),Object(s.jsx)(l,{style:f,"data-v-f18f7976":"",children:u}),Object(s.jsxs)("div",{className:"color-buttons","data-v-f18f7976":"",children:[N&&Object(s.jsx)("button",{disabled:S,className:o()("color-btn","blue-btn"),onClick:_,"data-v-f18f7976":"",children:N}),D&&Object(s.jsx)("button",{disabled:I,className:o()("color-btn","red-btn"),onClick:T,"data-v-f18f7976":"",children:D})]})]})]})}},598:function(e,t,c){},599:function(e,t,c){},600:function(e,t,c){},607:function(e,t,c){"use strict";var a=c(58),n=c(4);t.a=function(){return Object(n.jsxs)("div",{className:"bottom-nav-container",children:[Object(n.jsx)(a.c,{className:"bottom-nav-btn",to:"/overview",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-wallet"})}),Object(n.jsx)(a.c,{className:"bottom-nav-btn",to:"/chat",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-chat"})}),Object(n.jsx)(a.c,{className:"bottom-nav-btn",to:"/profile",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-profile"})}),Object(n.jsx)(a.c,{className:"bottom-nav-btn",to:"/feed",activeClassName:"active-nav-btn",children:Object(n.jsx)("i",{className:"bottom-nav-btn-icon icon-thin-feed"})})]})}},610:function(e,t,c){"use strict";var a=c(0),n=c(4);t.a=function(e){var t=e.color,c=e.length,o=e.type,i=e.width,s=Object(a.useMemo)((function(){return"vertical"===o?{borderLeftStyle:"solid",borderLeftWidth:"".concat(i/2,"px"),borderLeftColor:t,borderRightStyle:"solid",borderRightWidth:"".concat(i/2,"px"),borderRightColor:t,height:c}:"horizontal"===o?{borderTopStyle:"solid",borderTopWidth:i/2,borderTopColor:t,borderBottomStyle:"solid",borderBottomWidth:i/2,borderBottomColor:t,width:c}:{}}),[t,c,o,i]);return Object(n.jsx)("div",{style:s})}},613:function(e,t,c){"use strict";var a=c(17),n=c(0),o=c(84),i=c.n(o),s=(c(614),c(4));t.a=function(e){var t=e.label,c=void 0===t?null:t,o=e.icon,l=void 0===o?null:o,r=e.iconURL,d=void 0===r?null:r,b=e.onClick,u=void 0===b?void 0:b,j=e.nestedMode,f=void 0!==j&&j,v=e.large,p=void 0!==v&&v,O=e.small,h=void 0!==O&&O,m=e.relative,x=void 0!==m&&m,g=e.children,C=void 0===g?null:g,k=e.style,N=void 0===k?{}:k,y=Object(n.useState)(!1),S=Object(a.a)(y,2),w=S[0],_=S[1],R=Object(n.useCallback)((function(){f&&_(!w)}),[w,f]),D=Object(n.useMemo)((function(){return d?Object(s.jsx)("img",{src:d,className:"add-btn-icon",alt:"","data-v-d19ccba0":""}):Object(s.jsx)("i",{className:"fas fa-".concat(null!==l&&void 0!==l?l:"plus"),"data-v-d19ccba0":""})}),[l,d]),B=Object(n.useMemo)((function(){return c?Object(s.jsx)("p",{className:"add-btn-label","data-v-d19ccba0":"",children:c}):null}),[c]);return Object(s.jsxs)("div",{className:i()({"add-btn-container":!0,"add-btn-round-container":!c,"add-btn-large":p,"add-btn-small":h}),"data-v-d19ccba0":"",children:[Object(s.jsxs)("div",{className:i()({"add-btn":!0,"add-btn-round":!c,"add-btn-extended":!!c,"add-btn-relative":x,"add-btn-open":w,"add-btn-nested":f}),onClick:null!==u&&void 0!==u?u:R,style:N,"data-v-d19ccba0":"",children:[D,B]}),C?Object(s.jsx)("div",{className:i()({"add-btn-options":!0,"add-btn-options-open":w}),"data-v-d19ccba0":"",children:C}):null]})}},614:function(e,t,c){},639:function(e,t,c){"use strict";var a=c(84),n=c.n(a),o=c(591),i=c(610),s=c(640),l=c.n(s),r=c(4);t.a=function(e){var t=e.onChange,c=e.selected,a=e.showContentBtn;return Object(r.jsxs)("div",{className:n()(o.E,o.A,o.B,o.x,l.a.container),children:[Object(r.jsx)("span",{className:n()(o.D,"posts"===c?l.a.selected:l.a.unselected),onClick:function(){t("posts")},children:"Posts"}),Object(r.jsx)("div",{className:n()(o.a,a&&l.a["left-line"]),children:Object(r.jsx)(i.a,{color:"white",length:16,type:"vertical",width:2})}),Object(r.jsx)("span",{className:n()(o.D,"services"===c?l.a.selected:l.a.unselected),onClick:function(){t("services")},children:"Services"}),a&&Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)("div",{className:n()(o.a,l.a["right-line"]),children:Object(r.jsx)(i.a,{color:"white",length:16,type:"vertical",width:2})}),Object(r.jsx)("span",{className:n()(o.D,"content"===c?l.a.selected:l.a.unselected),onClick:function(){t("content")},children:"Content"})]})]})}},640:function(e,t,c){e.exports={container:"ProfileDivider_container__3ob9k",selected:"ProfileDivider_selected__3U98y",unselected:"ProfileDivider_unselected__1Z_qd","left-line":"ProfileDivider_left-line__2xjlN","right-line":"ProfileDivider_right-line__1d2KH"}},641:function(e,t,c){"use strict";t.a=c.p+"static/media/clipboard.beb19e1e.svg"},642:function(e,t,c){"use strict";t.a=c.p+"static/media/qrcode.69103c6c.svg"},746:function(e,t,c){e.exports={container:"ContentHostInputView_container__1CVAn","uri-or-token-input":"ContentHostInputView_uri-or-token-input__3vg5h","plus-or-paste-btn":"ContentHostInputView_plus-or-paste-btn__3z_k0"}},747:function(e,t,c){e.exports={"container-base":"Host_container-base__r5EJP","remove-or-cancel":"Host_remove-or-cancel__2sHhe Host_container-base__r5EJP",container:"Host_container__2hPww Host_container-base__r5EJP",pill:"Host_pill__1WzlY","display-name-or-uri":"Host_display-name-or-uri__2eaUy","price-and-status":"Host_price-and-status__3Q4n3",price:"Host_price__2oEgL",red:"Host_red__1kS00",yellow:"Host_yellow__3DLEG",blue:"Host_blue__3m2Kb"}},748:function(e,t,c){},890:function(e,t,c){"use strict";c.r(t);var a=c(46),n=c(3),o=c.n(n),i=c(6),s=c(17),l=c(0),r=c.n(l),d=c(37),b=c(638),u=c.n(b),j=c(58),f=c(84),v=c.n(f),p=c(9),O=c(8),h=c(113),m=c(591),x=c(607),g=c(613),C=c(593),k=c(177),N=c(594),y=c(27),S=c(20),w=c(59),_=c(29),R=c(746),D=c.n(R),B=c(747),I=c.n(B),P=c(4),T=function(e){var t=e.error,c=e.isBeingAddedOrDeleted,a=e.isDefault,n=e.onClickRemove,o=e.onClickWarning,i=e.price,r=e.publicKey,d=e.URI,b=S.useSelector(S.selectUser(r)),u=Object(l.useState)(!1),j=Object(s.a)(u,2),f=j[0],O=j[1],h=Object(l.useCallback)((function(){O((function(e){return!e}))}),[]),x=Object(l.useCallback)((function(){o(r||d)}),[o,r,d]),g=Object(l.useCallback)((function(){n(r||d)}),[n,r,d]),C=t&&c||r&&d||!r&&!d,k=t;return C&&(k="Malformed host provided to <Host />, it must have either a public key or an URI (though not both), and it must not have both truthy error and isAdding props at the same time: ".concat(JSON.stringify(C))),f?Object(P.jsxs)("div",{className:v()(m.A,m.e,m.E),children:[Object(P.jsx)("button",{onClick:g,className:v()(m.p),children:"Remove"}),Object(P.jsx)("button",{onClick:h,className:v()(m.p),children:"Cancel"})]}):Object(P.jsxs)("div",{className:v()(m.A,m.C,m.g,I.a.container),children:[Object(P.jsxs)("div",{className:v()(m.A,m.C,m.i,I.a.pill),children:[r?Object(P.jsx)(N.a,{height:24,publicKey:r}):Object(P.jsx)("i",{className:v()("fas fa-globe")}),Object(P.jsx)("span",{className:I.a["display-name-or-uri"],children:d&&d.toLowerCase()||b.displayName||p.g(r)}),c||k?Object(P.jsx)("div",{}):Object(P.jsx)("span",{className:"fas fa-times",onClick:h,style:{fontSize:12}})]}),Object(P.jsxs)("div",{className:v()(m.q,m.g,I.a["price-and-status"]),children:[Object(P.jsxs)("span",{className:v()(m.q,I.a.price),children:[i," sats"]}),k?Object(P.jsx)("i",{className:v()("fas fa-exclamation-triangle",m.r,I.a.yellow),onClick:x}):c?Object(P.jsx)("i",{className:v()("fas fa-hourglass-half",m.r,I.a.yellow)}):a?Object(P.jsx)("i",{className:v()("fas fa-check",m.r,I.a.blue)}):Object(P.jsx)("i",{className:v()("fas fa-link",m.r,I.a.blue)})]})]})},E=v()(m.A,m.E,m.e,m.f,m.x),U=function(e){var t,c=e.hosts,a=e.onAddHost,n=e.onRemoveHost,o=e.onRetryHost,i=Object(l.useState)({publicKeyOrServerURI:"",URIHostAwaitingForToken:""}),r=Object(s.a)(i,2),d=r[0],b=d.publicKeyOrServerURI,u=d.URIHostAwaitingForToken,j=r[1],f=Object(l.useState)(""),p=Object(s.a)(f,2),h=p[0],x=p[1],g=Object(l.useState)(!1),k=Object(s.a)(g,2),N=k[0],S=k[1],w=Object(l.useRef)(null),R=Object(l.useState)(!1),B=Object(s.a)(R,2),I=B[0],U=B[1],A=Object(l.useState)(""),M=Object(s.a)(A,2),H=M[0],K=M[1],z=Object(l.useRef)(null),F=Object(l.useState)(!1),L=Object(s.a)(F,2),W=L[0],q=L[1],V=Object(l.useMemo)((function(){return c.slice().sort((function(e,t){return t.dateAdded-e.dateAdded}))}),[c]),G=Object(l.useMemo)((function(){return V.filter((function(e){return e.isDefault}))}),[V]),J=Object(l.useMemo)((function(){return V.filter((function(e){return!e.isDefault}))}),[V]),$=Object(l.useMemo)((function(){return[].concat(Object(y.a)(G),Object(y.a)(J))}),[G,J]),X=Object(l.useCallback)((function(){S(!0)}),[]),Y=Object(l.useCallback)((function(){I||(navigator.clipboard?(U(!0),navigator.clipboard.readText().then((function(e){j(Object(_.a)((function(t){t.publicKeyOrServerURI=e})))})).catch((function(e){alert("Could not paste: ".concat(e.message))})).finally((function(){U(!1)}))):w.current&&(w.current.focus(),document.execCommand("paste"),w.current.blur()))}),[I,U]),Q=Object(l.useCallback)((function(){j(Object(_.a)((function(e){var t=O.f(e.publicKeyOrServerURI);t&&(e.publicKeyOrServerURI=t,e.URIHostAwaitingForToken=t)}))),O.f(b)||a(b)}),[j,b,a]),Z=Object(l.useCallback)((function(){W||(navigator.clipboard?(q(!0),navigator.clipboard.readText().then((function(e){K(e)})).catch((function(e){alert("Could not paste: ".concat(e.message))})).finally((function(){q(!1)}))):z.current&&(z.current.focus(),document.execCommand("paste"),z.current.blur()))}),[W,q,K]),ee=Object(l.useCallback)((function(){j(Object(_.a)((function(e){e.publicKeyOrServerURI="",e.URIHostAwaitingForToken=""}))),a(b,H)}),[j,a,b,H]),te=Object(l.useCallback)((function(e){n(e)}),[n]),ce=Object(l.useCallback)((function(){x("")}),[x]),ae=Object(l.useCallback)((function(){n(h),ce()}),[n,h,ce]),ne=Object(l.useCallback)((function(){o(h),x("")}),[o,h,x]);return Object(P.jsxs)(P.Fragment,{children:[Object(P.jsxs)("div",{className:v()(m.j,m.E,D.a.container),children:[Object(P.jsxs)("div",{className:(m.z,m.e),children:[Object(P.jsx)("input",{className:v()("input-field",D.a["uri-or-token-input"]),onChange:function(e){j(Object(_.a)((function(t){t.publicKeyOrServerURI=e.target.value,t.URIHostAwaitingForToken=""}))),K("")},type:"text",value:b,onKeyUp:function(e){"Enter"!==e.key&&13!==e.keyCode||Q()},autoCapitalize:"off",autoCorrect:"none",placeholder:"Provider Pubkey or Server URI (include https or http)",ref:w,onFocus:X}),0===b.length&&Object(P.jsx)("button",{className:v()(m.o,D.a["plus-or-paste-btn"]),disabled:I,onClick:Y,children:Object(P.jsx)("i",{className:"fas fa-paste"})}),b.length>0&&b!==u&&Object(P.jsx)("button",{className:v()(m.o,D.a["plus-or-paste-btn"]),disabled:0===b.length,onClick:Q,children:"+"})]}),b.length>0&&b===u&&Object(P.jsxs)("div",{className:(m.z,m.e),children:[Object(P.jsx)("input",{className:v()("input-field",D.a["uri-or-token-input"]),onChange:function(e){K(e.target.value)},type:"text",value:H,onKeyUp:function(e){"Enter"!==e.key&&13!==e.keyCode||ee()},autoCapitalize:"off",autoCorrect:"none",placeholder:"Token (required)",ref:z}),0===H.length&&Object(P.jsx)("button",{className:v()(m.o,D.a["plus-or-paste-btn"]),disabled:W,onClick:Z,children:Object(P.jsx)("i",{className:"fas fa-paste"})}),H.length>0&&Object(P.jsx)("button",{className:v()(m.o,D.a["plus-or-paste-btn"]),disabled:0===H.length,onClick:ee,children:"+"})]}),Object(P.jsx)("div",{className:v()(m.j),children:(N?$:G).map((function(e){return Object(P.jsx)(T,{URI:e.URI,dateAdded:0,error:e.error,isBeingAddedOrDeleted:e.isBeingAddedOrDeleted,isDefault:e.isDefault,onClickRemove:te,onClickWarning:x,price:e.price,publicKey:e.publicKey,token:e.token},e.publicKey||e.URI)}))})]}),Object(P.jsx)(C.a,{modalOpen:!!h,modalTitle:null===(t=$.find((function(e){return e.publicKey===h||e.URI===h})))||void 0===t?void 0:t.error,toggleModal:ce,children:Object(P.jsxs)("div",{className:E,children:[Object(P.jsx)("button",{onClick:ae,className:"shock-form-button m-1",children:"REMOVE"}),Object(P.jsx)("button",{onClick:ne,className:"shock-form-button-confirm m-1",children:"RETRY"})]})})]})},A=c(30),M=function(){var e=Object(d.b)(),t=S.useSelector((function(e){return e.content.seedProviderPub})),c=S.useSelector((function(e){return e.userProfiles})),a=S.useSelector((function(e){return e.content.seedInfo})),n=a.seedUrl,o=a.seedToken,i=Object(l.useState)([]),r=Object(s.a)(i,2),b=r[0],u=r[1],j=Object(l.useState)(null),f=Object(s.a)(j,2),v=f[0],p=f[1],h=Object(l.useState)(""),m=Object(s.a)(h,2),x=m[0],g=m[1],C=Object(l.useState)(0),k=Object(s.a)(C,2),N=k[0],_=k[1],R=Object(l.useState)(""),D=Object(s.a)(R,2),B=D[0],I=D[1];Object(l.useEffect)((function(){var e=c[t];e?v&&e.avatar===v.avatar&&e.offerSeedService===v.offerSeedService||p(e):p(null)}),[c,t,v,p]),Object(l.useEffect)((function(){if(v){var e=v.offerSeedService;e!==x&&g(e)}}),[v,x,g]),Object(l.useEffect)((function(){var e=[];n&&o&&e.push({URI:n,token:o,price:0,isBeingAddedOrDeleted:!1,dateAdded:Date.now(),isDefault:!0,error:null,publicKey:null}),t&&v&&e.push({dateAdded:Date.now(),isBeingAddedOrDeleted:!0,isDefault:!0,publicKey:t,price:0,URI:null,token:null,error:null}),u(e)}),[n,o,t,v,u]),Object(l.useEffect)((function(){x&&O.c.get("/api/gun/otheruser/".concat(t,"/load/offeredServices>").concat(x)).then((function(e){var t=e.data.data;_(t.servicePrice)})).catch((function(e){I(e)}))}),[x,t,_,I]),Object(l.useEffect)((function(){var e=Object(y.a)(b),t=e.findIndex((function(e){return!e.URI}));-1!==t&&e[t].price!==N&&(e[t].isBeingAddedOrDeleted=!1,e[t].price=N,u(e))}),[N,_,b,u]),Object(l.useEffect)((function(){var e=B.message||B,t=Object(y.a)(b),c=t.findIndex((function(e){return!e.URI}));-1!==c&&e!==t[c].error&&(t[c].isBeingAddedOrDeleted=!1,t[c].error=e,u(t))}),[B,I,b,u]);var T=Object(l.useCallback)((function(t,c){try{t.startsWith("http")?Object(A.k)(t,c)(e):Object(A.l)(t)(e)}catch(a){alert("Could not add host: ".concat(a.message)),O.e.error("Could not add host: ",a)}}),[e]),E=Object(l.useCallback)((function(t){try{t.startsWith("http")?Object(A.k)("","")(e):Object(A.l)("")(e)}catch(c){alert("Could not remove host: ".concat(c.message)),O.e.error("Could not remove host: ",c)}}),[e]);Object(l.useEffect)((function(){return e(Object(w.b)(t))}),[t,e]);var M=Object(l.useMemo)((function(){return b.filter((function(e){return e}))}),[b]);return Object(P.jsx)(U,{hosts:M,onAddHost:T,onRemoveHost:E,onRetryHost:function(){}})},H=c(639),K=c(592),z=c(641),F=c.p+"static/media/logo-alone.512c5854.png",L=c(642),W=c(14),q=(c(748),c(35)),V=c(43),G=r.a.lazy((function(){return Promise.all([c.e(2),c.e(1),c.e(9)]).then(c.bind(null,636))})),J=r.a.lazy((function(){return Promise.all([c.e(2),c.e(1),c.e(3),c.e(5),c.e(17)]).then(c.bind(null,876))})),$=["https://shock.pub","https://shock.page","https://lightning.page","https://satoshi.watch"],X={src:F,height:36,width:36,excavate:!0};t.default=function(){var e,t=S.useDispatch(),c=Object(l.useState)(!1),n=Object(s.a)(c,2),r=n[0],b=n[1],f=Object(l.useState)(null),y=Object(s.a)(f,2),w=y[0],_=y[1],R=Object(l.useState)(!1),D=Object(s.a)(R,2),B=D[0],I=D[1],T=S.useSelector((function(e){return e.node.publicKey})),E=S.useSelector(S.selectPostsNewestToOldest(T)),U=S.useSelector((function(e){return e.node.hostIP})),A=(S.useSelector(S.selectAllPosts),S.useSelector((function(e){return e.orders.myServices}))),F=Object(l.useState)("posts"),Y=Object(s.a)(F,2),Q=Y[0],Z=Y[1],ee=Object(d.c)(S.selectSelfUser);Object(l.useEffect)((function(){if(console.log(ee),ee.offerSeedService){var e=Object(h.e)(ee.offerSeedService)(t);return Object(W.c)(e)}}),[t]),Object(l.useEffect)((function(){return t(Object(q.q)(T))}),[t,T]),Object(l.useEffect)((function(){return t(Object(q.n)(T))}),[t,T]);var te=Object(l.useCallback)((function(){b(!r)}),[r]),ce=Object(l.useState)(!1),ae=Object(s.a)(ce,2),ne=ae[0],oe=ae[1],ie=S.useSelector((function(e){return e.node.webClientPrefix})),se=Object(l.useState)(ie),le=Object(s.a)(se,2),re=le[0],de=le[1],be=Object(l.useCallback)((function(){if(navigator.clipboard)navigator.clipboard.writeText(re+"/"+T);else{var e=document.querySelector("#web-client-url-holder");e.style.display="block",e.select(),document.execCommand("copy"),e.blur(),e.style.display="none"}}),[re,T]),ue=Object(l.useCallback)((function(){console.debug("Subbing to webclient prefix on hostIP --| ".concat(U," |-- and public key --| ").concat(T," |--"));var e=Object(W.b)({query:"$user::Profile>webClientPrefix::on",onData:function(e){"string"===typeof e&&e!==ie&&Object(V.f)(e)(t)},onError:function(e){console.error("There was an error fetching web client prefix: ".concat(e))}});return Object(W.c)(e)}),[ie,t,U,T]);Object(l.useEffect)((function(){return ue()}),[ue]);var je=Object(l.useCallback)((function(e){Z(e)}),[]),fe=re!==ie,ve=Object(l.useCallback)((function(){oe((function(e){return!e})),de(ie)}),[ie]),pe=Object(l.useCallback)((function(){ve()}),[ve]),Oe=Object(l.useCallback)((function(){re!==ie&&(Object(V.f)(re)(t),O.c.post("/api/gun/put",{path:"$user>Profile>webClientPrefix",value:re}).catch((function(e){alert("There was an error setting your web client prefix: ".concat(e.message))}))),ve()}),[re,ie,ve,t]),he=Object(l.useRef)(null),me=Object(l.useState)(!1),xe=Object(s.a)(me,2),ge=xe[0],Ce=xe[1],ke=function(){var e=Object(i.a)(o.a.mark((function e(t){var c,a,n,i,l,r;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,t.preventDefault(),!ge){e.next=4;break}return e.abrupt("return");case 4:if(Ce(!0),c=t.target,0!==(a=c.files).length){e.next=8;break}return e.abrupt("return");case 8:if(1===a.length){e.next=12;break}return O.e.error("Profile -> files.length !== 1"),alert("An error occurred while trying to set a header. This has been logged."),e.abrupt("return");case 12:return n=Object(s.a)(a,1),i=n[0],e.next=15,O.h(i,800,.9);case 15:return l=e.sent,"data:image/jpeg;base64,",r=l.slice("data:image/jpeg;base64,".length),e.next=20,O.c.post("/api/gun/put",{path:"$user>profileBinary>header",value:r});case 20:e.next=27;break;case 22:e.prev=22,e.t0=e.catch(0),O.e.error("Error while trying to load new header."),O.e.error(e.t0),alert("There was an error loading the new header: ".concat(e.t0.message));case 27:return e.prev=27,Ce(!1),e.finish(27);case 30:case"end":return e.stop()}}),e,null,[[0,22,27,30]])})));return function(t){return e.apply(this,arguments)}}(),Ne=Object(l.useCallback)((function(e){e.preventDefault();var t=he.current;t||(O.e.error("File input element for avatar is falsy."),alert("There was an error and it was logged.")),t.click()}),[]),ye=Object(l.useCallback)((function(e){console.log(e),!w&&e||_(null),_(e)}),[w]),Se=Object(l.useCallback)((function(){_(null)}),[]),we=Object(l.useCallback)(Object(i.a)(o.a.mark((function e(){var c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,w&&w.id){e.next=3;break}return e.abrupt("return");case 3:return I(!0),console.log("deleting:"),console.log(w),c=w.shared?"sharedPosts":"posts",e.next=9,O.c.post("/api/gun/put",{path:"$user>".concat(c,">").concat(w.id),value:null});case 9:t(Object(q.c)({id:w.id,authorId:T})),ye(null),I(!0),e.next=20;break;case 14:e.prev=14,e.t0=e.catch(0),I(!0),console.log("Error when deleting post:"),console.log(e.t0),alert("Could not delete post: ".concat(e.t0.message));case 20:case"end":return e.stop()}}),e,null,[[0,14]])}))),[w,t,T,ye,I]),_e=Object(l.useCallback)((function(){try{if(navigator.clipboard){var e="".concat(ie,"/").concat(T);navigator.clipboard.writeText(e)}else{var t=document.querySelector("#public-key-holder");t.style.display="block",t.select(),document.execCommand("copy"),t.blur(),t.style.display="none",b(!1)}}catch(c){alert("Could not copy to clipboard: ".concat(c.message))}}),[ie,T]),Re=Object(l.useState)(!1),De=Object(s.a)(Re,2),Be=De[0],Ie=De[1],Pe=ee.displayName,Te=Object(l.useState)(ee.displayName||"Anon"),Ee=Object(s.a)(Te,2),Ue=Ee[0],Ae=Ee[1],Me=Object(l.useState)(null),He=Object(s.a)(Me,2),Ke=He[0],ze=He[1],Fe=Object(l.useCallback)((function(e){""!==e&&(ze(e),O.c.put("/api/gun/me",{displayName:e}).catch((function(e){ze(null),alert("There was an error setting a new display name: ".concat(e.message))})))}),[]);Object(l.useEffect)((function(){Ke===Pe&&(console.debug("Got display name round trip from api."),ze(null))}),[Ke,Pe]);var Le=Object(l.useCallback)((function(){Ae(Pe),Ie((function(e){return!e}))}),[Pe]),We=Object(l.useCallback)((function(){Ue!==Pe&&Fe(Ue),Le()}),[Pe,Ue,Fe,Le]),qe=Object(l.useMemo)((function(){return{padding:"12px 24px"}}),[]),Ve=ee.bio,Ge=Object(l.useState)(!1),Je=Object(s.a)(Ge,2),$e=Je[0],Xe=Je[1],Ye=Object(l.useState)(Ve||"bio"),Qe=Object(s.a)(Ye,2),Ze=Qe[0],et=Qe[1],tt=Object(l.useState)(null),ct=Object(s.a)(tt,2),at=ct[0],nt=ct[1],ot=Object(l.useCallback)((function(e){""!==e&&(nt(e),O.c.put("/api/gun/me",{bio:e}).catch((function(e){nt(null),alert("There was an error setting a new bio: ".concat(e.message))})))}),[]);Object(l.useEffect)((function(){at===Ve&&(console.debug("Got bio round trip from api."),nt(null))}),[at,Ve]);var it=Object(l.useCallback)((function(){et(Ve),Xe((function(e){return!e}))}),[Ve]),st=Object(l.useCallback)((function(){Ze!==Ve&&ot(Ze),it()}),[Ve,Ze,ot,it]),lt=Object(l.useMemo)((function(){return{padding:"12px 24px"}}),[]);return Object(P.jsxs)(P.Fragment,{children:[Object(P.jsxs)("div",{className:"page-container profile-page","data-v-c7c77311":"",children:[Object(P.jsxs)("div",{className:"profile-container","data-v-c7c77311":"",children:[Object(P.jsxs)("div",{className:v()((e={"profile-cover":!0},Object(a.a)(e,m.y,!0),Object(a.a)(e,"profile-cover-has-cover",!!ee.header),e)),onClick:Ne,"data-v-c7c77311":"",children:[ee.header&&Object(P.jsx)("img",{alt:"User set profile header.",src:"data:image/jpeg;base64,".concat(ee.header),"data-v-c7c77311":""}),Object(P.jsx)("i",{className:v()(m.b,"fas","fa-pencil-alt","cover-pencil"),"data-v-c7c77311":""})]}),Object(P.jsxs)("div",{className:"profile-info-container","data-v-c7c77311":"",children:[Object(P.jsx)("div",{className:"profile-avatar",style:{height:"".concat(122,"px"),width:"".concat(122,"px")},"data-v-c7c77311":"",children:Object(P.jsx)(N.a,{height:122,publicKey:T,setsAvatar:!0,greyBorder:!0,disableOnlineRing:!0,"data-v-c7c77311":""})}),Object(P.jsxs)("div",{className:"profile-info","data-v-c7c77311":"",children:[Object(P.jsxs)("p",{className:v()(m.D,"profile-name"),onClick:Le,"data-v-c7c77311":"",children:[Ke||Pe,Object(P.jsx)("i",{className:"fas fa-pencil-alt pencil-btn","data-v-c7c77311":""})]}),Object(P.jsxs)("p",{className:v()(m.D,"profile-desc"),onClick:it,"data-v-c7c77311":"",children:[at||ee.bio||"Lightning.Page user",Object(P.jsx)("i",{className:"fas fa-pencil-alt pencil-btn","data-v-c7c77311":""})]}),Object(P.jsxs)("div",{className:"config-btn",onClick:ve,"data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"config-btn-icon icon-solid-spending-rule","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"config-btn-text","data-v-c7c77311":"",children:"Config"})]})]})]}),Object(P.jsxs)("div",{"data-v-c7c77311":"",children:[Object(P.jsx)(j.b,{to:"/goLive",className:"profile-choice-container","data-v-c7c77311":"",children:Object(P.jsxs)("div",{style:{backgroundColor:"red",color:"white",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"0.2em 0.5em",borderRadius:"0.7em",fontSize:"16px",fontWeight:600},"data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"fas fa-video","data-v-c7c77311":""}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:"GO LIVE"})]})}),Object(P.jsxs)(j.b,{to:"/createPost",className:"profile-choice-container","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"profile-choice-icon fas fa-pen-square","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-choice-text","data-v-c7c77311":"",children:"Create Post"})]}),Object(P.jsxs)(j.b,{to:"/publishContent",className:"profile-choice-container","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"profile-choice-icon fab fa-youtube","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-choice-text","data-v-c7c77311":"",children:"Publish Content"})]}),Object(P.jsxs)("button",{className:"profile-choice-container","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"profile-choice-icon fas fa-shopping-cart","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-choice-text","data-v-c7c77311":"",children:"Offer a Product"})]}),Object(P.jsxs)(j.b,{to:"/offerService",className:"profile-choice-container","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"profile-choice-icon fas fa-running","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-choice-text","data-v-c7c77311":"",children:"Offer a Service"})]})]}),Object(P.jsx)(H.a,{onChange:je,selected:Q,"data-v-c7c77311":""}),Object(P.jsxs)("div",{className:"","data-v-c7c77311":"",children:["posts"===Q&&E.map((function(e){return p.o(e)?Object(P.jsx)(l.Suspense,{fallback:Object(P.jsx)(k.a,{"data-v-c7c77311":""}),"data-v-c7c77311":"",children:Object(P.jsx)(J,{postID:e.originalPostID,sharerPublicKey:e.sharedBy,openTipModal:O.b,openUnlockModal:O.b,openDeleteModal:ye,openShareModal:null,"data-v-c7c77311":""})},e.shareID):Object(P.jsx)(l.Suspense,{fallback:Object(P.jsx)(k.a,{"data-v-c7c77311":""}),"data-v-c7c77311":"",children:Object(P.jsx)(G,{id:e.id,publicKey:e.authorId,openTipModal:O.b,openUnlockModal:O.b,openDeleteModal:ye,openShareModal:null,"data-v-c7c77311":""})},e.id)})),"services"===Q&&function(){if(ee.offerSeedService)return Object.entries(A).filter((function(e){var t=Object(s.a)(e,2),c=t[0];return!!t[1]&&ee.offerSeedService===c})).map((function(e){var c=Object(s.a)(e,2),a=c[0],n=c[1];return Object(P.jsxs)("div",{className:"post","data-v-c7c77311":"",children:[Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service ID"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:a}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Tpe"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.serviceType||""}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Title"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.serviceTitle||""}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Description"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.serviceDescription||""}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Condition"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.serviceCondition||""}),Object(P.jsx)("strong",{"data-v-c7c77311":"",children:"Service Price"}),Object(P.jsx)("p",{"data-v-c7c77311":"",children:n.servicePrice||""}),Object(P.jsx)("button",{onClick:function(){console.log("delete wtf"),Object(h.d)(a)(t)},"data-v-c7c77311":"",children:"DELETE SERVICE"})]},a)}))}()]}),Object(P.jsx)(K.a,{amt:200,"data-v-c7c77311":""}),Object(P.jsxs)(C.a,{toggleModal:te,modalOpen:r,contentStyle:{padding:"40px 30px"},"data-v-c7c77311":"",children:[Object(P.jsx)(u.a,{bgColor:"#23282d",fgColor:"#64bbff",value:"".concat(ie,"/").concat(T),size:180,className:"profile-qrcode",imageSettings:X,"data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-qrcode-desc","data-v-c7c77311":"",children:"Other users can scan this code to contact you"}),!navigator.clipboard&&Object(P.jsx)("input",{className:"hidden-input",id:"public-key-holder",readOnly:!0,type:"text",value:"".concat(ie,"/").concat(T),"data-v-c7c77311":""}),Object(P.jsxs)("div",{className:"profile-clipboard-container",onClick:_e,"data-v-c7c77311":"",children:[Object(P.jsx)("img",{src:z.a,className:"profile-clipboard-icon",alt:"","data-v-c7c77311":""}),Object(P.jsx)("p",{className:"profile-clipboard-text","data-v-c7c77311":"",children:"Tap to copy to clipboard"})]})]}),Object(P.jsxs)(C.a,{toggleModal:ve,modalOpen:ne,contentStyle:{padding:"2em 2em"},"data-v-c7c77311":"",children:[Object(P.jsx)("label",{htmlFor:"new-web-client-prefix","data-v-c7c77311":"",children:"Web Client"}),Object(P.jsxs)("div",{className:"web-client-prefix-picker","data-v-c7c77311":"",children:[Object(P.jsx)("i",{className:"far fa-copy",onClick:be,style:{fontSize:24},"data-v-c7c77311":""}),Object(P.jsx)("select",{onChange:function(e){de(e.target.value)},name:"new-web-client-prefix",id:"new-web-client-prefix",value:re,"data-v-c7c77311":"",children:$.map((function(e){return Object(P.jsx)("option",{value:e,"data-v-c7c77311":"",children:e},e)}))}),Object(P.jsx)("span",{"data-v-c7c77311":"",children:"/"}),Object(P.jsx)("span",{style:{fontSize:12},"data-v-c7c77311":"",children:T})]}),!navigator.clipboard&&Object(P.jsx)("input",{className:"hidden-input",id:"web-client-url-holder",readOnly:!0,type:"text",value:re+"/"+T,"data-v-c7c77311":""}),Object(P.jsx)("br",{"data-v-c7c77311":""}),Object(P.jsx)("label",{htmlFor:"content-host","data-v-c7c77311":"",children:"Content Host"}),Object(P.jsx)(M,{"data-v-c7c77311":""}),Object(P.jsx)("br",{"data-v-c7c77311":""}),fe&&Object(P.jsxs)("div",{className:"flex-center",style:{marginTop:"auto"},"data-v-c7c77311":"",children:[Object(P.jsx)("button",{onClick:pe,className:"shock-form-button m-1","data-v-c7c77311":"",children:"CANCEL"}),Object(P.jsx)("button",{onClick:Oe,className:"shock-form-button-confirm m-1","data-v-c7c77311":"",children:"SUBMIT"})]})]}),Object(P.jsxs)(C.a,{toggleModal:ye,modalOpen:w,contentStyle:{padding:"2em 2em"},blueBtn:!B&&"Cancel",disableBlueBtn:B,onClickBlueBtn:Se,redBtn:!B&&"Delete",disableRedBtn:B,onClickRedBtn:we,noFullWidth:!0,"data-v-c7c77311":"",children:[!B&&Object(P.jsx)("span",{className:"text-align-center","data-v-c7c77311":"",children:"Are you sure?"}),B&&Object(P.jsx)(k.a,{"data-v-c7c77311":""})]}),Object(P.jsx)(g.a,{onClick:te,large:!0,iconURL:L.a,icon:null,label:null,"data-v-c7c77311":""})]}),Object(P.jsx)(x.a,{"data-v-c7c77311":""})]}),Object(P.jsx)("input",{type:"file",id:"avatar-file",ref:he,hidden:!0,accept:"image/*",onChange:ke,"data-v-c7c77311":""}),Object(P.jsxs)(C.a,{contentStyle:qe,modalOpen:Be,toggleModal:Le,"data-v-c7c77311":"",children:[Object(P.jsx)("label",{htmlFor:"newDisplayName","data-v-c7c77311":"",children:"Display Name"}),Object(P.jsx)("input",{autoCapitalize:"none",autoCorrect:"off",type:"text",className:"input-field",placeholder:"New display name",name:"newDisplayName",onChange:function(e){var t=e.target.value;Ae(t)},value:Ue,"data-v-c7c77311":""}),Ue!==Pe&&""!==Ue?Object(P.jsx)("button",{onClick:We,className:"shock-form-button-confirm m-1","data-v-c7c77311":"",children:"OK"}):Object(P.jsx)("button",{onClick:Le,className:"shock-form-button m-1","data-v-c7c77311":"",children:"GO BACK"})]}),Object(P.jsxs)(C.a,{contentStyle:lt,modalOpen:$e,toggleModal:it,"data-v-c7c77311":"",children:[Object(P.jsx)("label",{htmlFor:"newBio","data-v-c7c77311":"",children:"New Bio"}),Object(P.jsx)("input",{autoCapitalize:"none",autoCorrect:"off",type:"text",className:"input-field",placeholder:"New bio",name:"newBio",onChange:function(e){var t=e.target.value;et(t)},value:Ze,"data-v-c7c77311":""}),Ze!==Ve&&""!==Ze?Object(P.jsx)("button",{onClick:st,className:"shock-form-button-confirm m-1","data-v-c7c77311":"",children:"OK"}):Object(P.jsx)("button",{onClick:it,className:"shock-form-button m-1","data-v-c7c77311":"",children:"GO BACK"})]})]})}}}]);
//# sourceMappingURL=19.6e6927fe.chunk.js.map