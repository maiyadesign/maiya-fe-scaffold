import request from '@/utils/request'; // mock数据请求
import Api from '@/helpers/ApiClient';

export async function findAll(payload) {
  return Api.get(`/<%= PageList[2] %>`, payload).then(res => res);
}

export async function save(payload) {
  const { id, params } = payload;
  let url = null;
  let method = '';
  if (id) {
    url = `/<%= PageList[2] %>/${id}`;
    method = 'put';
  } else {
    url = `/<%= PageList[2] %>`;
    method = 'post';
  }
  return Api[method](url, params).then(res => res);
}

export async function destroy(params) {
  return Api.delete(`/<%= PageList[2] %>/${params.id}`).then(res => res);
}

export async function find(params) {
  return Api.get(`/<%= PageList[2] %>/${params.id}`).then(res => res);
}

export async function multiDestroy(params) {
  return Api.delete(`/<%= PageList[2] %>/multi_destroy`, params).then(res => res);
}
