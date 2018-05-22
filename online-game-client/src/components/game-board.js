import React from "react";


class GameBoard extends React.Component {
    render() {
        let players = this.props.players;
        let currentPlayer = players ? players['currentPlayer'] : {};
        let opponentPlayer = players ? players['opponentPlayer'] : {};
        let result = currentPlayer.result;
        return (
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
                                 style={{
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
                                 style={{
                                         backgroundSize: '100% auto',
                                         backgroundImage:
                                             `url(/img/gestures/${opponentPlayer.gesture.toLowerCase()}-big.png)`,
                                     }}>
                            </div>
                            : ''}
                    </div>

                </div>
                <div className='button-panel bottom-panel' onClick={this.props.onChooseGesture}>
                    {this.props.gestures.map((gesture) => {
                        return (
                            <div className='div-button'
                                 key={gesture}
                                 style={{
                                         backgroundImage:
                                             `url(/img/gestures/${gesture.toLowerCase()}.png)`,
                                     }}
                                 data-value={gesture}>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}


export default GameBoard;