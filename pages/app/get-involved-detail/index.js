import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from 'layout/get-involved-detail/get-involved-detail-actions';

// components
import GetInvolvedDetail from 'layout/get-involved-detail';

class GetInvolvedDetailPage extends PureComponent {
  static propTypes = { breadCrumb: PropTypes.array.isRequired };

  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query: { id, source } } } = getState();

    // fetchs static data
    await dispatch(actions.fetchStaticData(id));

    const breadcrumbsItems = source === 'home' ?
      [{ name: 'Home', href: '/' }] :
      [{ name: 'Get involved', href: '/get-involved' }];

    return { breadCrumb: breadcrumbsItems };
  }

  render() {
    const { breadCrumb } = this.props;

    return <GetInvolvedDetail breadCrumb={breadCrumb} />;
  }
}

export default connect(
  state => ({
    getInvolvedDetail: state.getInvolvedDetail,
    user: state.user
  }),
  actions
)(GetInvolvedDetailPage);
