<template>
  <div id="app">  
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body{
  height: 100% !important;
  width: 100%;
  min-width: 960px;
}
#app {
  font-family: 'Microsoft YaHei','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100% !important;
}
.ivu-input{
  height: 40px !important;
  font-size: 14px !important;
}

.ivu-input-icon{
  height: 44px !important;
  line-height: 44px !important;
  width: 50px !important;
  position: absolute !important;
  left: 0 !important;
  border-right: 1px solid #eee !important;
  color: #eee !important;
  font-size: 20px !important;
}

.ivu-input-icon-normal+.ivu-input{
  padding-left: 60px !important;
}
.register .ivu-steps.ivu-steps-small .ivu-steps-head-inner{
  width: 60px !important;
  height: 60px !important;
  line-height: 60px !important;
  font-size: 36px !important;
  background-color: #cecece !important;
  border:none !important;
}
.register .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner{
  background-color: #475cc7 !important;
  border:none !important;
}
.register .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner{
   background-color: #475cc7 !important;  
   border:none !important; 
}
.register .ivu-steps.ivu-steps-small .ivu-steps-head-inner>.ivu-steps-icon.ivu-icon{
   font-size: 36px !important;
   color: #fff !important;
}
.register .ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail>i:after{
  height: 10px !important;
  background-color: #475cc7 !important; 
}
.register .ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner>.ivu-steps-icon{
  color: #fff !important;
}
.register .ivu-steps.ivu-steps-small .ivu-steps-tail{
  top: 27px !important;
}
.register .ivu-steps .ivu-steps-tail{
  height: 10px !important;
  background:#cecece !important;
}
.register .ivu-steps.ivu-steps-small .ivu-steps-title{
  position: relative !important;
  left: -72px !important;
  top: -45px !important;
  font-size: 20px !important;
  color:#475cc7 !important;
  font-weight: 300 !important;
}
.register .ivu-steps-item.ivu-steps-status-wait .ivu-steps-title{
  color: #525252 !important;
}
.register .ivu-steps.ivu-steps-small .ivu-steps-head-inner{
  margin-right: 0px !important;
}
.register .ivu-steps-horizontal .ivu-steps-item:not(:first-child) .ivu-steps-head{
  padding-left:0px !important; 
}

.register .ivu-select-single .ivu-select-selection,.teamcertifi .ivu-select-single .ivu-select-selection,.setup .ivu-select-single .ivu-select-selection,.report .ivu-select-single .ivu-select-selection{
  height: 40px !important;
}
.register .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value,.teamcertifi .ivu-select-single .ivu-select-selection .ivu-select-placeholder,.setup .ivu-select-single .ivu-select-selection .ivu-select-placeholder,.report header .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
  line-height: 40px !important;
  font-size: 14px !important;
}

.ivu-form .ivu-form-item-label{
  font-size: 18px !important;
  color: #a9a9a9 !important;
}
.register .ivu-checkbox-inner,.teamcertifi .ivu-checkbox-inner{
  width: 20px !important;
  height: 20px !important;
  margin-right: 20px !important;
}
.register .ivu-checkbox-checked .ivu-checkbox-inner:after,.teamcertifi .ivu-checkbox-checked .ivu-checkbox-inner:after{
  width: 7px !important;
  height: 13px !important;
  top: 1px !important;
  left: 6px !important;
}
.ivu-checkbox-checked .ivu-checkbox-inner{
  background-color: #475cc7 !important;
  border-color: #475cc7 !important;
}
.register .ivu-select-item-selected, .ivu-select-item-selected:hover{
  background-color: #475cc7 !important;
}
.ivu-modal-header{
   background-color: #fafafa !important;
}
.ivu-modal-footer,.ivu-modal-header{
  border:none !important;
}

