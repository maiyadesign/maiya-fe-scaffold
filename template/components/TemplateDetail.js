import React, { Component } from 'react';
import { Modal, Form, Button } from 'antd';
import PropTypes from 'prop-types';
import I18n from '@/helpers/I18n';

const FormItem = Form.Item;

export default class <%= PageList[1] %>Detail extends Component {
  static propTypes = {
    record: PropTypes.object,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onCancel = e => {
    this.props.onCancel(e);
  };

  render() {
    const formItems = [
      <%_ for(var i = 0; i < comParams.length; i++){ _%>
      <%_ if (comParams[i] === 'id') { _%>
      <%_ } else if (comParams[i] !== 'status') { _%>
      { name: '<%= comParams[i] %>' },
      <%_ } else { _%>
      {
        name: '<%= comParams[i] %>',
        render: record => {
          return I18n.t(`options.use_status.${record.status}`);
        },
      },
      <%_ } _%>
      <%_ } _%>
    ].map(col => {
      return (
        <FormItem
          className="detail-form-item"
          key={col.name}
          htmlFor={col.name}
          label={`${I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.${col.name}`)}:`}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          <div className="ant-form-text">
            {col.render ? col.render(this.props.record || {}) : this.props.record?.[col.name]}
          </div>
        </FormItem>
      );
    });

    return (
      <Modal
        footer={
          <Button type="ghost" onClick={this.onCancel}>
            {I18n.t('buttons.cancel')}
          </Button>
        }
        title={I18n.t('text.detail_title', {
          model: I18n.t(`activerecord.models.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>`),
        })}
        visible={this.props.visible}
        onCancel={this.onCancel}
      >
        <Form layout="horizontal">{formItems}</Form>
      </Modal>
    );
  }
}
