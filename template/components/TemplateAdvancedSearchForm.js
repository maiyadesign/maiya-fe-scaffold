import React, { Component } from 'react';
import { AdvancedSearch } from '@/components';
import I18n from '@/helpers/I18n';

export default class <%= PageList[1] %>AdvancedSearchForm extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    <%_ for(var i = 0; i < comParams.length; i++){ _%> <%_ if (comParams[i] === 'status' && comUi[i] === 'select') { _%>
    const statusArr = Object.entries(I18n.t('options.use_status') || {}).map(v => { return { id: v[0], name: v[1] }; });
    <%_ } _%> <%_ } _%>
    const AdvancedSearchGroup = [
      <%_ for(var i = 0; i < comParams.length; i++){ _%>
      <%_ if (comParams[i] !== 'id') { _%>
      {
        beforeDom: { label: `${I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`)}：`, style: {}, className: '' },
        key: '<%= comParams[i] %>',
        domType: '<%= comUi[i] %>',
        domClassName: '',
        <%_ if (comUi[i] !== 'select') { _%>
        attribute: { value: null, allowClear: true, style: { width: 'auto' }, placeholder: I18n.t('text.placeholder_<%= comUi[i] %>', { field: I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`) }) },
        <%_ } else { _%>
          <%_ if (comParams[i] === 'status') { _%>
        attribute: { data: statusArr },
          <%_ } else { _%>
        attribute: { request: { url: '/<%= PageList[0] %>', params: { search: { status: 'in_use' }, sort: 'name' } }, focus: true },
          <%_ } _%>
        <%_ } _%>
        rules: { message: I18n.t('text.placeholder_<%= comUi[i] %>', { field: I18n.t(`activerecord.attributes.<%= PageList[2][PageList[2].length - 1] === 's' ? PageList[2].substring(0, PageList[2].length - 1) : PageList[2] %>.<%= comParams[i] %>`) }) },
      },
      <%_ }_%>
      <%_ }_%>
    ];

    return <AdvancedSearch data={AdvancedSearchGroup} {...this.props} />;
  }
}
