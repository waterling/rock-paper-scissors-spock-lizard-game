import React from "react";


class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.gestures = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
    }


    render() {
        let result = this.props.me ? this.props.me.result : undefined;
        console.log(this.props);
        return (
            <div className='game-page'>
                <div className='game-board'>
                    <div className='opponent-info'>
                        <span className='opponent-name'>
                            {this.props.opponent ? 'Opponent name: ' + this.props.opponent.name : "Opponent hasn't name"}
                        </span>
                    </div>
                    <div className='result'>
                        <div className='gesture-selected'>
                            {this.props.me ? this.props.me.gesture : ''}
                        </div>
                        <div className='text-result'>
                            {result ?
                                <h1 className={`${result}-result`}>Result: {result}</h1>
                                : this.props.gameMessage
                            }

                        </div>
                        <div className='gesture-selected'>
                            {this.props.opponent ? this.props.opponent.gesture : ''}
                        </div>

                    </div>
                    <div className='button-panel bottom-panel' onClick={this.props.onChooseGesture}>
                        {this.gestures.map((gesture) => {
                            return <div className='div-button' data-value={gesture}>{gesture.toLocaleUpperCase()}</div>
                        })}
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