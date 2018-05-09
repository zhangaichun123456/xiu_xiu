<template>
	<div class="confirmout">
		<Breadcrumb separator=">">
	        <Breadcrumb-item href="/home/maillist">通讯录</Breadcrumb-item>
	        <Breadcrumb-item href="/home/inout">批量导入/导出</Breadcrumb-item>
	        <Breadcrumb-item>同步更新确认</Breadcrumb-item>
	    </Breadcrumb>
	    <div>
	        <p v-if="errflag1==0" class="tip">你一共上传了{{updata.length}}条数据</p>
            <p v-if="errflag1==1" class="tip">当前表格中有{{errornum}}条错误，请修改完成后重新上传</p>
	        <Table v-if="errflag1==1" :columns="columnsname" :data="updata"></Table>
            <Table v-if="errflag1==0" :columns="columnsname" :data="updata1"></Table>
	        <div class="suredata" v-if="errflag1==0">
	        	<p class="tip">以下有员工信息较之前有变更，将以此次为准（如有误，请调整 excel 重新上传）</p>
	        	<Table :columns="columnsname" :data="updata"></Table>
	        </div>
        </div>
        <footer>
	        <Button type="primary" @click="goinout" class="savebtn">重新上传</Button>
	        <Button v-if="errflag1==0" type="primary" @click="gohome" class="savebtn">保存</Button>
            <Button v-if="errflag1==1" disabled type="primary" class="btn">保存</Button>
        </footer>
	</div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';
export default{
	data (){
		return {
			// 表格列表头名
            columnsname: [
                    {
                        type: 'index',
                        title:'序号',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '部门',
                        key: 'deptName'
                    },
                    {
                        title: '职位',
                        key: 'jobPosition'
                    },
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '性别',
                        width: 60,
                        key: 'sex'
                    },
                    {
                        title: '工号',
                        key: 'empNo'
                    },
                    {
                        title: '是否此部门主管（是/否）',
                        key: 'chargeType1'
                    },
                    {
                        title: '手机号',
                        key: 'telno'
                    },{
                        title: '错误详情',
                        width: 200,
                        key: 'errorMsg',
                        className: 'errorMsg'
                    }
                ],
		}
	},
	mounted:function(){
   	  this.$nextTick(function(){
   	  })   	   
    },
    computed:{
        ...mapState([
            'entId',
            'updata',
            'updata1',
            'errflag1',
            'errornum',
        ]),
    },
    methods:{
    	goinout (){
    		this.$router.push('/home/inout')
    	},
        gohome (){
             var empVoList=[];
             var rows={};
             for (var i=0;i<this.updata.length;i++){
                 var obj={};
                 var chargeType=this.updata[i].chargeType.join(",")
                 obj.name=this.updata[i].name;
                 obj.deptName=this.updata[i].deptName;
                 obj.address=this.updata[i].address;
                 obj.extNo=this.updata[i].extNo;
                 obj.chargeType=chargeType;
                 obj.empNo=this.updata[i].empNo;
                 obj.telno=this.updata[i].telno;
                 obj.jobPosition=this.updata[i].jobPosition;
                 obj.email=this.updata[i].email;
                 obj.remark=this.updata[i].remark;
                 empVoList.push(obj);
             }
             empVoList=JSON.stringify(empVoList);
             var params={
                  'entId':this.entId,
                  'type':1,
                  'empVoList':empVoList,
                }
            this.axios.post(this.baseurl+'bas/organization/uploadConfirm',qs.stringify(params)).then((res)=>{
                var res=res.data;
                if(res.code==0){
                    this.$router.push('/home/maillist');
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
<style scoped>
.confirmout{
	margin: 10px 20px 0;
    padding: 20px;
    background: #fff;
}
.tip{
	height: 30px;
    line-height: 30px;
    background: #eceef9;
    color: #475cc7;
    margin: 15px 0;
    padding-left: 10px;
}
.suredata{
	margin: 40px 0;
}
footer{
	margin-top: 30px;
	text-align: center;
}
.btn{
    width: 120px;
    height: 36px;
}
.savebtn{
    width: 120px;
    height: 36px;
    color: #fff;
    background-color: #475cc7;
}   	
</style>