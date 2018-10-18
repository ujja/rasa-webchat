/* eslint-disable no-undef */
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  toggleChat,
  addUserMessage,
  emitUserMessage,
  addResponseMessage,
  addLinkSnippet,
  addVideoSnippet,
  addImageSnippet,
  addQuickReply,
  addButtonTemplate,
  initialize
} from "actions";
import { isSnippet, isVideo, isImage, isQR, isText, isButtonTemplate } from "./msgProcessor";
import WidgetLayout from "./layout";


class Widget extends Component {

  constructor(props) {
    super(props);
    this.messages = [];
    setInterval(() => {
      if (this.messages.length > 0) {
        this.dispatchMessage(this.messages.shift());
      }
    }, this.props.interval);
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on('bot_uttered', (botUttered) => {
      this.messages.push(botUttered);
    });

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullScreenMode) {
      this.props.dispatch(toggleChat());
    }
  }

  dispatchMessage(message) {
    if (Object.keys(message).length === 0) {
      return;
    }
    if (isText(message)) {
      this.props.dispatch(addResponseMessage(message.text));
    } else if (isQR(message)) {
      this.props.dispatch(addQuickReply(message));
    } else if (isSnippet(message)) {
      const element = message.attachment.payload.elements[0];
      this.props.dispatch(addLinkSnippet({
        title: element.title,
        defaultUrlAction: element.defaultUrlAction,
        imageUrl: element.imageUrl,
        content: element.buttons ? element.buttons[0].title : null,
        link: element.buttons ? element.buttons[0].url : null,
        target: '_blank'
      }));
    } else if (isVideo(message)) {
      const element = message.attachment.payload;
      this.props.dispatch(addVideoSnippet({
        title: element.title,
        video: element.src
      }));
    } else if (isImage(message)) {
      const element = message.attachment.payload;
      this.props.dispatch(addImageSnippet({
        title: element.title,
        image: element.src
      }));
    } else if (isButtonTemplate(message)) {
      const element = message.attachment.payload;
      this.props.dispatch(addButtonTemplate({
        title: message.text,
        buttons: message.buttons
      }));
    }
  }

  toggleConversation = () => {
    this.props.dispatch(toggleChat());

    const { initPayload, initialized, customData, socket } = this.props;
    if (!initialized) {
      this.props.dispatch(initialize());
      socket.emit('user_uttered', { message: initPayload, customData});
    }
  };

  handleMessageSubmit = (event) => {
    event.preventDefault();
    const userUttered = event.target.message.value;
    if (userUttered) {
      this.props.dispatch(addUserMessage(userUttered));
      this.props.dispatch(emitUserMessage(userUttered));
    }
    event.target.message.value = '';
  };

  render() {
    return (
      <WidgetLayout
        onToggleConversation={this.toggleConversation}
        onSendMessage={this.handleMessageSubmit}
        title={this.props.title}
        subtitle={this.props.subtitle}
        customData={this.props.customData}
        profileAvatar={this.props.profileAvatar}
        showCloseButton={this.props.showCloseButton}
        fullScreenMode={this.props.fullScreenMode}
        badge={this.props.badge}
      />
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.behavior.get('initialized')
});

Widget.propTypes = {
  interval: PropTypes.number,
  title: PropTypes.string,
  customData: PropTypes.shape({}),
  subtitle: PropTypes.string,
  initPayload: PropTypes.string,
  initialized: PropTypes.bool,
  inputTextFieldHint: PropTypes.string,
  handleNewUserMessage: PropTypes.func.isRequired,
  profileAvatar: PropTypes.string,
  showCloseButton: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  socket: PropTypes.shape({})
};

export default connect(mapStateToProps)(Widget);
