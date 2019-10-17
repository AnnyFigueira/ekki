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
        <div className="card w-100">
          <div className="card-body">
            <h3 className="card-title d-block mb-1 text-primary">
              Contatos
              <i className="fas fa-star ml-2 text-secondary" />
            </h3>
            <ul className="card-text d-block w-100">
              {this.state.contacts && this.state.contacts.map(contact => this.renderContact(contact)) }
            </ul>
          </div>
        </div>
    )
  }


}
