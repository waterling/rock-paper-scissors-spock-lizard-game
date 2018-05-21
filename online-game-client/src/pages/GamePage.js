import React from "react";
import {connect} from "react-redux";
import {gameApi, chatApi} from "../api";
import TextChat from "../components/text-chat";


class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };
        this.gestures = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
        this.onSend = this.onSend.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onChooseGesture = this.onChooseGesture.bind(this);
        this.onLoadMessages = this.onLoadMessages.bind(this);
    }


    onChooseGesture(event) {
        if (this.props.myGesture) {
            return;
        }
        let chosenGesture = event.target.getAttribute('data-value');
        let buttons = event.target.parentNode.children;

        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute('data-value') !== chosenGesture) {
                buttons[i].classList.add('block');
            } else {
                buttons[i].classList.add('choose');
            }
        }

        gameApi.sendGesture(chosenGesture);
    }

    onChangeMessage(event) {
        this.setState({message: event.target.value})
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.props.myGesture) {
            let buttons = document.getElementsByClassName('button-panel')[0].children;
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('block');
                buttons[i].classList.remove('choose');
            }
        }
        if (prevProps.messages.length !== this.props.messages.length) {
            this.onLoadMessages();
        }
    }

    onLoadMessages() {
        let messages = document.getElementsByClassName('messages')[0];
        if (messages) {
            messages.scrollTop = messages.scrollHeight;
        }
    }

    onSend() {
        if (!this.state.message.length) {
            return;
        }
        chatApi.sendMessage({
            message: this.state.message,
            roomID: this.props.roomID,
            userID: this.props.userID,
            userName: this.props.players ? this.props.players['currentPlayer'].name : '',
            time: +(new Date()),
        });
        this.setState({
            message: '',
        });
    }


    render() {
        let players = this.props.players;
        let currentPlayer = players ? players['currentPlayer'] : {};
        let opponentPlayer = players ? players['opponentPlayer'] : {};
        let result = currentPlayer.result;
        return (
            <div className='game-page'>
                <div className='game-board'>
                    <div className='opponent-info'>
                        <span className='opponent-name'>
                            {opponentPlayer ? 'Opponent name: ' + opponentPlayer.name : "Hasn't opponent"}
                        </span>
                    </div>
                    <div className='result'>
                        <div className='gesture-selected'>
                            {this.props.myGesture ?
                                <div className={'result-img'}
                                     style={
                                         {
                                             backgroundSize: '100% auto',
                                             backgroundImage:
                                                 `url(/img/gestures/${this.props.myGesture.toLowerCase()}-big.png)`,
                                         }}>
                                </div>
                                : ''}
                        </div>
                        <div className='text-result'>
                            {result ?
                                <h1 className={`${result}-result`}>Result: {result}</h1>
                                : this.props.gameMessage
                            }

                        </div>
                        <div className='gesture-selected'>
                            {opponentPlayer.gesture ?
                                <div className={'result-img'}
                                     style={
                                         {
                                             backgroundSize: '100% auto',
                                             backgroundImage:
                                                 `url(/img/gestures/${opponentPlayer.gesture.toLowerCase()}-big.png)`,

                                         }}>
                                </div>
                                : ''}
                        </div>

                    </div>
                    <div className='button-panel bottom-panel' onClick={this.onChooseGesture}>
                        {this.gestures.map((gesture) => {
                            return (
                                <div className='div-button'
                                     key={gesture}
                                     style={
                                         {
                                             backgroundImage:
                                                 `url(/img/gestures/${gesture.toLowerCase()}.png)`,
                                         }}
                                     data-value={gesture}>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='chat'>
                    <TextChat
                        userID={this.props.userID}
                        messages={this.props.messages}
                        message={this.state.message}
                        onSend={this.onSend}
                        onChangeMessage={this.onChangeMessage}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        roomID: store.roomState.roomID,
        userID: store.roomState.userID,
        players: store.gameState.players,
        myGesture: store.gameState.myGesture,
        messages: store.chatState.messages,
    };
};

export default connect(mapStateToProps)(GamePage);