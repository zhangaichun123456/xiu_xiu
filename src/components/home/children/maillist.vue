<template>
  <div class="maillist">
      <div class="wrap">
        <div class="left">
              <div class="leftwrapper">
                  <div class="search">
                      <Input v-model="searchcontent" icon="search" style="width: 200px" @on-change="searchkey(searchcontent)"></Input>
                  </div>
                  <div class="nav">
                      <ul>
                          <li @click="shownum=1" :class="{'active':shownum==1}">组织架构</li>
                          <li @click="showrole" :class="{'active':shownum==2}">角色</li>
                      </ul>
                  </div>
                  <!-- 展示组织架构 -->
                  <div class="org" v-show="shownum==1">
                  <!-- 搜索框没有内容时展现组织架构，有内容展示搜索列表 -->
                      <div class="tree" v-show="!searchcontent">
                          <ul v-for="menuItem in baseData" :key="menuItem.name">
                            <my-tree :model="menuItem" ref="mytree"></my-tree>
                          </ul>
                      </div>
                      <div class="searchlist" v-show="searchcontent">
                          <ul class="searchdatadeptList">
                              <li class="s_result" v-show='searchdatadeptList.length>0'>部门列表:</li>
                              <li v-for="item in searchdatadeptList" @click="searchdpt(item)"><Icon type="folder"></Icon> {{item.name}}</li>
                          </ul>
                          <ul class="searchdataempList">
                              <li class="s_result" v-show='searchdataempList.length>0'>人员列表:</li>
                              <li v-for="item in searchdataempList" @click="searchpeo(item)"><Icon type="android-person"></Icon> {{item.name}}</li>
                          </ul>
                      </div>
                  </div>
                  <!-- 展示角色 -->
                  <div class="role" v-if="shownum==2">
                    <ul class="addrole">
                      <li type="ghost" @click="addrolegrounpmodel=true"><span>新增角色组</span></li>
                      <li type="ghost" @click="addrolemodel=true"><span>新增角色</span></li>
                    </ul>
                      <div class="roletree">
                      <ul class="default">
                          <p @click="toggle">
                            <Icon type="arrow-down-b" class="arrow" v-show="open"></Icon>
                            <Icon type="arrow-right-b" class="arrow" v-show="!open"></Icon>
                            <Icon type="folder"></Icon>
                            <span>默认</span>
                          </p>
                          <div class="lilist" v-show="open">
                            <li v-for="item in defaultroledata" @click="showroleinfo(item)"><Icon type="person"></Icon><span>{{item.title}}</span></li>
                          </div>
                      </ul>
                      <ul v-for="(role,index) in rolelistdata" class="nodefault">
                          <p @click="toggle1(role,index)">
                            <Icon type="arrow-down-b" class="arrow" v-show="role.open1"></Icon>
                            <Icon type="arrow-right-b" class="arrow" v-show="!role.open1"></Icon>
                            <Icon type="folder"></Icon>
                            <span>{{role.name}}</span>
                          </p>
                          <div class="lilist" v-show="role.open1">
                            <li v-for="rolechildren in role.children" @click="showroleinfo()"><Icon type="person"></Icon><span>{{rolechildren.name}}</span></li>
                          </div>
                      </ul>
                    </div>
                  </div>
              </div>
        </div>
        <div v-if="shownum==1" class="right">
              <div class="head">
                  <span class="headname">{{activename}}</span>
                  <!-- 徽标根据后台res判断该部门有没有建群来决定是否渲染 -->
                  <Badge v-if="isfirst" count="全员群"></Badge>
                  <Badge v-if="!isfirst&&departdata.ifChatgroup==0" count="部门群"></Badge>
                  <Button v-if="isfirst" type="ghost" @click="modalset" class="setbtn">设置</Button>
                  <Button v-if="!isfirst" type="ghost" @click="modalset1" class="setbtn">部门编辑</Button>               
              </div>
              <div class="breadcrumb" v-if="!ifroot">
                   <Breadcrumb separator=">">
                      <span v-for="item in breaddata" :key="item.name" @click="togglebread(item)"><Breadcrumb-item>{{item.name}}</Breadcrumb-item></span>
                  </Breadcrumb>
              </div>
              <div class="childdept">
                  <p>下级部门</p>
                  <div class="nextlist">
                      <Button class="nextlistbtn" type="ghost" @click="adddpt=true">添加子部门</Button>
                  </div>
                  <ul v-if="deptchild.length>0">
                      <li v-for="item in deptchild" @click="toggledpt(item)">
                      {{item.name}}(<span>{{item.empCount}}</span>人)
                      <span class="listarrow">
                        <Icon type="chevron-right"></Icon>
                      </span>
                      </li>
                  </ul>
                  <div v-else class="nodept">当前部门无下级部门</div>
              </div>
              <div class="deptpeople">
                  <p>部门人员</p>
                  <div class="nextlist">
                      <Button class="peoeditbtn" type="primary" @click="clickaddmember">添加成员</Button>
                      <Button class="peoeditbtn" type="ghost" @click="inoutpage">批量导入/导出</Button>
                      <Button class="peoeditbtn" type="ghost" @click="changeDept">调整部门</Button>
                      <Button class="peoeditbtn delpeo" type="ghost" @click="delmember">批量删除</Button>
                      <Button class="peoeditbtn" type="ghost" @click="goteaminvi">团队邀请</Button>
                  </div>
                  <p class="nocer">双击员工姓名编辑员工信息</p>
                  <div class="deptpeolist">
                      <!-- 固定表头的方式在无数据的时候有问题，只有在不固定表头的时候无数据的时候正常，所以分情况渲染 -->
                      <Table v-if="deptpeolist.length>0" height="300" border :columns="deptpeo_table_head" :data="deptpeolist" @on-row-dblclick="editmember($event)" @on-selection-change="checkedmembers($event)"></Table>
                      <Table v-else :no-data-text='nopeople' border :columns="deptpeo_table_head" :data="deptpeolist"></Table>
                  </div>
              </div>
        </div>
        <div v-show="shownum==2" class="right">
          <div class="roleright">
            <p class="roletop">主管理员(1人)
              <span class="editicon" v-show="!defaultrole"><Icon type="compose"></Icon></span>
              <span class="editicon" v-show="defaultrole"><Icon type="compose"></Icon></span>
              <span class="userole">去审批流程里使用角色</span>
            </p>
            <p class="roletip" v-show="defaultrole">“主管理员”为默认角色，无法编辑，请到“管理后台－设置－更改主管理员”，设置完成后自动同步</p>
            <p v-show="!defaultrole"><Button type="primary">添加成员</Button><Button type="primary">批量移除</Button></p>
            <div class="tablerole">
              <Table :columns="roletablehead" :data="roletabledata" border></Table>
            </div>
          </div>
        </div>
        <!-- 部门设置弹框 -->
        <Modal v-model="modal_set" width="520" :closable="false" class-name="modelheader">
            <p slot="header">
              <span>编辑部门</span>
            </p>
            <div class="deptinfo">
                <p>部门信息</p>
                <Form class="depinfoform">
                      <Form-item label="部门名称:">
                          <Input v-if="isfirst" type="text" disabled v-model="dptname" style="width: 300px"></Input>
                          <Input v-else type="text" v-model="dptname" style="width: 300px"></Input>
                          <span class="formstar" v-if="!isfirst"><Icon type="asterisk"></Icon></span>
                      </Form-item>
                       <Form-item label="上级部门:" v-if="!isfirst">
                          <Input type="text" @on-focus="showupdpt" v-model="updpt.name" style="width: 300px"></Input>
                          <span class="formstar"><Icon type="asterisk"></Icon></span>
                      </Form-item>
                      <Form-item label="设置主管:">
                          <Input type="text" @on-focus="setdirector" v-model="directorname" style="width: 300px"></Input>
                          <span class="formstar"><Icon type="asterisk"></Icon></span>
                      </Form-item>
                 </Form>
            </div>
            <div class="grouptype">
                <p class="typetip" v-if="ifroot">全员群<span v-if="setinfo.cgInfo" @click="ifdestroygroup=true">解散该群</span></p>
                <p class="typetip" v-else>部门群<span v-if="setinfo.cgInfo" @click="ifdestroygroup=true">解散该群</span></p>
                <div v-if="!setinfo.cgInfo">
                    <div v-if="ifroot" class="quanyuantip">
                      <p>全员群在管理员创建企业的时候默认创建</p><br>
                      <p>群主默认为企业管理员，企业管理员转让管理员权限后群主身份自动更换至新管理员</p><br>
                      <p>企业在进行成员添加或删除时全员群将自动加入或踢出成员</p>
                    </div>
                    <div v-if="!ifroot" class="bumentip">
                    <Button type="primary" @click="setgroupking1">新建部门群</Button>
                    <p>"{{activename}}"的部门群聊</p>
                    </div>
                </div>
                <Form v-else :label-width="80" class="depinfoform">
                      <Form-item label="群名称">
                          <Input type="text" disabled :placeholder="setinfo.cgInfo.name"></Input>
                      </Form-item>
                      <Form-item label="群主">
                          <Input type="text" @on-focus="setgroupking1" v-model="groupking.nickname"></Input>
                      </Form-item>
                      <p class="groundcount">群人数：<span>{{setinfo.cgInfo.userCount}}</span>人</p>
                 </Form>
            </div>
            <div slot="footer" class="footerbtn">
                 <Button type="primary" @click="savedepinfo" class="savebtn">保存</Button>
                 <Button type="warning" v-if="!isfirst" @click="deldet">删除</Button>
                 <Button type="ghost" @click="modal_set=false">取消</Button>
            </div>
        </Modal>
        <!-- 主管选择框 -->
        <Modal v-model="modal_setdirector" width="720" :closable="false" @on-ok="dtpking" class="setdirector">
             <dptking ref="dptking"></dptking>
        </Modal>
        <!-- 部门群群主选择框 -->
        <Modal v-model="modal_setgroupking1" :closable="false" width="720" class="setuppeo" @on-ok="dptsureking">
             <groupkingz1></groupkingz1>
        </Modal>
        <!-- 解散该群 -->
        <Modal v-model="ifdestroygroup" title="提示">
          <p>解散“{{activename}}”的全员群聊,“{{activename}}”群聊的聊天记录，图片和文件将同时被删除</p>
          <div slot="footer">
              <Button type="error" size="large" @click="destroy">解散</Button>
              <Button type="ghost" size="large" @click="ifdestroygroup=false">取消</Button>
          </div>
        </Modal>
        <!-- 提示是否删除部门 -->
        <Modal v-model="ifdeldpt" title="提示" @on-ok="suredeldpt">
          <p>是否删除该部门</p>
        </Modal>
         <!-- 添加子部门 -->
        <Modal v-model="adddpt" width="520" :closable="false" class-name="modelheader">
          <p slot="header">
            <span>添加部门</span>
          </p>
          <div class="deptinfo">
                <p>部门信息</p>
                <Form class="depinfoform">
                      <Form-item label="部门名称">
                          <Input type="text" v-model="newdepname" style="width: 300px"></Input>
                          <span class="formstar"><Icon type="asterisk"></Icon></span>
                      </Form-item>
                      <Form-item label="上级部门">
                          <Input type="text" disabled :placeholder="activename" style="width: 300px"></Input>
                      </Form-item>
                 </Form>
          </div>
          <div slot="footer" class="footerbtn">
                 <Button type="primary" @click="saveadddpt" class="savebtn">保存</Button>
                 <Button type="ghost" @click="adddpt=false">取消</Button>
            </div>
        </Modal>
         <!-- 添加成员 -->
        <Modal v-model="memberdatas" width="520" :closable="false" class-name="modelheader">
          <p slot="header">
            <span>{{memberdatatitle}}</span>
          </p>
          <div class="deptinfo">
              <p>手机端展示信息</p>
              <p class="hideinfo">手机端不展示信息</p>            
              <Form class="depinfoform2" :label-width="140">
                    <Form-item label="姓名：" class="Required">
                        <Input v-if="membertype=='add'" type="text" v-model="memberdata.name" style="width: 300px"></Input>
                        <Input v-if="membertype=='edit'" disabled type="text" v-model="memberdata.name" style="width: 300px"></Input>
                        <span class="formstar"><Icon type="asterisk"></Icon></span>
                    </Form-item>
                    <Form-item label="工号：">
                        <Input type="text" v-model="memberdata.Jobnum" style="width: 300px"></Input>
                    </Form-item>
                    <Form-item label="手机号：" class="Required">
                        <Input type="text" v-if="membertype=='add'" v-model="memberdata.tel" style="width: 300px"></Input>
                        <Input type="text" v-if="membertype=='edit'" disabled v-model="memberdata.tel" style="width: 300px"></Input>
                        <span class="formstar"><Icon type="asterisk"></Icon></span>
                    </Form-item>
                    <Form-item label="部门：" class="Required">
                        <Input type="text" v-if="membertype=='add'" v-model="memberdata.dpt" @on-focus="showdpt" style="width: 300px"></Input>
                        <Input type="text" v-if="membertype=='edit'" v-model="memberdata.dpt" @on-focus="showeditdpt" style="width: 300px"></Input>
                        <span class="formstar"><Icon type="asterisk"></Icon></span>
                    </Form-item>
                    <Form-item label="职位：">
                        <Input type="text" v-model="memberdata.position" style="width: 300px"></Input>
                    </Form-item>
                    <Form-item label="分机号：">
                        <Input type="text" v-model="memberdata.shortnum" style="width: 300px"></Input>
                    </Form-item>
                    <Form-item label="邮箱：">
                        <Input type="text" v-model="memberdata.email" style="width: 300px"></Input>
                    </Form-item>
                    <Form-item label="办公地点：">
                        <Input type="text" v-model="memberdata.address" style="width: 300px"></Input>
                    </Form-item>
                    <Form-item label="备注：">
                        <Input type="text" v-model="memberdata.remarks" style="width: 300px"></Input>
                    </Form-item>
                    <Form-item label="号码隐藏：">
                        <Radio-group v-model="memberdata.ifshownum">
                            <Radio label="1">开</Radio>
                            <Radio label="0">关</Radio>
                            <Tooltip content="可对其发咻咻、发起咻咻网络视频通话">
                              <Icon type="help-circled"></Icon>
                            </Tooltip>
                        </Radio-group>
                    </Form-item>
                    <Form-item label="高管模式：">
                        <Radio-group v-model="memberdata.ifhighpeo">
                            <Radio label="1">开</Radio>
                            <Radio label="0">关</Radio>
                            <Tooltip>
                              <Icon type="help-circled"></Icon>
                              <div style="white-space: normal;" slot="content">
                              开启后，手机号码对所有员工隐藏。普通员工无法对其发咻咻、发起咻咻网络视频通话。高管之间不受影响
                              </div>
                            </Tooltip> 
                        </Radio-group>
                    </Form-item>
                    <Form-item label="员工ID：">
                        <Input type="text" v-model="memberdata.userid" style="width: 300px"></Input>
                    </Form-item>
              </Form>
          </div>
          <div slot="footer" class="footerbtn">
                 <Button type="primary" class="savebtn" @click="savenewmember">保存</Button>
                 <Button type="primary" class="savebtn" v-if="membertype=='add'"  @click="save_add">保存并继续添加</Button>
                 <Button type="primary" v-else @click="foreverdel">彻底删除</Button>
                 <Button type="ghost" @click="exitaddmember">取消</Button>
          </div>
        </Modal>
        <!-- 添加成员部门选择 -->
        <Modal v-model="ifchoosedpt" :closable="false" width="720" @on-ok="suredpt" class="choosedptvue">
          <choosedptvue ref="choosedpt"></choosedptvue>
        </Modal>
       <!--  <Modal v-model="ifchoosedpt" :closable="false" width="720" @on-ok="suredpt" class="choosedptvue">
           <xuanzedpt></xuanzedpt>
        </Modal> -->
        <!-- 编辑成员部门选择 -->
        <Modal v-model="editchoosedptmodel" :closable="false" width="720" @on-ok="sureeditdpt"class="editchoosedpt">
          <editchoosedpt ref="editchoosedpt"></editchoosedpt>
        </Modal>
         <!-- 调整成员部门的部门选择 -->
        <Modal v-model="changedeptmodel" :closable="false" width="720" @on-ok="surechangedept" class="changedept">
          <changedept ref="changedept"></changedept>
        </Modal>
        <!-- 上级部门选择 -->
        <Modal v-model="upchoosedpt" width="720" :closable="false" @on-ok="sureupdpt" class="sureupdpt">
          <chooseupdpt></chooseupdpt>
        </Modal>
        <!-- 新增角色组 -->
        <Modal v-model="addrolegrounpmodel" :closable="false" @on-ok="subrolegroup" class-name="modelheader" class="addrolegrounpmodel">
          <p slot="header">
            <span>新增角色组</span>
          </p>
          <Form class="depinfoform">
            <Form-item label="角色组名称">
              <Input v-model="rolegroupname" placeholder="请输入" style="width: 300px"></Input>
            </Form-item>
          </Form>
        </Modal>
        <!-- 新增角色 -->
        <Modal v-model="addrolemodel" :closable="false" @on-ok="subrole" class-name="modelheader" class="addrolegrounpmodel">
          <p slot="header">
            <span>新增角色</span>
          </p>
          <Form class="depinfoform">
            <Form-item label="角色名称">
              <Input v-model="rolename" placeholder="请输入" style="width: 300px"></Input>
            </Form-item>
            <Form-item label="所属分组">
              <Select v-model="rolegrounpselect" placeholder="请选择" style="width: 300px">
                  <Option v-for="item in rolelistdata" :value="item.rolegrpId" :key="item.name">{{item.name}}</Option>
              </Select>
          </Form-item>
          </Form>
        </Modal>
      </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import groupkingz1 from './../../../common/groupkingz1.vue'//引进部门群群主选择 弹框内容的组件
