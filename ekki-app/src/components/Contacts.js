import React from 'react';

export default class Contacts extends React.Component {
  
  state = {}

  async componentDidMount() {
    const response = await fetch('http://localhost:3001/contacts');
    const contacts = await response.json();
    this.setState({contacts});
  }

  renderContact(contact) {
    return (
      <li key="contact._id" >
        {contact.name}
      </li>
    )
  }

  render() {
    return (
      <>
        {this.state.contacts && this.state.contacts.length === 0 && <p className="font-weight-normal text-center py-5">Nenhum contato recente :)</p>}
        {this.state.contacts && this.state.contacts.length > 0 && 
          <ul>
            {this.state.contacts.map(contact => this.renderContact(contact)) }
          </ul>}
      </>
    )
  }


}
