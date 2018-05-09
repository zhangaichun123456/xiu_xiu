<template>
	<div class="notice">
		<div class="wrapper">
			<div class="Bread">
		        <Breadcrumb separator=">">
			        <Breadcrumb-item href="/home/teamapplication">企业应用</Breadcrumb-item>
			        <Breadcrumb-item>公告</Breadcrumb-item>
				</Breadcrumb>
			</div>
			<div class="content">
				<Tabs v-model="noticestatu">
			        <Tab-pane label="发公告" name="sendnotice">
			        	<Form :label-width="120">
				        	<ul>
					        	<li>
					        	    <span class="formstar"><Icon type="asterisk"></Icon></span>
					        		<Form-item label="公告标题：">
							            <Input v-model="noticetitle" placeholder="请输入公告标题" style="width:500px"></Input>
							        </Form-item>
					        	</li>
					        	<li>
					        		<Form-item label="作者：">
							            <Input v-model="author" placeholder="请输入作者" style="width: 500px"></Input>
							        </Form-item>
					        	</li>
						        <li>
						            <span class="formstar"><Icon type="asterisk"></Icon></span>
						        	<Form-item label="公告内容：">
							        	 <Row>
								        	 <Col span="20">
									        	 <div class="editcontent">
										            <vue-editor @imageAdded="handleImageAdded" useCustomImageHandler v-model="noticecontent"></vue-editor>
									             </div>
								        	 </Col>
							        	 </Row>
							        </Form-item>
						        </li>
						        <li>
					        		<Form-item label="附件：" class="upfj">
					        		    <Button type="primary">点击上传</Button>
							            <input type="file" @change="upfj" id="upfj" name="file">
							            <ul>
							                <li v-for="(olditem,index) in oldfjlist"><span class="filename">{{olditem.name}}</span><span @click="deloldfj(index)" class="delfile"><Icon type="close-circled"></Icon></span></li>
							            	<li v-for="(item,index) in fjlist"><span class="filename">{{item.name}}</span><span @click="delfj(index)" class="delfile"><Icon type="close-circled"></Icon></span></li>
							            </ul>

							            <p>支持.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip,.rar类型文件，20M以内</p>
							        </Form-item>
					        	</li>
					        	<li>
					        		<Form-item label="封面图片：" class="upimg">
					        		    <Button type="primary">点击上传</Button>
					        		    <div>
					        		    	<img :src="coverimg" alt="" v-show="coverimg!=null">
					        		    </div>
							            <input type="file" @change="upimg" id="upimg">
							            <p>推荐尺寸750*300；支持.jpg, .jpeg, .bmp, .gif, .png类型文件，5M以内</p>
							        </Form-item>
					        	</li>
					        	<li>
					        		<Form-item>
							        	<Radio-group v-model="noticetype" vertical>
									        <Radio label="1">
									            <span>设为保密公告</span>
									            <span class="texttip">接收人只能查看，消息不可转发和拷贝；公告详情页有接收人真实姓名水印，防止截图发送</span>
									        </Radio>
									        <Radio label="0">
									            <span>咻一下</span>
									            <span class="texttip">将重要的公告咻一下，确保对方收到</span>
									        </Radio>
									    </Radio-group>
							        </Form-item>
					        	</li>
					        	<li>
					        	    <span class="formstar"><Icon type="asterisk"></Icon></span>
					        		<Form-item label="发送范围：" >
					        		    <div class="rangewrapper">
						        		    <div class="sendrange" @click="showchoicemodaldpt">
						        		    	<span v-if="suredptarr.length>0" v-for="dpt in suredptarr">{{dpt.name}}</span>
						        		    </div>
						        		    <span>请选择部门 (部门和人员至少选择一种)</span>
					        		    </div>
					        		    <div class="rangewrapper">
						        		    <div class="sendrange" @click="showchoicemodalpeo">
						        		    	<span v-if="surepeoarr.length>0" v-for="peo in surepeoarr">{{peo.name}}</span>
						        		    </div>
						        		    <span>请选择人员 (部门和人员至少选择一种)</span>
					        		    </div>
							        </Form-item>
					        	</li>
					        	<li>
					        		<Form-item >
	                                    <Button type="primary" @click="sendnews">发送</Button>
	                                    <Button type="ghost" @click="previewnotice">预览</Button>
							        </Form-item>
					        	</li>
					        </ul>				        
			        	</Form>
			        </Tab-pane>
			        <Tab-pane label="历史公告" name="historynotice">
			        	<Table border :columns="histroyheaddata" :data="histroydata"></Table>
			        </Tab-pane>
			    </Tabs>
		    </div>
		</div>
		<!-- 选择部门 -->
		<Modal v-model="choicemodaldpt" width="725" :closable="false" class="addmembermodel" @on-ok="suredpt">
			<header>选择部门</header>
			<div class="addmembertree">
				<div class="left">
					<p>选择部门</p>
					<div class="tree">
						<Input v-model="searchcontent" icon="search" @on-change="searchkey(searchcontent)"></Input>
						<Breadcrumb separator=">">
		                    <span v-for="dtp in breaddata" :key="dtp.name" @click="nextfloor(dtp)"><Breadcrumb-item>{{dtp.name}}</Breadcrumb-item></span>
		                </Breadcrumb>
						<div class="lists">
						    <Checkbox :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
							<Checkbox-group v-model="checkAllGroup" @on-change="dptChange">
						    	<Checkbox v-if="!searchcontent" v-for="(item,index) in deptchild" :label="item.deptId" :key="item.deptId">
							    	{{item.name}}
							    	<span v-if="!item.choosed" class="nextfloor" @click.stop.prevent="nextfloor(item)">下级部门</span>
							    	<span v-if="item.choosed" class="nonextfloor">下级部门</span>
						    	</Checkbox>
						    	<Checkbox v-if="searchcontent" v-for="(item,index) in searchdataempList" :label="item.deptId" :key="index">
							    	{{item.name}}
							    	<span v-if="!item.choosed" class="nextfloor" @click.stop.prevent="nextfloor(item)">下级部门</span>
							    	<span v-if="item.choosed" class="nonextfloor">下级部门</span>
						    	</Checkbox>
					    	</Checkbox-group>
					    </div>
					</div>
				</div>
				<div class="right">
					<p>已选部门</p>
					<ul class="minadminlist">
						<li v-for="(ad,index) in dptarr" :key="ad"><span>{{ad.name}}</span><span class="closebtn" @click="detad(ad)"><Icon type="close"></Icon></span></li>
					</ul>
				</div>
			</div>
		</Modal>
		<!-- 选择人员 -->
		<Modal v-model="choicemodalpeo" width="725" :closable="false" class="addmembermodel" @on-ok="surepeo">
			<header>选择人员</header>
			<div class="addmembertree">
				<div class="left">
					<p>选择人员</p>
					<div class="tree">
						<Input v-model="searchcontent1" icon="search" @on-change="searchkey1(searchcontent1)"></Input>
						<Breadcrumb separator=">">
		                    <span v-for="dtp in breaddata" :key="dtp.name" @click="nextfloor(dtp)"><Breadcrumb-item>{{dtp.name}}</Breadcrumb-item></span>
		                </Breadcrumb>
						<div class="lists">
						    <Checkbox :value="checkAll1" @click.prevent.native="handleCheckAll1">全选</Checkbox>
							<ul v-if="!searchcontent1" class="dptlist">
								<li v-for="item in deptchild" :key="item.name">
									<span class="itemname"><span class="foldericon"><Icon type="folder"></Icon></span>{{item.name}}</span>
									<span class="nextfloor" @click="nextfloor(item)">下级部门</span>
								</li>
							</ul>
						    <div class="dptmember">
						        <Checkbox-group v-model="checkAllGroup1" @on-change="peoChange">
							    	<Checkbox v-if="!searchcontent1" v-for="(peo,index) in deptpeolist" :label="peo.empId" :key="peo.empId">{{peo.name}}</Checkbox>
							    	<Checkbox v-if="searchcontent1" v-for="(peo,index) in searchdataempList1" :label="peo.empId" :key="index">{{peo.name}}</Checkbox>
						    	</Checkbox-group>
						    </div>
					    </div>
					</div>
				</div>
				<div class="right">
					<p>已选人员</p>
					<ul class="minadminlist">
						<li v-for="(ad,index) in peoarr" :key="ad"><span>{{ad.name}}</span><span class="closebtn" @click="detad1(ad)"><Icon type="close"></Icon></span></li>
					</ul>
				</div>
			</div>
		</Modal>
		<!-- 公告预览 -->
		<Modal v-model="previewmodal" width="400" title='公告预览' :styles="{height:'600px',overflow:'auto'}">
		    <h3>{{noticetitle}}</h3>
		    <p><span class="author" v-if="author!=''">{{author}}</span><span>{{yltime}}</span></p>
		    <img class="coverimg" v-if="coverimg!=''" :src="coverimg" alt="">
		    <div class="ql-editor" v-html="noticecontent"></div>
		    <div v-if="fjlist.length>0" class="previewfj">
		        <p>附件：</p>
		    	<ul>
	            	<li v-for="(item,index) in fjlist"><span class="filename">{{item.name}}</span></li>
	            </ul>
		    </div>
			<div slot="footer"></div>
		</Modal>
		<!-- 公告详情 -->
		<Modal v-model="noticedetail" width="400" title='公告详情' :styles="{height:'600px',overflow:'auto'}">
		    <h3>{{singdetail.title}}</h3>
		    <p><span class="author" v-if="singdetail.writer!=''">{{singdetail.writer}}</span><span>{{singdetail.createTime}}</span></p>
		    <img class="coverimg" v-if="singdetail.coverimg!=''" :src="baseurl+singdetail.coverImg" alt="">
		    <div class="ql-editor" v-html="singdetail.content"></div>
		    <div class="previewfj">
		        <p>附件：</p>
		    	<ul>
	            	<li v-for="(item,index) in singdetail.noticeFiles"><span class="filename">{{item.name}}</span></li>
	            </ul>
		    </div>
			<div slot="footer"></div>
		</Modal>
		<!-- 已读未读详情 -->
		<Modal v-model="showreadmodel" width="720" title='已读未读详情'>
			<div>
				<p class="unreadnum">未读{{unreadlist.length}}人</p>
				<div class="unreadlist">
					<ul>
						<li v-for="item in unreadlist">
							<img :src="baseurl+item.avatarUrl" alt="">
							<p>{{item.nickname}}</p>
						</li>
					</ul>
				</div>
			</div>
			<div>
				<p class="readnum">已读{{readlist.length}}人</p>
				<div class="readlist">
					<ul>
						<li v-for="item in readlist">
							<img :src="baseurl+item.avatarUrl" alt="">
							<p>{{item.nickname}}</p>
						</li>
					</ul>
				</div>
			</div>
			<div slot="footer"></div>
		</Modal>
		<!-- 撤回 -->
		<Modal v-model="showwithdraw" width="500" title='提示' @on-ok="surewithdraw">
			确定撤回本条公告吗？
		</Modal>
		<!-- 置顶 -->
		<!-- <Modal v-model="showsetTop" width="500" title='提示' @on-ok="suresetTop">
			置顶后，该公告会出现在手机咻咻工作页面顶部，确认置顶该条公告吗？
		</Modal> -->
	</div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import qs from 'qs'
    import { VueEditor } from 'vue2-editor'
	export default{
		components: {
	      VueEditor
	    },
		data (){
			return {
			  noticestatu:'sendnotice',
              noticetitle:'',
              author:'',
              noticecontent:'',
              coverimg:"",
              coverimg1:"",
              fjlist:[],
              noticetype:0,//类型：0-普通公告(咻一下) 1-保密公告
              choicemodaldpt:false,
              choicemodalpeo:false,
              searchcontent:'',
              searchcontent1:'',
              checkAllGroup:[],
              checkAllGroup1:[],
              checkAll:false,
              checkAll1:false,
              searchdataempList:[],
              searchdataempList1:[],
              dptarr:[],
              peoarr:[],
              suredptarr:[],
              surepeoarr:[],
              yltime:'',
              previewmodal:false,
              noticedetail:false,
              singdetail:{},//公告详情
              histroyheaddata: [
	                {
	                    title: '通知标题',
	                    key: 'name',
	                    render: (h, params) => {
	                    	if(params.row.sort==1){
                               return h('div', [
                               	    h('div',{style: {marginTop: '5px',marginBottom:'5px'}},
		                                [
	                               	    	h('strong',{on:{click:()=>{this.clicktitle(params)}}}, params.row.title),
				                            h('Button', {
				                                props: {
				                                    type: 'success',
				                                    size: 'small'
				                                },
				                                style: {
				                                    marginLeft: '8px'
				                                },
				                            }, '置顶')
                           	    	    ]
                           	    	),
                           	    	h('p',[
                               	    	h('span',{style: {marginRight: '8px'}},  params.row.createTime),
			                            h('span', params.row.name)
                           	    	])
		                            
		                        ]);
	                    	}else{
	                    		return h('div', [
	                    			h('div',{style: {marginTop: '5px',marginBottom:'5px'}},
		                                [
	                    				  h('strong',{on:{click:()=>{this.clicktitle(params)}}}, params.row.title)
	                    			    ]
	                    			  ),
	                    			h('p',[
                               	    	h('span',{style: {marginRight: '8px'}},  params.row.createTime),
			                            h('span', params.row.name)
                           	    	])
		                            
		                        ]);
	                    	}
	                    }
	                },
	                {
	                    title: '状态',
	                    width: 200,
	                    key: 'age',
	                    render:(h,params)=>{
                            return h('p',{style: {color: '#38adff'},on:{click:()=>{this.readmodel(params)}}},
                            	[
	                            	h('span',{style: {marginRight: '8px'}},'已读'+ params.row.read+'人'),
	                            	h('span','未读'+ params.row.unread+'人')
                            	])
	                    }
	                },
	                {
	                    title: '操作',
	                    key: 'action',
	                    width: 200,
	                    align: 'center',
	                    render: (h, params) => {
	                    	if(params.row.sort==0){
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
		                                       this.editnotice(params);
		                                    }
		                                }
		                            }, '编辑'),
		                            h('Button', {
		                                props: {
		                                    type: 'error',
		                                    size: 'small'
		                                },
		                                style: {
		                                    marginRight: '5px'
		                                },
		                                on: {
		                                    click: () => {
		                                       this.withdraw(params);
		                                    }
		                                }
		                            }, '撤回'),
		                            h('Button', {
		                                props: {
		                                    type: 'success',
		                                    size: 'small'
		                                },
		                                on: {
		                                    click: () => {
		                                        this.setTop(params);
		                                    }
		                                }
		                            }, '设为置顶')
		                        ]);
	                        }else if(params.row.sort==1){
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
		                                       this.editnotice(params);   
		                                    }
		                                }
		                            }, '编辑'),
		                            h('Button', {
		                                props: {
		                                    disabled: 'disabled',
		                                    size: 'small'
		                                },
		                                style: {
		                                    marginRight: '5px'
		                                },
		                                on: {
		                                    click: () => {
		                                       this.withdraw(params);
		                                    }
		                                }
		                            }, '撤回'),
		                            h('Button', {
		                                props: {
		                                    type: 'warning',
		                                    size: 'small'
		                                },
		                                on: {
		                                    click: () => {
		                                        this.setTop(params);
		                                    }
		                                }
		                            }, '取消置顶')
		                        ]);
	                        }
	                    }
	                }
              ],
              histroydata:[],
              showreadmodel:false,
              showwithdraw:false,
              showsetTop:false,
              sorts:0,//置顶   0-否  1- 是
              unreadlist:[],
              readlist:[],
              cehuiid:null,
              oldfjlist:[],
              oldfjlistid:[],
			}
		},
		mounted:function(){
	   	  this.$nextTick(function(){
	   	  	 this.gethistorydata();
	   	  })   	   
	    },
		computed:{
		    ...mapState([
		    	'entId',
		    	'breaddata',
		    	'alldpt',
		    	'deptchild',
		    	'deptpeolist',
		    	'deptlist',
	    	    'emplist',
	    	    'admintelnum',
		    ]),
	    },
		methods:{
			...mapMutations([
                'RECORD_ALLDPT',
                'RECORD_DEPTPEOLIST',
                'RECORD_DEPTCHILD',
                'RECORD_BREADDATA',
                'record_deptlist',
                'record_emplist'
            ]),
            //获取历史公告数据
            gethistorydata (){
            	var params={
			        "entId":this.entId,
			      }
			    this.axios.post(this.baseurl+'notice/list',qs.stringify(params)).then((res)=>{
			         var res=res.data;
			         this.histroydata=res.data;
			    })
            },
            //公告内容的图片转换
			handleImageAdded (file, Editor, cursorLocation){
				var formData = new FormData();
                formData.append('file', file);
                var config = {
	              headers: {
	                'Content-Type': 'multipart/form-data'
	              }
	            }
                this.axios.post(this.baseurl+'notice/photoUpload',formData,config).then((res)=>{
                	var res=res.data;
                	if(res.code==0){
                		let url=this.baseurl+res.data.path;
                		Editor.insertEmbed(cursorLocation, 'image', url);
                	}else if(res.code==999){
		            	this.$Message.error(res.msg);
		            	this.$router.push('/login');
		            }else{
		            	this.$Message.error(res.msg);
		            }   
                	
                })
                .catch((err)=>{
                	this.$Message.error('图片获取失败');
                })
			},
			//选择附件
			upfj (){
			   var $_file = document.getElementById("upfj");
	           var file = $_file.files[0];
	           var filename=file.name;
	           var index = filename.lastIndexOf(".");
	           var ext = filename.substr(index+1);
	           var arr = ["doc","docx","pdf","xls","xlsx","ppt","zip","rar"];
	           if(arr.indexOf(ext)>-1){
	           	 if(file.size<30*1024*1024){
	           	 	this.fjlist.push(file);
	           	 }else{
	           	 	this.$Message.error('文件不得大于30M');
	           	 }
	           }else{
	           	 this.$Message.error('不支持上传文件格式');
	           }
			},
			//选择封面图片
			upimg (){
			   var $_file = document.getElementById("upimg");
	           var file = $_file.files[0];
	           var filename=file.name;
	           var index = filename.lastIndexOf(".");
	           var ext = filename.substr(index+1);
	           var arr = ["jpg","jpeg","bmp","gif","png"];
	           var formData = new FormData();
               formData.append('file', file);
                var config = {
	              headers: {
	                'Content-Type': 'multipart/form-data'
	              }
	            }
	           if(arr.indexOf(ext)>-1){
	           	 if(file.size<5*1024*1024){
			           this.axios.post(this.baseurl+'notice/photoUpload',formData,config).then((res)=>{
		                	var res=res.data;
		                	if(res.code==0){
		                		this.coverimg=this.baseurl+res.data.path;
		                		this.coverimg1=res.data.path;
		                	}else if(res.code==999){
				            	this.$Message.error(res.msg);
				            	this.$router.push('/login');
				            }else{
				            	this.$Message.error(res.msg);
				            }   
		                	
		                })
		                .catch((err)=>{
		                	this.$Message.error('图片获取失败');
		                })
	           	 }else{
	           	 	this.$Message.error('文件不得大于5M');
	           	 }
	           }else{
	           	 this.$Message.error('不支持上传图片格式');
	           } 
			},
			//删除附件
			delfj (index){
				this.fjlist.splice(index,1);
			},
			//删除旧的附件
			deloldfj (index){
				this.oldfjlist.splice(index,1);
				this.oldfjlistid.splice(index,1);
			},
			//选择发送的部门
			showchoicemodaldpt (){
                this.choicemodaldpt=true;
                var parmas={
		          'entId':this.entId
		         }
		         // 把alldpt的第一层保存vuex，用于刚开始的渲染
	            this.axios.post(this.baseurl+'bas/organization/queryAllDeptOfEnt',qs.stringify(parmas)).then((res)=>{
			        var res=res.data;
			         // 获取组织架构树形数据，当前部门默认勾选
			        this.RECORD_ALLDPT(res.data);
			        this.RECORD_DEPTCHILD(this.alldpt[0].children);
			        this.RECORD_BREADDATA(this.alldpt);
			    });
			    //获取公司所有部门和人员信息
			    var parmas2={
		          'entId':this.entId
		        };
		        this.axios.post(this.baseurl+'shezhi/getemolist',qs.stringify(parmas2)).then((res)=>{
		        	var res=res.data;
		        	if(res.code==0){
		        		this.record_deptlist(res.data.deptlist);
		        		this.record_emplist(res.data.emplist)
		        	}
		        })     
			},
		    //选择发送的人员
			showchoicemodalpeo (){
                this.choicemodalpeo=true;
                var parmas={
		          'entId':this.entId
		         }
		         // 把alldpt的第一层保存vuex，用于刚开始的渲染
	            this.axios.post(this.baseurl+'bas/organization/queryAllDeptOfEnt',qs.stringify(parmas)).then((res)=>{
			        var res=res.data;
			         // 获取组织架构树形数据，当前部门默认勾选
			        this.RECORD_ALLDPT(res.data);
			        this.RECORD_DEPTCHILD(this.alldpt[0].children);
			        this.RECORD_BREADDATA(this.alldpt);
			    });
			    // 把最高层对应的人员保存vuex，用于刚开始的渲染
			    var parmas1={
			      'entId':this.entId,
		          'deptId':0,
		         }
			    this.axios.post(this.baseurl+'bas/organization/selectChlidDeptAndEmpListByDeptId',qs.stringify(parmas1)).then((res)=>{
			        var res=res.data;
			        this.RECORD_DEPTPEOLIST(res.empList);
			    });
			    //获取公司所有部门和人员信息
			    var parmas2={
		          'entId':this.entId
		        };
		        this.axios.post(this.baseurl+'shezhi/getemolist',qs.stringify(parmas2)).then((res)=>{
		        	var res=res.data;
		        	if(res.code==0){
		        		this.record_deptlist(res.data.deptlist);
		        		this.record_emplist(res.data.emplist)
		        	}
		        }) 
			},
			//搜索时传值到后台，获取部门数组展现在列表上
		    searchkey (value){
		      if(value!=''){
		         this.axios.post(this.baseurl+'bas/organization/selectByKeyword',qs.stringify({'entId':this.entId,'keyword':value})).then((res)=>{
		             var res=res.data;
		             this.searchdataempList=res.deptList;
		             // 判断当前已勾选的项，勾选好的则用参数表明
		             for(var i=0;i<this.searchdataempList.length;i++){
		             	if(this.checkAllGroup.indexOf(this.searchdataempList[i].deptId)>-1){
	                       this.$set(this.searchdataempList[i],'choosed',true);
		             	}else{
		             		this.$set(this.searchdataempList[i],'choosed',false);
		             	}
		              }
		          })
		         }else{
		         	 // 搜索值为空的时候，就要判断当前部门有没有勾选的了
	         	 for(var i=0;i<this.deptchild.length;i++){
	             	if(this.checkAllGroup.indexOf(this.deptchild[i].deptId)>-1){
	                   this.$set(this.deptchild[i],'choosed',true);
	             	}else{
	             		this.$set(this.deptchild[i],'choosed',false);
	             	}
	              }
	             return;
	          }        
		    },
		    //搜索时传值到后台，获取人员数组展现在列表上
		    searchkey1 (value){
		      if(value!=''){
		         this.axios.post(this.baseurl+'bas/organization/selectByKeyword',qs.stringify({'entId':this.entId,'keyword':value})).then((res)=>{
		            var res=res.data;
		             this.searchdataempList1=res.empList;
		          })
		         }else{
		             return;
		         }       
		    },
		    // 点击全选全部勾上部门
			handleCheckAll () {
				// 当有搜索字时,列表就是搜索的结果，否则就是当前部门员工所挂员工列表
				var list=null;
		        if (this.searchcontent!='') {
	                list=this.searchdataempList;
		        }else{
		        	list=this.deptchild;
		        }
	            this.checkAll = !this.checkAll;
	            // 先把右侧列表的部门id整出来，用来后面对比
	            var arr=[];
	    		for(var i=0;i<this.dptarr.length;i++){
	    			arr.push(this.dptarr[i].deptId)
	    		}
	            if (this.checkAll) {
	            	//因为下级两个字如果选择的部门，则下级不可点，故设置个参数控制
		            for(var i=0;i<list.length;i++){
		            	this.$set(list[i],'choosed',true);
		            }
	            	// 全选勾上的时候，判断左侧右侧有没有和以前相同的，没有相同的就放进去，以免右侧多出重复的
		        	for(var i=0;i<list.length;i++){
		        		if(this.checkAllGroup.indexOf(list[i].deptId)<0){
		        			this.checkAllGroup.push(list[i].deptId);
		        		}

		        		if(arr.indexOf(list[i].deptId)<0){
		        			 this.dptarr.push(list[i]);
		        		}               
		        	 }
	            } else {;
	            	//因为下级两个字如果选择的部门，则下级不可点，故设置个参数控制
		            for(var i=0;i<list.length;i++){
		            	this.$set(list[i],'choosed',false);
		            }
	            	// 当取消全选时，把当前的部门的全选取消，和把当前的部门名称从右侧列表删除
	            	var arr=[];
	            	var result={};
	            	for(var i in this.deptchild){
						result[this.deptchild[i].deptId] = this.deptchild[i].deptId;
					}
					for(var i in this.checkAllGroup){
						if(!result[this.checkAllGroup[i]]){
							arr.push(this.checkAllGroup[i]);
						  };
					}
					this.checkAllGroup=arr;

					var arr1=[];
					var result1={};
					for(var i in this.deptchild){
						result1[this.deptchild[i].deptId] = this.deptchild[i].deptId;
					}
					for(var i in this.dptarr){
						if(!result1[this.dptarr[i].deptId]){
							arr1.push(this.dptarr[i]);
						  };
					}
					this.dptarr=arr1;
	            }
	        },
	        // 点击全选全部勾上人员
			handleCheckAll1 () {
				var list=null;
		        if (this.searchcontent1!='') {
	                list=this.searchdataempList1;
		        }else{
		        	list=this.deptpeolist;
		        }
		        // 先把右侧列表的员工id整出来，用来后面对比
	            var arr=[];
	    		for(var i=0;i<this.peoarr.length;i++){
	    			arr.push(this.peoarr[i].empId)
	    		}
	            this.checkAll1 = !this.checkAll1;
	            if (this.checkAll1) {
	            	for(var i=0;i<list.length;i++){
	            		if(this.checkAllGroup1.indexOf(list[i].empId)<0){
	            			this.checkAllGroup1.push(list[i].empId);
	            		}
	            		if(arr.indexOf(list[i].empId)<0){
	            			this.peoarr.push(list[i]);
	            		}
	            	}
	            } else {
	                // 当取消全选时，把当前的部门的人员全选取消，和把当前的部门人员名称从右侧列表删除
	            	var arr=[];
	            	var result={};
	            	for(var i in this.deptpeolist){
						result[this.deptpeolist[i].empId] = this.deptpeolist[i].empId;
					}
					for(var i in this.checkAllGroup1){
						if(!result[this.checkAllGroup1[i]]){
							arr.push(this.checkAllGroup1[i]);
						  };
					}
					this.checkAllGroup1=arr;

					var arr1=[];
					var result1={};
					for(var i in this.deptpeolist){
						result1[this.deptpeolist[i].empId] = this.deptpeolist[i].empId;
					}
					for(var i in this.peoarr){
						if(!result1[this.peoarr[i].empId]){
							arr1.push(this.peoarr[i]);
						  };
					}
					this.peoarr=arr1;
	            }
	        },
			//点击下一级
	        nextfloor (item){
	           var parmas={
			      'entId':this.entId,
		          'deptId':item.deptId,
		         }
			    this.axios.post(this.baseurl+'bas/organization/selectChlidDeptAndEmpListByDeptId',qs.stringify(parmas)).then((res)=>{
			        var res=res.data;
			        this.RECORD_DEPTCHILD(res.deptList);
			        this.RECORD_DEPTPEOLIST(res.empList);
			        this.RECORD_BREADDATA(res.parentDeptList);
			        // 部门选择也是用此方法，在有搜选关键字列表下的下一级，点击的时候记得把关键字清空
			        this.searchcontent='';
			        // 点击面包屑也是此方法，所以要判断点击面包屑后当时的部门有没有选中，然后给设置相应的参数
			        for(var i=0;i<this.deptchild.length;i++){
		            	if(this.checkAllGroup.indexOf(this.deptchild[i].deptId)>-1){
		            		this.$set(this.deptchild[i],'choosed',true);
		            	}else{
		            		this.$set(this.deptchild[i],'choosed',false);
		            	}	
			        }
			    }) 
			},
			//点击右侧删除 部门
		    detad (item){
		    	for (var i=0;i<this.checkAllGroup.length;i++){
		    		if(item.deptId==this.checkAllGroup[i]){
		    			this.checkAllGroup.splice(i,1);
		    		}
		    	}
		    	for (var i=0;i<this.dptarr.length;i++){
		    		if(item.deptId==this.dptarr[i].deptId){
		    			this.dptarr.splice(i,1);
		    		}
		    	}
		    	 //循环判断是哪个部门，然后该部门设置上级可点
		    	var list=null;
		        if (this.searchcontent!='') {
	                list=this.searchdataempList;
		        }else{
		        	list=this.deptchild;
		        }
		        for(var i=0;i<list.length;i++){
		        	if(item.deptId==list[i].deptId){
		        	  this.$set(list[i],'choosed',false);
		        	}
		        }
		    	this.checkAll1=false;
		    },
		    //点击右侧删除 人员
		    detad1 (item){
		    	for (var i=0;i<this.checkAllGroup1.length;i++){
		    		if(item.empId==this.checkAllGroup1[i]){
		    			this.checkAllGroup1.splice(i,1);
		    		}
		    	}
		    	for (var i=0;i<this.peoarr.length;i++){
		    		if(item.empId==this.peoarr[i].empId){
		    			this.peoarr.splice(i,1);
		    		}
		    	}
		    	this.checkAll1=false;
		    },
		    // 判断选择有没有选择完，全部选项勾选则全选勾上
	        dptChange (data){
	        	this.dptarr=[];
	        	var list=null;
		        if (this.searchcontent!='') {
	                list=this.searchdataempList;
		        }else{
		        	list=this.deptchild;
		        }
	        	//当前所见部门和人员
	        	var deptlist=[];
	        	var peolist=[];
		        if (this.searchcontent!='') {
	                peolist=this.searchdataempList;
		        }else{
		        	deptlist=this.deptchild;
		        	peolist=this.deptpeolist;
		        };
		        // 因为data是包含整个企业里面选中的数据，而这里需要跟当前选中的数据长度对比，故要过滤一下data
		         var arr=[];
		         for(var i=0;i<list.length;i++){
		         	if(data.indexOf(list[i].deptId)>-1){
		         		arr.push(list[i])
		         	}
		         }
	            if (arr.length === list.length) {
	                this.checkAll = true;
	            } else if (arr.length > 0) {
	                this.checkAll = false;
	            } else {
	                this.checkAll = false;
	            };
	            for (var i=0;i<this.deptlist.length;i++){
	            	if(data.indexOf(this.deptlist[i].deptId)>-1)
	            	this.dptarr.push(this.deptlist[i]);
	            }
	            //因为下级两个字如果选择的部门，则下级不可点，故设置个参数控制
	            for(var i=0;i<list.length;i++){
	            	if(data.indexOf(list[i].deptId)>-1){
	            		this.$set(list[i],'choosed',true);
	            	}else{
	            		this.$set(list[i],'choosed',false);
	            	}
	            	
	            }
	        },
	         // 判断选择有没有选择完，全部选项勾选则全选勾上
	        peoChange (data){
	        	this.peoarr=[];
	        	var list=null;
		        if (this.searchcontent1!='') {
	                list=this.searchdataempList1;
		        }else{
		        	list=this.deptpeolist;
		        }
		        // 因为data是包含整个企业里面选中的数据，而这里需要跟当前选中部门的人员数据长度对比，故要过滤一下data
		        var arr=[];
		        for(var i=0;i<list.length;i++){
		         	if(data.indexOf(list[i].empId)>-1){
		         		arr.push(list[i])
		         	}
		        }
	            if (arr.length === list.length) {
	                this.checkAll1 = true;
	            } else if (arr.length > 0) {
	                this.checkAll1 = false;
	            } else {
	                this.checkAll1 = false;
	            }
	            for (var i=0;i<this.emplist.length;i++){
	            	if(data.indexOf(this.emplist[i].empId)>-1)
	            	this.peoarr.push(this.emplist[i]);
	            }
	        },
	        //点击部门model的确定
			suredpt (){
	          this.choicemodaldpt=false;
	          this.suredptarr=this.dptarr;
			},
			//点击人员model的确定
			surepeo (){
			  this.choicemodalpeo=false;
	          this.surepeoarr=this.peoarr;
			},
			//获取当前时间
			gettime (){
				var date = new Date;
				var Year=date.getFullYear();
				var Month=date.getMonth()+1;
				var Dates=date.getDate();
				var Hours=date.getHours();
				var Minutes=date.getMinutes();
				var Seconds=date.getSeconds();
				this.yltime=Year+'年'+Month+'月'+Dates+'日'+' '+Hours+':'+Minutes;
			},
			//点击预览
			previewnotice (){
				if(this.noticetitle==''){
					this.$Message.error('公告标题未填写');
				}else if(this.dptarr.length==0&&this.peoarr.length==0){
					this.$Message.error('发送范围未选择');
				}else if(this.noticecontent==null){
					this.$Message.error('公告内容未填写');
				}else{
					this.gettime();
				    this.previewmodal=true;
				}
			},
			//发送公告
			sendnews (){
				var empIdList=[];
				var deptIdList=[];
				for(var i=0;i<this.suredptarr.length;i++){
					deptIdList.push(this.suredptarr[i].deptId)
				}
				for(var i=0;i<this.surepeoarr.length;i++){
					empIdList.push(this.surepeoarr[i].empId)
				}
				var formData = new FormData();
				formData.append('entId', this.entId);
	            formData.append('telNo', this.admintelnum);
	            formData.append('type', this.noticetype);
	            formData.append('title', this.noticetitle);
	            formData.append('content', this.noticecontent);
	            formData.append('sort', this.sorts);
	            formData.append('writer', this.author);
	            formData.append('coverImg', this.coverimg1);
	            formData.append('empIdList', empIdList);
	            formData.append('deptIdList', deptIdList);
	            formData.append('fileIdList', this.oldfjlistid);
	            for(var i=0;i<this.fjlist.length;i++){
	            	formData.append('file',this.fjlist[i]);
	            }
	            var config = {
	              headers: {
	                'Content-Type': 'multipart/form-data'
	              }
	            }
		        this.axios.post(this.baseurl+'notice/add',formData, config).then((res)=>{
		        	var res=res.data;
		        	if(res.code==0){
		        	   this.gethistorydata();
		               this.$Message.success('发布成功');
		               this.noticetype=0;
	                   this.noticetitle='';
	                   this.noticecontent='';
	                   this.sorts=0;
	                   this.author='';
	                   this.coverimg='';
	                   this.coverimg1='';
	                   this.suredptarr=[];
	                   this.surepeoarr=[];
	                   this.fjlist=[];
	                   this.oldfjlist=[];
	                   this.oldfjlistid=[];
					}else if(res.code==999){
		            	this.$Message.error(res.msg);
		            	this.$router.push('/login');
		            }else{
						this.$Message.error(res.msg);
					}	
		        })
		        .catch((err)=>{
                	this.$Message.error('后台链接异常');
                })
			},
			//点击已读未读详情
			readmodel (params){
				this.showreadmodel=true;
				var param={
			        "noticeId":params.row.noticeId,
			      }
				this.axios.post(this.baseurl+'notice/readinfo',qs.stringify(param)).then((res)=>{
					var res=res.data;
					if(res.code==0){
						this.readlist=res.data.readlist;
						this.unreadlist=res.data.unreadlist;
					}else if(res.code==999){
		            	this.$Message.error(res.msg);
		            	this.$router.push('/login');
		            }else{
						this.$Message.error(res.msg);
					}
				})
				.catch((err)=>{
                	this.$Message.error('后台链接异常');
                })
			},
			//撤回
			withdraw (params){
				this.showwithdraw=true;
				this.cehuiid=params.row.noticeId;
			},
			//确定撤回
			surewithdraw (params){
                var param={
			        "noticeId":this.cehuiid,
			      }
				this.axios.post(this.baseurl+'notice/del',qs.stringify(param)).then((res)=>{
					var res=res.data;
					if(res.code==0){
						this.gethistorydata();
					}else if(res.code==999){
		            	this.$Message.error(res.msg);
		            	this.$router.push('/login');
		            }else{
						this.$Message.error(res.msg);
					}		
				})
				.catch((err)=>{
                	this.$Message.error('获取数据失败');
                })
			},
			//设置或取消置顶弹窗
			setTop (params){
				// this.showsetTop=true;
				// this.zhidingid=params.row.noticeId;
				var param={
			        "noticeId":params.row.noticeId,
			      }
			    this.axios.post(this.baseurl+'notice/changepaixu',qs.stringify(param)).then((res)=>{
					var res=res.data;
					if(res.code==0){
						this.gethistorydata();
					}else if(res.code==999){
		            	this.$Message.error(res.msg);
		            	this.$router.push('/login');
		            }else{
						this.$Message.error(res.msg);
					}		
				})
				.catch((err)=>{
                	this.$Message.error('获取数据失败');
                })
			},
			//公告详情
			clicktitle (params){
				this.noticedetail=true;
				this.singdetail=params.row;
			},
			//编辑详情
			editnotice (params){
				this.noticestatu='sendnotice';
				this.noticetitle=params.row.title;
                this.noticecontent=params.row.content;
                this.sorts=params.row.sort;
                this.author=params.row.writer;
                this.coverimg=this.baseurl+params.row.coverImg;
                this.coverimg1=params.row.coverImg;
                this.suredptarr=[];
                this.surepeoarr=[];
                this.oldfjlist=params.row.noticeFiles;
                for(var i=0;i<this.oldfjlist.length;i++){
                	this.oldfjlistid.push(this.oldfjlist[i].id);
                }
			}
		}
	}
