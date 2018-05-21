import React from "react";
import {connect} from "react-redux";
import {gameApi, chatApi} from "../api";


class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };
        this.gestures = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
        this.onSend = this.onSend.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
    }


    onChooseGesture(event) {
        let chosenGesture = event.target.getAttribute('data-value');
        gameApi.sendGesture(chosenGesture);
    }

    onChangeMessage(event) {
        this.setState({message: event.target.value})
    }

    onSend() {
        chatApi.sendMessage({
            message: this.state.message,
            roomID: this.props.roomID,
            userID: this.props.userID,
            userName: this.props.players?this.props.players['currentPlayer'].name:'',
            time: +(new Date()),
        })
    }


    render() {
        let players = this.props.players;
        let currentPlayer = players ? players['currentPlayer'] : {};
        let opponentPlayer = players ? players['opponentPlayer'] : {};
        let result = currentPlayer.result;
        console.log(this.props);
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
                            {this.props.myGesture}
                        </div>
                        <div className='text-result'>
                            {result ?
                                <h1 className={`${result}-result`}>Result: {result}</h1>
                                : this.props.gameMessage
                            }

                        </div>
                        <div className='gesture-selected'>
                            {opponentPlayer ? opponentPlayer.gesture : ''}
                        </div>

                    </div>
                    <div className='button-panel bottom-panel' onClick={this.onChooseGesture}>
                        {this.gestures.map((gesture) => {
                            return <div className='div-button'>
                                <img src={`/img/gestures/${gesture.toLowerCase()}.png`}
                                     alt={gesture.toLocaleUpperCase()}
                                     data-value={gesture}
                                />
                            </div>
                        })}
                    </div>
                </div>
                <div className='chat'>
                    <div className='video-chat'>
                        Video chat
                    </div>
                    <div className='text-chat'>
                        <ul>
                            {this.props.messages.map(item => {
                                return <li>{item.message}</li>
                            })}
                        </ul>
                        <input type='text' className='modal-input'
                               placeholder='Enter message' value={this.props.value}
                               onChange={this.onChangeMessage}/>
                        <input type="submit" value="send" onClick={this.onSend}/>
                    </div>
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