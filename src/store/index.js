import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
import logo from '../image/banner2.jpg'

Vue.use(Vuex)

const state = {
    "entId":'',//企业id
    'deptId':'',//当前部门id
    'manager':null,//0不是管理员，1是子管理员，2是主管理员
    'baseData':[],//树结构数据
    'entname':'福建腾億',
    'defaultlogo':logo,//莫认头衔
    "teamInfo":[],//登录企业用户信息
    "admintelnum":'',//记录管理员的手机账号
    "ifroot":true,//// 判断点中的是否是企业名称，(最高的一层),不是选中企业，则出现面包屑导航
    "zuzhijiagou":[],//组织架构信息
    "activename":'',//组织架构当前选中的节点名称
    "departdata":{},//通讯录右侧对应的数据，包括部门名称,子部门和部门人员
    "groupking":'',//当前企业群主
    "groupking1":'',//当前企业群主
    "dptgrounking":'',//当前部门群主
    "choosedpt":[],//当前选中的部门
    "choosedpt1":[],//当前选中的部门
    "editchoosedpt":[],//编辑成员中的选中部门
    "editchoosedpt1":[],//编辑成员中的选中部门
    "updpt":'',//上级部门
    "updpt1":'',//上级部门
    "deptchild":[],//当前部门的子部门
    "breaddata":[],//面包屑数据
    "deptpeolist":[],//当前部门人员
    'isfirst':true,//判断是否和企业名称相同，来分别展示设置和部门编辑
    'directorList':[],//当前部门主管人员列表
    'directorList1':[],//当前部门主管人员列表
    'groupkinglist':[],//当前企业群主候选人
    'groupkinglist1':[],//当前部门群主候选人
    'alldpt':[],//所有部门的树结构，用于部门选择
    'changedeptlist':[],//调整部门的时候选中的部门
    'memebercheckeddata':[],//已选择的部门人员
    'memberempId':'',//双击店中的员工id
    'updata':[],//用户上传数据
    'updata1':[],//用户上传数据旧表
    'errflag':0,//用户上次的数据默认没有错误，导入
    'errflag1':0,//用户上次的数据默认没有错误，导出
    'errornum':0,//记录错误条数
    'childadmindpt':[],//设置子管理员所在部门
    'childadmindpt1':[],
    'adminlist':[],//所有选中子管理员的集合
    'companyinfo':{},//当前企业用于设置的信息
    'admindptlist':[],//所有选中子管理员部门的集合
    'emplist':[],//企业所有员工合集
    'deptlist':[],//企业所有部门合集
    'adminpeolist':[],//子管理员设置刚开始渲染数据
}

export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
})
