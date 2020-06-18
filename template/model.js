import { message } from 'antd';
import { processMessage } from '@/helpers/processMessage';
import { findAll, save, destroy, find, multiDestroy } from './service';
import MateKey from '@/helpers/MateKey';

const <%= PageList[1] %> = {
  <%_ for(var i = 0; i < comParams.length; i++){ _%>
  <%= comParams[i] %>: null,
  <%_ } _%>
  lock_version: 0,
};

const Model = {
  namespace: '<%= PageList[0] %>',
  state: {
    record: new MateKey(new Object(), <%= PageList[1] %>),
    data: [],
    pagination: new Object({ per_page: 0, total: 0, page: 0 }),
  },
  effects: {
    *findAll({ payload, messageShow = true }, { call, put }) {
      if (messageShow) message.loading('加载中..', null);
      const response = yield call(findAll, payload);
      if (messageShow) message.destroy();
      if (response.success) yield put({
        type: 'reducerFindAll',
        pagination: response.pagination,
        data: new MateKey(response.results, <%= PageList[1] %>),
      });
      return { ...response };
    },

    *save({ payload, callback }, { call, put }) {
      const response = yield call(save, payload);
      if (response.success) yield put({
        type: 'reducerSave',
        result: new MateKey(response.result, <%= PageList[1] %>),
      });
      if (callback) callback();
      return { ...response };
    },

    *destroy({ payload, callback, messageShow = true }, { call, put }) {
      const response = yield call(destroy, payload);
      if (messageShow) processMessage(response);
      if (response.success) yield put({
        type: 'reducerDestroy',
        result: new MateKey(response.result, <%= PageList[1] %>),
      });
      if (callback) callback();
      return { ...response };
    },

    *find({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      yield put({
        type: 'reducerFind',
        result: new MateKey(response.result, <%= PageList[1] %>),
      });
      if (callback) callback();
      return { ...response };
    },

    *multiDestroy({ payload, callback, messageShow = true }, { call, put }) {
      const response = yield call(multiDestroy, payload);
      if (messageShow) processMessage(response);
      if (response.success) yield put({
        type: 'reducerMultiDestroy',
        ids: response.ids,
      });
      if (callback) callback();
      return { ...response };
    },
  },
  reducers: {
    reducerFindAll(state, { data = [], pagination = {}, ...action }) {
      return { ...state, pagination, data };
    },
    reducerSave(state, { result = {}, ...action }) {
      const mapList = new Map();
      state.data.forEach(item => {
        mapList.set(item.id, item);
      });
      mapList.set(result.id, result);
      return { ...state, data: [...mapList.values()] };
    },
    reducerDestroy(state, { result = {}, ...action }) {
      const data = state.data.filter(v => {
        return v.id !== result.id;
      });
      return { ...state, data };
    },
    reducerFind(state, { result = {}, ...action }) {
      return { ...state, record: result };
    },
    reducerMultiDestroy(state, { ids = [], ...action }) {
      const mapList = new Map();
      state.data.forEach(item => {
        mapList.set(item.id, item);
      });
      ids.forEach(v => {
        mapList.delete(v);
      });
      return { ...state, data: [...mapList.values()] };
    },
  },
};
export default Model;
