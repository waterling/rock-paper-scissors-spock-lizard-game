import React from "react";
import {connect} from "react-redux";
import {gameApi, chatApi, videoApi} from "../api";
import TextChat from "../components/text-chat";


class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
        };
        this.audio = new Audio;
        this.gestures = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
        this.onSend = this.onSend.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onChooseGesture = this.onChooseGesture.bind(this);
        this.onLoadMessages = this.onLoadMessages.bind(this);
        this.callUser = this.callUser.bind(this);
        this.getCallFromUser = this.getCallFromUser.bind(this);
        this.hangUp = this.hangUp.bind(this);
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
        window.onbeforeunload = this.hangUp;
        if (this.props.videoIsStarted) {
            this.playAudio("/sound/callToUser.mp3");
            document.getElementById('localVideo').srcObject = this.props.localStream;
            document.getElementById('remoteVideo').srcObject = this.props.remoteStream;
        } else if (this.props.videoOffer) {
            this.playAudio("/sound/callFromUser.mp3")
        } else {
            this.stopAudio();
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

    callUser() {
        videoApi.callUser();
    }

    getCallFromUser() {
        console.log('lol');
        if (this.props.videoOffer) {
            videoApi.getCallFromUser();
        }
    }

    hangUp() {
        videoApi.hangup();
        this.stopAudio();
    }

    playAudio(path) {
        this.audio.src = path;
        this.audio.loop = true;
        this.audio.play();
    }

    stopAudio() {
        this.audio.src = "/sound/endOfCall.mp3";
        this.audio.loop = false;
        this.audio.play();
    }


    render() {
        let players = this.props.players;
        let currentPlayer = players ? players['currentPlayer'] : {};
        let opponentPlayer = players ? players['opponentPlayer'] : {};
        let result = currentPlayer.result;

        let disabledCall = this.props.videoOffer || this.props.isVideoInitiator || this.props.videoIsStarted;
        let disabledAnswer = !this.props.videoOffer;
        let disabledHangup = !(this.props.videoOffer || this.props.videoIsStarted);
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
                    <div className={'video-chat'}>

                        {this.props.videoIsStarted ?
                            <div>
                                <video id="localVideo" autoPlay muted/>
                                <video id="remoteVideo" autoPlay/>
                            </div>
                            : this.props.videoOffer && !this.props.isStarted ?
                                'Вам звонят'
                                : ''
                        }
                        <div className={'buttons'}>
                            <button hidden={disabledCall}
                                    id={'call'}
                                    onClick={this.callUser}
                            >
                                Call
                            </button>
                            <button hidden={disabledAnswer}
                                    id={'answer'}
                                    onClick={this.getCallFromUser}
                            >
                                Answer
                            </button>
                            <button hidden={disabledHangup}
                                    id={'hang-up'}
                                    onClick={this.hangUp}
                            >
                                Hang up
                            </button>
                        </div>
                    </div>
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
        videoIsStarted: store.videoState.isStarted,
        isVideoInitiator: store.videoState.isInitiator,
        videoOffer: store.videoState.offer,
        localStream: store.videoState.localStream,
        remoteStream: store.videoState.remoteStream,

    };
};

export default connect(mapStateToProps)(GamePage);