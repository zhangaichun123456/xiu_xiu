<template>
	<div class="setminadmin">
        <p class="roletop">子管理员({{managercount}}人)</p>
        <p class="add_del">
          <Button class="addbtn" type="primary" @click="goadd">添加成员</Button>
          <Button class="delbtn" type="primary" @click="delmember">批量移除</Button>
        </p>
        <Table :columns="roletablehead" :data="adminpeolist" @on-selection-change="choosemember($event)"></Table>
	</div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import qs from 'qs';
export default{
	data (){
		return {
			roletablehead:[//点击角色出来属于此角色的所有成员
			               {
	                      type: 'selection',
	                      width: 60,
	                      align: 'center'
	                   },
                      {
                          title: '姓名',
                          key: 'name'
                      },
                      {
                          title: '管理范围',
                          key: 'managerScope1'
                      },
                      {
                          title: '微应用权限',
                          key: 'minscopename'
                      },
                       {
                          title: '操作',
                          key: 'action',
                          render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editminadmin(params.index)
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        }
                      },
                ],
      choosearr:[],
      managercount:null,
		}
	},
  mounted:function(){
      this.$nextTick(function(){
        this.initdata();
      })       
   },
  computed:{
    ...mapState([
      'entId',
      'adminpeolist',
    ]),
  },
	methods:{
    ...mapMutations([
                'record_adminpeolist',
            ]),
    initdata (){
       var parmas={
        'entId':this.entId,
       };
        this.axios.post(this.baseurl+'shezhi/get',qs.stringify(parmas)).then((res)=>{
          var res=res.data;
          if(res.code==0){
            this.managercount=res.data.managercount;
            this.record_adminpeolist(res.data.emplist);
            for (var i=0;i<this.adminpeolist.length;i++){
              //部门转成name渲染
              var arr=this.adminpeolist[i].deptlist;
              //管理范围转成文字
              if(this.adminpeolist[i].managerScope==0){
                this.$set(this.adminpeolist[i],'managerScope1','全公司');
              }else if(this.adminpeolist[i].managerScope==1){
                this.$set(this.adminpeolist[i],'managerScope1','所在部门以及下级部门');
              }else if(this.adminpeolist[i].managerScope==2){
                this.$set(this.adminpeolist[i],'managerScope1','特定部门');
              }
              //微应用权限渲染
              var minscope=this.adminpeolist[i].mappInfos;
              var minscope1=[];
              for(var k=0;k<minscope.length;k++){
                minscope1.push(minscope[k].name);
              }
              var minscopename=minscope1.join(",");
              this.$set(this.adminpeolist[i],'minscopename',minscopename);
            }            
          }else if(res.code==999){
            this.$Message.error(res.msg);
            this.$router.push('/login');
          }else{
            this.$Message.error(res.msg);
          }
        })
    },
		goadd (){
      this.$router.push({path:'/home/setup/addminadmin',query:{type:'add'}});
		},
    choosemember (e){
      this.choosearr=e;
    },
    delmember (){
      var empIds='';
      var arr=[];
      for(var i=0;i<this.choosearr.length;i++){
         arr.push(this.choosearr[i].empId);
      }
      var obj={};
      obj.empList=arr;
      var str=JSON.stringify(obj);
      //把选中的员工参数发给后台;
      var parmas={
        'entId':this.entId,
        'data':str,
       }
      this.axios.post(this.baseurl+'shezhi/delect',qs.stringify(parmas)).then((res)=>{
        var res=res.data;
        console.log(res);
        if(res.code==0){
          this.$router.go(0);
        }else{
          this.$Message.error(res.msg);
        }
      })
    },
    //编辑子管理员
    editminadmin (index){
         // 把当前的成员信息转化成字符串保存到本地
         var str=JSON.stringify(this.adminpeolist[index]);
         localStorage.setItem("curadmininfo",str);
         this.$router.push({path:'/home/setup/addminadmin',query:{type:'edit'}});
    },
	}
}	
</script>
<style scoped>
.setminadmin{
  margin: 10px;
  background-color: #fff;
  min-height: 600px;
  padding: 20px 40px;
}
.add_del{
	margin:30px 0;
}
.add_del button{
	margin-right: 10px;
}
.roletop{ 
  font-size: 18px;
  color: #525252;
}
button{
  width: 120px;
  height: 36px;
  font-size: 14px;
}
.addbtn{
  background-color: #475cc7;
  border-color: #475cc7;
}
.delbtn{
  background: #dd3e19;
  border-color: #dd3e19;
}
</style>