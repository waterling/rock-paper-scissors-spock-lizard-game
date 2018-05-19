import React from "react";
import ModalName from "../components/modal-name";


class GamePage extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='game-page'>
                <div className='game-board'>
                    <div className='opponent-info'>
                        <span className='opponent-name'>
                            {this.props.opponentName}
                        </span>
                    </div>
                    <div className='result'>
                        <div className='gesture-selected'>
                            {this.props.myGesture}
                        </div>
                        <div className='text-result'>
                            {this.props.result?
                                <h1 className={`${this.props.result}-result`}>Result: {this.props.result}</h1>
                                : this.props.gameMessage
                            }

                        </div>
                        <div className='gesture-selected'>
                            {this.props.opponentGesture}
                        </div>

                    </div>
                    <div className='button-panel bottom-panel'>
                        <div className='div-button'>Rock</div>
                        <div className='div-button'>Paper</div>
                        <div className='div-button'>Scissors</div>
                        <div className='div-button'>Lizard</div>
                        <div className='div-button'>Spock</div>
                    </div>
                </div>
                <div className='chat'>
                    <div className='video-chat'>
                        Video chat
                    </div>
                    <div className='text-chat'>
                        Text chat
                    </div>
                </div>
            </div>
        );
    }
}


export default GamePage;