import React from 'react';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

import Contacts from './components/Contacts';
import Transactions from './components/Transactions';
import Modal from './components/Modal';

export default class Home extends React.Component {
  state = {
    modalVisible: false
  }

  displayModal() {
    this.setState({modalVisible: true});
  }


  render() {
    const {account} = this.props.me;
    return (
      <div>
        {this.state.modalVisible && <Modal />}
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
            <Router>
              <Link to="/history" className="btn btn-outline-primary mr-3">Extrato</Link>
              <Link to="/contacts" className="btn btn-outline-primary mr-3">Contatos</Link>
              <Link to="/transfer" className="btn btn-outline-primary">Transferir</Link>
            </Router>
            </div>
          </div>
        </div>
        <div className="row align-items-center px-5">
          <div className="mx-auto col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title d-block mb-1 text-primary">
                  Favoritos
                  <i className="fas fa-star ml-2 text-secondary" />
                </h3>
                <div className="card-text py-4">
                  <Contacts />
                </div>
                <Router>
                  <div className="d-flex justify-content-between align-items-center h-25">
                    <button type="button" className="btn btn-primary" title="Adicionar Contato" data-toggle="modal" data-target="#exampleModalCenter" onClick={() => this.displayModal()}><i className="fas fa-user-plus"/></button>
                    <Link to="/contacts" className="text-right">Gerenciar contatos</Link>
                  </div>
                </Router>
              </div>
            </div>
          </div>
          <div className="mx-auto col-md-6">
            <div className="card w-100">
              <div className="card-body">
                <h3 className="card-title d-block mb-1 text-primary">
                  Transferências
                  <i className="fas fa-exchange-alt text-secondary ml-2" />
                </h3>
                <div className="card-text py-4">
                  <Transactions />
                </div>
                <Router>
                  <div className="d-flex justify-content-between align-items-center h-25">
                    <button type="button" className="btn btn-primary" title="Nova Transferência"><i className="fas fa-hand-holding-usd"/></button>
                    <Link to="/history" className="text-right">Ver histórico completo</Link>
                  </div>
                </Router>
              </div>
            </div>
          </div>
        </div>
      </div>
       
    )
  }


}