</script>

<style scoped>
.notice{
    background: #fff;
    position: relative;
}
.wrapper{
	min-width: 960px;
	text-align: center;
}
.content{
	margin: 0 50px;
}
.content li{
	position: relative;
}
.content li .formstar{
	position: absolute;
	top: 10px;
	left: 0;
	color: red;
}
.Bread{
	text-align: left;
	margin: 10px 50px;
}
.upfj input{
    position: relative;
    top: 0;
    right: 85px;
    opacity: 0;
}
.upfj li{
	height: 50px;
	line-height: 50px;
	width: 500px;
	border:1px solid #ccc;
	margin-top: 10px;
	padding: 0 10px;
	font-size: 14px;
}
.upfj .filename{
	display: inline-block;
	width: 450px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.upfj li .delfile{
	float: right;
	font-size: 20px;
	color: red;
}
.upimg input{
	position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
}
.upimg .upimgtip{
	width: 150px;
	height: 60px;
	border: 1px solid #ccc;
	font-size: 16px;
	line-height: 60px;
	text-align: center;
}
.upimg img{
	margin-top: 30px;
	width: 150px;
}
.texttip{
	margin-left: 5px;
	color: #b7b1b1;
}
.sendrange{
	width: 500px;
	height: 40px;
	border:1px solid #dddee1;
}
.sendrange span{
    display: inline-block;
    height: 32px;
    line-height: 32px!important;
    background: #E8F2FD;
    color: #38adff!important;
    margin: 3px 3px;
    padding: 0 8px;
}
.rangewrapper span{
	line-height: 40px;
	color: #b7b1b1;
}
.addmembertree{
	padding: 20px 0 0 20px;
}
.addmembertree p{
	font-size: 18px;
	color: #a9a9a9;
	padding-bottom: 20px;
}
.addmembertree .left,.addmembertree .right{
	display: inline-block;
	vertical-align: top;
	overflow: auto;
}
.tree{
	border: 1px solid #eee;
	width: 330px;
	height: 330px;
	margin-right: 20px;
	overflow: auto;
}
.minadminlist{
	border: 1px solid #eee;
	width: 330px;
	height: 330px;
}
.addmembertree .right li{
  border-bottom: none;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.addmembertree .lists{
	padding: 0 10px 10px 20px;
}
.addmembertree .dptlist li {
	height: 35px;
	line-height: 35px;
	font-size: 14px;
	border-bottom: none;
}
.addmembertree .dptlist li:hover{
	background: #eee;
}
.nextfloor{
	float: right;
	color: #475cc7;
	width: 60px;
    text-align: right;
}
.nonextfloor{
	float: right;
	color: #ccc;
	width: 60px;
    text-align: right;
}
.addmembertree .minadminlist li{
	width: 290px;
	height: 36px;
	line-height: 36px;
	background-color: #dadef4;
	margin: 10px 0 10px 20px;
	font-size: 14px;
	color: #5a5a5a;
	padding: 0 20px 0 10px;
	position: relative;
}
.addmembertree .closebtn{
	position: absolute;
	right: 10px;
	top: 0;
	color: #fff;
}
.microimg{
	width: 14px;
	height: 14px;
	margin-right: 7px;
}
.imgwrap span,.imgwrap img{
	display: inline-block;
	vertical-align: middle;
}
.content{
	margin-top: 40px;
}
.all{
	line-height: 40px;
}
.all p{
	font-size: 14px;
	color: #a9a9a9;
}
.smallhead{
	font-size: 14px;
	color: #525252;
	padding:20px 0;
}
button{
	width: 120px;
	height: 36px;
}
header{
	background: #475cc7;
	text-align: center;
	height: 40px;
	line-height: 40px;
	font-size: 20px;
	color: #fff;
}
.foldericon{
	margin-right: 5px;
	color: #5a5a5a;
}
.itemname{
	display: inline-block;
	width: 200px;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.coverimg{
	width: 100%;
}
.previewfj{
	border-top: 1px solid #ccc;
}
.previewfj p{
	margin: 10px 0;
}
.previewfj li{
	height: 50px;
	line-height: 50px;
	width: 350px;
	border:1px solid #ccc;
	margin-top: 10px;
	padding: 0 10px;
	font-size: 14px;
}
.previewfj .filename{
	display: inline-block;
	width: 300px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.author{
	margin-right: 5px;
}
.unreadnum, .readnum{
	padding-left: 10px;
    font-size: 16px;
    font-weight: 500;
    line-height: 2;
    text-align: left;
    color: #333;
    background: #eee;
}
.readlist,.unreadlist{
	margin: 10px 0;
	min-height: 50px;
}
.unreadlist li,.readlist li{
	display: inline-block;	
	margin: 10px;
}
.unreadlist li p,.readlist li p{
	text-align: center;
}
.unreadlist img,.readlist img{
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
</style>