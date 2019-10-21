import React from 'react';

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


  render() {
    return (
      <>
        {this.renderTransactionHistory()}
      </>
    )
  }


}
