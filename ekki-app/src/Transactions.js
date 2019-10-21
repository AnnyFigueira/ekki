import React from 'react';
import {
  Link
} from "react-router-dom";

import Transactions from './components/Transactions';

export default class Home extends React.Component {
  state = {
    contacts: []
  }

  async componentDidMount() {
    let response = await fetch('http://localhost:3001/transactions');
    const transactions = await response.json();
    this.setState({transactions});

    response = await fetch('http://localhost:3001/contacts');
    const contacts = await response.json();
    this.setState({contacts});
  }

  resetMessages() {
    this.setState({transactionError: false});
    this.setState({transactionSucceded: false});
  }

  renderTransactionHistory() {
    return (
      <>
        {this.state.transactions && this.state.transactions.length === 0 && 
          <p className="font-weight-normal text-center"> 
            <span>Nenhuma transação :(</span>
          </p>}
        {this.state.transactions && this.state.transactions.length > 0 && 
          <ul className="list-group overflow-auto">
            {this.state.transactions.map(transaction => this.renderTransaction(transaction)) }
          </ul> 
        }
      </>
    )
  }

  renderTransaction(transaction) {
    const enter = this.props.me._id === transaction.receiver._id ? true : false;
    const contact = enter ? transaction.sender : transaction.receiver;

    return (
      <li key={transaction._id} className="list-group-item list-group-item-action">
        <div className="row">
          <div className="col-1">
            {enter && <i className="fas fa-arrow-down" />}
          </div>
          <div className="col-9">
            {enter && <small className="text-weight-bold">Transferência Recebida</small>}
            <span className="d-block w-100">{contact.name}</span>
            <span className="d-block w-100">R$ {transaction.value}</span>
          </div>
          <div className="col-2">
            {transaction.timestamp}
          </div>
        </div>
      </li>
    )
  }

  //to-do: transformar em um componente que possa receber um usuário opcionalmente
  renderNewTransaction() {
    return(
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="select" className="my-auto mb-0 mr-1">Contato: </label>
            <select class="form-control" id="select">
              {this.state.contacts.map(contact => <option id={contact.user._id}>{contact.user.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="value" className="my-auto mb-0 mr-1">Valor: </label>
            <input type="number" min="1" step="any" />
            <small className="form-text text-muted">Insira apenas números</small>
          </div>
        </div>
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="name" className="my-auto mb-0 mr-1">Nome: </label>
            <input type="text" className="form-control" ref={this.nameInput} id="name" disabled/>
          </div>
        </div>
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="account" className="my-auto mb-0 mr-1">Conta: </label>
            <input type="text" className="form-control" ref={this.accountInput} id="account" disabled/>
          </div>
        </div>
        <input type="submit" className="btn btn-primary" disabled={this.state.submitDisabled} value="Enviar" />
        {this.state.thisUserIsAlreadyContact && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />{this.state.name} já está na sua lista de contatos</div>}
        {this.state.anErrorOcurred && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />Ocorreu um erro, tente novamente mais tarde</div>}
        {this.state.succesfullyAddedContact && <div className="alert alert-success text-success mt-2"><i className="fas fa-check-circle mr-2" />Contato adicionado com sucesso</div>}
      </form>
    )
  }

  async handleSubmit(e) {
    e.preventDefault()
    const response = await fetch('http://localhost:3001/transactions', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "receiverId": this.state.receiverId,
          "value": this.state.value
        })
      });
    const contact = await response.json();
    if(response.status === 409) {
      //this.setState({thisUserIsAlreadyContact: true});
    }
    else { 
      if(response.ok) {
        /* let contacts = this.state.contacts;
        contacts.push(contact);
        this.setState({succesfullyAddedContact: true, contacts});
        window.scrollTo(0, this.contacts.current.offsetTop);  */
      } 
      else { this.setState({anErrorOcurred: true}); }
    }
  }


  render() {
    const {account} = this.props.me;
    return (
      <div>
        <div className="row align-items-center p-5 no-gutters">
          <div className="mx-auto col-md-6 order-md-2 text-md-right">
            <img src={require('./transfer-money.svg')} alt="Suas transações" className="img-fluid mb-3 mb-md-0"/>
          </div>
          <div className="col-md-6 order-md-1 text-center text-md-left">
            <h2 className="mb-0 text-primary">
              Transferências
              <i className="transfer-icon" />
            </h2>
            <div className="py-4">
              <p className="mb-2 h4">
                <span className="font-weight-normal">Verifique seu extrato e realize transações de forma rápida e segura</span>
              </p>
            </div>
            <div className="">
              <Link to="/" className="btn btn-outline-primary mr-3">Home</Link>
              <button type="button" className="btn btn-outline-primary mr-3">Extrato</button>
              <button type="button" className="btn btn-outline-primary">Nova</button>
            </div>
          </div>
        </div>
        <div className="row align-items-center px-5">
          <div className="mx-auto col-md-6 mb-3">
            <div className="card">
              <div className="card-body position-relative">
                <h3 className="card-title d-block mb-1 text-primary">
                  Histórico
                  <i className="fas fa-star ml-2 text-secondary" />
                </h3>
                <div className="card-text py-2">
                  {this.renderTransactionHistory()}
                </div>
                <button type="button" className="bottom-button btn btn-primary position-absolute" title="Nova Transferência"><i className="fas fa-hand-holding-usd"/></button>
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
                  {this.renderNewTransaction()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       
    )
  }


}
