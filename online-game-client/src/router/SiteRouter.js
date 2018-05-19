import React from "react";
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import WaitingPage from "../pages/WaitingPage";
import {connectToRoom, createRoom, initSocket, onLeavePlayer, onStartGame} from "../api/workWithSocket";
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
            waitingMessage: 'Добро пожаловать',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLeavePlayer = this.handleLeavePlayer.bind(this);
        this.handleChooseGesture = this.handleChooseGesture.bind(this);
        this.onRoomCreated = this.onRoomCreated.bind(this);
        this.onRoomConnected = this.onRoomConnected.bind(this);
        this.startGame = this.startGame.bind(this);
    }

    handleChange(event) {
        this.setState({
            name: event.target.value,
        })
    }

    handleChooseGesture(event) {

    }

    handleLeavePlayer(data) {
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

    handleSubmit(event) {
        this.setState((prevState, props) => {
            return ({
                name: prevState.name,
                wait: true,
            })
        });

    }

    componentDidMount() {
        initSocket(this.state.endpoint);
        onLeavePlayer(this.handleLeavePlayer);
    }

    componentDidUpdate() {
        if (this.state.wait && !this.state.haveRoom) {
            let regexp = /room=([^&]+)/i;
            let roomID = '';
            if (!!regexp.exec(window.location.search)) {
                roomID = regexp.exec(window.location.search)[1];
                connectToRoom(this.state.name, roomID, this.onRoomConnected);
            } else {
                createRoom(this.state.name, this.onRoomCreated);
            }
            this.setState((prevState, props) => ({haveRoom: true}));
        }
    }

    onRoomCreated(data) {
        this.setState({
            inviteLink: `http://${CONFIG.HOST}:${CONFIG.CLIENT_PORT}/?room=${data.roomID}`,
            roomID: data.roomID,
            playerID: data.id
        });
        onStartGame(this.startGame);
    }

    onRoomConnected(data) {
        this.setState({
            inviteLink: `http://${CONFIG.HOST}:${CONFIG.CLIENT_PORT}/?room=${data.roomID}`,
            roomID: data.roomID,
            playerID: data.id
        });
        onStartGame(this.startGame);
    }


    startGame(data) {
        this.setState({gameStarted: true, players: data});
        console.log(data);
    }

    static getOpponentName(playerId, players) {
        for (let i in players) {
            if (players.hasOwnProperty(i)) {
                if (i !== playerId) {
                    console.log(players[i]);
                    console.log(players[i]._name);
                    return players[i]._name;
                }
            }
        }
    }

    render() {
        return (
            <Router>
                <div className='router'>
                    <Route exact path="/" render={(match) => {
                        return <WaitingPage
                            wait={this.state.wait}
                            name={this.state.name}
                            onSubmit={this.handleSubmit}
                            onChange={this.handleChange}
                            waitingMessage={this.state.waitingMessage}
                            inviteLink={this.state.inviteLink}/>
                    }}/>
                    <Route path='/game' render={(match) => {
                        return (this.state.gameStarted ?
                                <GamePage
                                    opponentName={SiteRouter.getOpponentName(this.state.playerID, this.state.players)}
                                    onChooseGesture={this.handleChooseGesture}

                                />
                                : <Redirect to={'/'}/>
                            /*<GamePage result={'win'} opponentName={'Player1'}/>*/
                        )
                    }}/>
                    {this.state.gameStarted ? <Redirect to={'/game'}/> : ''}
                </div>
            </Router>
        )
    }
}