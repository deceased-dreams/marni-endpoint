(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-37dcbd1f"],{"1bd6":function(t,e,n){"use strict";n.d(e,"d",(function(){return i})),n.d(e,"a",(function(){return u})),n.d(e,"c",(function(){return s})),n.d(e,"e",(function(){return d})),n.d(e,"b",(function(){return p}));n("96cf");var r=n("3b8d"),a=n("e738");function i(){return c.apply(this,arguments)}function c(){return c=Object(r["a"])(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,a["a"].get("/alternatif");case 2:return e=t.sent,t.abrupt("return",e.data);case 4:case"end":return t.stop()}}),t)}))),c.apply(this,arguments)}function u(t){return o.apply(this,arguments)}function o(){return o=Object(r["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,a["a"].post("/alternatif",e);case 2:case"end":return t.stop()}}),t)}))),o.apply(this,arguments)}function s(t){return l.apply(this,arguments)}function l(){return l=Object(r["a"])(regeneratorRuntime.mark((function t(e){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,a["a"].get("/alternatif/"+e);case 2:return n=t.sent,t.abrupt("return",n.data);case 4:case"end":return t.stop()}}),t)}))),l.apply(this,arguments)}function d(t,e){return f.apply(this,arguments)}function f(){return f=Object(r["a"])(regeneratorRuntime.mark((function t(e,n){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,a["a"].put("/alternatif/"+e,n);case 2:case"end":return t.stop()}}),t)}))),f.apply(this,arguments)}function p(t){return v.apply(this,arguments)}function v(){return v=Object(r["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,a["a"].delete("/alternatif/"+e);case 2:case"end":return t.stop()}}),t)}))),v.apply(this,arguments)}},"2fdb":function(t,e,n){"use strict";var r=n("5ca1"),a=n("d2c8"),i="includes";r(r.P+r.F*n("5147")(i),"String",{includes:function(t){return!!~a(this,t,i).indexOf(t,arguments.length>1?arguments[1]:void 0)}})},"3d0e":function(t,e,n){},5147:function(t,e,n){var r=n("2b4c")("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(n){try{return e[r]=!1,!"/./"[t](e)}catch(a){}}return!0}},"63cb":function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"balita-list"}},[n("v-toolbar",{attrs:{flat:""}},[n("v-app-bar-nav-icon",{on:{click:function(e){return t.$router.push("/app/balita/add")}}},[n("v-icon",{attrs:{color:"blue accent-2",large:""}},[t._v("\n        add\n      ")])],1),n("v-toolbar-title",[t._v("Data Alternatif")]),n("v-spacer"),n("v-text-field",{attrs:{"hide-details":"",flat:"",placeholder:"Keyword pencarian berdasarkan nama pasien dan nama penyakit.","prepend-icon":"mdi-magnify"},model:{value:t.keyword,callback:function(e){t.keyword=e},expression:"keyword"}})],1),n("v-card",{attrs:{tile:"",flat:""}},[n("v-data-table",{attrs:{headers:t.headers,items:t.filtered,"hide-default-footer":"","server-items-length":t.filtered.length,"items-per-page":t.filtered.length},scopedSlots:t._u([{key:"item.sex",fn:function(e){var n=e.item;return[t._v("\n        "+t._s("PEREMPUAN"==n.sex?"Perempuan":"Laki - Laki")+"\n      ")]}},{key:"item.action",fn:function(e){var r=e.item;return[n("div",[n("v-btn",{attrs:{dark:"",small:"",icon:"",to:"/app/balita/edit/"+r.id}},[n("v-icon",{attrs:{small:"",color:"green"}},[t._v("\n              create\n            ")])],1),n("v-btn",{attrs:{dark:"",small:"",icon:""},on:{click:function(e){return t.onDelete(r.id)}}},[n("v-icon",{attrs:{small:"",color:"red"}},[t._v("\n              remove\n            ")])],1)],1)]}}])})],1)],1)},a=[],i=(n("96cf"),n("3b8d")),c=(n("6762"),n("2fdb"),n("2b0e")),u=n("1bd6"),o=function(){return{headers:[{text:"ID",value:"id"},{text:"Nama",value:"nama"},{text:"Umur",value:"age"},{text:"Berat Badan",value:"beratBadan"},{text:"Tinggi Badan",value:"tinggiBadan"},{text:"Jenis Kelamin",value:"sex"},{text:"",value:"action"}],items:[],keyword:""}},s=c["default"].extend({data:o,computed:{filtered:function(){var t=this.keyword.toUpperCase();return this.items.filter((function(e){return e.nama.toUpperCase().includes(t)}))}},methods:{loadDataBalita:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,Object(u["d"])();case 2:this.items=t.sent;case 3:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),onDelete:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,Object(u["b"])(e);case 3:alert("Sukses menghapus data balita"),t.next=10;break;case 6:t.prev=6,t.t0=t["catch"](0),alert("Gagal menghapus data balita"),console.log(t.t0);case 10:return t.prev=10,this.loadDataBalita(),t.finish(10);case 13:case"end":return t.stop()}}),t,this,[[0,6,10,13]])})));function e(e){return t.apply(this,arguments)}return e}()},mounted:function(){this.loadDataBalita()}}),l=s,d=(n("8004"),n("2877")),f=n("6544"),p=n.n(f),v=n("5bc1"),h=n("8336"),m=n("b0af"),b=n("8fea"),g=n("132d"),x=n("2fa4"),w=n("8654"),k=n("71d9"),y=n("2a7f"),R=Object(d["a"])(l,r,a,!1,null,null,null);e["default"]=R.exports;p()(R,{VAppBarNavIcon:v["a"],VBtn:h["a"],VCard:m["a"],VDataTable:b["a"],VIcon:g["a"],VSpacer:x["a"],VTextField:w["a"],VToolbar:k["a"],VToolbarTitle:y["b"]})},6762:function(t,e,n){"use strict";var r=n("5ca1"),a=n("c366")(!0);r(r.P,"Array",{includes:function(t){return a(this,t,arguments.length>1?arguments[1]:void 0)}}),n("9c6c")("includes")},8004:function(t,e,n){"use strict";var r=n("3d0e"),a=n.n(r);a.a},aae3:function(t,e,n){var r=n("d3f4"),a=n("2d95"),i=n("2b4c")("match");t.exports=function(t){var e;return r(t)&&(void 0!==(e=t[i])?!!e:"RegExp"==a(t))}},d2c8:function(t,e,n){var r=n("aae3"),a=n("be13");t.exports=function(t,e,n){if(r(e))throw TypeError("String#"+n+" doesn't accept regex!");return String(a(t))}}}]);
//# sourceMappingURL=chunk-37dcbd1f.611ec483.js.map