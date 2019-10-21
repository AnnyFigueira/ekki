import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import formatCurrency from '../formatCurrency';

export default class TransactionHistory extends React.Component {
  state = {}

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      transactions: props.transactions
    };
  }

  renderTransactionHistory() {
    return (
      <>
        {(!this.state.transactions || this.state.transactions.length === 0) && 
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
    const enter = this.props.me._id === transaction.receiver ? true : false;
    const contact = enter ? transaction.sender : transaction.receiver;
    moment.locale('pt-br');
    return (
      <li key={transaction._id} className="list-group-item d-block">
        <div className="row no-gutters">
          <div className="col-1">
            {enter && <i className="fas fa-arrow-down text-success" />}
            {!enter && <i className="fas fa-arrow-up text-danger" />}
          </div>
          <div className="col-8">
            {enter && <small className="text-weight-bold">Transferência Recebida</small>}
            {!enter && <small className="text-weight-bold">Transferência Enviada</small>}
            <span className="d-block w-100">{contact.name}</span>
            {enter && <span className="d-block w-100 text-success">R$ {formatCurrency(transaction.value)}</span>}
            {!enter && <span className="d-block w-100 text-danger">R$ {formatCurrency(transaction.value)}</span>}
          </div>
          <div className="col-3">
            {moment(transaction.timestamp).format('DD/MM/YY [às] LT')}
          </div>
        </div>
      </li>
    )
  }


  render() {
    return (
      <>
        {this.renderTransactionHistory()}
      </>
    )
  }


}
