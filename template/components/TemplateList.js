import React, { Component } from 'react';
import { Table, Popconfirm, Divider, Badge, Icon } from 'antd';
import PropTypes from 'prop-types';
import I18n from '@/helpers/I18n';
import Immutable from 'immutable';
import _ from 'lodash';

export default class <%= PageList[1] %>List extends Component {
  static propTypes = {
    pagination: PropTypes.object,
    loading: PropTypes.bool,
    destroying: PropTypes.bool,
    selectedRowKeys: PropTypes.array,
    recordActions: PropTypes.array,
    onSelectChange: PropTypes.func,
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func,
    onPageChange: PropTypes.func,
    onShowSizeChange: PropTypes.func,
    records: PropTypes.array,
    onRecordActionClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleRecordActionClick = (action_name, record) => {
    this.props.onRecordActionClick && this.props.onRecordActionClick(action_name, record);
  };

  handleSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.onSelectChange && this.props.onSelectChange(selectedRowKeys, selectedRows);
  };

  handleSelect = (record, selected, selectedRows) => {
    this.props.onSelect && this.props.onSelect(record, selected, selectedRows);
  };

  handleSelectAll = (selected, selectedRows, changeRows) => {
    this.props.onSelectAll && this.props.onSelectAll(selected, selectedRows, changeRows);
  };

  handleChange = (pagination, filters, sorter, extra ) => {
    let obj = {};
    if (Object.keys(sorter).length > 0) {
      const { columnKey, order = '' } = sorter || {};
      obj = { ...obj, [columnKey]: order };
    }
    if (Object.keys(filters).length > 0) {
      Object.entries(filters).map(item => {
        obj = { ...obj, search: { [item[0]]: (item[1] || [])[0] } };
      })
    }
    if (this.props.onSortChange) {
      this.props.onSortChange(obj);
    }
  }

  getConfirmTitle = action => {
    if (action.confirm === true && action.name === 'destroy')
      return I18n.t('text.confirmation_destroy') || '删除后不可恢复，确定删除吗?';
    if (action.confirm === true) return I18n.t('text.confirmation') || '确定吗?';
    if (!action.confirm) return '';
    return action.confirm;
  };

  render() {
    const { loading, destroying, selectedRowKeys, records, recordActions, searchParams, listFilters } = this.props;

    let _recordActions = recordActions || [];
    const recordActionsHtml = record => {
      return _recordActions.map((action, index) => {
        const actLabel = action.text || action.name;
        if (action.confirm) {
          return (
            <Popconfirm
              key={action.name}
              visiable={!destroying}
              title={this.getConfirmTitle(action)}
              okText={actLabel}
              cancelText={I18n.t('buttons.cancel') || '取消'}
              onConfirm={this.handleRecordActionClick.bind(this, action.name, record)}
              placement="topRight"
              disabled={action.permission}
              icon={<Icon type="close-circle" style={{ color: 'red' }} />}
            >
              <a className="record-action" disabled={action.permission}>{actLabel} {index !== _recordActions.length - 1 && <Divider type="vertical" />}</a>
            </Popconfirm>
          );
        }
        return (
          <a key={action.name} className="record-action"
            disabled={action.permission}
            onClick={this.handleRecordActionClick.bind(this, action.name, record)}
          >
            {actLabel} {index !== _recordActions.length - 1 && <Divider type="vertical" />}
          </a>
        );
      });
    };

    const columns = [
      <%_ for(var i = 0; i < comParams.length; i++){ _%>
        <%_ if (comParams[i] === 'id') { _%>
        <%_ } else if (comParams[i] !== 'status') { _%>
      { dataIndex: '<%= comParams[i] %>', width: <%= comParams.length > 6 ? 120 : 145 %> },
        <%_ } else { _%>
      {
        dataIndex: '<%= comParams[i] %>',
        filterShow: true,
        filterMultiple: false,
        filters: Object.entries(Immutable.isMap(I18n.t('options.use_status')) ? I18n.t('options.use_status').toJS() : I18n.t('options.use_status') || {}).map(v => {
          return { text: v[1], value: v[0] };
        }),
        render: (text, record) => {
          const statusMap = { in_use: 'success', unused: 'processing' };
          return (
            <Badge
              status={statusMap[record.status]}
              text={I18n.t(`options.use_status.${record.status}`)}
            />
          );
        },
      },
        <%_ } _%>
      <%_ } _%>
      {
        title: 'actions',
        dataIndex: '',
        sorterShow: true,
        width: 300,
        key: 'actions',
        render: (text, record) => {
          return <div className="record-actions">{recordActionsHtml(record)}</div>;
        },
      },
    ].map(col => {
      let newCol = { ...col };
      if (!col.sorterShow) {
        newCol = { ...newCol, sorter: true, sortOrder: listFilters[col.dataIndex] }
      }
      if (col.filterShow) {
        newCol = { ...newCol, filteredValue: searchParams[col.dataIndex] ? [searchParams[col.dataIndex]] : [] }
      }

      if (col.dataIndex)
        return { ...newCol, title: col.title || I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.${col.dataIndex}`) };
      return { ...newCol, title: I18n.t(`text.${col.title}`) };
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
      onSelect: this.handleSelect,
      onSelectAll: this.handleSelectAll,
    };

    return (
      <Table
        rowKey="id"
        scroll={{ x: `${columns.length * 10}%`, y: true }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={records}
        loading={loading}
        pagination={false}
        onChange={this.handleChange}
      />
    );
  }
}
