(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[22],{447:function(e,t,a){"use strict";a(3),a(455);var r=a(7);t.a=function(e){var t=e.tipCounter,a=e.tipValue,n=e.zoomed;return a>0?Object(r.jsxs)("div",{className:"ribbon-container",style:{opacity:n?0:1},"data-v-89f23dd9":"",children:[Object(r.jsx)("p",{className:"ribbon-title","data-v-89f23dd9":"",children:"Total Tips"}),Object(r.jsxs)("p",{className:"ribbon-value","data-v-89f23dd9":"",children:[t," ",1===t?"Tip":"Tips"]})]}):null}},455:function(e,t,a){},459:function(e,t,a){"use strict";var r=a(3),n=a(7);t.a=function(e){var t=e.color,a=e.length,c=e.type,s=e.width,i=Object(r.useMemo)((function(){return"vertical"===c?{borderLeftStyle:"solid",borderLeftWidth:"".concat(s/2,"px"),borderLeftColor:t,borderRightStyle:"solid",borderRightWidth:"".concat(s/2,"px"),borderRightColor:t,height:a}:"horizontal"===c?{borderTopStyle:"solid",borderTopWidth:s/2,borderTopColor:t,borderBottomStyle:"solid",borderBottomWidth:s/2,borderBottomColor:t,width:a}:{}}),[t,a,c,s]);return Object(n.jsx)("div",{style:i})}},462:function(e,t,a){"use strict";var r=a(2),n=a.n(r),c=a(6),s=a(14),i=a(3),o=a(447),d=(a(463),a(148)),l=a(15),u=a(7),b="".concat("https://webtorrent.shock.network","/rtmpapi/api/streams/live");t.a=function(e){e.id;var t=e.item,a=(e.index,e.postId,e.tipValue),r=e.tipCounter,f=e.hideRibbon,v=e.width,j=e.timeout,p=void 0===j?1e4:j,h=Object(i.useRef)(null),m=Object(i.useState)(!1),O=Object(s.a)(m,2),x=O[0],g=O[1],y={width:"100%"};return v&&(y.width=v),Object(i.useEffect)((function(){var e=null,a=function(){var e=Object(c.a)(n.a.mark((function e(){var a,r,c,i;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.magnetURI.split("/live/")[1].split("/index.m3u8"),r=Object(s.a)(a,1),c=r[0],e.next=4,l.a.get("".concat(b,"/").concat(c));case 4:if(e.sent.data.isLive){e.next=7;break}return e.abrupt("return",!1);case 7:return(i=Object(d.a)(h.current,{autoplay:!0,muted:!0,aspectRatio:"16:9"})).src({src:t.magnetURI,type:"application/x-mpegURL"}),i.play(),e.abrupt("return",!0);case 13:return e.prev=13,e.t0=e.catch(0),e.abrupt("return",!1);case 16:case"end":return e.stop()}}),e,null,[[0,13]])})));return function(){return e.apply(this,arguments)}}();return a().then((function(t){t?g(!0):e=setInterval(Object(c.a)(n.a.mark((function t(){return n.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a();case 2:if(!t.sent){t.next=7;break}return g(!0),clearInterval(e),t.abrupt("return");case 7:case"end":return t.stop()}}),t)}))),p)})),function(){clearInterval(e)}}),[t,p]),Object(u.jsx)("div",{className:"media-container w-100","data-v-e99aa5ee":"",children:Object(u.jsxs)("div",{className:"video-container w-100",style:{cursor:"pointer",width:"100%"},"data-v-e99aa5ee":"",children:[!x&&Object(u.jsx)("p",{"data-v-e99aa5ee":"",children:"The streamer has disconnected."}),Object(u.jsx)("div",{style:x?{width:"100%"}:{display:"none",width:"100%"},"data-v-e99aa5ee":"",children:Object(u.jsx)("video",{className:"video-js vjs-default-skin",ref:h,style:y,preload:"auto",controls:!0,muted:!0,autoPlay:!0,"data-v-e99aa5ee":""})}),!f&&Object(u.jsx)(o.a,{tipCounter:r,tipValue:a,zoomed:!1,"data-v-e99aa5ee":""})]})})}},463:function(e,t,a){},675:function(e,t,a){},676:function(e,t,a){e.exports={root:"Static_root__Dyzfu",overlay:"Static_overlay__1DRAx","overlay-text":"Static_overlay-text__2Rle7"}},677:function(e,t,a){e.exports={"stream-type-btn":"GoLive_stream-type-btn__3sNtJ","stream-type-btn-icon":"GoLive_stream-type-btn-icon__2p9-P","obs-logo":"GoLive_obs-logo__1p3Hh"}},717:function(e,t,a){"use strict";a.r(t);var r=a(2),n=a.n(r),c=a(6),s=a(14),i=a(3),o=a.n(i),d=a(40),l=a(73),u=a.n(l),b=(a(675),a(39)),f=a(145),v=a(15),j=a.p+"static/media/obs-2.7c61e78e.svg",p=a(462),h=a(554),m=a(22),O=a(435),x=a(18),g=a(469),y=a(434),k=a(459),w=a(436),C=a(676),S=a.n(C),N=a(7),T=function(e){var t=e.overlay,a=o.a.useRef(),r=o.a.useState(100),n=Object(s.a)(r,2),c=n[0],i=n[1],d=o.a.useCallback((function(e){if(e)try{i(e.getBoundingClientRect().width)}catch(t){console.log("Error inside onWidth mechanism in <Static />:"),console.log(t)}}),[]);o.a.useEffect((function(){var e=a.current;e?(e.width=c,e.height=c/16*9):console.error("Canvas ref falsy inside <Static />.")}),[c]);var l=o.a.useRef(!0);return o.a.useEffect((function(){l.current=!0;var e=a.current;if(e){var t=e.getContext("2d"),r=t.createImageData(e.width,e.height);return function e(){if(l.current){for(var a=0,n=r.data.length;a<n;a++)r.data[a]=255*Math.random()|0;t.putImageData(r,0,0),requestAnimationFrame(e)}}(),function(){l.current=!1}}console.error("Canvas ref falsy inside <Static />.")}),[c]),Object(N.jsxs)(N.Fragment,{children:[Object(N.jsxs)("div",{className:S.a.root,children:[t&&Object(N.jsx)("div",{className:S.a.overlay,children:Object(N.jsx)("span",{className:S.a["overlay-text"],children:t})}),Object(N.jsx)("canvas",{ref:a})]}),Object(N.jsx)("div",{className:y.width100,ref:d})]})},P=function(){var e=o.a.useRef(),t=o.a.useState(100),a=Object(s.a)(t,2),r=a[0],n=a[1],c=o.a.useState(""),i=Object(s.a)(c,2),d=i[0],l=i[1],b=o.a.useCallback((function(e){if(e)try{n(e.getBoundingClientRect().width)}catch(t){l("Error inside onWidth mechanism in <CamFeed />:"),console.log(t)}}),[]);return o.a.useEffect((function(){var t=e.current;t?t.width=r:l("Video ref falsy inside <CamFeed />.")}),[r]),o.a.useEffect((function(){var t,a;if(null===(t=navigator)||void 0===t||null===(a=t.mediaDevices)||void 0===a?void 0:a.getUserMedia){var r=e.current;navigator.mediaDevices.getUserMedia({video:!0}).then((function(e){r.srcObject=e})).catch((function(e){l("Could not get your camera feed: ".concat(e.message))}))}}),[]),Object(N.jsxs)(N.Fragment,{children:[d&&Object(N.jsx)(T,{overlay:d}),Object(N.jsx)("video",{autoPlay:!0,className:u()(d&&y.displayNone),ref:e}),Object(N.jsx)("div",{className:y.width100,ref:b})]})},R=a(677),I=a.n(R);t.default=function(){var e=Object(d.b)(),t=Object(m.g)(),a=x.useSelector((function(e){return e.content.seedProviderPub})),r=x.useSelector((function(e){return e.content.seedInfo})),o=r.seedUrl,l=r.seedToken,C=x.useSelector((function(e){return e.content.streamLiveToken})),S=x.useSelector((function(e){return e.content.streamUserToken})),R=x.useSelector((function(e){return e.content.availableTokens})),_=x.useSelector((function(e){return e.content.streamUrl})),U=x.useSelector((function(e){return e.userProfiles})),D=Object(i.useState)("obs"),L=Object(s.a)(D,2),B=L[0],F=L[1],E=Object(i.useState)(!1),M=Object(s.a)(E,2),W=M[0],z=M[1],V=Object(i.useState)(C),A=Object(s.a)(V,2),G=A[0],J=A[1],H=Object(i.useState)(S),q=Object(s.a)(H,2)[1],K=Object(i.useState)("Look I'm streaming!"),Y=Object(s.a)(K,2),Q=Y[0],X=Y[1],Z=Object(i.useState)(!1),$=Object(s.a)(Z,1)[0],ee=Object(i.useState)(null),te=Object(s.a)(ee,2),ae=te[0],re=te[1],ne=Object(i.useState)(""),ce=Object(s.a)(ne,2),se=ce[0],ie=ce[1],oe=Object(i.useState)(null),de=Object(s.a)(oe,2),le=de[0],ue=de[1],be=Object(i.useState)(!1),fe=Object(s.a)(be,2),ve=fe[0],je=fe[1],pe=Object(i.useCallback)(function(){var t=Object(c.a)(n.a.mark((function t(r,c){var i,d,u,f,j,p,m,O,x,g,y,k,w;return n.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,z(!0),t.next=4,Object(h.a)({availableTokens:R,seedProviderPub:a,seedToken:l,seedUrl:o,serviceID:c,servicePrice:r});case 4:return i=t.sent,d=i.seedUrl,u=i.tokens,f=Object(s.a)(u,1),j=f[0],q(j),t.next=11,v.a.post("".concat(d,"/api/stream/auth"),{token:j});case 11:return p=t.sent,m=p.data,O=m.data.token,console.log(O),x="".concat(j,"?key=").concat(O),J("".concat(j,"?key=").concat(O)),g="".concat(d,"/rtmpapi/live/").concat(j,"/index.m3u8"),y=d.replace("https","rtmp"),ie("".concat(y,"/live")),Object(b.d)(j,x,g)(e),k=[],""!==Q&&k.push({type:"text/paragraph",text:Q}),k.push({type:"stream/embedded",width:0,height:0,magnetURI:g,isPreview:!1,isPrivate:!1,userToken:j}),t.next=26,v.a.post("/api/gun/wall",{tags:[],title:"Post",contentItems:k});case 26:200===t.sent.status?(console.log("post created successfully"),z(!1)):(re("invalid response status"),z(!1)),t.next=35;break;case 30:t.prev=30,t.t0=t.catch(0),console.log(t.t0),re(null!==(w=null===t.t0||void 0===t.t0?void 0:t.t0.errorMessage)&&void 0!==w?w:null===t.t0||void 0===t.t0?void 0:t.t0.message),z(!1);case 35:case"end":return t.stop()}}),t,null,[[0,30]])})));return function(e,a){return t.apply(this,arguments)}}(),[R,a,l,o,e,Q]),he=Object(i.useCallback)((function(){ue(null)}),[ue]),me=Object(i.useCallback)((function(){var e=le.servicePrice,t=le.serviceID;pe(e,t),ue(null)}),[le,pe,ue]),Oe=Object(i.useCallback)(function(){var e=Object(c.a)(n.a.mark((function e(t){var r,c,s,i,d,u;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,!ve){e.next=3;break}return e.abrupt("return");case 3:je(!0),t.preventDefault(),r=!1,e.t0=n.a.keys(R);case 7:if((e.t1=e.t0()).done){e.next=16;break}if(c=e.t1.value,!Object.prototype.hasOwnProperty.call(R,c)){e.next=14;break}if(!R[c][0]){e.next=14;break}return r=!0,e.abrupt("break",16);case 14:e.next=7;break;case 16:if(s="",U[a]&&(s=U[a].SeedServiceProvided),!(r||o&&l)){e.next=22;break}pe(),e.next=33;break;case 22:if(!s||!a){e.next=32;break}return e.next=25,v.a.get("/api/gun/otheruser/".concat(a,"/load/offeredServices>").concat(s));case 25:i=e.sent,d=i.data,u=d.data.servicePrice,console.log(d),ue({servicePrice:u,serviceID:s}),e.next=33;break;case 32:re("No way found to publish content");case 33:e.next=38;break;case 35:e.prev=35,e.t2=e.catch(0),re(e.t2.message);case 38:return e.prev=38,je(!1),e.finish(38);case 41:case"end":return e.stop()}}),e,null,[[0,35,38,41]])})));return function(t){return e.apply(this,arguments)}}(),[ve,U,a,o,l,R,pe]),xe=Object(i.useCallback)((function(){navigator.clipboard.writeText(G)}),[G]),ge=Object(i.useCallback)((function(){navigator.clipboard.writeText(se)}),[se]),ye=Object(i.useCallback)((function(e){var t=e.target,a=t.value;switch(t.name){case"paragraph":return void X(a);case"source":return void F(a);default:return}}),[X,F]),ke=Object(i.useCallback)((function(){Object(b.f)()(e),t.push("/profile")}),[e,t]),we=Object(i.useMemo)((function(){return Object(N.jsx)(p.a,{hideRibbon:!0,item:{magnetURI:_},timeout:1500,id:void 0,index:void 0,postId:void 0,tipCounter:void 0,tipValue:void 0,width:void 0,"data-v-7e2f1bd4":""})}),[_]),Ce=u()(y.col,y.centerJustify,y.centerAlign,I.a["stream-type-btn"]);return Object(N.jsxs)(N.Fragment,{children:[Object(N.jsxs)(g.a,{pageTitle:"GO LIVE",scrolls:!0,"data-v-7e2f1bd4":"",children:[$&&Object(N.jsx)("div",{"data-v-7e2f1bd4":"",children:we}),$||"camera"!==B?Object(N.jsx)(T,{"data-v-7e2f1bd4":""}):Object(N.jsx)(P,{"data-v-7e2f1bd4":""}),Object(N.jsxs)("div",{className:u()(y.rowCentered,y.width100),"data-v-7e2f1bd4":"",children:[Object(N.jsxs)("div",{className:Ce,onClick:F.bind(null,"camera"),"data-v-7e2f1bd4":"",children:[Object(N.jsx)("i",{className:u()(I.a["stream-type-btn-icon"],"fas","fa-camera"),"data-v-7e2f1bd4":""}),Object(N.jsx)(w.a,{amt:16,"data-v-7e2f1bd4":""}),Object(N.jsx)(k.a,{color:"camera"===B?"#4285b9":"white",length:36,type:"horizontal",width:2,"data-v-7e2f1bd4":""})]}),Object(N.jsxs)("div",{className:Ce,onClick:F.bind(null,"obs"),"data-v-7e2f1bd4":"",children:[Object(N.jsx)("img",{alt:"",className:I.a["obs-logo"],src:j,"data-v-7e2f1bd4":""}),Object(N.jsx)(w.a,{amt:16,"data-v-7e2f1bd4":""}),Object(N.jsx)(k.a,{color:"obs"===B?"#4285b9":"white",length:36,type:"horizontal",width:2,"data-v-7e2f1bd4":""})]})]}),Object(N.jsx)("div",{className:y.commonPaddingH,"data-v-7e2f1bd4":"",children:ae?Object(N.jsxs)(N.Fragment,{children:[Object(N.jsx)("p",{"data-v-7e2f1bd4":"",children:" An error ocurred: "}),Object(N.jsx)("br",{"data-v-7e2f1bd4":""}),Object(N.jsx)("p",{className:"error-container","data-v-7e2f1bd4":"",children:ae}),Object(N.jsx)("button",{className:"shock-form-button",onClick:re.bind(null,null),"data-v-7e2f1bd4":"",children:"Dismiss"})]}):G?Object(N.jsxs)(N.Fragment,{children:["obs"===B&&Object(N.jsx)("p",{className:"m-b-1","data-v-7e2f1bd4":"",children:"You are ready to go! setup the stream with OBS and watch it from your profile"}),Object(N.jsx)("p",{"data-v-7e2f1bd4":"",children:"Broadcaster:"}),Object(N.jsxs)("div",{style:{border:"1px solid var(--main-blue)",padding:"0.5rem",display:"flex",justifyContent:"space-between",marginBottom:"1rem"},"data-v-7e2f1bd4":"",children:[Object(N.jsx)("p",{"data-v-7e2f1bd4":"",children:se.substring(0,20)+(se.length>21?"...":"")}),Object(N.jsx)("i",{className:"far fa-copy",onClick:ge,"data-v-7e2f1bd4":""})]}),Object(N.jsx)("p",{"data-v-7e2f1bd4":"",children:"Stream Key:"}),Object(N.jsxs)("div",{style:{border:"1px solid var(--main-blue)",padding:"0.5rem",display:"flex",justifyContent:"space-between",marginBottom:"1rem"},"data-v-7e2f1bd4":"",children:[Object(N.jsx)("p",{"data-v-7e2f1bd4":"",children:G.substring(0,20)+(G.length>21?"...":"")}),Object(N.jsx)("i",{className:"far fa-copy",onClick:xe,"data-v-7e2f1bd4":""})]}),Object(N.jsx)("div",{className:"flex-center","data-v-7e2f1bd4":"",children:Object(N.jsx)("button",{onClick:ke,className:"shock-form-button-confirm","data-v-7e2f1bd4":"",children:"STOP"})})]}):Object(N.jsxs)(N.Fragment,{children:[Object(N.jsx)("input",{className:"input-field",type:"text",name:"paragraph",id:"paragraph",value:Q,onChange:ye,"data-v-7e2f1bd4":""}),Object(N.jsx)("button",{onClick:Oe,className:u()(y.width100,"shock-form-button-confirm"),disabled:"camera"===B||ve,"data-v-7e2f1bd4":"",children:ve?"...":"START NOW"})]})})]}),le&&Object(N.jsxs)(O.a,{modalOpen:le&&!W,toggleModal:he,contentStyle:{padding:"1rem"},"data-v-7e2f1bd4":"",children:[Object(N.jsxs)("p",{"data-v-7e2f1bd4":"",children:["The service from the default service provider will cost:"," ",Object(N.jsxs)("strong",{"data-v-7e2f1bd4":"",children:[le.servicePrice," sats"]})]}),Object(N.jsxs)("div",{className:y.rowCentered,"data-v-7e2f1bd4":"",children:[Object(N.jsx)("button",{className:"shock-form-button m-1",onClick:he,"data-v-7e2f1bd4":"",children:"Cancel"}),Object(N.jsx)("button",{className:"shock-form-button-confirm m-1",onClick:me,"data-v-7e2f1bd4":"",children:"Confirm"})]})]}),W?Object(N.jsx)(f.a,{overlay:!0,fullScreen:!0,text:"Creating stream...","data-v-7e2f1bd4":""}):null]})}}}]);
//# sourceMappingURL=22.2e11a8e0.chunk.js.map