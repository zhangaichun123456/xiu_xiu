import {RECORD_TEAMINFO,RECORD_ADMINTEL} from './mutation-types.js'

export default {
	// 记录企业用户信息
	async record_teaminfo({commit,state}) {
		commit(RECORD_TEAMINFO);
	},
	//记录管理员的手机账号
	async record_admintel({commit,state}){
		commit(RECORD_ADMINTEL);
	}
}