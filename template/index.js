import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Icon, Alert, Popconfirm, message, Pagination } from 'antd';
import _ from 'lodash';
import { App, QuickSearchForm, SelectPublic, BreadcrumbPublic, IconFont } from '@/components';
import { <%= PageList[1] %>AdvancedSearchForm, <%= PageList[1] %>Detail, <%= PageList[1] %>Form, <%= PageList[1] %>List } from './components';
import I18n from '@/helpers/I18n';
import Permission from '@/helpers/Permission';
import { MateSort } from '@/helpers/MateKey';
import { AdvancedScheme } from '@/helpers/DesignScheme';

import styles from './index.less';

@connect(({ <%= PageList[0] %>, loading }) => {
  return {
    data: <%= PageList[0] %>.data,
    record: <%= PageList[0] %>.record,
    pagination: <%= PageList[0] %>.pagination,
    loading: loading.models.<%= PageList[0] %>,
  };
})

class <%= PageList[1] %> extends Component {
  state = {
    searchParams: {},
    advancedSearchParams: {},
    listFilters: {},
    mode: '',
    record: this.props.record,
    detailVisible: false,
    advancedSearchExpand: false,
    selectedRowKeys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: '<%= PageList[0] %>/findAll',
    });
  }

  handleQuickSearch = (errors, values) => {
    const { dispatch } = this.props;
    const { searchParams, advancedSearchParams, listFilters } = this.state;
    const newSearchParams = { ...searchParams, ...values, ...advancedSearchParams };
    this.setState({ searchParams: newSearchParams });
    dispatch({
      type: '<%= PageList[0] %>/findAll',
      payload: { search: newSearchParams, sort: MateSort(listFilters) },
    });
  };

  handleQuickChange = obj => {
    const { searchParams } = this.state;
    const newSearchParams = { ...searchParams, ...obj };
    this.setState({ searchParams: newSearchParams });
  }

  handleQuickReset = () => {
    this.setState({ searchParams: {}, listFilters: {}, advancedSearchParams: {}  });
  }

  handleAnewReloadList = () => {
    const { dispatch, pagination } = this.props;
    const { searchParams, listFilters } = this.state;
    const perPage = pagination.per_page;
    let page = pagination.page;

    if (this.props.data.length === 0 && page > 1) {
      page -= 1;
    }
    dispatch({
      type: '<%= PageList[0] %>/findAll',
      payload: { search: searchParams, sort: MateSort(listFilters), page, per_page: perPage },
      messageShow: false,
    });
  }

  handleReloadList = () => {
    const { dispatch, pagination } = this.props;
    const { searchParams, listFilters } = this.state;
    const page = pagination.page;
    const perPage = pagination.per_page;

    dispatch({
      type: '<%= PageList[0] %>/findAll',
      payload: { search: searchParams, sort: MateSort(listFilters), page, per_page: perPage },
    });
  };

  handlePageChange = (page, perPage) => {
    const { dispatch } = this.props;
    const { searchParams, listFilters } = this.state;
    dispatch({
      type: '<%= PageList[0] %>/findAll',
      payload: { search: searchParams, sort: MateSort(listFilters), page, per_page: perPage },
    });
  };

  handleShowSizeChange = (page, perPage) => {
    const { dispatch } = this.props;
    const { searchParams, listFilters } = this.state;
    dispatch({
      type: '<%= PageList[0] %>/findAll',
      payload: { search: searchParams, sort: MateSort(listFilters), page, per_page: perPage },
    });
  };

  handleSelectPublicChange = (key, val) => {
    const { dispatch } = this.props;
    const { searchParams, listFilters } = this.state;
    const newSearchParams = { ...searchParams, [key]: val };
    this.setState({ searchParams: newSearchParams });
    dispatch({
      type: '<%= PageList[0] %>/findAll',
      payload: { search: newSearchParams, sort: MateSort(listFilters) },
    });
  }

  handleSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleSortChange = sortHash => {
    const { dispatch, pagination } = this.props;
    const { page, per_page } = pagination;
    const { search = {}, ...listFilters } = sortHash;
    const { searchParams } = this.state;
    const newSearchParams = { ...searchParams, ...search };
    this.setState({ searchParams: newSearchParams, listFilters });

    dispatch({
      type: '<%= PageList[0] %>/findAll',
      payload: { search: newSearchParams, sort: MateSort(listFilters), page, per_page },
    });
  }

  handleNew = () => {
    this.setState({ mode: 'form', record: {} });
  };

  handleMultiDestroy = async () => {
    const { dispatch } = this.props;

    let res = await dispatch({
      type: '<%= PageList[0] %>/multiDestroy',
      payload: { ids: this.state.selectedRowKeys },
    });
    if (res.success) {
      this.setState({ selectedRowKeys: [] });
      this.handleAnewReloadList();
    }
  };

  handleAdvancedSearchToggle = () => {
    this.setState({ advancedSearchExpand: !this.state.advancedSearchExpand });
  };

  handleAdvancedSearch = (errors, values) => {
    const { advancedSearchParams, searchParams } = this.state;
    const newSearchParams = { ...advancedSearchParams, ...values };
    this.setState({ advancedSearchParams: newSearchParams });

    if (AdvancedScheme()) {
      this.setState({ searchParams: { ...searchParams, ...newSearchParams} });
    }
  };

  handleEmpty = () => {
    this.setState({ selectedRowKeys: [] });
    message.success('清除成功');
  }

  handleRecordActionClick = (action_name, record) => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    switch (action_name) {
      case 'detail':
        dispatch({
          type: '<%= PageList[0] %>/find',
          payload: { id: record.id },
        });
        this.setState({
          detailVisible: true,
        });
        break;
      case 'edit':
        this.setState({ mode: 'form', record: this.props.data.find(v => v.id === record.id) || {} });
        break;
      case 'destroy':
        dispatch({
          type: '<%= PageList[0] %>/destroy',
          payload: { id: record.id },
        }).then(res => {
          if (res.success) {
            this.setState({ selectedRowKeys: selectedRowKeys.filter(n => n !== record.id) });
            this.handleAnewReloadList();
          }
        });
        break;
      default:
    }
  };

  handleDetailCancel = () => {
    this.setState({ detailVisible: false });
  };

  handleSave = async (errors, values) => {
    const { dispatch } = this.props;

    this.setState({ record: values });
    const res = await dispatch({
      type: '<%= PageList[0] %>/save',
      payload: { id: this.state.record.id, params: { <%= 
        PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] 
      %>: values } },
    });
    if (res.success) this.handleAnewReloadList();
    return res;
  };

  handleOnClose = () => {
    this.setState({ mode: '' });
  };

  renderModals = () => {
    switch (this.state.mode) {
      case 'form':
        return (
          <<%= PageList[1] %>Form
            record={this.state.record}
            onSave={this.handleSave}
            onCancel={this.handleOnClose}
          />
        );
      default:
    }
  };

  render() {
    const { pagination = {}, data = [], loading } = this.props;
    const { per_page = 25, total = 0, page = 1 } = pagination;
    const { advancedSearchExpand, selectedRowKeys, destroying = false, searchParams, listFilters } = this.state;
    const hasSelected = selectedRowKeys.length > 0;

    let pageSizeOptions = [10, 20, 25, 30, 40, 50, 80, 100 ];
    pageSizeOptions.push(per_page);
    pageSizeOptions = _.uniq(pageSizeOptions, true);
    pageSizeOptions = pageSizeOptions.map(item => `${item}`);

    const PageHeaderWrapperTitle = (
      <div>
        <BreadcrumbPublic />
        { I18n.t('<%= PageList[2] %>.index.title') }
      </div>
    );
    const PageHeaderWrapperCnt = (
      <div className={styles.PageHeaderWrapperCnt}>
        <div className={styles.text}>
          
        </div>
        <div className={styles.PageHeaderWrapperCnt_right}>
          <Button
            className={styles.rightReload}
            icon="reload"
            onClick={this.handleReloadList}
            disabled={loading}
          >
            {I18n.t('buttons.reload') || '刷新'}
          </Button>
          <Popconfirm
            className={styles.rightMulti}
            title={I18n.t('text.confirmation_destroy') || '删除后不可恢复，确定删除吗？'}
            okText={I18n.t('buttons.destroy') || '删除'}
            cancelText={I18n.t('buttons.cancel') || '取消'}
            onConfirm={this.handleMultiDestroy}
            placement="bottomRight"
            disabled={!hasSelected || !Permission.can('null')}
            icon={<Icon type="close-circle" style={{ color: 'red' }} />}
          >
            <Button className={styles.multiDestroy} disabled={!hasSelected || !Permission.can('null')} loading={loading}>
              {I18n.t('buttons.multi_destroy') || '批量删除'}
            </Button>
          </Popconfirm>
          <Button className={styles.rightNew} disabled={!Permission.can('null')} type="primary" onClick={this.handleNew}>
            <Icon type="snippets" />
            {I18n.t('buttons.new') || '新建'}
          </Button>
        </div>
      </div>
    );
    const SelectPublicArr = [
      {
        key: '<%= PageList[0] %>',
        name: `${I18n.t('activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[0] %>') }:`,
        attribute: { request: { url: '/<%= PageList[0] %>', params: { search: { status: 'in_use' }, sort: 'name' } }, focus: true }
      },
    ];

    return (
      <PageHeaderWrapper title={PageHeaderWrapperTitle} content={PageHeaderWrapperCnt}>
        <App>
          <div className={styles.<%= PageList[1] %>}>
            <div className={styles.Header}>
              <div className={styles.Header_left}>
                {
                  SelectPublicArr.map(item => {
                    return (
                      <div className={styles.filter} key={item.key}>
                        {item.name} &nbsp;
                        <SelectPublic onChange={this.handleSelectPublicChange.bind(this, item.key)} value={searchParams[item.key]} {...item.attribute}  />
                      </div>
                    )
                  })
                }
                <div className={styles.header_cntR}>
                  <QuickSearchForm
                    searchType="primary"
                    searchText={I18n.t('buttons.query')}
                    fields={[]}
                    defaultValues={this.state.searchParams}
                    onSearch={this.handleQuickSearch}
                    onChange={this.handleQuickChange}
                    onReset={this.handleQuickReset}
                  />
                  <a className={styles.HeaderA} onClick={this.handleAdvancedSearchToggle}>
                    {I18n.t(`buttons.${advancedSearchExpand ? 'collapse' : 'expand'}`) || '高级搜索'}
                  </a>
                </div>
              </div>
            </div>
            {advancedSearchExpand && (
              <div className={styles.HeaderAdvanced}>
                <<%= PageList[1] %>AdvancedSearchForm
                  onSearch={this.handleAdvancedSearch}
                  defaultValues={this.state.advancedSearchParams}
                />
              </div>
            )}
            
            {hasSelected ? (
              <div style={{ margin: '10px 0' }}>
                <Alert
                  message={
                    <span>
                      <IconFont type="iconxingzhuang1" />&nbsp;&nbsp;
                      {I18n.t('text.selected_records', { count: selectedRowKeys.length })}&nbsp;&nbsp;
                      <a onClick={this.handleEmpty}>{I18n.t('buttons.clear') || '清空'}</a>
                    </span>
                  }
                />
              </div>
            ) : null}

            <div className={styles.TableList}>
              <<%= PageList[1] %>List
                loading={loading}
                destroying={destroying}
                records={data}
                selectedRowKeys={selectedRowKeys}
                listFilters={listFilters}
                searchParams={searchParams}
                recordActions={[
                  { name: 'detail', text: I18n.t('buttons.detail') || '详情', permission: !Permission.can('null') },
                  { name: 'edit', text: I18n.t('buttons.edit') || '编辑', permission: !Permission.can('null') },
                  { name: 'destroy', text: I18n.t('buttons.destroy') || '删除', confirm: true, permission: !Permission.can('null') },
                ]}
                onRecordActionClick={this.handleRecordActionClick}
                onSelectChange={this.handleSelectChange}
                onSortChange={this.handleSortChange}
              />
              <<%= PageList[1] %>Detail
                visible={this.state.detailVisible}
                onCancel={this.handleDetailCancel}
                record={this.props.record}
              />
            </div>

            <div className={styles.paging}>
              <div className={styles.left}>
                {(`${I18n.t('text.paginate', { count: total, count2: `${page} / ${Math.ceil(total / per_page) || 1}` })}` || `共 ${total} 条记录 第 ${page} / ${Math.ceil(total / per_page) || 1} 页`)}
              </div>
              <div className={styles.right}>
                <Pagination
                  current={page}
                  total={total}
                  showSizeChanger
                  showQuickJumper
                  pageSize={per_page}
                  pageSizeOptions={pageSizeOptions}
                  onChange={this.handlePageChange}
                  onShowSizeChange={this.handleShowSizeChange}
                />
              </div>
            </div>
            {this.renderModals()}
          </div>
        </App>
      </PageHeaderWrapper>
    );
  }
}

export default <%= PageList[1] %>;
