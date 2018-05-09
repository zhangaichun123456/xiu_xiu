<template>
  <div class="inout">
	  <Breadcrumb separator=">">
	        <Breadcrumb-item href="/home/maillist">通讯录</Breadcrumb-item>
	        <Breadcrumb-item>批量导入/导出</Breadcrumb-item>
	  </Breadcrumb>
	  <p class="nocer" v-if="!certified">温馨提醒：由于您的企业未认证，通讯录仅能存储200人以内的员工，如有超出，建议<span @click="gocertifie">申请企业认证</span></p>
	  <div class="tips">
	  	<p>1.为了确保通讯录信息的准确性，请导出通讯录，并在最新通讯录上修改。</p>
	  	<p>2.子帐号仅能上传和导出有权限范围内的通讯录信息。</p>
	  </div>
	  <ul class="nav">
	  	<li @click="lishow='in'" :class="{'active':lishow=='in'}">批量导入通讯录</li>
	  	<li @click="lishow='out'" :class="{'active':lishow=='out'}">导出/修改通讯录</li>
	  </ul>
	  <!-- 导入页面 -->
	  <div class="importli">
		  	<div v-show="lishow=='in'" class="step1"><span class="stepnum">1</span>下载员工通讯录模版，批量填写员工信息<Button type="primary" @click="downLoad">下载模板</Button></div>
		  	<div v-show="lishow=='out'" class="step1"><span class="stepnum">1</span>导出所有员工信息，批量修改员工信息<Button type="primary" @click="exportfile">导出</Button></div>
        <form v-show="lishow=='in'" enctype="multipart/form-data" method="post" name="fileinfo">
  		  	<div class="step2">
  			  	<p><span class="stepnum">2</span><span>上传填写好的员工信息表</span>
              <Button type="primary" class="choosebtn">选择文件</Button>
              <input type="file" name="file" @change='choosefile' id="fileinfo">
              <input type="hidden" name="entId" :value="entId">   
              <input type="hidden" name="type" :value="0">
              <span class="filename">{{filename}}</span>
            </p>            
  		  	</div>  	
        </form>
         <form v-show="lishow=='out'" enctype="multipart/form-data" method="post" name="fileinfoout">
          <div class="step2">
            <p><span class="stepnum">2</span><span>上传修改好的员工信息表</span>
              <Button type="primary" class="choosebtn">选择文件</Button>
              <input type="file" name="file" @change='choosefile1' id="fileinfo1">
              <input type="hidden" name="entId" :value="entId">   
              <input type="hidden" name="type" :value="1">
              <span class="filename">{{filename1}}</span>
            </p>            
          </div>    
        </form>
        <div class="step3" v-show="lishow=='in'">
            <span class="stepnum">3</span>
            进行通讯录上传
            <input class="shangchuan" v-if="!hasfile" disabled value="上传" type="button">
            <input v-else value="上传" class="shangchuan active" @click="uploadchoosefile" type="button">
        </div>
        <div class="step3" v-show="lishow=='out'">
            <span class="stepnum">3</span>
            进行通讯录同步
            <input class="shangchuan" v-if="!hasfile1" disabled value="同步" type="button">
            <input v-else value="同步" class="shangchuan active" @click="synupfile" type="button">
        </div>
		  	<Progress :percent="percent"></Progress>
        <p class="foottip">{{foottip}}</p>
	  </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';
