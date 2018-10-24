import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PROP_TYPES } from 'constants';
import { addUserMessage, emitUserMessage, setQuickReply, toggleInputDisabled, changeInputFieldHint } from 'actions';
import Message from '../Message/index';

import './styles.scss';

class ButtonTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick(button) {
    const payload = button.payload;
    const title = button.title;
    const id = this.props.id;
    // This is the function from quick reply. It is good for here too, but its confusing.
    this.props.chooseReply(payload, title, id);
  }

  render() {
    return (
      <div>
        <Message message={this.props.message} />
        {
        <div className="buttons">
          {this.props.message.get('buttons').map((button, index) => <div
            key={index} className={'button'}
            onClick={this.handleClick.bind(this, button)}
          >{button.title}</div>)}
        </div>
        }
      </div>);
  }
}


const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  inputState: state.behavior.get('disabledInput')
});

const mapDispatchToProps = dispatch => ({
  toggleInputDisabled: _ => dispatch(toggleInputDisabled()),
  changeInputFieldHint: hint => dispatch(changeInputFieldHint(hint)),
  chooseReply: (payload, title, id) => {
    // This is the function from quick reply. It is good for here too, but its confusing.
    dispatch(setQuickReply(id, title));
    dispatch(addUserMessage(title));
    dispatch(emitUserMessage(payload));
    // dispatch(toggleInputDisabled());
  }
});


ButtonTemplate.propTypes = {
  message: PROP_TYPES.BUTTON_TEMPLATE
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonTemplate);
