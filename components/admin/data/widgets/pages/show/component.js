import React, { PureComponent } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// components
import WidgetsForm from 'components/admin/data/widgets/form/WidgetsForm';
import Aside from 'components/ui/Aside';
import MetadataForm from 'components/widgets/metadata/form/MetadataForm';

class WidgetsShow extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
    dataset: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
  }

  render() {
    const {
      query: { id, subtab },
      tabs,
      dataset,
      user: { token }
    } = this.props;
    const currentSubTab = subtab || 'edit';

    return (
      <div className="c-widgets-show">
        <StickyContainer>
          <div className="row l-row">
            <div className="columns small-12 medium-3">
              <Sticky>
                {
                  ({ style }) => (
                    <div style={style}>
                      <Aside
                        items={tabs}
                        selected={currentSubTab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              {(subtab === 'edit') &&
              (<WidgetsForm
                id={id}
                authorization={token}
                showEditor
                onSubmit={() => {
                  if (dataset) {
                    Router.pushRoute('admin_data_detail', { tab: 'datasets', subtab: 'widgets', id: dataset });
                  } else {
                    Router.pushRoute('admin_data', { tab: 'widgets' });
                  }
                }}
              />)}

              {(subtab === 'metadata') &&
                (<MetadataForm
                  application={process.env.APPLICATIONS}
                  authorization={token}
                  widget={id}
                  onSubmit={() => { Router.pushRoute('admin_data', { tab: 'widgets', id }); }}
                />)}
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

export default WidgetsShow;