export default {
   data (){
   	return {
   		certified:false,//有误认证判断是否显示温馨提示
   		lishow:'in',//导入导出nav切换
   		percent: 0,//上传进度条，刚开始为0
      hasfile:false,
      hasfile1:false,
      files:{},
      foottip:null,
      filename:'未上传任何文件',
      filename1:'未上传任何文件'
   	}
   },
   mounted:function(){
   	  this.$nextTick(function(){
   	  })   	   
   },
   computed:{
    ...mapState([
      'entId',
      'errflag',
      'errornum',
    ]),
  },
   methods:{
       ...mapMutations([
                'record_updata',
                'record_errflag',
                'record_updata1',
                'record_errflag1',
                'record_errornum'
            ]),
   	   // 跳转企业认证页面
   	   gocertifie (){
   	   	this.$router.push('/home/teamcertifi/company')
   	   },
       //下载模板
       downLoad (){
         var params={
          'entId':this.entId,
         };
         this.axios.post(this.baseurl+'bas/organization/downloadExcelTemp',qs.stringify(params)).then((res)=>{
          var res=res.data;
          if(res.code==999){
              this.$Message.error(res.msg);
              this.$router.push('/login');
           }else if(res.code==1){
              this.$Message.error(res.msg);
           }else{
              window.location.href=this.baseurl+'bas/organization/downloadExcelTemp?entId='+this.entId;
           }

         })
       },
       choosefile (){
          let files = document.getElementById('fileinfo').files;
          this.filename=files[0].name;
          if (files && files.length){
             this.files=files;
             this.hasfile=true;          
          }else{
            this.$Message.error('没有选择文件');
          }       
       },
   	   //点击上传，把后台要的参数传到后台，成功后进度条为100%;跳入导入确认页面
   	   uploadchoosefile (){
          var _this=this;
          var oData = new FormData(document.forms.namedItem("fileinfo"));
           this.axios.post(this.baseurl+'bas/organization/uploadExcel',oData).then((res)=>{
            var res=res.data;
            if(res.code==0){
              // 把上传的数据取出来，重新组成表格组件需要的格式，存在vuex
              var newemplist=res.data.newEmpList;
              var arr=[];
              var error_num=0;//错误条数
              for(var i=0;i<newemplist.length;i++){
                // 是否是主管的字段转化成表格组件所需要的格式
                newemplist[i].chargeType=newemplist[i].chargeType.split(",");
                let chargearr=[];
                for(var j=0;j<newemplist[i].chargeType.length;j++){
                  if(newemplist[i].chargeType[j]==0){
                    chargearr.push('否');
                  }else if(newemplist[i].chargeType[j]==1){
                    chargearr.push('是');
                  };  
                }
                chargearr=chargearr.join(",");
                this.$set(newemplist[i],'chargeType1',chargearr)               
                //通过后端的信息把错误字段标红
                if(newemplist[i].errorField.length>0){
                  error_num++;
                  var obj={};
                  this.$set(newemplist[i],'cellClassName',obj)
                  for(var k in newemplist[i]){
                    if(newemplist[i].errorField.indexOf(k)>-1){
                      if(k=='chargeType'){
                         k='chargeType1'
                      }
                      obj[k]="redactive";
                    }
                  }
                }
                arr.push(newemplist[i]);
              }
              this.record_errornum(error_num);
              this.record_updata(arr);
              if(this.errornum>0){
                this.record_errflag(1);
              }else{
                this.record_errflag(0);
              }
              // 进度条过渡到100%，.5s后进入导入确认页面
              if(this.percent>=100){
                return false;
               }
               this.percent+=100;
               this.foottip='正在上传......';
               setTimeout(function(){
                 _this.$router.push('/home/confirmin')
               }, 500)
            }else if(res.code==999){
              this.$Message.error(res.msg);
              this.$router.push('/login');
            }else{
              this.$Message.error(res.msg);
            }
          })
         
   	   },
       //导出
       exportfile (){
         var params={
          'entId':this.entId,
         };
         this.axios.post(this.baseurl+'bas/organization/exportAllEmpToExcel',qs.stringify(params)).then((res)=>{
           var res=res.data;
           if(res.code==999){
              this.$Message.error(res.msg);
              this.$router.push('/login');
           }else if(res.code==1){
              this.$Message.error(res.msg);
           }else{
              window.location.href=this.baseurl+'bas/organization/exportAllEmpToExcel?entId='+this.entId;
           }
         })
       },
       choosefile1 (){
          let files = document.getElementById('fileinfo1').files;
          this.filename1=files[0].name;
          if (files && files.length){
             this.files=files;
             this.hasfile1=true;          
          }else{
            this.$Message.error('没有选择文件');
          }       
       },
   	   //点击同步，把后台要的参数传到后台，成功后进度条为100%;跳入同步更新确认页面
   	   synupfile (){
          var _this=this;
          var oData = new FormData(document.forms.namedItem("fileinfoout"));

           this.axios.post(this.baseurl+'bas/organization/uploadExcel',oData).then((res)=>{
            var res=res.data;
            if(res.code==0){
              // 把上传的数据取出来，重新组成表格组件需要的格式，存在vuex
              var newemplist=res.data.newEmpList;
              var oldemplist=res.data.oldEmpList;
              var arr=[];
              var arr1=[];
              var error_num=0;//错误条数
              for(var i=0;i<newemplist.length;i++){
                // 是否是主管的字段转化成表格组件所需要的格式
                newemplist[i].chargeType=newemplist[i].chargeType.split(",");
                let chargearr=[];
                for(var j=0;j<newemplist[i].chargeType.length;j++){
                  if(newemplist[i].chargeType[j]==0){
                    chargearr.push('否');
                  }else if(newemplist[i].chargeType[j]==1){
                    chargearr.push('是');
                 };  
                }
                chargearr=chargearr.join(",");
                this.$set(newemplist[i],'chargeType1',chargearr)
                //通过后端的信息把错误字段标红
                if(newemplist[i].errorField.length>0){
                  // 错误条数加1
                  error_num++;
                  var obj={};
                  this.$set(newemplist[i],'cellClassName',obj)
                  for(var k in newemplist[i]){
                    if(newemplist[i].errorField.indexOf(k)>-1){
                      if(k=='chargeType'){
                         k='chargeType1'
                      }
                      obj[k]="redactive";
                    }
                  }
                }
                arr.push(newemplist[i]);
              }
              // 旧表
              for(var i=0;i<oldemplist.length;i++){
                // 是否是主管的字段转化成表格组件所需要的格式
                 oldemplist[i].chargeType=oldemplist[i].chargeType.split(",");
                  let chargearr=[];
                  for(var j=0;j<oldemplist[i].chargeType.length;j++){
                    if(oldemplist[i].chargeType[j]==0){
                      chargearr.push('否');
                    }else if(oldemplist[i].chargeType[j]==1){
                      chargearr.push('是');
                   };  
                  }
                  chargearr=chargearr.join(",");
                  this.$set(oldemplist[i],'chargeType1',chargearr)
                  arr1.push(oldemplist[i]);
              }
              this.record_errornum(error_num);
              this.record_updata(arr);
              this.record_updata1(arr1);
              if(this.errornum>0){
                this.record_errflag1(1);
              }else{
                this.record_errflag1(0);
              }
              // 进度条过渡到100%，.5s后进入导入确认页面
              if(this.percent>=100){
                return false;
               }
               this.percent+=100;
               this.foottip='正在同步......';
               setTimeout(function(){
                 _this.$router.push('/home/confirmout')
               }, 500)
            }else if(res.code==999){
               this.$Message.error(res.msg);
               this.$router.push('/login');
            }else{
              this.$Message.error(res.msg);
            }
          })
   	   },
   }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inout{
	margin: 10px 20px 0;
  padding: 20px;
  background: #fff;
}
.nocer{
  height: 30px;
  line-height: 30px;
  background: #eceef9;
  color: #475cc7;
  margin: 15px 0;
  padding-left: 10px;
}
.tips{
	line-height: 30px;
}
.nav{
  height: 60px;
  line-height: 60px;
	font-size: 0;
	margin:20px 0 30px 0;
  background-color: #f8f8f8;
}
.nav li{
	width: 175px;
	display: inline-block;
  text-align: center;
  font-size: 18px;
  color: #a9a9a9;
}
.nav .active{
	background: #fff;
	color: #475cc7;
  border-top: 4px solid #475cc7;
}
.importli{
	background: #fff;
}
.stepnum{
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
  line-height: 30px;
  border:1px solid #475cc7;
  border-radius: 50%;
  color: #475cc7;
  text-align: center;
  font-size: 18px;
  margin-right: 10px;
  box-sizing:border-box;
}
.step1,.step2,.step3{
  font-size: 14px;
  color: #525252;
	margin: 40px 0;
}
.shangchuan{
  width: 120px;
  height: 36px;
  outline: none;
  border: 0px;
  margin-left: 30px;
  border-radius: 5px;
}
.step1 button{
  width: 120px;
  height: 36px;
  margin-left: 30px;
  background-color: #475cc7;
  font-size: 14px;
}

.choosebtn{
  width: 120px;
  height: 36px;
  background-color: #475cc7;
  margin-left: 30px;
}
.active{
  background-color: #475cc7;
  color: #fff;
}
.foottip{
  font-size: 14px;
  color: #a9a9a9;
  margin-top: 40px;
}
#fileinfo,#fileinfo1{
  margin-left: 30px;
  position: relative;
  top: 0;
  right: 150px;
  opacity: 0
}
.filename{
  position: relative;
  right: 300px;
}
</style>
