import React from 'react';
import {
  Link
} from "react-router-dom";

import ContactList from './components/ContactList';

export default class Contacts extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      id: '',
      name: '',
      account: '',
      cpf: '',
      disabled: true
    }

    this.cpfInput = React.createRef();
    this.contacts = React.createRef();
  }

  componentDidMount() {
    const queryString = require('query-string');
    const parsed = queryString.parse(this.props.location.search);

    if(parsed.add) {
      this.cpfInput.current.focus();
    }
  }

  updateCPF(e) { this.setState({cpf: e.target.value}); }

  async searchUser() {
    const response = await fetch(`http://localhost:3001/users/${this.state.cpf}`);
    const user = await response.json();
    this.setState({id: user._id, name: user.name, account: user.account, cpf: user.cpf, disabled: false});
  }

  async handleSubmit() {
    console.log(this.state.id);
    const response = await fetch('http://localhost:3001/contacts', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "id": this.state.id
        })
      });
    const contact = await response.json();
    console.log(contact);
    //e.preventDefault();
  }
  
  render() {
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
                <span className="font-weight-normal">Adicione contatos para realizar transferências com apenas um clique!</span>
              </p>
            </div>
            <div className="">
              <Link to="/" className="btn btn-outline-primary mr-3">Home</Link>
              <button type="button" onClick={() => window.scrollTo(0, this.contacts.current.offsetTop)} className="btn btn-outline-primary mr-3">Contatos</button>
              <button type="button" onClick={() => this.cpfInput.current.focus()} className="btn btn-outline-primary">Novo</button>
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
                <div className="card-text py-5 overflow-auto" ref={this.contacts}>
                  <ContactList all/>
                  <div className="text-center">
                    <button type="button" onClick={() => this.cpfInput.current.focus()} className="btn btn-outline-primary">Adicionar Contato</button>
                  </div>
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
                        <label htmlFor="cpfInput" className="my-auto mb-0 mr-1">CPF: </label>
                        <input type="text" className="form-control" id="cpfInput" ref={this.cpfInput} placeholder="Insira o CPF" value={this.state.cpf} onChange={e => this.updateCPF(e)}/>
                        <div className="input-group-append">
                          <button className="btn btn-outline-primary" type="button" onClick={() => this.searchUser()}>Pesquisar</button>
                        </div>
                      </div>
                      <small className="form-text text-muted">Insira apenas números</small>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <label htmlFor="name" className="my-auto mb-0 mr-1">Nome: </label>
                        <input type="text" className="form-control" id="name" disabled value={this.state.name}/>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <label htmlFor="account" className="my-auto mb-0 mr-1">Conta: </label>
                        <input type="text" className="form-control" id="account" disabled value={this.state.account}/>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary" disabled={this.state.disabled} onClick={() => this.handleSubmit()}>Adicionar</button>
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