.ivu-form-item-content{
  text-align: left !important;
}
.ivu-col-span-12{
  width:29% !important;
}
.registep2 .ivu-form-item-error-tip{
  top:15% !important;
  left: 410px !important;
}
.registep2 .address .ivu-form-item-error-tip{
  top:100% !important;
  left: 0 !important;
}
.maillist .ivu-input-icon{
  position: absolute !important;
  top: 0 !important;
  left: 245px !important;
  border-right: 0 !important;
  font-size: 30px !important;
}
.maillist .ivu-input{
  padding: 0 45px 0 25px !important;
  border-radius: 20px !important;
  background:#4b4d6e !important;
  color: #fff !important;
}
.maillist .ivu-input-wrapper{
  width: 300px !important;
  margin: 0 auto !important;
}
.register .ivu-form-item-label:before,.teamcertifi .ivu-form-item-label:before,.twoset .ivu-form-item-label:before{
    content: '*' !important;
    display: inline-block !important;
    margin-right: 4px !important;
    line-height: 1 !important;
    font-family: SimSun !important;
    font-size: 12px !important;
    color: #ed3f14 !important;
}
/*徽标设置*/
.maillist .head .ivu-badge-count{
  font-size: 10px !important;
  margin:0 10px !important;
}
/*ghost按钮背景色*/
.maillist .ivu-btn-ghost{
  background-color:#fff;
}
/*添加子部门表单弹框*/
.adddmember .ivu-icon-asterisk{
  position: absolute !important;
  top: 10px !important;
  left: -57px !important;
  font-size: 10px !important;
  color: red !important;
}
/*通讯录的弹框*/
.modelheader .ivu-modal-header{
  background: #4056c5 !important;
}
.modelheader .ivu-modal-header p{
  font-size: 20px !important;
  text-align: center !important;
  height: 50px !important;
  line-height: 50px !important;
  color: #fff !important;
  font-weight: 300 !important;
}
/*导入导出页面排版，选择文件按钮和文字并排*/
.inout .ivu-upload,.inout .ivu-upload-list{
  display: inline-block !important;
  vertical-align: middle !important;
}
/*角色管理的表格老是失效，故而固定宽度*/
.maillist .roleright .ivu-table table{
  width: 100% !important;
}
/*主管候选人竖列排版*/
.dptking label{
  display: block !important;
  padding: 5px 0 5px 10px !important;
}
/*导入确认中的错误详情红色*/
.confirmin .ivu-table td.errorMsg,.confirmout .ivu-table td.errorMsg{
    color: red !important;
}
/*导入确认中的错误详情红色*/
.confirmin .redactive,.confirmout .redactive{
    color: red !important;
    background: #ccc !important;
}
/*子管理员候选人竖列排版*/
.addmembertree label{
  display: block !important;
  padding: 5px 0 5px 0 !important;
  overflow-x: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}
