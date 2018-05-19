import React from "react";



class ModalName extends React.Component {

    constructor(props){
        super(props);
    }



    render(){
        return(
            <div className='modal'>
                    <input type='text' className='modal-input' placeholder='Введите имя:)' value={this.props.value} onChange={this.props.onChange} />
                    <input type="submit" value="OK" onClick={this.props.onSubmit}/>
            </div>
        )
    }
}


export default ModalName;