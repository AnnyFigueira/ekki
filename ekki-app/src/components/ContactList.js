import React from 'react';

export default class ContactList extends React.Component {
  
  state = {}

  /* static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      contacts: props.contacts
    };
  } */

  componentDidUpdate(prevProps) {
    if (this.props.contacts.length !== prevProps.contacts.length) {
      let difference = this.props.contacts.filter(x => !prevProps.contacts.includes(x));
      console.log(difference);
      this.fetchData(this.props.contacts);
      const contacts = this.state.contacts;
      contacts.push(difference).flatten();
      this.setState({contacts});
    }
  }

  componentDidMount() {
    this.setState({contacts: this.props.contacts});
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
    if(response.status === 500) { this.setState({anErrorOcurred: true}); }
    else { 
      const contacts = this.state.contacts.filter(contact => contact._id !== id);
      this.setState({contactDeletedSuccesfully: true, contacts}); }
  }

  resetMessages() {
    this.setState({anErrorOcurred: false});
    this.setState({contactDeletedSuccesfully: false});
  }

  renderContact(contact) {
    return (
      <li key={contact._id} className="list-group-item list-group-item-action">
        <div className="position-relative">
        {contact.user.name}
          <div className="action-buttons position-absolute">
            <button type="button" className="btn btn btn-link mr-1" title="Transferir..."><i className="fas fa-exchange-alt"/></button>
            <button type="button" className="btn btn btn-link" title="Remover Contato" onClick={() => this.removeContact(contact._id)}><i className="fas fa-times"/></button>
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
            {this.props.fav ? <span>Nenhum contato recente :(</span> : <span className="d-block">Nenhum contato adicionado :(</span>}
          </p>}
        {this.state.contacts && this.state.contacts.length > 0 && 
          <ul className="list-group overflow-auto">
            {this.state.contacts.map(contact => this.renderContact(contact)) }
          </ul> }
        {this.state.anErrorOcurred && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />Ocorreu um erro, tente novamente mais tarde</div>}
        {this.state.contactDeletedSuccesfully && <div className="alert alert-success text-success mt-2"><i className="fas fa-check-circle mr-2" />Contato removido com sucesso</div>}
      </>
    )
  }


}
