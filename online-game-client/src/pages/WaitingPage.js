import React from "react";
import {roomApi, chatApi} from "../api";
import {connect} from 'react-redux';
import ModalName from "../components/modal-name";
import {Redirect} from "react-router-dom";


class WaitingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wait: false,
            name: '',
        };
        this.onChangeName = this.onChangeName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
    }

    componentDidMount() {
        //TODO room include game and chat
        chatApi.initChat();
    }

    componentWillUpdate() {
        if (this.props.roomID) {
            this.setState({
                clickCreate: false,
            })
        }
    }

    onSubmit() {
        this.setState((prevState, props) => {
            return ({
                wait: true,
            })
        });
        if (this.props.inviteID && !this.props.nonexistentRoom) {
            roomApi.connectToRoom(this.state.name, this.props.inviteID)
        } else {
            roomApi.createRoom(this.state.name);
        }
    }

    onClickCreate() {
        this.setState({
            clickCreate: true,
        });
        roomApi.createRoom(this.state.name)
    }

    onChangeName(event) {
        this.setState({
            name: event.target.value,
        })
    }

    render() {
        let error = (this.props.roomIsFull || this.props.nonexistentRoom);
        return (
            <div className='waiting-page'>
                {this.state.wait || this.props.roomID
                    ?
                    <span>
                        {this.state.name}
                    </span>
                    :
                    <ModalName
                        value={this.state.name}
                        onChange={this.onChangeName}
                        onSubmit={this.onSubmit}
                    />

                }
                {this.props.inviteLink
                    ?
                    <span>Your invite link: {this.props.inviteLink}</span>
                    :
                    this.state.wait && error && this.state.clickCreate ?
                        'Loading...' :
                        ''
                }

                {error ?
                    <input type="submit" value="Создать" onClick={this.onClickCreate}/>
                    : ''
                }


                {//TODO try to remove this
                    this.props.inviteID && this.props.nonexistentRoom ?
                        <Redirect to={'/'}/> : ''}
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        roomIsFull: store.roomState.roomIsFull,
        nonexistentRoom: store.roomState.nonexistentRoom,
        roomID: store.roomState.roomID,
        inviteLink: store.roomState.inviteLink,
    };
};

export default connect(mapStateToProps)(WaitingPage);