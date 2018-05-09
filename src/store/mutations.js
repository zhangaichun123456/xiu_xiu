import {
	RECORD_ENTID,
	RECORD_TEAMINFO,
	RECORD_ADMINTEL,
	RECORD_ZUZHIJIAGOU,
	RECORD_baseData,
	CHANGEACTIVE,
	RECORD_DEPARTDATA,
	CHANGEIFROOT,
	RECORD_GROUPKING,
	RECORD_GROUPKING1,
	CHOOSEDPT,
	CHOOSEDPT1,
	EDITCHOOSEDPT,
	EDITCHOOSEDPT1,
	UPDPT,
	UPDPT1,
	RECORD_DEPTCHILD,
	RECORD_BREADDATA,
	RECORD_DEPTPEOLIST,
	RECORD_ISFIRST,
	RECORD_DEPTID,
	RECORD_DIRECTORNAME,
	RECORD_DIRECTORNAME1,
	RECORD_GROUNKINGLIST,
	RECORD_GROUNKINGLIST1,
	RECORD_ALLDPT,
	RECORD_DPTGROUNPKING,
	RECORD_changedeptlist,
	RECORD_memebercheckeddata,
	RECORD_memberempId,
	record_updata,
	record_updata1,
	record_errflag,
	record_errflag1,
	record_errornum,
	record_adminlist,
	record_companyinfo,
	record_manager,
	record_admindptlist,
	record_emplist,
	record_deptlist,
	record_adminpeolist,
} from './mutation-types.js'

export default {
	// 记录企业ID
	[RECORD_ENTID](state, info) {
		state.entId = info;
	},
	// 记录企业用户信息
	[RECORD_TEAMINFO](state, info) {
		state.teamInfo = info;
	},
	// 记录企业用户信息
	[RECORD_baseData](state, info) {
		state.baseData = info;
	},
	// 记录当前用户是否管理员
	[record_manager](state, info) {
		state.manager = info;
	},
	//记录当前用户的手机账号
	[RECORD_ADMINTEL](state, admintel) {
		state.admintelnum = admintel;
	},
	// 记录组织架构信息
	[RECORD_ZUZHIJIAGOU](state, info) {
		state.zuzhijiagou = info;
	},
	//组织架构当前选中的节点名称
	[CHANGEACTIVE](state, name) {
		state.activename = name;
	},
	//保存当前点击节点部门的数据，包含节点名称，子节点名称和人数
	[RECORD_DEPARTDATA](state, data) {
		state.departdata = data;
	},
	// 判断点中的是否是企业名称，(最高的一层),不是选中企业，则出现面包屑导航
	[CHANGEIFROOT](state, data) {
		state.ifroot = data;
	},
	//保存企业群主
	[RECORD_GROUPKING](state, name) {
		state.groupking = name;
	},
	//保存群主
	[RECORD_GROUPKING1](state, name) {
		state.groupking1 = name;
	},
	//添加成员的时候选中的所属部门的列表
	[CHOOSEDPT](state, dpts) {
		state.choosedpt = dpts;
	},
	//添加成员的时候选中的所属部门的列表
	[CHOOSEDPT1](state, dpts) {
		state.choosedpt1 = dpts;
	},
	//编辑成员的时候选中的所属部门的列表
	[EDITCHOOSEDPT](state, dpts) {
		state.editchoosedpt = dpts;
	},
	//编辑成员的时候选中的所属部门的列表
	[EDITCHOOSEDPT1](state, dpts) {
		state.editchoosedpt1 = dpts;
	},
	//保存选择上级部门
	[UPDPT](state, dpt) {
		state.updpt = dpt;
	},
	//保存选择上级部门
	[UPDPT1](state, dpt) {
		state.updpt1 = dpt;
	},
	//保存当前部门的子部门
	[RECORD_DEPTCHILD](state, data) {
		state.deptchild = data;
	},
	//保存当前面包屑数据
	[RECORD_BREADDATA](state, data) {
		state.breaddata = data;
	},
	//保存当前部门人员
	[RECORD_DEPTPEOLIST](state, data) {
		state.deptpeolist = data;
	},
   //保存当前部门是否和企业名称一致
	[RECORD_ISFIRST](state, data) {
		state.isfirst = data;
	},
	//保存当前部门id
	[RECORD_DEPTID](state, data) {
		state.deptId = data;
	},
	//保存当前部门主管列表
	[RECORD_DIRECTORNAME](state, data) {
		state.directorList = data;
	},
	//保存当前部门主管列表
	[RECORD_DIRECTORNAME1](state, data) {
		state.directorList1 = data;
	},
	//保存当前企业群主候选人
	[RECORD_GROUNKINGLIST](state, data) {
		state.groupkinglist = data;
	},
	//保存当前部门群主候选人
	[RECORD_GROUNKINGLIST1](state, data) {
		state.groupkinglist1 = data;
	},
	//保存当前部门群主
	[RECORD_DPTGROUNPKING](state, data) {
		state.dptgrounking = data;
	},
	//保存所有部门树结构
	[RECORD_ALLDPT](state, data) {
		state.alldpt = data;
	},
	//保存调整部门时所选的部门
	[RECORD_changedeptlist](state, data) {
		state.changedeptlist = data;
	},
	//保存已选择的部门人员
	[RECORD_memebercheckeddata](state, data) {
		state.memebercheckeddata = data;
	},
	//保存当前编辑的员工id
	[RECORD_memberempId](state, data) {
		state.memberempId = data;
	},
	//保存用户上传数据
	[record_updata](state, data) {
		state.updata = data;
	},
	//保存用户上传数据,旧表
	[record_updata1](state, data) {
		state.updata1 = data;
	},
	//保存用户数据是否上传错误，导入
	[record_errflag](state, data) {
		state.errflag = data;
	},
	//保存用户数据是否上传错误，导出
	[record_errflag1](state, data) {
		state.errflag1 = data;
	},
	//保存复选框所有选中子管理员的集合
	[record_adminlist](state, data) {
		state.adminlist = data;
	},
	//保存当前企业用于设置的信息
	[record_companyinfo](state, data) {
		state.companyinfo = data;
	},
	//保存复选框所有选中子管理员部门的集合
	[record_admindptlist](state, data) {
		state.admindptlist = data;
	},
	//保存公司所有部门
	[record_deptlist](state, data) {
		state.deptlist = data;
	},
	//保存公司所有员工
	[record_emplist](state, data) {
		state.emplist = data;
	},
	//保存子管理员设置刚开始渲染数据
	[record_adminpeolist](state, data) {
		state.adminpeolist = data;
	},
	//保存导入导出的时候错误条数
	[record_errornum](state, data) {
		state.errornum = data;
	},


}