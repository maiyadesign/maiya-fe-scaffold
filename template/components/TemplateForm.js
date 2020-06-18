import React, { Component } from 'react';
import { Modal, Form, Alert } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { AddPartForm } from '@/components';
import { processMessage } from '@/helpers/processMessage';
import { mergeErrorsToFormFields } from '@/helpers/form';
import I18n from '@/helpers/I18n';

const createForm = Form.create;

@createForm({
  mapPropsToFields: props => {
    const record = props.record || {};
    const initValues = {};

    if (record) {
      Object.entries(record).forEach(item => {
        if (
          [
            // date cols
          ].indexOf(item[0]) > -1
        ) {
          initValues[item[0]] = Form.createFormField({
            value: item[1] && moment(item[1]),
          });
        } else {
          if (item[1] !== null) {
            initValues[item[0]] = Form.createFormField({ value: item[1] || null });
          }
        }
      });
    }

    return initValues;
  },
})

export default class <%= PageList[1] %>Form extends Component {
  static propTypes = {
    record: PropTypes.object,
    title: PropTypes.string,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    form: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      saving: false,
      AlertShow: false,
    };
  }

  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll(async (errors, values) => {
      if (errors) return;

      if (this.props.onSave) {
        this.setState({ saving: true });
        let res = await this.props.onSave(errors, values);
        this.setState({ saving: false });
        if (res.success) {
          this.handleCancel();
        } else {
          this.setState({ AlertShow: true });
          if (res.errors) {
            let values = this.props.form.getFieldsValue();
            this.props.form.setFields(mergeErrorsToFormFields(values, res.errors));
          }
        }
        processMessage(res);
      }
    });
  };

  handleCancel = e => {
    this.props.onCancel && this.props.onCancel(e);
  };

  render() {
    const { record = {}, title } = this.props;
    let realTitle = title || I18n.t('<%= PageList[2] %>.new.title') || I18n.t('text.new_title', { model: I18n.t('activerecord.models.<%= PageList[2] %>'), }) || '新建';
    if (record.id) {
      const to_label = record.to_label || record.name;
      realTitle = title || I18n.t('<%= PageList[2] %>.edit.title', { label: to_label }) || I18n.t('text.edit_title', { model: I18n.t('activerecord.models.<%= PageList[2] %>'), label: to_label, }) || `编辑 ${to_label}`;
    }
    <%_ for(var i = 0; i < comParams.length; i++){ _%> <%_ if (comParams[i] === 'status' && comUi[i] === 'select') { _%> 
    const statusArr = Object.entries(I18n.t('options.use_status') || {}).map(v => { return { id: v[0], name: v[1] }; });
    <%_ } _%> <%_ } _%>
    const AddPartGroup = [
      <%_ for(var i = 0; i < comParams.length; i++){ _%>
        <%_ if (comParams[i] === 'id') { _%>
      {
        formItem: {},
        setField: { key: '<%= comParams[i] %>' },
        domType: '<%= comUi[i] %>',
        domAttribute: { type: "hidden" },
      },
        <%_ } else { _%>  
          <%_ switch (comUi[i]) { case 'select' : _%>
            <%_ if (comParams[i] === 'status') { _%>
      {
        formItem: { label: `${I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`)}：`, labelCol: { span: 6 }, wrapperCol: { span: 14 } },
        setField: { key: '<%= comParams[i] %>', rules: [{ required: false, message: I18n.t('text.placeholder_<%= comUi[i] %>', { field: I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`) }) }] },
        domType: '<%= comUi[i] %>',
        domAttribute: { width: "100%", data: statusArr, placeholder: I18n.t('text.placeholder_<%= comUi[i] %>', { field: I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`) }) },
      },
            <%_ } else { _%>
      {
        formItem: { label: `${I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`)}：`, labelCol: { span: 6 }, wrapperCol: { span: 14 } },
        setField: { key: '<%= comParams[i] %>', rules: [{ required: false, message: I18n.t('text.placeholder_<%= comUi[i] %>', { field: I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`) }) }] },
        domType: '<%= comUi[i] %>',
        domAttribute: { width: "100%", stuff: true, request: { url: '/<%= PageList[0] %>', params: { search: { status: 'in_use' }, sort: 'name' } }, placeholder: I18n.t('text.placeholder_<%= comUi[i] %>', { field: I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`) }) },
      },  
            <%_ } _%>
          <%_ break; default : _%>
      {
        formItem: { label: `${I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`)}：`, labelCol: { span: 6 }, wrapperCol: { span: 14 } },
        setField: { key: '<%= comParams[i] %>', rules: [{ required: false, message: I18n.t('text.placeholder_<%= comUi[i] %>', { field: I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`) }) }] },
        domType: '<%= comUi[i] %>',
        domAttribute: { placeholder: I18n.t('text.placeholder_<%= comUi[i] %>', { field: I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`) }) },
      },
          <%_ break; } _%>
        <%_ } _%>
      <%_ } _%>
      {
        formItem: {},
        setField: { key: 'lock_version', initialValue: 0 },
        domType: 'input',
        domAttribute: { type: "hidden" },
      },
    ];

    return (
      <Modal
        title={realTitle}
        visible
        maskClosable={false}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        cancelText={I18n.t('buttons.cancel') || '取消'}
        okText={I18n.t('buttons.confirm') || '确定'}
        confirmLoading={this.state.saving}
      >
        <Form layout="horizontal">
          {
            this.state.AlertShow && (
              <Alert
                message={`${I18n.t('flash.error', { action: I18n.t('text.actions') })}`}
                type="error"
                showIcon
              />
            )
          }
          <AddPartForm AddPartGroup={AddPartGroup} {...this.props} />
        </Form>
      </Modal>
    );
  }
}