.addmembertree label:hover{
  background: #eee !important;
}
.confirmin .ivu-table-cell,.confirmout .ivu-table-cell{
  padding: 0 8px !important;
}
.depinfoform2 .ivu-form-item:nth-child(9){
  margin-top: 100px !important;
}
.modelheader .ivu-modal{
    top: 0px !important;
}
.setdirector .ivu-modal-body,.modelheader .ivu-modal-body,.sureupdpt .ivu-modal-body,.changedept .ivu-modal-body,.choosedptvue .ivu-modal-body,.editchoosedpt .ivu-modal-body,.setuppeo .ivu-modal-body,.addsmallappli .ivu-modal-body,.addmembermodel .ivu-modal-body,.choosedeptmodel .ivu-modal-body,.destorymodel .ivu-modal-body,.surepro .ivu-modal-body{
  padding: 0 !important;
}
.setdirector .ivu-btn-primary,.sureupdpt .ivu-btn-primary,.changedept .ivu-btn-primary,.choosedptvue .ivu-btn-primary,.editchoosedpt .ivu-btn-primary,.setuppeo .ivu-btn-primary,.addrolegrounpmodel .ivu-btn-primary,.addsmallappli .ivu-btn-primary,.addmembermodel .ivu-btn-primary,.choosedeptmodel .ivu-btn-primary{
  background-color: #475cc7 !important;
}
.setdirector .ivu-input-wrapper,.setuppeo .ivu-input-wrapper,.addmembermodel .ivu-input-wrapper,.choosedeptmodel .ivu-input-wrapper{
  width: 290px!important;
  margin: 10px 0 20px 20px !important;
}
.setdirector .ivu-input-icon-normal+.ivu-input,.setuppeo .ivu-input-icon-normal+.ivu-input,.addmembermodel .ivu-input-icon-normal+.ivu-input,.choosedeptmodel .ivu-input-icon-normal+.ivu-input{
  border-radius: 20px !important;
  padding-left: 20px !important;
  background: #eee !important;
}
.setdirector .ivu-input-icon,.setuppeo .ivu-input-icon,.addmembermodel .ivu-input-icon,.choosedeptmodel .ivu-input-icon{
  position: absolute !important;
  top: 0 !important;
  left: 240px !important;
  border-right: 0 !important;
  font-size: 30px !important;
  color: #475cc7 !important;
}
.setdirector .dptking label{
  padding: 10px 0 10px 10px !important;
  margin-left: 22px !important;
  font-size: 14px !important;
  color: #5a5a5a !important;
  overflow-x: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}
.setdirector .ivu-checkbox{
  margin-right: 14px !important;
}
.teaminvi .ivu-breadcrumb a,.inout .ivu-breadcrumb a,.confirmin .ivu-breadcrumb a,.confirmout .ivu-breadcrumb a,.maillist .ivu-breadcrumb>span,.addmembermodel .ivu-breadcrumb>span,.choosedeptmodel .ivu-breadcrumb>span,.report .ivu-breadcrumb a,.notice .ivu-breadcrumb a{
  font-size: 14px !important;
  color: #475cc7 !important;
}
.teaminvi .ivu-breadcrumb>span:last-child,.inout .ivu-breadcrumb>span:last-child,.confirmin .ivu-breadcrumb>span:last-child,.confirmout .ivu-breadcrumb>span:last-child,.maillist .ivu-breadcrumb>span:last-child,.addmembermodel .ivu-breadcrumb>span:last-child,.choosedeptmodel .ivu-breadcrumb>span:last-child,.report .ivu-breadcrumb>span:last-child,.inout .ivu-breadcrumb>span:last-child,.notice .ivu-breadcrumb>span:last-child{
  font-size: 14px !important;
  color: #a9a9a9 !important;
  font-weight: 300 !important;
}
.ivu-progress-success .ivu-progress-bg{
  background-color: #475cc7 !important;
}
.teamcertifi .ivu-checkbox-wrapper{
  font-size: 18px !important;
  color: #5a5a5a !important;
}
.addminadmin .ivu-checkbox-wrapper{
  font-size: 14px !important;
  color: #525252 !important;
}
.addminadmin .ivu-radio-group-vertical .ivu-radio-wrapper{
  margin-bottom: 10px !important;
}
.dptking label:hover{
  background: #eee !important;
}
.changedepttree label,.choosedepttree label,.edtimemeberdpttree label{
  width: 400% !important;
  height: 40px !important;
  line-height: 40px !important;
  padding-left: 5px !important;
}
.changedepttree label:hover,.choosedepttree label:hover,.edtimemeberdpttree label:hover{
  background: #eee !important;
}
.maillist .ivu-breadcrumb{
  padding-left: 20px !important;
}
.addmembermodel .ivu-breadcrumb,.choosedeptmodel .ivu-breadcrumb{
  padding: 0 20px 10px 20px !important;
}
.report .page .ivu-select-single .ivu-select-selection{
  height: 32px!important;
}
.report .page .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
  line-height: 32px !important;
}
.ql-toolbar.ql-snow .ql-formats{
  line-height: 24px;
}
</style>
