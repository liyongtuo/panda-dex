import { getWithToken, postWithToken } from '../method';

const [get, post] = [getWithToken, postWithToken];

const url = '/finance';

const request = {

    // 查询新人项目
    getProject: (id) => get(`${url}/access/get_project?project_id=${id}`),

    // 查询项目列表
    getProjectList: () => get(`${url}/access/get_project_list`),

    // 查询新项目
    getNewProject: () => get(`${url}/access/get_new_project`),

    //查询活动项目
    getActivityProject: () => get(`${url}/access/get_activity_project_list`),

    //查询消息图片
    getMessageImage: () => get(`${url}/get_message_image`),

    //查看历史项目
    getPostProject : () => get(`${url}}/access/get_end_project_list`),

    //出借历史
    getInvestHistory: () => get(`${url}/access/invest_history`),

    //已抢完项目列表 /access/get_end_project_list
    getRecruitProject : () => get(`${url}/access/get_recruit_project_list`),

    //已结束项目列表
    getEndProject: () => get(`${url}/access/get_end_project_list`),

    //项目历史记录 /finance/project_history
    getProjectHistory: (id) => get(`${url}/project_history?project_id=${id}`),

    // 出借
    postProjectInvest: (data) => post(`${url}/invest`, data),

    //我的理财
    getMyFinance: (data) => get(`${url}/my_finance`, data),

    //我的出借 my_invest
    getInvestDetail:(id) => get(`${url}/my_invest?order_id=${id}`),

    //invest_identify
    getInvestIdentify : (data) => post(`${url}/invest_identify_new`, data),


    //黄老板专用接口 add_project
    postAddProject: (data) => post(`${url}/add_project`, data),

    //黄老板专用接口 add_loan_order
    postAddLoanOrder: (data) => post(`${url}/add_loan_order`, data),

    //黄老板专用接口 add_loaner
    postAddLoaner: (data) => post(`${url}/add_loaner`, data),

    //黄老板专用接口 get_loan_order
    getLoanerOrder: () => get(`${url}/get_loan_order`),

    //黄老板专用接口 get_loaner
    getLoaner: () => get(`${url}/get_loaner`),

    //黄老板专用接口 get_qualifications
    getQualification : () => get(`${url}/get_qualifications`),

    //黄老板专用接口 get_qualifications
    getQualifications : (id) => get(`${url}/get_qualifications?type=${id}`),

    //黄老板专用接口 get_qualification_user
    getQualificationUser : (id) => get(`${url}/get_qualification_user?type=${id}`),

    //黄老板专用接口 add_qualification_group
    postAddQualificationGroup : (data) => post(`${url}/add_qualification_group`, data),

    //黄老板专用接口 add_qualification
    postAddQualification : (data) => post(`${url}/add_qualification`, data),

    // 编辑用户权限组 edit_qualification_group
    postQualificationGroup : (data) => post(`${url}/edit_qualification_group`,data),
    //黄老板专用接口 delete_qualification
    postDeleteQualification : (data) => post(`${url}/delete_qualification`, data),

    // // 新增子订单
    // postAddTrade: (data) => post(`${url}/add_trade`, data),
    //
    // // 币种信息
    // getCoinInfo: (coin) => get(`${url}/coin_info?coin=${coin}`),



};

export default request;
