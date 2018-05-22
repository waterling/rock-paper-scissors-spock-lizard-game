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


    //метод срабатывает, когда выбирается один из жестов
    onChooseGesture(event) {
        if (this.props.myGesture) {
            return;
        }
        let chosenGesture = event.target.getAttribute('data-value');
        let buttons = event.target.parentNode.children;

        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute('data-value') !== chosenGesture) {
                //блокирует все конпки
                buttons[i].classList.add('block');
            } else {
                //выделяется единственная выбранная
                buttons[i].classList.add('choose');
            }
        }
        //отправляет выбранный жест
        gameApi.sendGesture(chosenGesture);
    }
    //реагирует на изменение имени
    onChangeMessage(event) {
        this.setState({message: event.target.value})
    }

    componentDidUpdate(prevProps, prevState) {
        //если жеста уже нет, то он снимает блок
        if (!this.props.myGesture) {
            let buttons = document.getElementsByClassName('button-panel')[0].children;
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('block');
                buttons[i].classList.remove('choose');
            }
        }
        //делает прокрутку чата вниз, если было добавленно сообщение
        if (prevProps.messages.length !== this.props.messages.length) {
            this.onLoadMessages();
        }
        //перед отключением обрывает соединения
        window.onbeforeunload = this.hangUp;
        //работа со звуком при вызове, сбрасывании
        if (this.props.videoIsStarted) {
            //работает у человека, который звонит
            this.playAudio("/sound/callToUser.mp3");
            document.getElementById('localVideo').srcObject = this.props.localStream;
            document.getElementById('remoteVideo').srcObject = this.props.remoteStream;
        } else if (this.props.videoOffer) {
            //работает у человека, которому звонит
            this.playAudio("/sound/callFromUser.mp3")
        } else if (this.audio) {
            //останавливает, если сбросили или вышел игрок из игры
            this.stopAudio();
        }
    }
    //прокрутка чата вниз
    onLoadMessages() {
        let messages = document.getElementsByClassName('messages')[0];
        if (messages) {
            messages.scrollTop = messages.scrollHeight;
        }
    }
    //отправка нового сообщения
    onSend() {
        //проверка на пустое
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
        //обнуляет поле для ввода
        this.setState({
            message: '',
        });
    }
    //вызывает пользователя, когда нажимает соответствующую кнопку
    callUser() {
        videoApi.callUser();
    }
    //принимает вызов пользователя
    getCallFromUser() {
        if (this.props.videoOffer) {
            videoApi.getCallFromUser();
        }
    }
    //сбрасывает звонок или заканчивает разговор
    hangUp() {
        videoApi.hangup();
        this.stopAudio();
    }
    //вопроизводит музыку, когда идет работа с вызовами
    playAudio(path) {
        this.audio = new Audio;
        this.audio.src = path;
        this.audio.loop = true;
        this.audio.play();
    }
    //останавливает музыку, если сбросили
    stopAudio() {
        let path = "/sound/endOfCall.mp3";
        if (this.audio.src !== path) {
            this.audio.src = path;
            this.audio.loop = false;
            this.audio.play();
        } else {
            this.audio = undefined;
        }
        setTimeout(() => {
            this.audio = undefined
        }, 1500)

    }


    render() {
        let players = this.props.players;
        //определяем какие кнопки будем в какой момент показывать
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
        roomID: store.roomState.roomID, // ид комнаты
        userID: store.roomState.userID, // ид текущего пользователя
        players: store.gameState.players, // все игроки комнаты
        myGesture: store.gameState.myGesture, // жест, выбранный текущим пользователем
        opponentChooseGesture: store.gameState.opponentChooseGesture, // оповещение о том, что оппонент сделал выбор
        messages: store.chatState.messages, // все сообщения
        videoIsStarted: store.videoState.isStarted, // началась ли трансляция хотя бы на одной из сторон
        isVideoInitiator: store.videoState.isInitiator, // показывает, кто звонил
        videoOffer: store.videoState.offer, // показывает, кому звонили
        localStream: store.videoState.localStream, // стрим на текущей стороне
        remoteStream: store.videoState.remoteStream, // стрим другого пользователя
    };
};

export default connect(mapStateToProps)(GamePage);