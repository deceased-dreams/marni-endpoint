(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-379754e5"],{"1f4f":function(t,e,a){"use strict";a("8b37");var s=a("80d2"),i=a("7560"),l=a("58df");e["a"]=Object(l["a"])(i["a"]).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes(){return{"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader,...this.themeClasses}}},methods:{genWrapper(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:Object(s["g"])(this.height)}},[this.$createElement("table",this.$slots.default)])}},render(t){return t("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}})},"58c1":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-toolbar",{attrs:{dense:"",flat:"",color:"grey lighten-5"}},[a("v-app-bar-nav-icon",{on:{click:function(e){return t.$router.push("/app/kriteria/"+t.id+"/subs/add")}}},[a("v-icon",{attrs:{color:"blue accent-2",large:""}},[t._v("\n        add\n      ")])],1),a("v-toolbar-title",[t._v("Data Sub Kriteria")])],1),a("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[a("thead",[a("tr",[a("th",{staticClass:"text-left"},[t._v("Kode")]),a("th",{staticClass:"text-left"},[t._v("Label")]),a("th",{staticClass:"text-left"},[t._v("Bobot")]),a("th",{staticClass:"text-left"}),a("th",{staticClass:"text-right"})])]),a("tbody",t._l(t.items,(function(e){return a("tr",{key:e.id},[a("td",[t._v(t._s(e.kode))]),a("td",[t._v(t._s(e.label))]),a("td",[t._v("\n            ["+t._s(e.weight_a.toFixed(3))+", "+t._s(e.weight_b.toFixed(3))+", "+t._s(e.weight_c.toFixed(3))+"]\n          ")]),a("td"),a("td",{staticClass:"text-right"},[a("v-btn",{attrs:{dark:"",small:"",icon:"",to:"/app/kriteria/"+e.id+"/edit"}},[a("v-icon",{attrs:{small:"",color:"green"}},[t._v("\n                create\n              ")])],1),a("v-btn",{attrs:{dark:"",small:"",icon:""},on:{click:function(a){return t.del(e.id)}}},[a("v-icon",{attrs:{small:"",color:"red"}},[t._v("\n                remove\n              ")])],1)],1)])})),0)]},proxy:!0}])})],1)},i=[],l=a("e738"),r={name:"list-sub-kriteria",props:["id"],data:()=>({items:[]}),methods:{loadData(){return l["a"].get(`/kriteria/${this.id}/subs`).then(t=>t.data).then(t=>{this.items=t}).catch(t=>{console.log(t),alert("gagal mengambil data sub kriteria")})},del(t){l["a"].delete("/subs/"+t).then(t=>(alert("sukses menghapus data subkriteria"),this.loadData())).catch(t=>{console.log(t),alert("gagal menghapus data")})}},mounted(){console.log("here"),this.loadData()}},n=r,o=a("2877"),d=a("6544"),c=a.n(d),h=a("5bc1"),u=a("8336"),b=a("132d"),p=a("1f4f"),v=a("71d9"),f=a("2a7f"),g=Object(o["a"])(n,s,i,!1,null,null,null);e["default"]=g.exports;c()(g,{VAppBarNavIcon:h["a"],VBtn:u["a"],VIcon:b["a"],VSimpleTable:p["a"],VToolbar:v["a"],VToolbarTitle:f["b"]})},"8b37":function(t,e,a){}}]);
//# sourceMappingURL=chunk-379754e5.81074bb7.js.map