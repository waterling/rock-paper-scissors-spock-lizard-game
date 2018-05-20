import React from "react";
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import WaitingPage from "../pages/WaitingPage";
import {
    connectToRoom,
    createRoom,
    initSocket, onFullRoom,
    onGetRoundResult,
    onLeavePlayer, onNonexistentRoom,
    onStartGame,
    sendGesture
} from "../api/workWithSocket";
import * as CONFIG from "../config" ;
import GamePage from "../pages/GamePage";


export default class SiteRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wait: false,
            name: '',
            endpoint: `http://${CONFIG.HOST}:${CONFIG.PORT}`,
            inviteLink: undefined,
            haveRoom: false,
            roomID: undefined,
            gameStarted: false,
            nonexistentRoom: false,
            fullRoom: false,
            waitingMessage: 'Добро пожаловать',
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onLeavePlayer = this.onLeavePlayer.bind(this);
        this.onChooseGesture = this.onChooseGesture.bind(this);
        this.onRoomCreated = this.onRoomCreated.bind(this);
        this.onRoomConnected = this.onRoomConnected.bind(this);
        this.clearFieldsAndAddMyGesture = this.clearFieldsAndAddMyGesture.bind(this);
        this.startGame = this.startGame.bind(this);
        this.onGetResult = this.onGetResult.bind(this);
        this.onNonexistentRoom = this.onNonexistentRoom.bind(this);
        this.onFullRoom = this.onFullRoom.bind(this);
    }

    onChangeName(event) {
        this.setState({
            name: event.target.value,
        })
    }

    onChooseGesture(event) {
        let chosenGesture = event.target.getAttribute('data-value');
        sendGesture(chosenGesture);
        this.clearFieldsAndAddMyGesture(chosenGesture);
    }


    clearFieldsAndAddMyGesture(gesture) {
        let tempPlayers = this.state.players;
        for (let i in tempPlayers) {
            if (tempPlayers.hasOwnProperty(i)) {
                delete tempPlayers[i].gesture;
                delete tempPlayers[i].result;
            }
        }
        tempPlayers[this.state.playerID].gesture = gesture;
        this.setState({players: tempPlayers});
    }

    onGetResult(data) {
        this.setState((prevState, props) => {
            let tempPlayers = {};
            tempPlayers[data[0].id] = data[0];
            tempPlayers[data[1].id] = data[1];
            return {players: tempPlayers};
        });
        console.log(data);
        setTimeout(this.clearFieldsAndAddMyGesture, 1000, undefined)
    }

    onRoomCreated(data) {
        this.setState({
            inviteLink: `http://${CONFIG.HOST}:${CONFIG.CLIENT_PORT}/?room=${data.roomID}`,
            roomID: data.roomID,
            playerID: data.id,
            haveRoom: true,
        });
        onStartGame(this.startGame);
        onGetRoundResult(this.onGetResult);
    }

    onRoomConnected(data) {
        this.setState({
            inviteLink: `http://${CONFIG.HOST}:${CONFIG.CLIENT_PORT}/?room=${data.roomID}`,
            roomID: data.roomID,
            playerID: data.id,
            haveRoom: true,
        });

        onStartGame(this.startGame);
        onGetRoundResult(this.onGetResult)
    }


    startGame(data) {
        this.setState({gameStarted: true, players: data});
        console.log(data);
    }


    onNonexistentRoom() {
        this.setState({
            wait: false,
            nonexistentRoom: true,
            roomID: undefined,
        });
        console.log("doesn't exist");
        //TODO handle page doesnt exist
    }

    onFullRoom() {
        this.setState({fullRoom: true});
        console.log('full room');
        //TODO full room
    }

    onLeavePlayer(data) {
        this.setState((prevState, props) => {
            let tempPlayers = prevState.players;
            delete tempPlayers[data.leavedPlayerID];
            return {
                players: tempPlayers,
                gameStarted: false,
                waitingMessage: 'Ваш оппонет покинул игру...'
            }
        })
    }

    onSubmit(event) {
        this.setState((prevState, props) => {
            return ({
                fullRoom: false,
                nonexistentRoom: false,
                wait: true,
            })
        });

    }

    componentDidMount() {
        initSocket(this.state.endpoint);
        const regexp = /room=([^&]+)/i;
        let roomID = undefined;
        if(!!regexp.exec(window.location.search)){
            roomID = regexp.exec(window.location.search)[1];
        }
        this.setState({roomID: roomID});
        onLeavePlayer(this.onLeavePlayer);
    }

    componentDidUpdate() {
        if (this.state.wait && !this.state.haveRoom) {
            if (this.state.roomID) {
                connectToRoom(this.state.name, this.state.roomID, this.onRoomConnected);
                onNonexistentRoom(this.onNonexistentRoom);
                onFullRoom(this.onFullRoom);
            } else {
                createRoom(this.state.name, this.onRoomCreated);
            }
        }
    }


    static getOpponent(playerId, players) {
        for (let i in players) {
            if (players.hasOwnProperty(i)) {
                if (i !== playerId) {
                    return players[i];
                }
            }
        }
    }

    render() {
        return (
            <Router>
                <div className='router'>
                    <Route exact path="/" render={(match) => {
                        return (
                            this.state.gameStarted ? <Redirect to={'/game'}/> :
                                <WaitingPage
                                    wait={this.state.wait}
                                    fullRoom={this.state.fullRoom}
                                    nonexistentRoom={this.state.nonexistentRoom}
                                    name={this.state.name}
                                    onSubmit={this.onSubmit}
                                    onChange={this.onChangeName}
                                    waitingMessage={this.state.waitingMessage}
                                    inviteLink={this.state.inviteLink}
                                />
                        )
                    }}/>
                    <Route path='/game' render={(match) => {
                        return (this.state.gameStarted ?
                                <GamePage
                                    opponent={SiteRouter.getOpponent(this.state.playerID, this.state.players)}
                                    me={this.state.players[this.state.playerID]}
                                    onChooseGesture={this.onChooseGesture}
                                />
                                :
                                <Redirect to={'/'}/>
                            /*<GamePage
                                opponentName={SiteRouter.getOpponentName(this.state.playerID, this.state.players)}
                                onChooseGesture={this.handleChooseGesture}
                            />*/
                        )
                    }}/>
                </div>
            </Router>
        )
    }
}