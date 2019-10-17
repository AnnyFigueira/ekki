import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

import Contacts from './Contacts';

export default class Transactions extends React.Component {

  render() {
    const {account} = this.props.me;
    return (
      <div>
        <div className="row align-items-center px-5 no-gutters">
          <div className="mx-auto col-md-4 order-md-2 text-md-right">
            <img src="https://image.flaticon.com/icons/svg/1392/1392078.svg" className="img-fluid mb-3 mb-md-0"/>
          </div>
          <div className="col-md-8 order-md-1 text-center text-md-left">
            <h2 className="mb-3 text-primary">Seu Saldo</h2>
            <div className="mb-5">
              <p className="mb-2">
                <span className="font-weight-normal">Saldo disponível: </span>
                <span className={`h4 font-weight-bold ${account.balance <= 0 ? "text-danger" : "text-success"}`}>
                  R$ {account.balance}
                </span>
              </p>
              <p className="mb-3">
                <span>Limite restante: </span>
                {account.balance < 0 && <span className="text-danger"> R$ {account.limit + account.balance} </span>}
                {account.balance >= 0 && <span className="text-success"> R$ {account.limit} </span>}
              </p>
            </div>
            <Router>
              <Link to="/history" className="btn btn-outline-primary mr-3">Extrato</Link>
              <Link to="/contacts" className="btn btn-outline-primary mr-3">Contatos</Link>
              <Link to="/transfer" className="btn btn-outline-primary">Transferir</Link>
            </Router>
          </div>
        </div>
        <div className="row align-items-center px-5 no-gutters">
          <div className="mx-auto col-md-6">
            <Contacts />
          </div>
          <div className="mx-auto col-md-6"></div>
        </div>
      </div>
       
    )
  }


}
