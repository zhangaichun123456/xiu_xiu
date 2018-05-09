<template>
	<div class="report">
	    <div class="wrapper">
	        <div class="Bread">
		        <Breadcrumb separator=">">
			        <Breadcrumb-item href="/home/teamapplication">企业应用</Breadcrumb-item>
			        <Breadcrumb-item>日志</Breadcrumb-item>
				</Breadcrumb>
			</div>
			<header>
				<Form>
					<ul>
						<li>
							<Form-item label="发起人">
					            <Input v-model="Publisher" style="width: 200px"></Input>
					        </Form-item>
						</li>
						<li class="reporttypelist">
							<Form-item label="日志类型" prop="city">
					            <Select v-model="reporttype" placeholder="请选择日志类型" style="width: 200px">
					                <Option value="0">日报</Option>
					                <Option value="1">周报</Option>
					                <Option value="2">月报</Option>
					                <Option value="3">拜访记录</Option>
					            </Select>
					        </Form-item>
						</li>
						<li class="datali">
							 <Form-item label="选择日期">
					            <Row>
					                <Col span="10">
					                    <Date-picker type="date" placeholder="选择开始日期" v-model="starttime" style="width: 200px" @on-change="changesdata($event)"></Date-picker>
					                </Col>
					                <Col span="10">
					                    <Date-picker type="date" placeholder="选择结束日期" v-model="endtime" style="width: 200px" @on-change="changeedata($event)"></Date-picker>
					                </Col>
					            </Row>
					        </Form-item>
						</li>
						<li>
							<span @click="initdata"><Button type="primary">查询</Button></span>
				            <span @click="resetinput"><Button type="primary">重置条件</Button></span>
				            <span @click="exportdata"><Button type="primary">批量导出</Button></span>
						</li>
					</ul>
				</Form>
			</header>
			<div class="content">
				<Table border :columns="reporttablehead" :data="reporttabledata" @on-select="singleselect($event)" @on-select-all="allselect($event)"></Table>
			</div>
			<div class="page">
				<Page :total="tabledata.length" :page-size="pagesnum" :page-size-opts="[10, 20, 30,tabledata.length]" show-sizer show-elevator show-total @on-change="changepage($event)" @on-page-size-change="changepages($event)"></Page>
			</div>
		</div>
	</div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from 'vuex'
    import qs from 'qs';
	export default{
		data (){
			return {
               Publisher:'',
               reporttype:'',
               starttime:'',
               endtime:'',
               tabledata:[],
               pagesnum:10,
               reporttablehead: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                     {
                     	title: '序号',
                        type: 'index',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '发起人',
                        key: 'nickname',
                        width: 200,
                    },
                    {
                        title: '发布时间',
                        key: 'createTime',
                        width: 200,
                    },
                    {
                        title: '日志类型',
                        key: 'reportType1',
                        width: 200,
                    },
                    {
                        title: '地址',
                        key: 'position'
                    }
                ],
	           reporttabledata: [],
               choosedata:[],
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
	        ]),
	    },
		methods:{
			//获取数据
			initdata (){
                var params={
		          entId:this.entId,
		          name:this.Publisher,
		          dateFrom:this.starttime,
		          dateEnd:this.endtime,
                  type:this.reporttype,
		        };
		         this.axios.post(this.baseurl+'report/list',qs.stringify(params)).then((res)=>{
		            var res=res.data;
		            if(res.code==0){
		            	if(res.data.length>0){
		            		this.tabledata=res.data;
			                for(var k=0;k<this.tabledata.length;k++){
			                	if(this.tabledata[k].reportType==0){
			                		this.$set(this.tabledata[k],'reportType1','日报');
			                	}else if(this.tabledata[k].reportType==1){
	                                this.$set(this.tabledata[k],'reportType1','周报');
			                	}else if(this.tabledata[k].reportType==2){
	                                this.$set(this.tabledata[k],'reportType1','月报');
			                	}else if(this.tabledata[k].reportType==3){
	                                this.$set(this.tabledata[k],'reportType1','拜访记录');
			                	}
			                }
			            	var arr=[];
			            	for(var i=0;i<this.pagesnum;i++){
			            		if(this.tabledata[i]){
                                  arr.push(this.tabledata[i]);
			            		  this.reporttabledata=arr;
			            		}
			            	}
		            	}else if(res.data.length==0){
		            		this.reporttabledata=[];
		            	}
		            }else if(res.code==999){
		            	this.$Message.error(res.msg);
		                this.$router.push('/login');
		            }else{
		            	this.$Message.error(res.msg);
		            }
		        })       
			},
			//开始日期改变时，保存开始日期
			changesdata (e){
               this.starttime=e;
			},
			//结束日期改变时，结束开始日期
			changeedata (e){
               this.endtime=e;
			},
			//切换页码
			changepage (e){
				if(e==0){
					var arr=[];
					for(var i=e;i<this.pagesnum;i++){
						if(this.tabledata[i]){
							arr.push(this.tabledata[i]);
	            		    this.reporttabledata=arr;
						}
	            	}
				}
				if(e>0){
					var arr=[];
					for(var i=e*this.pagesnum-this.pagesnum;i<e*this.pagesnum;i++){
						if(this.tabledata[i]){
						  arr.push(this.tabledata[i]);
						  this.reporttabledata=arr;
						}
	            	}
				}
				
			},
			changepages (e){
				this.pagesnum=e;
				this.initdata();
			},
			//单个选择
			singleselect (e){
                this.choosedata=e;
			},
			//全选
			allselect (e){
                this.choosedata=e;
			},
			//重置条件
			resetinput (){
			   this.Publisher='';
               this.reporttype='';
               this.starttime='';
               this.endtime='';
			},
			//批量导出
			exportdata (){
			   if(this.choosedata.length==0){
			   	   this.$Message.error('没有选择数据');
			   }else{
                   var listdata=[];
	               for(var i=0;i<this.choosedata.length;i++){
	                  var obj={};
	                  obj.id=this.choosedata[i].id;
	                  obj.reportType=this.choosedata[i].reportType;
	                  listdata.push(obj);
	            }
	            var OBJ={};
	            OBJ.reportList=listdata;
	            OBJ=JSON.stringify(OBJ);
	               window.location.href=this.baseurl+'report/expoi?entId='+this.entId+'&data='+encodeURI(OBJ);
			   }
			}
		}
	}
</script>

<style scoped>
.report{
    background: #fff;
    position: relative;
}
.wrapper{
	min-width: 960px;
	text-align: center;
}	
header{
	background: #fff; 
	margin: 10px;
	padding: 20px;
}
header ul li{
	display: inline-block;
	vertical-align: top;
	margin: 0 20px;
	width: 300px;
}
.reporttypelist li{
	width: 150px;
}
.content{
	margin: 10px 50px;
}
.datali{
    width: 600px;
}
button{
	height: 40px;
}
.page{
	background: #fff;
	margin: 20px 50px;
}
.Bread{
	text-align: left;
	margin: 10px 50px;
}
</style>