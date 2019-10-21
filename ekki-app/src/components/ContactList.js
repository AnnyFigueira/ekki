import React from 'react';
import {
  Link
} from "react-router-dom";

export default class ContactList extends React.Component {
  
  state = {}

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      contacts: props.contacts
    };
  }

  resetMessages() {
    this.setState({errorDeletingContact: false});
    this.setState({contactDeletedSuccesfully: false});
  }

  renderContactList() {
    return (
      <>
        {this.state.contacts && this.state.contacts.length === 0 && 
          <p className="font-weight-normal text-center"> 
            <span className="d-block">Nenhum contato :(</span>
          </p>}
        {this.state.contacts && this.state.contacts.length > 0 && 
          <ul className="list-group overflow-auto">
            {this.state.contacts.map(contact => this.renderContact(contact)) }
          </ul> }
        {this.state.errorDeletingContact && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />Não foi possível remover o contato, tente novamente mais tarde</div>}
        {this.state.contactDeletedSuccesfully && <div className="alert alert-success text-success mt-2"><i className="fas fa-check-circle mr-2" />Contato removido com sucesso</div>}
      </>
    )
  }

  async removeContact(id) {
    this.resetMessages();
    const response = await fetch(`http://localhost:3001/contacts/${id}`, {
        method: 'delete',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "id": id
        })
    });
    if(response.status === 500) { this.setState({errorDeletingContact: true}); }
    else { 
      this.setState({contactDeletedSuccesfully: true}); 
      this.props.removeContact(id);
    }
  }

  renderContact(contact) {
    return (
      <li key={contact._id} className="list-group-item list-group-item-action">
        <div className="position-relative">
        {contact.user.name}
          <div className="action-buttons position-absolute">
            <Link to="transactions#transfer" className="btn btn btn-link mr-1" title="Transferir..."><i className="fas fa-exchange-alt"/></Link>
            <button type="button" className="btn btn btn-link" title="Remover Contato" onClick={() => this.removeContact(contact._id)}><i className="fas fa-times"/></button>
          </div>
        </div>
      </li>
    )
  }

  render() {
    return (
      <>
        {this.renderContactList()}
      </>
    )
  }

}
