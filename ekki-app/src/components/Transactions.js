import React from 'react';

export default class Transactions extends React.Component {
  state = {}

  async componentDidMount() {
    const response = await fetch('http://localhost:3001/transactions');
    const transactions = await response.json();
    this.setState({transactions});
  }

  render() {
    return (
      <>
        {this.state.transactions && this.state.transactions.length === 0 && <p className="font-weight-normal text-center py-5">Nenhuma transação recente :)</p>}
        {this.state.transactions && this.state.transactions.length > 0 && 
          <table className="card-text d-block w-100">

          </table>}
      </>
    )
  }


}
