import React from "react";


class ModalName extends React.Component {
    render() {
        return (
            <div className='modal'>
                <span className='modal-message'>
                        Представьтесь, пожалуйста
                </span>
                <input type='text' className='modal-input' placeholder='Введите имя:)' value={this.props.value}
                       onChange={this.props.onChange}/>
                <input className='modal-button' type="submit" value="OK" onClick={this.props.onSubmit}/>
            </div>
        )
    }
}


export default ModalName;