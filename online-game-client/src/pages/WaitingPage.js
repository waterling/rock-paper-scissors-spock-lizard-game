import React from "react";
import {roomApi, chatApi} from "../api";
import {connect} from 'react-redux';
import ModalName from "../components/modal-name";
import {Redirect} from "react-router-dom";
import WelcomeWindow from "../components/welcome-window";


class WaitingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wait: false, // ожидает ли игрок оппонента
            name: '', // имя текущего игрока
        };
        this.onChangeName = this.onChangeName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
    }

    componentDidMount() {
        chatApi.initChat();
    }
    //если проблемы с комнатой, то мы ждем пока, создается новая
    componentWillUpdate() {
        if (this.props.roomID) {
            this.setState({
                clickCreate: false,
            })
        }
    }
    //создает или подключается к комнате после ввода имени
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
    // при проблеме с комнатой создает ее
    onClickCreate() {
        this.setState({
            clickCreate: true,
        });
        roomApi.createRoom(this.state.name)
    }
    //изменение имени при ввода
    onChangeName(event) {
        this.setState({
            name: event.target.value,
        })
    }

    render() {
        let error = (this.props.roomIsFull || this.props.nonexistentRoom);
        return (
            <div className='waiting-page'>
                <WelcomeWindow
                    wait={this.state.wait}
                    roomID={this.props.roomID}
                    name={this.state.name}
                    clickCreate={this.state.click}
                    onClickCreate={this.onClickCreate}
                    inviteLink={this.props.inviteLink}
                    error={error}
                    onChangeName={this.onChangeName}
                    onSubmit={this.onSubmit}
                />


                {this.props.inviteID && this.props.nonexistentRoom ?
                        <Redirect to={'/'}/> : ''}
            </div>
        );
    }
}

const mapStateToProps = function (store) {
    return {
        roomIsFull: store.roomState.roomIsFull, // если комната полная
        nonexistentRoom: store.roomState.nonexistentRoom, // если комната уже не существует
        roomID: store.roomState.roomID, // ид комнаты
        inviteLink: store.roomState.inviteLink, // ссылка для приглашения
    };
};

export default connect(mapStateToProps)(WaitingPage);