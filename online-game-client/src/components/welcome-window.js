import React from "react";
import ModalName from "./modal-name";


class WelcomeWindow extends React.Component {
    render() {
        return (
            <div className='welcome-window'>
                <span className='welcome message'>
                    {!this.props.wait && this.props.roomID ?
                        'Ваш оппонент покинул игру'
                        : 'Добро пожаловать'}
                </span>
                {this.props.wait || this.props.roomID
                    ?
                    <span className='welcome name'>
                        {this.props.name}
                    </span>
                    :
                    <ModalName
                        value={this.props.name}
                        onChange={this.props.onChangeName}
                        onSubmit={this.props.onSubmit}
                    />

                }
                {this.props.inviteLink
                    ?
                    <span className={'inviteLink'}>
                        Your invite link:
                        <a
                            href={this.props.inviteLink}
                            target={'_blank'}
                            className={'invite-link'}
                        >
                            {this.props.inviteLink}
                        </a>
                    </span>
                    :
                    this.props.wait && this.props.error && this.props.clickCreate ?
                        'Loading...' :
                        ''
                }

                {this.props.error ?
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                        Комната переполнена или не существует. Создать новую?<br/>
                        <input type="submit" value="Создать" onClick={this.props.onClickCreate}/>
                    </div>
                    : ''
                }
            </div>
        )
    }
}


export default WelcomeWindow;