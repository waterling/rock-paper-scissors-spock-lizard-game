import React from "react";
import ModalName from "../components/modal-name";
import {createRoom} from "../api/workWithSocket";



class WaitingPage extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className='waiting-page'>
                {this.props.waitingMessage}
                {!this.props.wait
                    ?
                    <ModalName value={this.props.name} onChange={this.props.onChange} onSubmit={this.props.onSubmit}/>
                    :
                    <span>
                        {this.props.name}
                    </span>
                }
                {this.props.inviteLink
                ?
                <span>Your invite link: {this.props.inviteLink}</span>
                :''}
            </div>
        );
    }
}


export default WaitingPage;