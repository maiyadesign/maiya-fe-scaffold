const get<%= PageList[1] %> = [];
const post<%= PageList[1] %> = [];

export default {
  'GET /mock/<%= PageList[0] %>': get<%= PageList[1] %>,
  'POST /mock/<%= PageList[0] %>': post<%= PageList[1] %>,
};
