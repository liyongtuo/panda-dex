import { postWithToken } from '../method';

const [post] = [postWithToken];

const url = '/trade';

const request = {

    // 提交问题
    postQuestion: (data) => post(`${url}/api/question/submit_question`, data),
};

export default request;
