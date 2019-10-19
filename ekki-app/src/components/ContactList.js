import React from 'react';

export default class ContactList extends React.Component {
  
  state = {}

  async componentDidMount() {
    const response = await fetch('http://localhost:3001/contacts');
    const contacts = await response.json();
    this.setState({contacts});
  }

  renderContact(contact) {
    return (
      <li key="contact._id" >
        {contact.name}
      </li>
    )
  }

  render() {
    return (
      <>
        {this.state.contacts && this.state.contacts.length === 0 && 
          <p className="font-weight-normal text-center"> 
            {this.props.all ? <span className="d-block mb-3">Nenhum contato adicionado :(</span> : <span>Nenhum contato recente :(</span>}
          </p>}
        {this.state.contacts && this.state.contacts.length > 0 && 
          <ul>
            {this.state.contacts.map(contact => this.renderContact(contact)) }
          </ul>}
      </>
    )
  }


}
