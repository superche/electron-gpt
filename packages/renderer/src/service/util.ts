import { ElNotification } from 'element-plus';
import defaultAxios from 'axios';

export const axios = defaultAxios.create({
  withCredentials: true,
});

// Add response interceptor
axios.interceptors.response.use(
  // Do something with response error
  response => {
    if ((response as any).response && (response as any).response.status === 401) {
      throw new Error('Login Error');
    }
    return response;
  },
  // Do something with response error
  error => {
    if (error.response && error.response.status === 401) {
      throw new Error('Login Error');
    }
    return Promise.reject(error);
  },
);

function commonError(params: any, notShowError?: boolean) {
  const rt = axios(params).then(res => {
    if (res.status === 200) {
      return res.data;
    } else {
      if (notShowError) {
        // nothing
      } else {
        ElNotification.error({
          title: 'status错误',
          message: (res as any).msg,
        });
      }
      return res;
    }
  });

  rt.catch(error => {
    // console.log({ error }, params)
    if (notShowError) {
      // nothing
    } else if (error.response) {
      if (error.response.data && error.response.data.msg) {
        ElNotification.error({
          title: `错误: ${params.url}`,
          message: error.response.data.msg,
        });
      } else {
        ElNotification.error({
          title: '错误',
          message: `status: ${error.response.status}, statusText: ${error.response.statusText}, url: ${params.url}`,
        });
      }
    }
  });
  return rt;
}

export function code200Error(params: any, notShowError?: boolean) {
  return commonError(params, notShowError).then(res => {
    if (res.status === 0 || res.status === 403) {
      return res;
    } else {
      const rt = Promise.reject(res);
      rt.catch(() => {
        console.warn('axios status error', res);
      });
      return rt;
    }
  });
}
