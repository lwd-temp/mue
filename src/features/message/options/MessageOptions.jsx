import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdCancel, MdAdd, MdOutlineTextsms } from 'react-icons/md';
import { toast } from 'react-toastify';
import { TextareaAutosize } from '@mui/material';

import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { Button } from 'components/Elements';
import EventBus from 'utils/eventbus';

class MessageOptions extends PureComponent {
  constructor() {
    super();
    this.state = {
      messages: JSON.parse(localStorage.getItem('messages')) || [],
    };
  }

  reset = () => {
    localStorage.setItem('messages', '[]');
    this.setState({
      messages: [],
    });
    toast(variables.getMessage(this.languagecode, 'toasts.reset'));
    EventBus.emit('refresh', 'message');
  };

  modifyMessage(type, index) {
    const messages = this.state.messages;
    if (type === 'add') {
      messages.push('');
    } else {
      messages.splice(index, 1);
    }

    this.setState({
      messages,
    });
    this.forceUpdate();

    localStorage.setItem('messages', JSON.stringify(messages));
  }

  message(e, text, index) {
    const result = text === true ? e.target.value : e.target.result;

    const messages = this.state.messages;
    messages[index] = result;
    this.setState({
      messages,
    });
    this.forceUpdate();

    localStorage.setItem('messages', JSON.stringify(messages));
    document.querySelector('.reminder-info').style.display = 'flex';
    localStorage.setItem('showReminder', true);
  }

  render() {
    const MESSAGE_SECTION = 'modals.main.settings.sections.message';

    return (
      <>
        <Header
          title={variables.getMessage(`${MESSAGE_SECTION}.title`)}
          setting="message"
          category="message"
          element=".message"
          zoomSetting="zoomMessage"
          visibilityToggle={true}
        />
        <PreferencesWrapper
          setting="message"
          visibilityToggle={true}
          category="message"
          zoomSetting="zoomMessage"
        >
          <Row final={true}>
            <Content title={variables.getMessage(`${MESSAGE_SECTION}.messages`)} />
            <Action>
              <Button
                type="settings"
                onClick={() => this.modifyMessage('add')}
                icon={<MdAdd />}
                label={variables.getMessage(`${MESSAGE_SECTION}.add`)}
              />
            </Action>
          </Row>
          <div className="messagesContainer">
            {this.state.messages.map((_url, index) => (
              <div className="messageMap" key={index}>
                <div className="flexGrow">
                  <div className="icon">
                    <MdOutlineTextsms />
                  </div>
                  <div className="messageText">
                    <span className="subtitle">
                      {variables.getMessage(`${MESSAGE_SECTION}.title`)}
                    </span>
                    <TextareaAutosize
                      value={this.state.messages[index]}
                      placeholder={variables.getMessage(
                        'modals.main.settings.sections.message.content',
                      )}
                      onChange={(e) => this.message(e, true, index)}
                      varient="outlined"
                      style={{ padding: '0' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="messageAction">
                    <Button
                      type="settings"
                      onClick={() => this.modifyMessage('remove', index)}
                      icon={<MdCancel />}
                      label={variables.getMessage('modals.main.marketplace.product.buttons.remove')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {this.state.messages.length === 0 && (
            <div className="photosEmpty">
              <div className="emptyNewMessage">
                <MdOutlineTextsms />
                <span className="title">
                  {variables.getMessage(`${MESSAGE_SECTION}.no_messages`)}
                </span>
                <span className="subtitle">
                  {variables.getMessage(`${MESSAGE_SECTION}.add_some`)}
                </span>
                <Button
                  type="settings"
                  onClick={() => this.modifyMessage('add')}
                  icon={<MdAdd />}
                  label={variables.getMessage(`${MESSAGE_SECTION}.add`)}
                />
              </div>
            </div>
          )}
        </PreferencesWrapper>
      </>
    );
  }
}

export { MessageOptions as default, MessageOptions };
