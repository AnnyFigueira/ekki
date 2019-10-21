import React from 'react';
import {
  Link
} from "react-router-dom";
import CurrencyInput from 'react-currency-input';
import TransactionHistory from './components/TransactionHistory';
import transferMoney from'./images/transfer-money.svg';
import formatCurrency from './formatCurrency';

export default class Transactions extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      contacts: [],
      selected: {},
      name: '',
      cpf: '',
      value: 0.00,
      maskedValue: "0,00"
    }

    this.contactSelect = React.createRef();
    this.nameInput = React.createRef();
    this.cpfInput = React.createRef();
    this.valueInput = React.createRef();
    this.transactions = React.createRef();
  }

  async componentDidMount() {
    const queryString = require('query-string');
    const parsed = queryString.parse(this.props.location.search);

    let response = await fetch('http://localhost:3001/transactions');
    const transactions = await response.json();
    this.setState({transactions});

    response = await fetch('http://localhost:3001/contacts');
    const contacts = await response.json();
    this.setState({contacts});
  }

  resetMessages() {
    this.setState({transactionError: false});
    this.setState({usingLimit: false});
    this.setState({transactionSuccesfull: false});
    this.setState({youDontHaveBalance: false});
    this.setState({similarTransaction: false});
  }

  handleChange(e) {
    const contact = this.state.contacts.find(contact => contact.userId == e.target.value);
    this.setState({
      receiverId: contact.userId,
      name: contact.user.name,
      cpf: contact.user.cpf
    });
  }

  handleValueChange(event, maskedValue, value) {
    this.setState({maskedValue, value});

    if (this.props.me.account.balance < value) {
      this.setState({usingLimit: true});
    }
  }

  resetForm() {
    this.setState({receiverId: 0,
      maskedValue: "0,00",
      name: "",
      cpf: ""
    })
  }

  renderNewTransaction() {
    return(
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <div className="form-group row no-gutters">
          <label htmlFor="select" className="my-auto mb-0 col-3">Contato: </label>
          <div className="col-9">
            <select className="form-control" id="select" defaultValue="0" value={this.state.receiverId} onChange={(e) => this.handleChange(e)}>
              <option key="0" value="0" disabled hidden>Selecione um contato </option>
              {this.state.contacts.map(contact => <option key={contact.user._id} value={contact.user._id}>{contact.user.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group row no-gutters">
          <label htmlFor="value" className="my-auto mb-0 col-3">Valor: </label>
          <div className="col-9">
            <CurrencyInput decimalSeparator="," thousandSeparator="." className="form-control" value={this.state.maskedValue} onChangeEvent={(e,m,v) => this.handleValueChange(e,m,v)}/>
          </div>
          {this.state.usingLimit && <div className="alert alert-danger text-danger mt-2 mb-0"><i className="fas fa-exclamation-circle mr-2" />Usando R$ {formatCurrency(this.state.value - this.props.me.account.balance)} do limite</div>}
        </div>
        <div className="form-group row no-gutters">
          <label htmlFor="name" className="my-auto mb-0 col-3">Nome: </label>
          <div className="col-9">
            <input type="text" className="form-control" ref={this.nameInput} id="name" value={this.state.name} disabled/>
          </div>
        </div>
        <div className="form-group row no-gutters">
          <label htmlFor="cpf" className="my-auto mb-0 col-3">CPF: </label>
          <div className="col-9">
            <input type="text" className="form-control" ref={this.cpfInput} id="cpf" value={this.state.cpf} disabled/>
          </div>
        </div>
        <input type="submit" className="btn btn-primary" value="Enviar" />
        {this.state.transactionError && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />Ocorreu um erro, tente novamente mais tarde</div>}
        {this.state.youDontHaveBalance && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />Você não tem saldo suficiente</div>}
        {this.state.similarTransaction && <div className="alert alert-warning text-warning mt-2"><i className="fas fa-exclamation-circle mr-2" />Transação semelhante recente</div>}
        {this.state.transactionSuccesfull && <div className="alert alert-success text-success mt-2"><i className="fas fa-check-circle mr-2" />Transferência realizada!</div>}
      </form>
    )
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.resetMessages();
    const value = this.state.value;
    
    const response = await fetch('http://localhost:3001/transactions', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "receiverId": this.state.receiverId,
          "value": value
        })
      });
    let transaction = await response.json();
    if(response.status === 403) {
      this.setState({youDontHaveBalance: true});
    }
    else { 
      if(response.ok) {
        if (transaction.value) {
          let transactions = this.state.transactions;
          transactions.unshift(transaction);
          this.setState({transactionSuccesfull: true, transactions});
          this.props.changeBalance(value);
        }
        else { this.setState({similarTransaction: true}) }
      } 
      else { this.setState({anErrorOcurred: true}); }
    }
    this.resetForm();
  }


  render() {
    return (
      <div>
        <div className="row align-items-center p-5 no-gutters">
          <div className="mx-auto col-md-6 order-md-2 text-md-right">
            <img src={transferMoney} alt="Suas transações" className="img-fluid mb-3 mb-md-0"/>
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
              <a href="#history" className="btn btn-outline-primary mr-3">Extrato</a>
              <a href="#transfer" className="btn btn-outline-primary">Nova</a>
            </div>
          </div>
        </div>
        <div className="row align-items-center px-5">
          <div className="mx-auto col-md-6 mb-3">
            <div className="card" id="history">
              <div className="card-body position-relative">
                <h3 className="card-title d-block mb-1 text-primary">
                  Histórico
                  <i className="fas fa-history ml-2 text-secondary" />
                </h3>
                <div className="card-text py-2">
                  <TransactionHistory transactions={this.state.transactions} me={this.props.me} all/>
                </div>
                <a href="#transfer" className="bottom-button btn btn-primary position-absolute" title="Nova Transferência"><i className="fas fa-exchange-alt"/></a>
              </div>
            </div>
          </div>
          <div className="mx-auto col-md-6 mb-3">
            <div className="card w-100" id="transfer">
              <div className="card-body">
                <h3 className="card-title d-block mb-1 text-primary">
                  Transferir
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
