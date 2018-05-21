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
import {connect} from "react-redux";


class SiteRouter extends React.Component {
    render() {
        return (
            <Router>
                <div className='router'>
                    <Route exact path="/" render={(match) => {
                        const params = new URLSearchParams(match.location.search);
                        const inviteID = params.get('room');
                        return (
                            this.props.gameStarted ?
                                <Redirect to={'/game'}/>
                                : <WaitingPage inviteID={inviteID}/>
                        )
                    }}/>
                    <Route path='/game' render={(match) => {
                        return (
                            this.props.gameStarted ?
                                <GamePage/>
                                : <Redirect to={'/'}/>
                        )
                    }}/>
                </div>
            </Router>
        )
    }
}

const mapStateToProps = function(store) {
    return {
        gameStarted: store.gameState.gameStarted,
    };
};

export default connect(mapStateToProps)(SiteRouter);