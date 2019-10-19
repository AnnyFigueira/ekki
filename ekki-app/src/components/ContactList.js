import React from 'react';

export default class ContactList extends React.Component {
  
  state = {}

  async componentDidMount() {
    const response = await fetch('http://localhost:3001/contacts');
    const contacts = await response.json();
    this.props.all ? this.setState({contacts}) : this.setState({contacts: contacts.slice(0,5)});
  }

  renderContact(contact) {
    return (
      <li key={contact._id} className="list-group-item list-group-item-action">
        <div className="position-relative">
        {contact.user.name}
          <div className="action-buttons position-absolute">
            <button type="button" className="btn btn btn-link mr-1" title="Transferir..."><i className="fas fa-exchange-alt"/></button>
            <button type="button" className="btn btn btn-link" title="Remover Contato"><i className="fas fa-times"/></button>
          </div>
        </div>
      </li>
    )
  }

  render() {
    return (
      <>
        {this.state.contacts && this.state.contacts.length === 0 && 
          <p className="font-weight-normal text-center"> 
            {this.props.all ? <span className="d-block">Nenhum contato adicionado :(</span> : <span>Nenhum contato recente :(</span>}
          </p>}
        {this.state.contacts && this.state.contacts.length > 0 && 
          <ul className="list-group">
            {this.state.contacts.map(contact => this.renderContact(contact)) }
          </ul> }
      </>
    )
  }


}
