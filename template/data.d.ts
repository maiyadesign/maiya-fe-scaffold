export interface <%= PageList[1] %>Item {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  title: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
}

export interface <%= PageList[1] %>Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface <%= PageList[1] %>Data {
  list: <%= PageList[1] %>Item[];
  pagination: Partial<<%= PageList[1] %>Pagination>;
}

export interface <%= PageList[1] %>Params {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
