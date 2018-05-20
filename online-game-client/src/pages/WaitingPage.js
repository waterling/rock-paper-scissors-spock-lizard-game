import React from "react";
import ModalName from "../components/modal-name";
import {createRoom} from "../api/workWithSocket";


class WaitingPage extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let error = (this.props.fullRoom || this.props.nonexistentRoom);
        return (
            <div className='waiting-page'>
                {this.props.waitingMessage}
                {this.props.wait || error
                    ?
                    <span>
                        {this.props.name}
                    </span>
                    :
                    <ModalName
                        value={this.props.name}
                        onChange={this.props.onChange}
                        onSubmit={this.props.onSubmit}
                    />

                }
                {this.props.inviteLink
                    ?
                    <span>Your invite link: {this.props.inviteLink}</span>
                    :
                    this.props.wait && error ?
                        'Loading...' :
                        ''

                }

                {error ?
                    <input type="submit" value="Создать" onClick={this.props.onSubmit}/>
                    : ''
                }
            </div>
        );
    }
}


export default WaitingPage;