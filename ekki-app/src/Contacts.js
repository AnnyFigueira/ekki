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
        <div className="card">
          <div className="card-body">
            <h2 className="card-title d-block w-100 mb-1 h5">Contatos</h2>
            <ul className="card-text d-block w-100">
              {this.state.contacts && this.state.contacts.map(contact => this.renderContact(contact)) }
            </ul>
          </div>
        </div>
    )
  }


}
