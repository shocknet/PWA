(this["webpackJsonpshocknet-pwa"]=this["webpackJsonpshocknet-pwa"]||[]).push([[22],{447:function(e,t,a){"use strict";a(3),a(455);var n=a(7);t.a=function(e){var t=e.tipCounter,a=e.tipValue,c=e.zoomed;return a>0?Object(n.jsxs)("div",{className:"ribbon-container",style:{opacity:c?0:1},"data-v-b712ad81":"",children:[Object(n.jsx)("p",{className:"ribbon-title","data-v-b712ad81":"",children:"Total Tips"}),Object(n.jsxs)("p",{className:"ribbon-value","data-v-b712ad81":"",children:[t," ",1===t?"Tip":"Tips"]})]}):null}},455:function(e,t,a){},459:function(e,t,a){"use strict";var n=a(3),c=a(7);t.a=function(e){var t=e.color,a=e.length,r=e.type,s=e.width,o=Object(n.useMemo)((function(){return"vertical"===r?{borderLeftStyle:"solid",borderLeftWidth:"".concat(s/2,"px"),borderLeftColor:t,borderRightStyle:"solid",borderRightWidth:"".concat(s/2,"px"),borderRightColor:t,height:a}:"horizontal"===r?{borderTopStyle:"solid",borderTopWidth:s/2,borderTopColor:t,borderBottomStyle:"solid",borderBottomWidth:s/2,borderBottomColor:t,width:a}:{}}),[t,a,r,s]);return Object(c.jsx)("div",{style:o})}},462:function(e,t,a){"use strict";var n=a(14),c=a(3),r=a(447),s=(a(463),a(148)),o=a(7);"".concat("https://webtorrent.shock.network","/rtmpapi/api/streams/live");t.a=function(e){e.id;var t=e.item,a=(e.index,e.postId,e.tipValue),i=e.tipCounter,d=e.hideRibbon,l=e.width,b=(e.timeout,Object(c.useRef)(null)),u=Object(c.useState)(!1),v=Object(n.a)(u,2),p=v[0],j=(v[1],{width:"100%"});l&&(j.width=l);var f=t.liveStatus;return Object(c.useEffect)((function(){var e=Object(s.a)(b.current,{autoplay:!0,muted:!0,aspectRatio:"16:9"});e.src({src:t.magnetURI,type:"application/x-mpegURL"}),e.play()}),[t]),Object(c.useEffect)((function(){console.log("status:",f)}),[t]),Object(o.jsx)("div",{className:"media-container w-100","data-v-e99aa5ee":"",children:Object(o.jsxs)("div",{className:"video-container w-100",style:{cursor:"pointer",width:"100%"},"data-v-e99aa5ee":"",children:[!p&&"waiting"===f&&Object(o.jsx)("p",{"data-v-e99aa5ee":"",children:"The stream did not start yet."}),!p&&"wasLive"===f&&Object(o.jsx)("p",{"data-v-e99aa5ee":"",children:"The stream is over"}),!p&&!f&&Object(o.jsx)("p",{"data-v-e99aa5ee":"",children:"The streamer has disconnected."}),Object(o.jsx)("div",{style:"live"===f?{width:"100%"}:{display:"none",width:"100%"},"data-v-e99aa5ee":"",children:Object(o.jsx)("video",{className:"video-js vjs-default-skin",ref:b,style:j,preload:"auto",controls:!0,muted:!0,autoPlay:!0,"data-v-e99aa5ee":""})}),!d&&Object(o.jsx)(r.a,{tipCounter:i,tipValue:a,zoomed:!1,"data-v-e99aa5ee":""})]})})}},463:function(e,t,a){},675:function(e,t,a){},676:function(e,t,a){e.exports={"stream-type-btn":"GoLive_stream-type-btn__3sNtJ","stream-type-btn-icon":"GoLive_stream-type-btn-icon__2p9-P","obs-logo":"GoLive_obs-logo__1p3Hh"}},720:function(e,t,a){"use strict";a.r(t);var n=a(2),c=a.n(n),r=a(6),s=a(14),o=a(3),i=a(40),d=a(73),l=a.n(d),b=(a(675),a(39)),u=a(145),v=a(15),p=a.p+"static/media/obs-2.7c61e78e.svg",j=a(462),f=a(554),m=a(22),h=a(435),O=a(18),x=a(469),g=a(434),k=a(459),y=a(436),w=a(676),S=a.n(w),C=a(7);t.default=function(){var e=Object(i.b)(),t=Object(m.g)(),a=O.useSelector((function(e){return e.content.seedProviderPub})),n=O.useSelector((function(e){return e.content.seedInfo})),d=n.seedUrl,w=n.seedToken,T=O.useSelector((function(e){return e.content.streamLiveToken})),N=O.useSelector((function(e){return e.content.streamUserToken})),I=O.useSelector((function(e){return e.content.availableTokens})),P=O.useSelector((function(e){return e.content.streamPostId})),U=O.useSelector((function(e){return e.content.streamContentId})),L=O.useSelector((function(e){return e.content.streamStatusUrl})),R=O.useSelector((function(e){return e.content.streamUrl})),_=O.useSelector((function(e){return e.userProfiles})),B=Object(o.useState)("obs"),D=Object(s.a)(B,2),z=D[0],M=D[1],V=Object(o.useState)(!1),W=Object(s.a)(V,2),E=W[0],F=W[1],G=Object(o.useState)(T),J=Object(s.a)(G,2),A=J[0],H=J[1],$=Object(o.useState)(N),K=Object(s.a)($,2)[1],Y=Object(o.useState)("Look I'm streaming!"),q=Object(s.a)(Y,2),Q=q[0],X=q[1],Z=Object(o.useState)(!1),ee=Object(s.a)(Z,2),te=ee[0],ae=ee[1],ne=Object(o.useState)(null),ce=Object(s.a)(ne,2),re=ce[0],se=ce[1],oe=Object(o.useState)(""),ie=Object(s.a)(oe,2),de=ie[0],le=ie[1],be=Object(o.useState)(null),ue=Object(s.a)(be,2),ve=ue[0],pe=ue[1],je=Object(o.useState)(!1),fe=Object(s.a)(je,2),me=fe[0],he=fe[1],Oe=Object(o.useState)(0),xe=Object(s.a)(Oe,2),ge=xe[0],ke=xe[1];Object(o.useEffect)((function(){if(L){var e,t=setInterval(Object(r.a)(c.a.mark((function a(){return c.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,v.a.get(L);case 3:if(a.sent.data.isLive){a.next=6;break}return a.abrupt("return");case 6:ae(!0),clearInterval(t),e=setTimeout((function(){console.info("upp"),ke(Date.now())}),5e3),a.next=13;break;case 11:a.prev=11,a.t0=a.catch(0);case 13:case"end":return a.stop()}}),a,null,[[0,11]])}))),2e3);return function(){clearInterval(t),clearTimeout(e)}}}),[L,ae]);var ye=Object(o.useCallback)(function(){var t=Object(r.a)(c.a.mark((function t(n,r){var o,i,l,u,p,j,m,h,O,x,g,k,y,S,C,T,N,P,U,L,R,_;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,F(!0),t.next=4,Object(f.a)({availableTokens:I,seedProviderPub:a,seedToken:w,seedUrl:d,serviceID:r,servicePrice:n});case 4:return o=t.sent,i=o.seedUrl,l=o.tokens,u=Object(s.a)(l,1),p=u[0],K(p),t.next=11,v.a.post("".concat(i,"/api/stream/auth"),{token:p});case 11:return j=t.sent,m=j.data,h=m.data.token,console.log(h),O="".concat(p,"?key=").concat(h),H("".concat(p,"?key=").concat(h)),x="".concat(i,"/rtmpapi/live/").concat(p,"/index.m3u8"),g=i.replace("https","rtmp"),le("".concat(g,"/live")),k="".concat(i,"/rtmpapi/api/streams/live/").concat(p),y=[],""!==Q&&y.push({type:"text/paragraph",text:Q}),y.push({type:"stream/embedded",width:0,height:0,magnetURI:x,isPreview:!1,isPrivate:!1,userToken:p,liveStatus:"waiting",statusUrl:k}),t.next=26,v.a.post("/api/gun/wall",{tags:[],title:"Post",contentItems:y});case 26:if(200!==(S=t.sent).status){t.next=39;break}return C=S.data,T=Object(s.a)(C,2),N=T[0],P=T[1],console.log(P.contentItems),U=Object.entries(P.contentItems).find((function(e){var t=Object(s.a)(e,2);t[0];return t[1].magnetURI===x})),L=Object(s.a)(U,1),R=L[0],Object(b.d)({seedToken:p,liveToken:O,streamUrl:x,streamPostId:N,streamContentId:R,streamStatusUrl:k})(e),t.next=35,v.a.post("/api/listenStream",{postId:N,contentId:R,statusUrl:"".concat(i,"/rtmpapi/api/streams/live/").concat(p)});case 35:console.log("post created successfully"),F(!1),t.next=41;break;case 39:se("invalid response status"),F(!1);case 41:t.next=48;break;case 43:t.prev=43,t.t0=t.catch(0),console.log(t.t0),se(null!==(_=null===t.t0||void 0===t.t0?void 0:t.t0.errorMessage)&&void 0!==_?_:null===t.t0||void 0===t.t0?void 0:t.t0.message),F(!1);case 48:case"end":return t.stop()}}),t,null,[[0,43]])})));return function(e,a){return t.apply(this,arguments)}}(),[I,a,w,d,e,Q]),we=Object(o.useCallback)((function(){pe(null)}),[pe]),Se=Object(o.useCallback)((function(){var e=ve.servicePrice,t=ve.serviceID;ye(e,t),pe(null)}),[ve,ye,pe]),Ce=Object(o.useCallback)(function(){var e=Object(r.a)(c.a.mark((function e(t){var n,r,s,o,i,l;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,!me){e.next=3;break}return e.abrupt("return");case 3:he(!0),t.preventDefault(),n=!1,e.t0=c.a.keys(I);case 7:if((e.t1=e.t0()).done){e.next=16;break}if(r=e.t1.value,!Object.prototype.hasOwnProperty.call(I,r)){e.next=14;break}if(!I[r][0]){e.next=14;break}return n=!0,e.abrupt("break",16);case 14:e.next=7;break;case 16:if(s="",_[a]&&(s=_[a].SeedServiceProvided),!(n||d&&w)){e.next=22;break}ye(),e.next=33;break;case 22:if(!s||!a){e.next=32;break}return e.next=25,v.a.get("/api/gun/otheruser/".concat(a,"/load/offeredServices>").concat(s));case 25:o=e.sent,i=o.data,l=i.data.servicePrice,console.log(i),pe({servicePrice:l,serviceID:s}),e.next=33;break;case 32:se("No way found to publish content");case 33:e.next=38;break;case 35:e.prev=35,e.t2=e.catch(0),se(e.t2.message);case 38:return e.prev=38,he(!1),e.finish(38);case 41:case"end":return e.stop()}}),e,null,[[0,35,38,41]])})));return function(t){return e.apply(this,arguments)}}(),[me,_,a,d,w,I,ye]),Te=Object(o.useCallback)((function(){navigator.clipboard.writeText(A)}),[A]),Ne=Object(o.useCallback)((function(){navigator.clipboard.writeText(de)}),[de]),Ie=Object(o.useCallback)((function(e){var t=e.target,a=t.value;switch(t.name){case"paragraph":return void X(a);case"source":return void M(a);default:return}}),[X,M]),Pe=Object(o.useCallback)((function(){v.a.post("/api/gun/put",{path:"$user>posts>".concat(P,">contentItems>").concat(U,">liveStatus"),value:"wasLive"}),Object(b.f)()(e),console.info("doing it!!"),console.info(N),fetch("https://webtorrent.shock.network/api/stream/torrent/".concat(N)).then((function(e){return e.json()})).then((function(e){var t=e.magnet;t&&v.a.post("/api/gun/put",{path:"$user>posts>".concat(P,">contentItems>").concat(U,">playbackMagnet"),value:t})})).catch((function(e){return console.info(e)})),t.push("/profile")}),[e,t,N]),Ue=Object(o.useMemo)((function(){return Object(C.jsx)(j.a,{hideRibbon:!0,item:{magnetURI:R,liveStatus:"live"},timeout:1500,id:void 0,index:void 0,postId:void 0,tipCounter:void 0,tipValue:void 0,width:void 0,"data-v-7e2f1bd4":""})}),[R,ge]),Le=l()(g.col,g.centerJustify,g.centerAlign,S.a["stream-type-btn"]);return Object(C.jsxs)(C.Fragment,{children:[Object(C.jsxs)(x.a,{pageTitle:"GO LIVE",scrolls:!0,"data-v-7e2f1bd4":"",children:[te&&Object(C.jsx)("div",{"data-v-7e2f1bd4":"",children:Ue}),Object(C.jsxs)("div",{className:l()(g.rowCentered,g.width100),"data-v-7e2f1bd4":"",children:[Object(C.jsxs)("div",{className:Le,onClick:M.bind(null,"camera"),"data-v-7e2f1bd4":"",children:[Object(C.jsx)("i",{className:l()(S.a["stream-type-btn-icon"],"fas","fa-camera"),"data-v-7e2f1bd4":""}),Object(C.jsx)(y.a,{amt:16,"data-v-7e2f1bd4":""}),Object(C.jsx)(k.a,{color:"camera"===z?"#4285b9":"white",length:36,type:"horizontal",width:2,"data-v-7e2f1bd4":""})]}),Object(C.jsxs)("div",{className:Le,onClick:M.bind(null,"obs"),"data-v-7e2f1bd4":"",children:[Object(C.jsx)("img",{alt:"",className:S.a["obs-logo"],src:p,"data-v-7e2f1bd4":""}),Object(C.jsx)(y.a,{amt:16,"data-v-7e2f1bd4":""}),Object(C.jsx)(k.a,{color:"obs"===z?"#4285b9":"white",length:36,type:"horizontal",width:2,"data-v-7e2f1bd4":""})]})]}),Object(C.jsx)("div",{className:g.commonPaddingH,"data-v-7e2f1bd4":"",children:re?Object(C.jsxs)(C.Fragment,{children:[Object(C.jsx)("p",{"data-v-7e2f1bd4":"",children:" An error ocurred: "}),Object(C.jsx)("br",{"data-v-7e2f1bd4":""}),Object(C.jsx)("p",{className:"error-container","data-v-7e2f1bd4":"",children:re}),Object(C.jsx)("button",{className:"shock-form-button",onClick:se.bind(null,null),"data-v-7e2f1bd4":"",children:"Dismiss"})]}):A?Object(C.jsxs)(C.Fragment,{children:["obs"===z&&Object(C.jsx)("p",{className:"m-b-1","data-v-7e2f1bd4":"",children:"You are ready to go! setup the stream with OBS and watch it from your profile"}),Object(C.jsx)("p",{"data-v-7e2f1bd4":"",children:"Broadcaster:"}),Object(C.jsxs)("div",{style:{border:"1px solid var(--main-blue)",padding:"0.5rem",display:"flex",justifyContent:"space-between",marginBottom:"1rem"},"data-v-7e2f1bd4":"",children:[Object(C.jsx)("p",{"data-v-7e2f1bd4":"",children:de.substring(0,20)+(de.length>21?"...":"")}),Object(C.jsx)("i",{className:"far fa-copy",onClick:Ne,"data-v-7e2f1bd4":""})]}),Object(C.jsx)("p",{"data-v-7e2f1bd4":"",children:"Stream Key:"}),Object(C.jsxs)("div",{style:{border:"1px solid var(--main-blue)",padding:"0.5rem",display:"flex",justifyContent:"space-between",marginBottom:"1rem"},"data-v-7e2f1bd4":"",children:[Object(C.jsx)("p",{"data-v-7e2f1bd4":"",children:A.substring(0,20)+(A.length>21?"...":"")}),Object(C.jsx)("i",{className:"far fa-copy",onClick:Te,"data-v-7e2f1bd4":""})]}),Object(C.jsx)("div",{className:"flex-center","data-v-7e2f1bd4":"",children:Object(C.jsx)("button",{onClick:Pe,className:"shock-form-button-confirm","data-v-7e2f1bd4":"",children:"STOP"})})]}):Object(C.jsxs)(C.Fragment,{children:[Object(C.jsx)("input",{className:"input-field",type:"text",name:"paragraph",id:"paragraph",value:Q,onChange:Ie,"data-v-7e2f1bd4":""}),Object(C.jsx)("button",{onClick:Ce,className:l()(g.width100,"shock-form-button-confirm"),disabled:"camera"===z||me,"data-v-7e2f1bd4":"",children:me?"...":"START NOW"})]})})]}),ve&&Object(C.jsxs)(h.a,{modalOpen:ve&&!E,toggleModal:we,contentStyle:{padding:"1rem"},"data-v-7e2f1bd4":"",children:[Object(C.jsxs)("p",{"data-v-7e2f1bd4":"",children:["The service from the default service provider will cost:"," ",Object(C.jsxs)("strong",{"data-v-7e2f1bd4":"",children:[ve.servicePrice," sats"]})]}),Object(C.jsxs)("div",{className:g.rowCentered,"data-v-7e2f1bd4":"",children:[Object(C.jsx)("button",{className:"shock-form-button m-1",onClick:we,"data-v-7e2f1bd4":"",children:"Cancel"}),Object(C.jsx)("button",{className:"shock-form-button-confirm m-1",onClick:Se,"data-v-7e2f1bd4":"",children:"Confirm"})]})]}),E?Object(C.jsx)(u.a,{overlay:!0,fullScreen:!0,text:"Creating stream...","data-v-7e2f1bd4":""}):null]})}}}]);
//# sourceMappingURL=22.1fa1c364.chunk.js.map