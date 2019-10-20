import React from 'react';
import {
  Link
} from "react-router-dom";

import Transactions from './components/Transactions';

export default class Home extends React.Component {
  state = {}

  async componentDidMount() {
    const response = await fetch('http://localhost:3001/contacts');
    const contacts = await response.json();
    this.setState({contacts});
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
            <span>Nenhum contato recente :(</span>
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
      const contacts = this.state.contacts.filter(contact => contact._id !== id);
      this.setState({contactDeletedSuccesfully: true, contacts}); }
  }


  render() {
    const {account} = this.props.me;
    return (
      <div>
        <div className="row align-items-center p-5 no-gutters">
          <div className="mx-auto col-md-6 order-md-2 text-md-right">
            {/* <img src="https://image.flaticon.com/icons/svg/1392/1392078.svg" className="img-fluid mb-3 mb-md-0"/> */}
            <img src={require('./savings.svg')} alt="Suas economias conosco" className="img-fluid mb-3 mb-md-0"/>
          </div>
          <div className="col-md-6 order-md-1 text-center text-md-left">
            <h2 className="mb-md-3 mb-0 text-primary">
              Seu Saldo
              <i className="money-icon" />
            </h2>
            <div className="py-4">
              <p className="mb-2 h4">
                <span className="font-weight-normal">Saldo disponível: </span>
                <span className={`h3 d-inline-block font-weight-bold ${account.balance <= 0 ? "text-danger" : "text-success"}`}>
                  R$ {account.balance}
                </span>
              </p>
              <p className="mb-2 h5 font-weight-normal">
                <span>Limite restante: </span>
                {account.balance < 0 && <span className="text-danger"> R$ {account.limit + account.balance} </span>}
                {account.balance >= 0 && <span className="text-success"> R$ {account.limit} </span>}
              </p>
            </div>
            <div className="pt-md-5">
              <Link to="/history" className="btn btn-outline-primary mr-3">Extrato</Link>
              <Link to="/contacts" className="btn btn-outline-primary mr-3">Contatos</Link>
              <Link to="/transfer" className="btn btn-outline-primary">Transferir</Link>
            </div>
          </div>
        </div>
        <div className="row align-items-center px-5">
          <div className="mx-auto col-md-6 mb-3">
            <div className="card">
              <div className="card-body position-relative">
                <h3 className="card-title d-block mb-1 text-primary">
                  Favoritos
                  <i className="fas fa-star ml-2 text-secondary" />
                </h3>
                <div className="card-text py-2">
                  {this.renderContactList()}
                </div>
                <Link to="/contacts?add=true" className="bottom-button btn btn-primary position-absolute" title="Adicionar Contato"><i className="fas fa-user-plus"/></Link>
                <Link to="/contacts" className="bottom-link position-absolute">Gerenciar contatos</Link>
              </div>
            </div>
          </div>
          <div className="mx-auto col-md-6 mb-3">
            <div className="card w-100">
              <div className="card-body">
                <h3 className="card-title d-block mb-1 text-primary">
                  Transferências
                  <i className="fas fa-exchange-alt text-secondary ml-2" />
                </h3>
                <div className="card-text py-2">
                  <Transactions />
                </div>
                <button type="button" className="bottom-button btn btn-primary position-absolute" title="Nova Transferência"><i className="fas fa-hand-holding-usd"/></button>
                <Link to="/history" className="bottom-link text-right position-absolute">Ver histórico completo</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
       
    )
  }


}
