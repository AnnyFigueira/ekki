import React from 'react';
import {
  Link
} from "react-router-dom";

import ContactList from './components/ContactList';
import onlineFriends from'./images/online-friends.svg';

export default class Contacts extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      id: '',
      name: '',
      account: '',
      cpf: '',
      submitDisabled: true,
    }

    this.cpfInput = React.createRef();
    this.nameInput = React.createRef();
    this.accountInput = React.createRef();
    this.contacts = React.createRef();
  }

  async componentDidMount() {
    const queryString = require('query-string');
    const parsed = queryString.parse(this.props.location.search);

    if(parsed.add) {
      this.cpfInput.current.focus();
    }

    const response = await fetch('http://localhost:3001/contacts');
    const contacts = await response.json();
    this.setState({contacts});
  }

  handleChange(e) {
    this.setState({[e.target.id]: e.target.value}); 
  }

  async searchUser() {
    this.resetMessages();
    if (this.state.cpf === this.props.me.cpf) { this.setState({youCannotAddYourself: true}) }
    else {
      const response = await fetch(`http://localhost:3001/users/${this.state.cpf}`);
      const user = await response.json();
      if(response.status === 404) {
        this.setState({userNotFound: true})
      }
      else {
        if(response.ok && user) {
          /* this.nameInput.current.value = user.name;
          this.accountInput.current.value = user.account; */
          this.setState({id: user._id, name: user.name, account: user.account, cpf: user.cpf, submitDisabled: false});}
        else { 
          this.setState({anErrorOcurred: true})
        }
      }
    }
  }

  resetMessages() {
    this.setState({userNotFound: false});
    this.setState({youCannotAddYourself: false});
    this.setState({thisUserIsAlreadyContact: false});
    this.setState({anErrorOcurred: false});
    this.setState({succesfullyAddedContact: false});
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.resetMessages();
    const response = await fetch('http://localhost:3001/contacts', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "id": this.state.id
        })
      });
    const contact = await response.json();
    if(response.status === 409) {
      this.setState({thisUserIsAlreadyContact: true});
    }
    else { 
      if(response.ok) {
        let contacts = this.state.contacts;
        contacts.push(contact);
        this.setState({succesfullyAddedContact: true, contacts});
        window.scrollTo(0, this.contacts.current.offsetTop); } 
      else { this.setState({anErrorOcurred: true}); }
    }
    this.resetForm();
  }

  resetForm() {
    this.setState({id: '',
    cpf: '',
    submitDisabled: true})
  }

  removeContact(id) {
    this.resetMessages();
    const contacts = this.state.contacts.filter(contact => contact._id !== id);
    this.setState({contacts}); 
  }
  
  render() {
    return (
      <div>
        <div className="row align-items-center p-5 no-gutters">
          <div className="mx-auto col-md-6 order-md-2 text-md-right">
            <img src={onlineFriends} alt="Tenha seus contatos acessíveis de forma rápida e fácil!" className="img-fluid mb-3 mb-md-0"/>
          </div>
          <div className="col-md-6 order-md-1 text-center text-md-left">
            <h2 className="mb-0 text-primary">
              Contatos
              <i className="favorites-icon" />
            </h2>
            <div className="py-4">
              <p className="mb-2 h4">
                <span className="font-weight-normal">Adicione contatos para realizar transferências com apenas um clique!</span>
              </p>
            </div>
            <div className="">
              <Link to="/" className="btn btn-outline-primary mr-3">Home</Link>
              <a href="#contact-list" className="btn btn-outline-primary mr-3">Contatos</a>
              <button type="button" onClick={() => this.cpfInput.current.focus()} className="btn btn-outline-primary">Novo</button>
            </div>
          </div>
        </div>
        <div className="row align-items-center px-5">
          <div className="mx-auto order-2 order-md-1 col-md-6 mb-3">
            <div className="card" id="contact-list">
              <div className="card-body">
                <h3 className="card-title d-block mb-1 text-primary">
                  Contatos
                  <i className="fas fa-user-friends ml-2 text-secondary" />
                </h3>
                <div className="card-text py-2" ref={this.contacts}>
                  <ContactList contacts={this.state.contacts} me={this.props.me} removeContact={id => this.removeContact(id)}/>
                </div>
                <div className="text-center">
                  <button type="button" onClick={() => this.cpfInput.current.focus()} className="btn btn-outline-primary">Adicionar Contato</button>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto order-1 order-md-2 col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title d-block mb-1 text-primary">
                  Novo Contato
                  <i className="fas fa-user-plus ml-2 text-secondary" />
                </h3>
                <div className="card-text py-4">
                  <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className="form-group row no-gutters">
                      <label htmlFor="cpf" className="my-auto mb-0 col-3">CPF: </label>
                      <div className="col-9">
                        <div className="input-group">
                          <input type="text" className="form-control" id="cpf" ref={this.cpfInput} placeholder="Insira o CPF" value={this.state.cpf} onChange={e => this.handleChange(e)}/>
                          <div className="input-group-append">
                            <button className="btn btn-outline-primary" type="button" onClick={() => this.searchUser()}>Pesquisar</button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <small className="form-text text-muted">Insira apenas números</small>
                        {this.state.youCannotAddYourself && <div className="alert alert-danger text-danger"><i className="fas fa-exclamation-circle mr-2" />Você não pode adicionar a si mesmo</div>}
                        {this.state.userNotFound && <div className="alert alert-danger text-danger"><i className="fas fa-exclamation-circle mr-2" />Usuário não encontrado</div>}                      
                      </div>
                    </div>
                    <div className="form-group row no-gutters">
                        <label htmlFor="name" className="my-auto mb-0 col-3">Nome: </label>
                        <div className="col-9">
                          <input type="text" className="form-control" ref={this.nameInput} id="name" value={this.state.name} disabled/>
                        </div>
                      </div>
                    <div className="form-group row no-gutters">
                      <label htmlFor="account" className="my-auto mb-0 col-3">Conta: </label>
                      <div className="col-9">
                        <input type="text" className="form-control" ref={this.accountInput} id="account" value={this.state.account} disabled/>
                      </div>
                    </div>
                    <input type="submit" className="btn btn-primary" disabled={this.state.submitDisabled} value="Adicionar" />
                    {this.state.thisUserIsAlreadyContact && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />{this.state.name} já é um contato</div>}
                    {this.state.anErrorOcurred && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />Ocorreu um erro</div>}
                    {this.state.succesfullyAddedContact && <div className="alert alert-success text-success mt-2"><i className="fas fa-check-circle mr-2" />Contato adicionado</div>}
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
