/*! Built with http://stenciljs.com */
chessboard.loadBundle("yie1m7bq",["exports"],function(e){var t=window.chessboard.h,n=function(){function e(){this.items=1,this.x=0,this.y=0,this.menuDisplay="none",this.ovlBg="transparent",this.header="",this.footer=""}return e.prototype.render=function(){var e=this,n=screen.availWidth,i=screen.availHeight,o=new Array(this.items).slice().map(function(e,t){return t});console.log(o);var r={display:this.menuDisplay,position:"absolute",top:"0",left:"0",width:.99*n+"px",height:.82*i+"px",minWidth:.99*n+"px",minHeight:.82*i+"px",maxWidth:.99*n+"px",maxHeight:.82*i+"px",background:this.ovlBg,opacity:"1",zIndex:"10"},l={display:"flex",flexDirection:"column",justyfyContent:"flex-start",position:"relative",left:this.x+"px",top:this.y+"px",paddingLeft:"1em",minWidth:"10em",maxWidth:"20%",minHeight:"3em",overFlowY:"auto",color:"black",background:"white",border:"solid 1px black",borderRadius:"5px",mozBoxShadowBottom:"10px 10px 10px black",webkitBoxShadowBottom:"10px 10px 10px black",boxShadowBottom:"10px 10px 10px black",opacity:"1"},a={display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"solid 1px #dfdfdf"};return t("div",{ref:function(t){return e.overlay=t},style:Object.assign({},r),onClick:function(){e.closeMenu.emit()}},t("div",{style:Object.assign({},l),onClick:function(e){e.cancelBubble=!0}},t("div",{style:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",fontWeight:"bold",padding:"0.5em"}},t("h3",null,this.header),t("div",{title:"Close",style:{cursor:"pointer",textAlign:"center",color:"white",padding:"0.2em",background:"red",border:"none",borderRadius:"50%",fontWeight:"bolder",fontSize:"1em",width:"1.2em",height:"1.2em"},onClick:function(){e.closeMenu.emit()}},"X")),t("ul",{style:Object.assign({},{listStyle:"none",margin:"0",padding:"0"})},o.map(function(e){return t("li",{style:Object.assign({},a),key:e},t("slot",{name:e.toString()}))}))))},Object.defineProperty(e,"is",{get:function(){return"context-menu"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{footer:{type:String,attr:"footer"},header:{type:String,attr:"header"},items:{type:Number,attr:"items"},menuDisplay:{type:String,attr:"menu-display"},ovlBg:{type:String,attr:"ovl-bg"},x:{type:Number,attr:"x"},y:{type:Number,attr:"y"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"closeMenu",method:"closeMenu",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),e}(),i=function(){function e(){}return e.prototype.render=function(){return t("p",{style:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}},t("slot",null))},Object.defineProperty(e,"is",{get:function(){return"custom-p"},enumerable:!0,configurable:!0}),e}();e.ContextMenu=n,e.CustomP=i,Object.defineProperty(e,"__esModule",{value:!0})});