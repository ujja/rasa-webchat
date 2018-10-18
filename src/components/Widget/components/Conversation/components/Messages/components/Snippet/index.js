import React, { PureComponent } from 'react';
import { PROP_TYPES } from 'constants';

import './styles.scss';

class Snippet extends PureComponent {
  render() {

    return (
      <div className="snippet">
        { console.log("props: " + JSON.stringify(this.props, 2))}
        { this.renderTitle()}
        { this.renderImage()}
        { this.renderDetails()}
      </div>
    );
  }

  renderTitle() {
    return (
      <b className="snippet-title">
        { this.props.message.get('title') }
      </b>
    )
  }

  renderImage() {
    if (!this.props.message.get('imageUrl')) {
      return null;
    }
    if (this.props.message.get('defaultUrlAction')) {
      return (
        <div className="image-details">
          <a href={this.props.message.get('defaultUrlAction')}>
            <img src={this.props.message.get('imageUrl')} className="imageFrame" />
          </a>
        </div>
      )
    }

    return (
      <div className="image-details">
        <img src={this.props.message.get('imageUrl')} className="imageFrame" />
      </div>
    )
  }

  renderDetails() {
    return (
      <div className="snippet-details">
        <a href={this.props.message.get('link')} target={this.props.message.get('target')} className="link">
          { this.props.message.get('content') }
        </a>
      </div>
    )
  }
}

Snippet.propTypes = {
  message: PROP_TYPES.SNIPPET
};

export default Snippet;
