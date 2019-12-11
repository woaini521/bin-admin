(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e17d2"],{"7b3d":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-table-layout",[a("b-tree",{attrs:{slot:"tree",data:e.treeData,"lock-select":e.lockTreeSelect},on:{"on-select-change":e.handTreeCurrentChange},slot:"tree"}),a("v-filter-bar",{attrs:{slot:"filter","is-opened":e.filterOpened},slot:"filter"},[a("v-filter-item",{attrs:{title:"用户名称"}},[a("b-input",{attrs:{size:"small",placeholder:"请输入部门名称",clearable:""},model:{value:e.listQuery.name,callback:function(t){e.$set(e.listQuery,"name","string"===typeof t?t.trim():t)},expression:"listQuery.name"}})],1),a("v-filter-item",{attrs:{title:"显示禁用",width:"160px"}},[a("b-switch",{attrs:{size:"large","true-value":"Y","false-value":"N"},on:{"on-change":e.handleFilter},model:{value:e.listQuery.delFlag,callback:function(t){e.$set(e.listQuery,"delFlag",t)},expression:"listQuery.delFlag"}},[a("span",{attrs:{slot:"open"},slot:"open"},[e._v("显示")]),a("span",{attrs:{slot:"close"},slot:"close"},[e._v("隐藏")])])],1),a("v-filter-item",{attrs:{"show-toggle":!0,"is-opened":e.filterOpened},on:{"on-search":e.handleFilter,"on-reset":e.resetQuery,"on-toggle":function(t){e.filterOpened=!e.filterOpened}}}),a("template",{slot:"more"},[a("v-filter-item",{attrs:{title:"地址"}},[a("b-input",{attrs:{size:"small",placeholder:"请输入",clearable:""},model:{value:e.listQuery.address,callback:function(t){e.$set(e.listQuery,"address","string"===typeof t?t.trim():t)},expression:"listQuery.address"}})],1),a("v-filter-item",{attrs:{title:"年龄"}},[a("b-input",{attrs:{size:"small",placeholder:"请输入",clearable:""},model:{value:e.listQuery.age,callback:function(t){e.$set(e.listQuery,"age","string"===typeof t?t.trim():t)},expression:"listQuery.age"}})],1)],1)],2),a("template",{slot:"ctrl"},[a("b-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary",size:"small",icon:"ios-add"},on:{click:e.handleCreate}},[e._v("新增")])],1),a("b-table",{ref:"table",attrs:{slot:"table",columns:e.columns,data:e.list,loading:e.listLoading,stripe:"","max-height":"526",width:e.treeTableWidth},slot:"table",scopedSlots:e._u([{key:"name",fn:function(t){return[a("a",{attrs:{href:""},on:{click:function(a){return a.stopPropagation(),a.preventDefault(),e.handleCheck(t.row)}}},[e._v(e._s(t.row.name))])]}},{key:"action",fn:function(t){return[a("b-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"text"},on:{click:function(a){return e.handleModify(t.row)}}},[e._v("编辑")]),[a("b-divider",{attrs:{type:"vertical"}}),a("b-button",{directives:[{name:"waves",rawName:"v-waves"}],staticStyle:{color:"red"},attrs:{type:"text"},on:{click:function(a){return e.handleRemove(t.row)}}},[e._v("删除")])]]}}])}),a("b-page",{attrs:{slot:"pager",total:e.total,"show-sizer":""},on:{"on-change":e.handleCurrentChange,"on-page-size-change":e.handleSizeChange},slot:"pager"}),a("b-drawer",{attrs:{"append-to-body":!1,fullscreen:"","footer-hide":"",title:e.editTitle},model:{value:e.dialogFormVisible,callback:function(t){e.dialogFormVisible=t},expression:"dialogFormVisible"}},["check"===e.dialogStatus?a("div",{staticStyle:{width:"880px",padding:"20px 0 0 20px"}},[a("v-key-label",{attrs:{label:"姓名","label-width":"150px","is-half":"","is-first":""}},[e._v(e._s(e.user.name))]),a("v-key-label",{attrs:{label:"年龄","is-half":""}},[e._v(e._s(e.user.age))]),a("v-key-label",{attrs:{label:"出生日期","label-width":"150px"}},[e._v(e._s(e.user.birthday))]),a("v-key-label",{attrs:{label:"地址","label-width":"150px","is-bottom":""}},[e._v(e._s(e.user.address))]),a("div",{staticStyle:{padding:"10px","text-align":"center"}},[a("b-button",{directives:[{name:"waves",rawName:"v-waves"}],on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("返 回")])],1)],1):a("div",{staticStyle:{width:"880px",padding:"20px 0 0 60px"}},[a("b-form",{ref:"form",attrs:{model:e.user,rules:e.ruleValidate,"label-width":130}},[a("div",{attrs:{flex:"box:mean"}},[a("b-form-item",{attrs:{label:"姓名",prop:"name"}},[a("b-input",{attrs:{placeholder:"请输入姓名",clearable:""},model:{value:e.user.name,callback:function(t){e.$set(e.user,"name",t)},expression:"user.name"}})],1),a("b-form-item",{attrs:{label:"年龄",prop:"age"}},[a("b-input-number",{staticStyle:{width:"100%"},attrs:{min:0},model:{value:e.user.age,callback:function(t){e.$set(e.user,"age",t)},expression:"user.age"}})],1)],1),a("b-form-item",{attrs:{label:"出生日期",prop:"birthday"}},[a("b-input",{attrs:{placeholder:"请输入出生日期",clearable:""},model:{value:e.user.birthday,callback:function(t){e.$set(e.user,"birthday",t)},expression:"user.birthday"}})],1),a("b-form-item",{attrs:{label:"地址",prop:"address"}},[a("b-input",{attrs:{placeholder:"请输入地址",clearable:""},model:{value:e.user.address,callback:function(t){e.$set(e.user,"address",t)},expression:"user.address"}})],1),a("b-form-item",[a("b-button",{directives:[{name:"waves",rawName:"v-waves"}],attrs:{type:"primary",loading:e.btnLoading},on:{click:e.handleSubmit}},[e._v("确 定")]),a("b-button",{directives:[{name:"waves",rawName:"v-waves"}],on:{click:e.handleCancel}},[e._v("取 消")])],1)],1)],1)])],2)},r=[],s={data:function(){return{tableWrapWidth:0,currentTreeNode:null,filterOpened:!1,listQuery:{size:10,page:1},total:0,list:[],listLoading:!1,btnLoading:!1,dialogFormVisible:!1,dialogStatus:""}},computed:{editTitle:function(){var e={check:"查看",modify:"修改",create:"新增"};return e[this.dialogStatus]||"标题"},isCheck:function(){return"check"===this.dialogStatus},isEdit:function(){return"create"===this.dialogStatus||"modify"===this.dialogStatus},tableWidth:function(){return this.tableWrapWidth-70},treeTableWidth:function(){return this.tableWrapWidth-270},lockTreeSelect:function(){return"check"===this.dialogStatus||"modify"===this.dialogStatus}},mounted:function(){this.$EventBus.$on("/layout/resize",this._resizeTable)},watch:{dialogFormVisible:function(e){e||(this.dialogStatus="")}},methods:{_resizeTable:function(e){this.tableWrapWidth=e,this.$refs.table&&this.$refs.table.handleResize()},treeMapper:function(e,t){var a=this,i=e.id,r=t?t.split(","):[];r.push(i);var s=[];e.children&&e.children.forEach((function(e){s.push(a.treeMapper(e,r.join(",")))}));var n=!!this.currentTreeNode&&this.currentTreeNode.id===i,l=!!this.currentTreeNode&&this.currentTreeNode.parents.includes(i);return{id:e.id,title:e.text,parents:r,selected:n,expand:l,children:s}},setListData:function(e){e?(this.list=e.list,this.total=e.total,this.listLoading=!1):(this.list=[],this.listLoading=!0)},openEditPage:function(e){this.dialogStatus=e,this.dialogFormVisible=!0,this.$refs.form&&this.$refs.form.resetFields()},handleCancel:function(){var e=this;this.$confirm({title:"警告",content:"此操作会清空当前操作，是否继续？",onOk:function(){e.dialogFormVisible=!1}})},searchList:function(){console.error("searchList need overwrite (from mixin)")},handleFilter:function(){this.listQuery.page=1,this.searchList()},handleSizeChange:function(e){this.listQuery.page=1,this.listQuery.size=e,this.searchList()},handleCurrentChange:function(e){this.listQuery.page=e,this.searchList()}}};function n(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,i)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(a,!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var d={required:!0,message:"必填项",trigger:"blur"},c={name:"TableDemo",mixins:[s],data:function(){var e=this,t=function(e,t,a){t.length>0&&a()};return{listQuery:{name:"",delFlag:"N",address:"",age:""},treeData:[],columns:[{title:"序号",type:"index",width:50,align:"center",indexMethod:function(t){return e.listQuery.size*(e.listQuery.page-1)+t._index+1}},{title:"姓名",slot:"name"},{title:"年龄",key:"age"},{title:"出生日期",key:"birthday"},{title:"地址",key:"address"},{title:"操作",slot:"action",width:180}],user:null,ruleValidate:{name:[d],birthday:[{required:!0,message:"必填项",trigger:"blur"},{validator:t,trigger:"blur"}],address:[d]}}},created:function(){this.initTree(),this.resetUser()},methods:{handTreeCurrentChange:function(e,t){this.currentTreeNode=t,console.log(this.currentTreeNode)},resetQuery:function(){this.listQuery={page:1,size:10,name:"",delFlag:"N",address:"",age:""}},handleCreate:function(){this.resetUser(),this.openEditPage("create")},handleModify:function(e){this.user=l({},e),this.openEditPage("modify")},handleCheck:function(e){this.user=l({},e),this.openEditPage("check")},handleRemove:function(e){var t=this,a=l({},e);this.$confirm({title:"警告",content:"确实要删除当前用户吗？",onOk:function(){console.log(a),t.$message({type:"success",content:"删除成功"})}})},handleSubmit:function(){var e=this;this.$refs.form.validate((function(t){t&&(e.$message({type:"success",content:"操作成功"}),e.dialogFormVisible=!1)}))},resetUser:function(){this.user={id:"",username:"",delFlag:"N",address:"",age:0}},initTree:function(){this.treeData=[{title:"一级 1",expand:!0,children:[{title:"二级 1-1",expand:!0,children:[{title:"三级 1-1-1"},{title:"三级 1-1-2"}]},{title:"二级 1-2",expand:!0,children:[{title:"三级 1-2-1"},{title:"三级 1-2-2"}]}]}],this.treeData.length>0&&(this.currentTreeNode=this.treeData[0],this.listQuery.parentId=this.currentTreeNode.id,this.$set(this.treeData[0],"selected",!0),this.$set(this.treeData[0],"expand",!0),this.searchList())},searchList:function(){this.setListData({list:[{name:"王小明",age:18,birthday:"1990-04-22",address:"北京市朝阳区芍药居"},{name:"张小刚",age:25,birthday:"1990-02-11",address:"北京市海淀区西二旗"},{name:"李小红",age:30,birthday:"1991-06-16",address:"上海市浦东新区世纪大道"},{name:"周小伟",age:26,birthday:"1992-09-02",address:"深圳市南山区深南大道"},{name:"张小发",age:33,birthday:"1989-12-22",address:"南京市龙眠大道"},{name:"张小刚",age:25,birthday:"1990-02-11",address:"北京市海淀区西二旗"},{name:"李小红",age:30,birthday:"1991-06-16",address:"上海市浦东新区世纪大道"},{name:"周小伟",age:26,birthday:"1992-09-02",address:"深圳市南山区深南大道"},{name:"张小发",age:33,birthday:"1989-12-22",address:"南京市龙眠大道"},{name:"张小发",age:33,birthday:"1989-12-22",address:"南京市龙眠大道"}],total:15})}}},u=c,h=a("2877"),b=Object(h["a"])(u,i,r,!1,null,null,null);t["default"]=b.exports}}]);