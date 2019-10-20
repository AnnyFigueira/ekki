import React from 'react';
import {
  Link
} from "react-router-dom";

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
          this.nameInput.current.value = user.name;
          this.accountInput.current.value = user.account;
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
    this.setState({errorDeletingContact: false});
    this.setState({contactDeletedSuccesfully: false});
  }

  async handleSubmit(e) {
    e.preventDefault()
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
    
  }

  async removeContact(id) {
    this.resetMessages();
    const response = await fetch(`http://localhost:3001/contacts/${id}`, {
        method: 'delete',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "id": id
        })
    });
    if(response.status === 500) { this.setState({errorDeletingContact: true}); }
    else { 
      const contacts = this.state.contacts.filter(contact => contact._id !== id);
      this.setState({contactDeletedSuccesfully: true, contacts}); }
  }

  renderContactList() {
    return (
      <>
        {this.state.contacts && this.state.contacts.length === 0 && 
          <p className="font-weight-normal text-center"> 
            <span className="d-block">Nenhum contato adicionado :(</span>
          </p>}
        {this.state.contacts && this.state.contacts.length > 0 && 
          <ul className="list-group overflow-auto">
            {this.state.contacts.map(contact => this.renderContact(contact)) }
          </ul> }
        {this.state.anErrorOcurred && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />Ocorreu um erro, tente novamente mais tarde</div>}
        {this.state.contactDeletedSuccesfully && <div className="alert alert-success text-success mt-2"><i className="fas fa-check-circle mr-2" />Contato removido com sucesso</div>}
      </>
    )
  }

  renderContact(contact) {
    return (
      <li key={contact._id} className="list-group-item list-group-item-action">
        <div className="position-relative">
        {contact.user.name}
          <div className="action-buttons position-absolute">
            <button type="button" className="btn btn btn-link mr-1" title="Transferir..."><i className="fas fa-exchange-alt"/></button>
            <button type="button" className="btn btn btn-link" title="Remover Contato" onClick={() => this.removeContact(contact._id)}><i className="fas fa-times"/></button>
          </div>
        </div>
      </li>
    )
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
                <div className="card-text py-2" ref={this.contacts}>
                  {this.renderContactList()}
                </div>
                <div className="text-center">
                  <button type="button" onClick={() => this.cpfInput.current.focus()} className="btn btn-outline-primary">Adicionar Contato</button>
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
                  <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className="form-group">
                      <div className="input-group">
                        <label htmlFor="cpf" className="my-auto mb-0 mr-1">CPF: </label>
                        <input type="text" className="form-control" id="cpf" ref={this.cpfInput} placeholder="Insira o CPF" onChange={e => this.handleChange(e)}/>
                        <div className="input-group-append">
                          <button className="btn btn-outline-primary" type="button" onClick={() => this.searchUser()}>Pesquisar</button>
                        </div>
                      </div>
                      <small className="form-text text-muted">Insira apenas números</small>
                      {this.state.youCannotAddYourself && <div className="alert alert-danger text-danger"><i className="fas fa-exclamation-circle mr-2" />Você não pode adicionar a si mesmo</div>}
                      {this.state.userNotFound && <div className="alert alert-danger text-danger"><i className="fas fa-exclamation-circle mr-2" />Usuário não encontrado</div>}
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
                    <input type="submit" className="btn btn-primary" disabled={this.state.submitDisabled} value="Adicionar" />
                    {this.state.thisUserIsAlreadyContact && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />{this.state.name} já está na sua lista de contatos</div>}
                    {this.state.anErrorOcurred && <div className="alert alert-danger text-danger mt-2"><i className="fas fa-exclamation-circle mr-2" />Ocorreu um erro, tente novamente mais tarde</div>}
                    {this.state.succesfullyAddedContact && <div className="alert alert-success text-success mt-2"><i className="fas fa-check-circle mr-2" />Contato adicionado com sucesso</div>}
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
