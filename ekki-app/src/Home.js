import React from 'react';

export default class Transactions extends React.Component {

  render() {
    const {account} = this.props.me;
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
            <span className="card-title d-block w-100 mb-1 h5 font-weight-normal">Saldo atual </span>
            <span className={`card-text d-block w-100 h4 font-weight-bold ${account.balance < 0 ? "text-danger" : "text-success"}`}>
              R$ {account.balance}
            </span>
            {(account.balance < 0) && <span className="d-block w-100">Limite restante R${account.limit + account.balance}</span>}
          </div>
        </div>
      </div>
    )
  }


}
