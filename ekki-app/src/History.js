import React from 'react';

export default class Transactions extends React.Component {

  async componentDidMount() {
    const response = await fetch('http://localhost:3001/transactions');
    const transactions = await response.json();
    this.setState({transactions});
  }

  render() {
    return (
        <div className="card w-100">
          <div className="card-body">
            <h3 className="card-title d-block mb-1 text-primary">
              Transferências
              <i className="fas fa-exchange-alt text-secondary ml-2" />
            </h3>
            <table className="card-text d-block w-100">
  
            </table>
          </div>
        </div>

    )
  }


}