import dptking from './../../../common/dptking.vue'
import choosedptvue from './../../../common/choosedpt.vue'//成员添加部门选择
import editchoosedpt from './../../../common/editmemberdpt.vue'//成员编辑部门选择
import changedept from './../../../common/changedept.vue'//调整成员部门的部门选择
import chooseupdpt from './../../../common/chooseupdpt.vue'//上级部门选择
import xuanzedpt from './../../../common/xuanzedpt.vue'
import myTree from '../../../common/treeMenu.vue'
import qs from 'qs';
export default {
   data (){
      return {
          searchcontent:'',//搜索内容
          shownum:1,
          searchdatadeptList:[],//搜索出来的部门列表数据
          searchdataempList:[],//搜索出来的人员列表数据
          deptpeo_table_head: [
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
                          title: '职位',
                          key: 'jobPosition'
                      },
                      {
                          title: '工号',
                          key: 'empNo'
                      },
                      {
                          title: '手机号',
                          key: 'telno'
                      },
                      {
                          title: '邮箱',
                          key: 'email'
                      },
                      {
                          title: '状态',
                          key: 'copystate'
                      }
                  ],
          nopeople:'当前部门暂无成员',//当前部门没人员的时候的提示
          beset:false,//是否有新建群，默认刚开始没有新建群
          modal_set:false,//默认是隐藏该弹出框,设置框
          modal_setdirector:false,//设置主管人员选择
          // modal_setgroupking:false,//设置全员群群主框
          modal_setgroupking1:false,//设置部门群群主框
          Bechosen:[],//被选择人员，部门对应的人员数据，由于要求格式不一样，用函数把deptpeolist重新排成要求的格式存放在此;
          directorname:"",//主管姓名
          dptname:'',
          ifgroup:false,//新建全员群提示框
          ifdestroygroup:false,//是否解散该群
          setinfo:[],//点击企业设置的渲染数据
          ifdeldpt:false,//删除部门提示框
          togglename:'',//切换的名字
          adddpt:false,//添加子部门弹框
          newdepname:'',//新建的子部门名称
          memberdatatitle:'添加成员',//添加编辑成员的标题
          memberdatas:false,//添加成员弹框
          membertype:'add',//弹框类型是增加员工还是编辑员工         
          memberdata:{//添加成员的填写信息
            name:'',
            Jobnum:'',
            tel:'',
            dpt:'',
            position:'',
            shortnum:'',
            email:'',
            address:'',
            remarks:'',
            userid:'',
            ifshownum:0,//添加成员的号码隐藏按钮默认选择关
            ifhighpeo:0,//添加成员的高管模式按钮默认选择关
          },
          ifchoosedpt:false,//选择部门弹框默认不显示
          upchoosedpt:false,//上级部门弹框默认不显示
          defaultroledata:[
                      {
                          title: '主管理员',
                          roleId: 1
                      },
                      {
                          title: '子管理员',
                          roleId: 2
                      },
                      {
                          title: '主管',
                          roleId: 3
                      },
                  ],
          open:true,//角色树结构的展开与否；
          defaultrole:true,//是否默认角色
          roletablehead:[//点击角色出来属于此角色的所有成员
                      {
                          title: '姓名',
                          key: 'name'
                      },
                      {
                          title: '部门',
                          key: 'jobPosition'
                      },
                      {
                          title: '工号',
                          key: 'empNo'
                      },
                  ],
          roletabledata:[
              ],
          addrolegrounpmodel:false,//新增角色组弹框
          rolegroupname:'',//角色组名称
          addrolemodel:false,//新增角色弹框
          rolegrounpselect:'',//选择所属分组
          rolelistdata:[],//角色树结构非默认数据
          rolename:'',//角色名称
          changedeptmodel:false,
          editchoosedptmodel:false,
      }
   },
   computed:{
    ...mapState([
      'entId',
      'departdata',//对应的部门名，子部门和部门人员
      "activename",
      'baseData',
      'ifroot',// 判断点中的是否是企业名称，(最高的一层),不是选中企业，则出现面包屑导航
      "groupking",//群主
      "groupking1",//群主备份
      "dptgrounking",
      "choosedpt",//选中的部门
      "choosedpt1",//选中的部门
      'updpt',//上级部门
      'updpt1',
      'deptchild',//当前部门的子部门
      'breaddata',//面包屑数据
      'zuzhijiagou',
      'deptpeolist',
      'isfirst',
      'deptId',
      'directorList',
      'directorList1',
      'alldpt',
      'changedeptlist',
      'memebercheckeddata',
      'memberempId',
      'editchoosedpt',
      'editchoosedpt1',
    ]),
  },
   components: {
       myTree,
       groupkingz1,
       choosedptvue,
       changedept,
       chooseupdpt,
       dptking,
       editchoosedpt,
       xuanzedpt,
   },
   mounted:function(){
        this.$nextTick(function(){
            this.inittree();
            this.initroletree();
        })
     
   },
   methods:{
    ...mapMutations([
                'RECORD_ZUZHIJIAGOU',//放组织机构的树结构数据信息
                'CHANGEACTIVE',//点击高亮存放的对应的节点名称
                'RECORD_DEPARTDATA',//保存对应的部门名，子部门和部门人员
                'CHOOSEDPT',//当前选中的部门
                'CHOOSEDPT1',//当前选中的部门
                'RECORD_DEPTCHILD',//当前部门的子部门
                'CHANGEIFROOT',
                'RECORD_DEPTCHILD',
                'RECORD_BREADDATA',
                'RECORD_DEPTPEOLIST',//当前部门人员
                'RECORD_ISFIRST',
                'UPDPT',
                'UPDPT1',
                'RECORD_DIRECTORNAME',
                'RECORD_DIRECTORNAME1',
                'RECORD_DEPTID',
                'RECORD_GROUNKINGLIST',
                'RECORD_GROUNKINGLIST1',
                'RECORD_GROUPKING',//当前部门群主
                'RECORD_GROUPKING1',
                'RECORD_ALLDPT',
                'RECORD_memebercheckeddata',
                'RECORD_changedeptlist',
                'RECORD_memberempId',
                'EDITCHOOSEDPT',
                'EDITCHOOSEDPT1',
                'RECORD_baseData'
            ]),
    //组织架构树形数据初始加载
   inittree (){
        this.axios.post(this.baseurl+'bas/organization/organizationPage',qs.stringify({'entId':this.entId})).then((res)=>{
           var res=res.data;
           if(res.code==0){
            // 获取树状结构数据
             this.RECORD_baseData(res.entInfo);
             // 先把顶层保存
             this.RECORD_DEPARTDATA(this.baseData[0]);
             this.RECORD_ISFIRST(true);
             this.CHANGEIFROOT(true);
             this.RECORD_DEPTID(0);
             // 获取顶层子部门数据
             this.RECORD_DEPTCHILD(this.departdata.children);
             //获取顶层部门人员数据
             this.RECORD_DEPTPEOLIST(res.empList);
             this.filterdata(this.deptpeolist);           
             this.RECORD_ZUZHIJIAGOU(this.baseData)//数据放在vuex组织架构
             this.CHANGEACTIVE(this.baseData[0].name);
             // 因为此方法是重新加载刷新渲染顶层，so没有面包屑
             this.RECORD_BREADDATA([]);
           }else if(res.code==999){
              this.$Message.error(res.msg);
              this.$router.push('/login');
           }else{
              this.$Message.error(res.msg);
           }
           
        })
          
   },
   //根据人员的state来判断在职状态
   filterdata (arr){
      for(var i=0;i<arr.length;i++){
          if(arr[i].state==0){
            this.$set(arr[i],'copystate','邀请中');
          }else if(arr[i].state==1){
            this.$set(arr[i],'copystate','邀请失败');
          }else if(arr[i].state==2){
            this.$set(arr[i],'copystate','在职');
          }else if(arr[i].state==3){
            this.$set(arr[i],'copystate','离职');
          }
        }
    },
   //角色树结构初始化
   initroletree (){
       var _this=this;
        // 初始化角色列表
        this.axios.post(this.baseurl+'bas/organization/selectTreeOfRoleGrp',qs.stringify({'rolegrpId':0})).then(function(res){
          var res=res.data;
          if(res.code==0){
            _this.rolelistdata=res.data;
            // 给每一层加一个open1来表示切换箭头图标的标志
            for(var i=0;i<_this.rolelistdata.length;i++){
              _this.$set(_this.rolelistdata[i],'open1',true);
            }
          }else if(res.code==999){
            this.$Message.error(res.msg);
            this.$router.push('/login');
          }else{
            this.$Message.error(res.msg);
          }
        });
   },
   //搜索时传值到后台，获取数组展现在列表上
   searchkey (value){
      if(value!=''){
         this.axios.post(this.baseurl+'bas/organization/selectByKeyword',qs.stringify({'entId':this.entId,'keyword':value})).then((res)=>{
            var res=res.data;
             this.searchdatadeptList=res.deptList;
             this.searchdataempList=res.empList;
          })
         }else{
             return;
         }       
   },
   // 点击搜索出来的部门
   searchdpt (item){
     this.CHANGEACTIVE(item.name);
     this.axios.post(this.baseurl+'bas/organization/selectChlidDeptAndEmpListByDeptId',qs.stringify({'entId':this.entId,'deptId':item.deptId})).then((res)=>{
        var res=res.data;
        this.RECORD_BREADDATA(res.parentDeptList)
        this.RECORD_DEPTCHILD(res.deptList);
        this.filterdata(res.empList);
        this.RECORD_DEPTPEOLIST(res.empList);
        this.RECORD_DEPARTDATA(item);
        this.$refs.mytree[0].ifactive(this.departdata);
        // 判断点中的是否是企业名称，(最高的一层),不是选中企业，则出现面包屑导航组件 和显示设置或者部门编辑
        if(item.deptId==this.zuzhijiagou[0].deptId){
          this.RECORD_ISFIRST(true);
          this.CHANGEIFROOT(true);
        }else{
          this.RECORD_ISFIRST(false);
          this.CHANGEIFROOT(false);
        }
      });
   },
   // 点击搜索出来的人员
   searchpeo (item){
     this.editmember(item);
   },
   //团队邀请按钮
   goteaminvi (){
      this.$router.push('/home/teaminvi');
     },
    //批量导入导出按钮
   inoutpage (){
      this.$router.push('/home/inout');
     },
   // 点击设置，把对对应的id发至后端，获取res，渲染modal，打开设置modal，渲染对应数据,包括主管，群主等信息
   modalset (){
      this.modal_set=true;
      this.dptname=this.activename
      // 根据是否企业设置还是部门编辑来调不同的接口和参数
      var url=this.baseurl+'bas/organization/queryEntInfo';
      var parmas={
          'entId':this.entId
         }
      this.axios.post(url,qs.stringify(parmas)).then((res)=>{
        var res=res.data;
        console.log(res);
        if(res.code==0){
          this.setinfo=res.data;//数据取出来
          // 当前主管列表提取出来保存到vuex
          this.RECORD_DIRECTORNAME(this.setinfo.directorList);
          this.RECORD_DIRECTORNAME1(this.setinfo.directorList);
          //渲染主管名字   
          var arr=[];
          for(var i=0;i<this.directorList.length;i++){
              arr.push(this.directorList[i].name);
          }
          this.directorname=arr.join(",");
          //若有群信息，则把群主渲染进来
          if(this.setinfo.cgInfo){
            this.RECORD_GROUPKING(this.setinfo.cgInfo.groupHolder);
            this.RECORD_GROUPKING1(this.setinfo.cgInfo.groupHolder);
          }
          // 上级部门渲染
          if(this.setinfo.parentDept){
            this.UPDPT(this.setinfo.parentDept);
          } 
        }else{
          this.$Message.error(res.msg);
        }
        
      })      
    },
    //部门编辑
    modalset1 (){
      this.modal_set=true;
      this.dptname=this.activename
      // 根据是否企业设置还是部门编辑来调不同的接口和参数
      var url=this.baseurl+'bas/organization/queryDeptInfo';
      var parmas={
          'deptId':this.deptId
         }
      this.axios.post(url,qs.stringify(parmas)).then((res)=>{
        var res=res.data;
        if(res.code==0){
          this.setinfo=res.data;//数据取出来
          // 当前主管列表提取出来保存到vuex
          this.RECORD_DIRECTORNAME(this.setinfo.directorList);
          this.RECORD_DIRECTORNAME1(this.setinfo.directorList);
          //渲染主管名字   
          var arr=[];
          for(var i=0;i<this.directorList.length;i++){
              arr.push(this.directorList[i].name);
          }
          this.directorname=arr.join(",");
          //若有群信息，则把群主渲染进来
          if(this.setinfo.cgInfo){
            this.RECORD_GROUPKING(this.setinfo.cgInfo.groupHolder);
            this.RECORD_GROUPKING1(this.setinfo.cgInfo.groupHolder);
          }
          // 上级部门渲染
          if(this.setinfo.parentDept){
            this.UPDPT(this.setinfo.parentDept);
          } 
        }else{
          this.$Message.error(res.msg);
        }
        
      })      
    },
   // 设置主管穿梭框
   setdirector (){
      this.modal_setdirector=true;
      var _this=this;
      // 用empId字段来对比
      var isatrr=[];
      for(var i=0;i<this.directorList.length;i++){
        isatrr.push(this.directorList[i].empId);
      }
      defaultdtp(this.deptpeolist);
      function defaultdtp(arr){
        for(var i=0;i<arr.length;i++){
          if(_this.directorList!=""&&isatrr.indexOf(arr[i].empId)>-1){
            _this.$set(arr[i],'xuanzhong',true)          
          }
        }    
      };
   },         
   // 主管框点击确定时把把主管名单渲染到主管input
   dtpking (){
        this.RECORD_DIRECTORNAME(this.directorList1);
        var arr=[];
        for(var i=0;i<this.directorList.length;i++){
            arr.push(this.directorList[i].name);
        }
        this.directorname=arr.join(",");
      // 把选择好的主管发到后端并且保存到vuex里
   },
   //部门群新建群群主选择框
   setgroupking1 (){
     this.modal_setgroupking1=true;
     var params={
          'entId':this.entId,
          'deptId':this.deptId
        }
      this.axios.post(this.baseurl+'bas/organization/selectZzUserList',qs.stringify(params)).then((res)=>{
          var res=res.data;
          if(res.code==0){
            this.RECORD_GROUNKINGLIST1(res.data);//保存群主候选人
          }else{
            this.$Message.error(res.msg);
          }
          
        })
   },
   //上级部门选择
   showupdpt (){
      var _this=this;
      this.upchoosedpt=true;
       var parmas={
            'entId':this.entId
           }
     this.axios.post(this.baseurl+'bas/organization/queryAllDeptOfEnt',qs.stringify(parmas)).then((res)=>{
        var res=res.data;
        this.RECORD_ALLDPT(res.data);
        // 过滤掉本部门以及以下部门再渲染，因为不能把本身是子部门选择成上级部门
        filtdata(this.alldpt);
        function filtdata(arr){
          for(var i=0;i<arr.length;i++){
            if(arr[i].deptId==_this.deptId){
              arr.splice(i,1);
            }else if(arr[i].deptId!=_this.deptId&&arr[i].children){
              filtdata(arr[i].children);
            }  
          }
        };
        // 利用面包屑把当前部门的上一级部门找到并保存
        this.UPDPT(this.breaddata[this.breaddata.length-2]);
        this.UPDPT1(this.breaddata[this.breaddata.length-2]); 
     })
   },
   //上级部门选择完毕点确定
   sureupdpt (){
      this.UPDPT(this.updpt1)
   },
    // 新建群
   newgroup () {
    // 点击确定后把对应的参数发给后端,重新渲染全员群页面
    var params={
        'entId':this.entId,
        'deptId':0,
        'name':this.activename,
       }
    this.axios.post(this.baseurl+'bas/organization/createGroup',qs.stringify(params)).then((res)=>{
      var res=res.data;
      if(res.code==0){
        this.$set(this.setinfo,'cgInfo',res.data);
        this.RECORD_GROUPKING(this.setinfo.cgInfo.groupHolder);//保存群主
        this.RECORD_GROUPKING1(this.setinfo.cgInfo.groupHolder);
        this.$set(this.departdata,'ifChatgroup',0);//加此句用于更新徽标
      }
    })
   },
    // 解散群
    destroy (){
      // 发送对应的参数到后台，再关闭提示框,并且重新加载一下设置弹框
      var params={
        'cgId':this.setinfo.cgInfo.cgId,
       }
      this.axios.post(this.baseurl+'bas/organization/deleteGroup',qs.stringify(params)).then((res)=>{
        var res=res.data;
        if(res.code==0){
          this.ifdestroygroup=false;
          this.modalset();
          this.$set(this.departdata,'ifChatgroup',1);//加此句用于更新徽标
        }else{
          this.$Message.error(res.msg);
        }
      })      
    },
    // 点击确定后把群主渲染到群主框
    sureking (){
      this.RECORD_GROUPKING(this.groupking1);
    },
    //部门新建群，点击新建后的弹框确定好群主，发相关参数给后台
    dptsureking (){
      // 先判断有没有选择群主
      if(this.dptgrounking){
          var params={
          'entId':this.entId,
          'deptId':this.deptId,
          'name':this.activename,
          'userId':this.dptgrounking.userId
          }
          // 再判断是否有群字段，有则不是新建，无则是新建
          if(!this.setinfo.cgInfo){
            this.axios.post(this.baseurl+'bas/organization/createGroup',qs.stringify(params)).then((res)=>{
              var res=res.data;
              if(res.code==0){
                this.modal_setgroupking1=false;
                this.modalset1();
                this.$set(this.departdata,'ifChatgroup',0);//加此句用于更新徽标
              }else{
                this.$Message.error(res.msg);
              }
              
            })
          }else{
            this.RECORD_GROUPKING(this.dptgrounking);
          }
          
      }else{
        this.$Message.error('没选群主');
      }
      
    },
    // 保存编辑部门
    savedepinfo (){
      // 把当前企业或部门的主管人员用后端规定的格式重新写好
      var directorIds='';
      var arr=[];
      for(var i=0;i<this.directorList.length;i++){
        arr.push(this.directorList[i].empId);
      }
      directorIds=arr.join(",");
      // 判断当前是否是企业还是部门，来决定参数的不同
      var params={};
      var url;
      var pid=0;
      if(!this.updpt.deptId){
        pid=0;
      }else{
        pid=this.updpt.deptId;
      }
      if(this.deptId==this.baseData[0].deptId){
          url='bas/organization/editEnt'
          params={
        'entId':this.entId,
        'directorIds':directorIds,
        }
      }else{
         url='bas/organization/editDept'
          params={
        'entId':this.entId,
        'deptId':this.deptId,
        'pid':pid,
        'name':this.dptname,
        'directorIds':directorIds,
        'groupHolder':this.groupking.userId,
        }
      }
      var savearr=null;
      var _this=this;
      this.axios.post(this.baseurl+url,qs.stringify(params)).then((res)=>{
         var res=res.data;
         if(res.code==0){
          this.modal_set=false;
          this.$refs.mytree[0].ifactive(this.departdata);
          if(this.deptId!=this.baseData[0].deptId){
            changedept(this.baseData);
            function changedept(arr){
               for(let i=0;i<arr.length;i++){
                 if(arr[i].deptId==_this.deptId){
                   // 把对应的名称更改成input里的部门名称
                   arr[i].name=_this.dptname;
                   _this.CHANGEACTIVE(_this.dptname);
                   // 先删除本部门，并把本部门存到savearr中
                   savearr=arr[i];
                   arr.splice(i,1);
                 }else if(arr[i].children){
                   changedept(arr[i].children);
                 }
               }
            }
            changedept1(this.baseData);
            // 把arr放到对应的部门中
            function changedept1(data){
                for(let j=0;j<data.length;j++){
                  if(data[j].deptId==pid){
                    if(data[j].children!=null){
                      data[j].children.push(savearr);
                    }else{
                      data[j].children=[];
                      data[j].children.push(savearr);
                    }                  
                  }else if(data[j].children){
                    changedept1(data[j].children);
                  }
               }
             } 
          }
                  
         }else{
          this.$Message.error(res.msg);
         }
      })
    },
    //删除部门
    deldet (){
      // 先判断该部门有无人员,若无人则弹出提示框确认是否删除
        this.ifdeldpt=true;
    },
    //确定删除
    suredeldpt (){
      var params={
        'entId':this.entId,
        'deptId':this.deptId,
        }
      // 把对应的参数发到后台让后台删除
      this.axios.post(this.baseurl+'bas/organization/deleteDept',qs.stringify(params)).then((res)=>{
         var res=res.data;
         if(res.code==0){
          // 关闭提示框和部门设置框
            this.ifdeldpt=false;
            this.modal_set=false;
            this.inittree();
         }else{
          this.$Message.error(res.msg);
         }
      })      
    },
    //点击面包树跳转对应部门
    togglebread (item) {
    // 把对应的参数发到后台重新渲染加载右侧页面,并把左侧架构树高亮对应位置
      this.CHANGEACTIVE(item.name);
      this.axios.post(this.baseurl+'bas/organization/selectChlidDeptAndEmpListByDeptId',qs.stringify({'entId':this.entId,'deptId':item.deptId})).then((res)=>{
        var res=res.data;
        this.RECORD_BREADDATA(res.parentDeptList)
        this.RECORD_DEPTCHILD(res.deptList);
        this.filterdata(res.empList);
        this.RECORD_DEPTPEOLIST(res.empList);
        this.RECORD_DEPARTDATA(item);
        this.$refs.mytree[0].ifactive(this.departdata);
      });    
      // 判断点中的是否是企业名称，(最高的一层),不是选中企业，则出现面包屑导航组件 和显示设置或者部门编辑
      if(item.deptId!=this.zuzhijiagou[0].deptId){
         this.CHANGEIFROOT(false);
         this.RECORD_ISFIRST(false);

      }else{
         this.CHANGEIFROOT(true);
         this.RECORD_ISFIRST(true);
      }      
    },
    //点击子部门列表里面的部门
    toggledpt (item){
      // 把对应的参数发到后台重新渲染加载右侧页面,并把左侧架构树高亮对应位置;
      this.CHANGEACTIVE(item.name);
      this.axios.post(this.baseurl+'bas/organization/selectChlidDeptAndEmpListByDeptId',qs.stringify({'entId':this.entId,'deptId':item.deptId})).then((res)=>{
        var res=res.data;
        this.RECORD_BREADDATA(res.parentDeptList)
        this.RECORD_DEPTCHILD(res.deptList);
        this.filterdata(res.empList);
        this.RECORD_DEPTPEOLIST(res.empList);
        this.RECORD_DEPARTDATA(item);
        this.$refs.mytree[0].ifactive(this.departdata);
      });    
      // 判断点中的是否是企业名称，(最高的一层),不是选中企业，则出现面包屑导航组件 和显示设置或者部门编辑
      if(item.deptId!=this.zuzhijiagou[0].deptId){
         this.CHANGEIFROOT(false);
         this.RECORD_ISFIRST(false);

      }else{
         this.CHANGEIFROOT(true);
         this.RECORD_ISFIRST(true);
      }      
    },
    //保存子部门
    saveadddpt (){
      var _this=this;
      // 先检验有没有填部门名称
      if(this.newdepname){
        // 把对应的参数发到后台重新渲染加载右侧页面，然后关闭此弹框
        // 上一级部门id（上一级为企业时，填0）
        var pid=0;
        if(!this.departdata.deptId){
          pid=0;
        }else{
          pid=this.departdata.deptId;
        }
         var params={
        'entId':this.entId,
        'pid':pid,
        'name':this.newdepname,
        }
        var _this=this;
        this.axios.post(this.baseurl+'bas/organization/saveDept',qs.stringify(params)).then((res)=>{
          var res=res.data;
          if(res.code==0){
            this.adddpt=false;
            this.uploadbaseData(this.baseData,res.data);
            this.$refs.mytree[0].ifactive(this.departdata);
            this.newdepname='';
          }else{
            this.$Message.error(res.msg);
          }
        })        
      }else{
        this.$Message.error('没填名称');
      }
    },
    // 点击添加成员，弹出成员填写框，把vuex的部门名集合清空，把当前节点部门名渲染
    clickaddmember (){
      this.memberdatas=true;
      this.membertype='add';
      this.memberdatatitle='添加成员';
      this.memberdata={
                name:'',
                Jobnum:'',
                tel:'',
                dpt:'',
                position:'',
                shortnum:'',
                email:'',
                address:'',
                remarks:'',
                userid:'',
                ifshownum:'0',
                ifhighpeo:'0',
              };
      // 每次点击添加成员，都会往choosedpt增加一次当前的departdata，故刚开始清空
      this.CHOOSEDPT([]);
      this.CHOOSEDPT1([]);
      this.choosedpt.push(this.departdata);
      this.choosedpt1.push(this.departdata);
      //渲染部门名字  
      var arr=[];
      for(var i=0;i<this.choosedpt.length;i++){
          arr.push(this.choosedpt[i].name);
      }
      this.memberdata.dpt=arr.join(",");
    },
    //添加成员聚焦点击部门input框后，则选择部门model出现
    showdpt (){
      var _this=this;
      this.ifchoosedpt=true;    
      var parmas={
        'entId':this.entId
       }
      this.axios.post(this.baseurl+'bas/organization/queryAllDeptOfEnt',qs.stringify(parmas)).then((res)=>{
        var res=res.data;
        this.$refs.choosedpt.emptychoose();
        this.CHOOSEDPT1([]);
        this.CHOOSEDPT1(this.choosedpt);
         // 获取组织架构树形数据，当前部门默认勾选
        this.resetdata(res.data);
        this.RECORD_ALLDPT(res.data);
          // 用deptId字段对比，把选中部门都用表上gouxuan
            var isatrr=[];
            for(var i=0;i<this.choosedpt.length;i++){
            isatrr.push(this.choosedpt[i].deptId);
              }
            defaultdtp(this.alldpt);
            function defaultdtp(arr){
              for(var i=0;i<arr.length;i++){
                if(_this.choosedpt!=''&&isatrr.indexOf(arr[i].deptId)>-1){
                  _this.$set(arr[i],'gouxuan',true);
                } 
                if(arr[i].children){
                  defaultdtp(arr[i].children);
                }
              }              
            };  
      })    
        
    },
    //编辑成员聚焦点击部门input框后，则选择部门model出现
    showeditdpt (){
       var _this=this;
       this.editchoosedptmodel=true;
       var parmas={
       'entId':this.entId
       }
       this.axios.post(this.baseurl+'bas/organization/queryAllDeptOfEnt',qs.stringify(parmas)).then((res)=>{
         var res=res.data;
         // 全选去掉后，后侧列表先清空再重新渲染左侧对应的数据
         this.$refs.editchoosedpt.emptychoose();
         this.EDITCHOOSEDPT1([]);
         this.EDITCHOOSEDPT1(this.editchoosedpt);
         // 保存整个架构数据，与已存在的部门对比，名字相同，则画上勾
          this.resetdata(res.data);
         this.RECORD_ALLDPT(res.data);
         var isatrr=[];
         for(var i=0;i<this.editchoosedpt.length;i++){
            isatrr.push(this.editchoosedpt[i].deptId);
              }
          defaultdtp2(this.alldpt);
          function defaultdtp2(arr){
              for(var i=0;i<arr.length;i++){
                if(isatrr.indexOf(arr[i].deptId)>-1){
                  _this.$set(arr[i],'gouxuan',true);
                };
                if(arr[i].children){
                  defaultdtp2(arr[i].children);
                };
              }     
          }
       })
    },
    // 点击添加成员部门选择框的确定后，渲染在部门input里面
    suredpt (){
      this.CHOOSEDPT(this.choosedpt1);
      var arr=[];
      for(var i=0;i<this.choosedpt.length;i++){
        arr.push(this.choosedpt[i].name)
      }
      this.memberdata.dpt=arr.join(",");
    },
    //保存添加成员的信息
    savenewmember (){
      if(this.memberdata.name==''||this.memberdata.tel==''||this.memberdata.dpt==''){
         this.$Message.error('有必填项没填');
      }else if(!/^1[34578]\d{9}$/.test(this.memberdata.tel)){
        this.$Message.error('手机号格式不正确');
      }else{
        // 把所有参数传到后台，清空并关闭model；刷新数据页面
          var params={};
          var url='';
          var deptIds='';
          var arr=[];
          if(this.membertype=='add'){ 
             for(var i=0;i<this.choosedpt.length;i++){
               arr.push(this.choosedpt[i].deptId)
             }
             deptIds=arr.join(",");
            url='bas/organization/saveEmp';
            params={
              'entId':this.entId,
              'deptIds':deptIds,
              'name':this.memberdata.name,
              'telno':this.memberdata.tel,
              'empNo':this.memberdata.Jobnum,
              'jobPosition':this.memberdata.position,
              'extNo':this.memberdata.shortnum,
              'email':this.memberdata.email,
              'address':this.memberdata.address,
              'remark':this.memberdata.remarks,
              'telnoHide':this.memberdata.ifshownum,
              'managerHide':this.memberdata.ifhighpeo,
              }
          }else{
            for (var i=0;i<this.editchoosedpt.length;i++){
                arr.push(this.editchoosedpt[i].deptId)
            }
            deptIds=arr.join(",");
            url='bas/organization/editEmp';
            params={
              'entId':this.entId,
              'empId':this.memberempId,
              'deptIds':deptIds,
              'name':this.memberdata.name,
              'telno':this.memberdata.tel,
              'empNo':this.memberdata.Jobnum,
              'jobPosition':this.memberdata.position,
              'extNo':this.memberdata.shortnum,
              'email':this.memberdata.email,
              'address':this.memberdata.address,
              'remark':this.memberdata.remarks,
              'telnoHide':this.memberdata.ifshownum,
              'managerHide':this.memberdata.ifhighpeo,
              }
          }
          var _this=this;
          this.axios.post(this.baseurl+url,qs.stringify(params)).then((res)=>{
            var res=res.data;
            // 成功后关闭弹框，并清空列表
            if(res.code==0){
              this.memberdatas=false;
              this.memberdata={
                name:'',
                Jobnum:'',
                tel:'',
                dpt:'',
                position:'',
                shortnum:'',
                email:'',
                address:'',
                remarks:'',
                userid:'',
                ifshownum:'0',
                ifhighpeo:'0',
              };
              this.updatabasedata();
              this.$refs.mytree[0].ifactive(this.departdata);
              
            }else{
              this.$Message.error(res.msg);
            }
          
         })
        
        }
    },
    //保存并继续添加成员的信息
    save_add (){
      if(this.memberdata.name==''||this.memberdata.tel==''||this.memberdata.dpt==''){
         this.$Message.error('有必填项没填');
      }else if(!/^1[34578]\d{9}$/.test(this.memberdata.tel)){
        this.$Message.error('手机号格式不正确');
      }else{
        var deptIds='';
        var arr=[];
        for(var i=0;i<this.choosedpt.length;i++){
           arr.push(this.choosedpt[i].deptId)
        }
        deptIds=arr.join(",");
        // 把所有参数传到后台，清空并关闭model；刷新数据页面
         var params={
          'entId':this.entId,
          'deptIds':deptIds,
          'name':this.memberdata.name,
          'telno':this.memberdata.tel,
          'empNo':this.memberdata.Jobnum,
          'jobPosition':this.memberdata.position,
          'extNo':this.memberdata.shortnum,
          'email':this.memberdata.email,
          'address':this.memberdata.address,
          'remark':this.memberdata.remarks,
          'telnoHide':this.memberdata.ifshownum,
          'managerHide':this.memberdata.ifhighpeo,
          }
          this.axios.post(this.baseurl+'bas/organization/saveEmp',qs.stringify(params)).then((res)=>{
            var res=res.data;
            // 成功后并清空列表
            if(res.code==0){
              this.memberdata={
                name:'',
                Jobnum:'',
                tel:'',
                dpt:'',
                position:'',
                shortnum:'',
                email:'',
                address:'',
                remarks:'',
                userid:'',
                ifshownum:'0',
                ifhighpeo:'0',
              };
              this.updatabasedata();
              this.$refs.mytree[0].ifactive(this.departdata);
            }else{
              this.$Message.error(res.msg);
            }
          
         })
        
        }
    },
    //取消添加成员
    exitaddmember (){
      // 关闭弹框并清除填写的信息
      this.memberdatas=false;
      this.memberdata={
                name:'',
                Jobnum:'',
                tel:'',
                dpt:'',
                position:'',
                shortnum:'',
                email:'',
                address:'',
                remarks:'',
                userid:'',
                ifshownum:'0',
                ifhighpeo:'0',
              };

    },
    //调整部门
    changeDept (){
       var _this=this;
      //先调用子组件的方法让全选框先默认为空
       this.$refs.changedept.emptychoose();
       this.RECORD_changedeptlist([]);
      if(this.memebercheckeddata.length<1){
        this.$Message.error('没勾选员工');
      }else{
        this.changedeptmodel=true;     
        var parmas={
          'entId':this.entId
         }
        this.axios.post(this.baseurl+'bas/organization/queryAllDeptOfEnt',qs.stringify(parmas)).then((res)=>{
          var res=res.data;
           // 获取组织架构树形数据，当前部门默认勾选
          // 先给每个部门加上gouxuan字段
          this.resetdata(res.data);
          this.RECORD_ALLDPT(res.data);
       }) 

      }  
    },
    //调整部门选择好后点击确定
    surechangedept (){
      var empIds='';
      var arr=[];
      for(var i=0;i<this.memebercheckeddata.length;i++){
         arr.push(this.memebercheckeddata[i].empId);
      }
      empIds=arr.join(",");

      var deptIds='';
      var arr1=[];
      for(var i=0;i<this.changedeptlist.length;i++){
         arr1.push(this.changedeptlist[i].deptId);
      }
      deptIds=arr1.join(",");

      var parmas={
        'entId':this.entId,
        'empIds':empIds,
        'deptIds':deptIds
       }
       this.axios.post(this.baseurl+'bas/organization/changeDept',qs.stringify(parmas)).then((res)=>{
        var res=res.data;
        if(res.code==0){
          this.updatabasedata();
          this.$refs.mytree[0].ifactive(this.departdata);
        }else{
          this.$Message.error(res.msg);
        }
       })
    },
    //双击部门人员行进行该人员编辑
    editmember (e){
      // 存储点击的员工的员工id，编辑员工发送后端的时候用到
      this.RECORD_memberempId(e.empId);
      this.memberdatas=true;
      this.memberdatatitle='编辑成员';
      this.membertype='edit';
      // 发送该成员的id，获取该成员的具体信息
       var params={
        'empId':e.empId,
        }
      this.axios.post(this.baseurl+'bas/organization/queryEmpInfo',qs.stringify(params)).then((res)=>{
        var res=res.data;
        var depname='';
        this.EDITCHOOSEDPT(res.data.deptList);
        this.EDITCHOOSEDPT1(res.data.deptList);
        var arr=[];
        for(var i=0;i<this.editchoosedpt.length;i++){
          arr.push(this.editchoosedpt[i].name);
        }
        depname=arr.join(",")
        this.memberdata={//编辑成员的填写信息
            name:res.data.name,
            Jobnum:res.data.empNo,
            tel:res.data.telno,
            dpt:depname,
            position:res.data.jobPosition,
            shortnum:res.data.empNo,
            email:res.data.email,
            address:res.data.address,
            remarks:res.data.remark,
            userid:res.data.userId,
            ifshownum:res.data.telnoHide,//编辑成员的号码隐藏按钮默认选择关
            ifhighpeo:res.data.managerHide,//编辑成员的高管模式按钮默认选择关
        };
      })
      
    },
    //点击编辑成员部门选择框的确定后，渲染在部门input里面
    sureeditdpt (){
       this.EDITCHOOSEDPT(this.editchoosedpt1);
       var arr=[];
       for(var i=0;i<this.editchoosedpt.length;i++){
        arr.push(this.editchoosedpt[i].name)
       }
       this.memberdata.dpt=arr.join(",");
    },
    //彻底删除
    foreverdel (){
      var params={
        'entId':this.entId,
        'empId':this.memberempId,
        }
      this.axios.post(this.baseurl+'bas/organization/deleteEmp',qs.stringify(params)).then((res)=>{
        var res=res.data;
        if(res.code==0){
          this.memberdatas=false;
          this.$refs.mytree[0].ifactive(this.departdata);
        }else{
          this.$Message.error(res.msg);
        }
      })

    },
    // 把选中的数据先保存
    checkedmembers (e){
      this.RECORD_memebercheckeddata(e);
    },
    //批量删除成员
    delmember (){
      var empIds='';
      var arr=[];
      for(var i=0;i<this.memebercheckeddata.length;i++){
         arr.push(this.memebercheckeddata[i].empId);
      }
      empIds=arr.join(",");
      //把选中的员工参数发给后台;
      var parmas={
        'entId':this.entId,
        'empIds':empIds,
       }
      if(empIds==''){
        this.$Message.error('请先选择要删除的员工');
      }else{
        this.axios.post(this.baseurl+'bas/organization/deleteBatchEmp',qs.stringify(parmas)).then((res)=>{
          var res=res.data;
          if(res.code==0){
            this.updatabasedata();
            this.$refs.mytree[0].ifactive(this.departdata);
          }else{
            this.$Message.error(res.msg);
          }
        })
      }
      
    },
    //点击角色管理，加载角色有关数据
    showrole (){
      this.shownum=2;
    },
    //点击角色树结构切换伸缩展开
    toggle (){
      this.open=!this.open;
    },
    //点击非默认角色书结构切换伸缩展开
    toggle1 (item,index){
       if(item.open1==true){
        this.$set(item,'open1',false)
      }else{
        this.$set(item,'open1',true)
      }     
    },
    // 点击角色展示右侧角色详情
    showroleinfo (){

    },
    //点击新增角色确定按钮,提交到后台
    subrole (){
       var _this=this;
       var param={'rolegrpId':this.rolegrounpselect,'name':this.rolename};
       this.axios.post(this.baseurl+'bas/organization/saveRole',qs.stringify(param)).then((res)=>{
        var res=res.data;
        if(res.code==0){
          this.initroletree();
        }else{
          this.$Message.error(res.msg);
        }        
       })

    },
    // 新增角色组，提交后台
    subrolegroup (){
      var _this=this;
      var param={'name':this.rolegroupname};
      this.axios.post(this.baseurl+'bas/organization/saveRoleGrp',qs.stringify(param)).then(function(res){
        var res=res.data;
        _this.initroletree();
      });    
    },
    uploadbaseData (data,resdata){
       for(var i=0;i<data.length;i++){
          if(data[i].deptId==this.deptId){
            if(data[i].children!=null){
              data[i].children.push(resdata);
            }else{
               data[i].children=[];
               data[i].children.push(resdata);
            } 
          }else if(data[i].children){
            this.uploadbaseData(data[i].children,resdata);
          }
        }
            
    },
    // 获取通讯录左侧树结构的数据
    updatabasedata (){
      this.axios.post(this.baseurl+'bas/organization/organizationPage',qs.stringify({'entId':this.entId})).then((res1)=>{
          var res1=res1.data;
          if(res1.code==0){
            var maillistdata=res1.entInfo;
            this.RECORD_baseData(maillistdata);
          }
        })
    },
    // 渲染出来的数据每层部门加上gouxuan字段
    resetdata (arr){
      for(var i=0;i<arr.length;i++){
          this.$set(arr[i],'gouxuan',false)
          if(arr[i].children){
            this.resetdata(arr[i].children);
          }       
      }
    },
 }
   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.maillist{
    width: 100%;
    min-width: 960px;
    height: calc(100% - 80px);
    background: #fff;
    position: relative;
}
.wrap{
  height: 100%;
  position: relative;
  overflow-x:auto;
  overflow-y:hidden;
}
.left{
    position: absolute;
    top: 0;
    left: 0;
    width: 320px;
    height:100%;
    background-color: #1e214a;
    overflow: auto;
}
.right{
    float: right;
    height: 100%;
    background-color: #eee;
    width: calc(100% - 320px);
    min-width: 600px;
    overflow: auto;
}
.leftwrapper{
    width: 300px;
    margin: 0 auto;
}
.search{
    margin: 30px auto;
}
.nav ul{
    font-size: 0;
    margin: 0 auto;
}
.nav ul li{
    display: inline-block;
    width: 50%;
    font-size: 20px;
    text-align: center;
    color: #a9a9b4;
    line-height: 40px;
}
.nav ul .active{
    color: #fff;
    border-bottom: 4px solid #475cc7;
}
.tree{
    margin-top: 20px;
}
.tree ul{
    font-size: 14px;
}
.tree  li{
    line-height: 26px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.searchlist{
    height: 600px;
    overflow: auto;
    color: #fff;
    margin-top: 20px;
}
.searchlist li{ 
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background: #1e214a;
    padding: 0 20px;
}
.searchlist li:hover{
  background:#090c2f;
}
.searchlist ul .s_result{
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    background: #1e214a;
     padding: 0 10px;
}

.right .head{
    height: 80px;
    line-height: 80px;
    background-color: #fff;
    margin: 10px;
    font-size: 18px; 
}
.right .head .headname{
  padding-left: 20px;
  color: #525252;
}
.head .setbtn{
  width: 120px;
  height: 36px;
  background-color: #475cc7;
  color: #fff;
  font-size: 14px;
  float: right;
  position: relative;
  top: 50%;
  right: 20px;
  margin-top: -18px;
}
.breadcrumb{
    height: 60px;
    line-height: 60px;
    background-color: #fff;
    margin: 10px;
    font-size: 16px;
}
.nextlist{
    margin:40px 0 30px 0;
}
.nextlistbtn{
    width: 120px;
    height: 36px;
    background-color: #475cc7;
    color: #fff;
    font-size: 14px;
}
.childdept{
  margin: 10px;
  background-color: #fff;
  padding:24px 20px;
}
.childdept p{
  font-size: 18px;
  color: #a9a9a9;
}
.childdept li:first-child{
  border-top: 1px solid #cecece;
}
.childdept li{
    border-bottom: 1px solid #cecece;
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: #525252;
    padding: 0 10px;
}
.childdept .listarrow{
  float: right;
  position: relative;
  top: 0;
  right: 0;
}
.childdept li:nth-child(2) .listarrow{
  float: right;
  position: relative;
  top: 0;
  right: -5px;
}
.deptpeople{
  margin: 10px;
  background-color: #fff;
  padding: 24px 20px;
}
.deptpeople p{
  font-size: 18px;
  color: #a9a9a9;
}
.deptpeople button{
  margin-right: 20px;
}
.deptpeople .peoeditbtn{
  width: 120px;
  height: 36px;
  background-color: #475cc7;
  color: #fff;
  font-size: 14px;
}
.deptpeople .delpeo{
  background-color: #dd3e19;
}
/*.peoeditbtn:last-child{
  float: right;
}*/
.nodept{
  text-align: center;
  margin: 30px 0;
}
.Required{
  position: relative;
}
.addrole{
  font-size: 0;
  margin: 20px 0 40px 0;
}
.addrole li{
  display: inline-block;
  width: 50%;
  font-size: 14px;
  text-align: center;
  color:#fff;
}
.addrole li span{
  display: inline-block;
  width: 120px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #fff;
}
.roletree{
  overflow: auto;
  font-size:14px;
  color: #a9a9b4;
}
.roletree .default,.roletree .nodefault{
  margin: 0 0 10px 10px;
  font-size: 14px;
  position: relative;
  padding-left: 20px;
}
.roletree .arrow{
  position: absolute;
  top: 2px;
  left: 0;
}
.roletree li{
  height: 42px;
  line-height: 42px;
}
.roletree span{
  margin-left: 5px;
}
.lilist{
  margin-left: 15px;
}
.roletop{
  font-size: 18px;
  color: #525252;
  padding: 20px 0 15px 20px;
}
.roletop .editicon{
  font-size: 20px;
  margin-left:20px;
  color: #475cc7;
}
.userole{
  float: right;
  padding-right: 20px;
  color: #475cc7;
  font-size: 14px;
  border-bottom: 1px solid #475cc7;
}
.roletip {
  height: 30px;
  line-height: 30px;
  background-color:#eceef9;
  margin: 0 20px; 
  padding-left: 10px;
  font-size: 12px;
  color: #475cc7;
}
.tablerole{
  margin: 20px;
}
.deptinfo p{
  font-size: 18px;
  color: #a9a9a9;
  background: #f8f8f8;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}
.depinfoform{
  padding: 50px;
}
.formstar{
  color: #e41d14;
}
.grouptype .typetip{
  font-size: 18px;
  color: #a9a9a9;
  background: #f8f8f8;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}
.grouptype .typetip span{
  float: right;
}
.grouptype .groundcount{
  font-size: 18px;
  color: #a9a9a9;
}
.quanyuantip{
  padding:20px;
  font-size: 14px;
}
.bumentip{
  text-align: center;
}
.bumentip button{
  margin: 50px 0 34px 0;
  width: 120px;
  height: 36px;
  background: #475cc7;
}
.bumentip p{
  font-size: 14px;
  color: #a9a9a9;
}
.footerbtn{
  margin: 20px 0;
  text-align: center;
}
.footerbtn button{
  width: 120px;
  height: 36px;
}
.footerbtn .savebtn{
  background: #475cc7;
}
.hideinfo{
  position: relative;
  top: 560px;
}
.roleright{
  margin: 10px;
  background-color: #fff;
  min-height: 100%;
}
.deptpeople .nocer{
  height: 30px;
  line-height: 30px;
  background: #eceef9;
  color: #475cc7;
  margin: 15px 0;
  padding-left: 10px;
  font-size: 14px;
}
</style>
