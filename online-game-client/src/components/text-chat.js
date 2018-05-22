import React from "react";

const ENTER_KEY = 13;

class TextChat extends React.Component {

    onKeyPress(event) {
        let key = event.which || event.keyCode;
        if (key === ENTER_KEY) {
            this.props.onSend(event);
        }
    }

    render() {
        return (
            <div className='text-chat'>
                <div className={'messages'}>
                    {this.props.messages.map(item => {
                        let time = new Date(item.time);
                        let timeStr = time.getHours() + ':' + time.getMinutes();
                        let user = item.userID === this.props.userID ? 'user-1' : 'user-2';
                        return <div className={`message-item message-${user}`} key={item.time}>
                            <time className="message-time">{timeStr}</time>
                            <div className="message-text">
                                <p>{item.message}</p>
                            </div>
                        </div>
                    })
                    }
                </div>
                <div className={'send-form'}>
                    <input type='text' className='send-input'
                           placeholder='Enter message' value={this.props.message}
                           onChange={this.props.onChangeMessage} onKeyPress={this.onKeyPress.bind(this)}/>
                    <input className={'send-button'} type="submit" value="send" onClick={this.props.onSend}
                    />
                </div>
            </div>
        )
    }
}


export default TextChat;