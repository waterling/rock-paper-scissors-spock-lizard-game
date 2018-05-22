import React from "react";


class VideoChat extends React.Component {
    render() {
        return (
            <div className={'video-chat'}>

                {this.props.videoIsStarted ?
                    <div>
                        <video id="localVideo" autoPlay muted/>
                        <video id="remoteVideo" autoPlay/>
                    </div>
                    : this.props.videoOffer && !this.props.videoIsStarted ?
                        'Вам звонят'
                        : ''
                }
                <div className={'buttons'}>
                    <button hidden={this.props.disabledCall}
                            id={'call'}
                            onClick={this.props.callUser}
                    >
                        Call
                    </button>
                    <button hidden={this.props.disabledAnswer}
                            id={'answer'}
                            onClick={this.props.getCallFromUser}
                    >
                        Answer
                    </button>
                    <button hidden={this.props.disabledHangup}
                            id={'hang-up'}
                            onClick={this.props.hangUp}
                    >
                        Hang up
                    </button>
                </div>
            </div>
        )
    }
}


export default VideoChat;