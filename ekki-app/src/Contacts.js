import React from 'react';
import {
  Link
} from "react-router-dom";

import ContactList from './components/ContactList';

export default class Contacts extends React.Component {
  
  render() {
    console.log(this.props)
    return (
      <div>
        <div className="row align-items-center p-5 no-gutters">
          <div className="mx-auto col-md-6 order-md-2 text-md-right">
            <img src={require('./online-friends.svg')} alt="Tenha seus contatos acessíveis de forma rápida e fácil!" className="img-fluid mb-3 mb-md-0"/>
          </div>
          <div className="col-md-6 order-md-1 text-center text-md-left">
            <h2 className="mb-0 text-primary">
              Seus Contatos
              <i className="favorites-icon" />
            </h2>
            <div className="py-4">
              <p className="mb-2 h4">
                <span className="font-weight-normal">Adicione contatos para realizar transferências na velocidade de um clique!</span>
              </p>
            </div>
            <div className="">
              <Link to="/" className="btn btn-outline-primary mr-3">Home</Link>
              <Link to="/contacts" className="btn btn-outline-primary mr-3">Contatos</Link>
              <Link to="/contacts?add=true" className="btn btn-outline-primary">Novo</Link>
            </div>
          </div>
        </div>
        <div className="row align-items-center px-5">
          <div className="mx-auto col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title d-block mb-1 text-primary">
                  Contatos
                  <i className="fas fa-user-friends ml-2 text-secondary" />
                </h3>
                <div className="card-text py-4">
                  <ContactList all/>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title d-block mb-1 text-primary">
                  Novo Contato
                  <i className="fas fa-user-plus ml-2 text-secondary" />
                </h3>
                <div className="card-text py-4">
                  <form>
                    <div className="form-group">
                      <div className="input-group">
                        <label htmlFor="inputCPF" className="my-auto mb-0 mr-1">CPF: </label>
                        {this.props.location.search && <input type="text" className="form-control" id="inputCPF" placeholder="Insira o CPF" autoFocus/>}
                        {!this.props.location.search && <input type="text" className="form-control" id="inputCPF" placeholder="Insira o CPF"/>}
                        <div className="input-group-append">
                          <button className="btn btn-outline-primary" type="button">Pesquisar</button>
                        </div>
                      </div>
                      <small className="form-text text-muted">Insira apenas números</small>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <label htmlFor="name" className="my-auto mb-0 mr-1">Nome: </label>
                        <input type="text" className="form-control" id="name" disabled/>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <label htmlFor="account" className="my-auto mb-0 mr-1">Conta: </label>
                        <input type="text" className="form-control" id="account" disabled/>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
       
    )
  }


}
