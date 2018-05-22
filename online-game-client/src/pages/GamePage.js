import React from "react";
import {connect} from "react-redux";
import {gameApi, chatApi, videoApi} from "../api";
import TextChat from "../components/text-chat";
import GameBoard from "../components/game-board";
import VideoChat from "../components/video-chat";
import store from "../store";


class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
        };
        this.audio = undefined;
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
        } else if (this.audio) {
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
        if (this.props.videoOffer) {
            videoApi.getCallFromUser();
        }
    }

    hangUp() {
        videoApi.hangup();
        this.stopAudio();
    }

    playAudio(path) {
        this.audio = new Audio;
        this.audio.src = path;
        this.audio.loop = true;
        this.audio.play();
    }

    stopAudio() {
        let path = "/sound/endOfCall.mp3";
        if (this.audio.src !== path) {
            this.audio.src = path;
            this.audio.loop = false;
            this.audio.play();
        } else {
            this.audio = undefined;
        }


    }


    render() {
        let players = this.props.players;

        let disabledCall = this.props.videoOffer || this.props.isVideoInitiator || this.props.videoIsStarted;
        let disabledAnswer = !this.props.videoOffer;
        let disabledHangup = !(this.props.videoOffer || this.props.videoIsStarted);
        return (
            <div className='game-page'>
                <GameBoard
                    players={players}
                    onChooseGesture={this.onChooseGesture}
                    gestures={this.gestures}
                    myGesture={this.props.myGesture}
                    opponentChooseGesture={this.props.opponentChooseGesture}
                />
                <div className='chat'>
                    <VideoChat
                        disabledCall={disabledCall}
                        disabledAnswer={disabledAnswer}
                        disabledHangup={disabledHangup}
                        videoOffer={this.props.videoOffer}
                        videoIsStarted={this.props.videoIsStarted}
                        callUser={this.callUser}
                        getCallFromUser={this.getCallFromUser}
                        hangUp={this.hangUp}

                    />
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
        opponentChooseGesture: store.gameState.opponentChooseGesture,
        messages: store.chatState.messages,
        videoIsStarted: store.videoState.isStarted,
        isVideoInitiator: store.videoState.isInitiator,
        videoOffer: store.videoState.offer,
        localStream: store.videoState.localStream,
        remoteStream: store.videoState.remoteStream,
    };
};

export default connect(mapStateToProps)(GamePage);