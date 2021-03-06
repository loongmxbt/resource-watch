import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getPartner, getDatasetsByPartner } from 'modules/partners/actions';

// Next
import { Router } from 'routes';

// Components
import Banner from 'components/app/common/Banner';
import Layout from 'layout/layout/layout-app';
import DatasetList from 'components/datasets/list';

// constants
import { PARTNERS_CONNECTIONS } from 'constants/partners';

class PartnerDetailPage extends PureComponent {
  static propTypes = {
    partner: PropTypes.object,
    datasets: PropTypes.array.isRequired
  };

  static defaultProps = { partner: {} };

  static async getInitialProps({ store, query }) {
    const { id } = query;
    await store.dispatch(getPartner(id));

    if (PARTNERS_CONNECTIONS[id]) await store.dispatch(getDatasetsByPartner(PARTNERS_CONNECTIONS[id]));

    return {};
  }

  handleTagSelected(tag) {
    Router.pushRoute('explore', { topics: `["${tag.id}"]` });
  }

  render() {
    const {
      partner,
      datasets
    } = this.props;
    const {
      name,
      summary,
      website,
      'white-logo': whiteLogo,
      cover,
      body
    } = partner;
    const logoPath = whiteLogo ? whiteLogo.medium : '';
    const coverPath = cover && cover.cover;
    const logo = website !== '' ? (
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          title={name}
          alt={name}
          className="logo"
          src={`${process.env.STATIC_SERVER_URL}${logoPath}`}
        />
      </a>) :
      (<img
        title={name}
        alt={name}
        className="logo"
        src={`${process.env.STATIC_SERVER_URL}${logoPath}`}
      />);
    const bannerStyles = { backgroundImage: `url(${process.env.STATIC_SERVER_URL}${coverPath})` };

    return (
      <Layout
        title="Partner detail"
        // TO-DO: fill description
        description="Partner detail description"
      >
        <div className="c-page partner-detail">
          <Banner
            className="intro -text-center"
            styles={bannerStyles}
            useBackground={false}
          >
            <div className="row">
              <div className="column small-12 partner-header">
                <h4 className="title c-text -default -bold -uppercase">RESOURCE WATCH PARTNER</h4>
                <div className="logo-container">
                  {logo}
                </div>
                <div className="description">
                  <div className="row">
                    <div className="column small-12 medium-12">
                      {summary && (<p className="c-text -extra-big">{summary}</p>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Banner>
          <section className="l-section">
            <div className="l-container">
              <div className="row align-center">
                <div className="column small-12 medium-8">
                  <p>{body}</p>
                </div>
              </div>
              {!!datasets.length &&
                <div className="row align-center">
                  <div className="column small-12 datasets-container">
                    <div>
                      <h3>{`Datasets by ${name}`}</h3>
                      <DatasetList
                        active={[]}
                        list={datasets}
                        mode="grid"
                        showActions={false}
                        onTagSelected={this.handleTagSelected}
                      />
                    </div>
                  </div>
                </div>}
            </div>
          </section>

          <div className="l-container learn-more">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center">
                  <p className="-claim">
                    Learn more about <br />
                    {name}
                  </p>
                  <a
                    className="c-button -primary -alt"
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Our work
                  </a>
                </Banner>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default PartnerDetailPage;
