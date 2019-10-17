import React from 'react';
import { timingSafeEqual } from 'crypto';

export default class Transactions extends React.Component {

  async componentDidMount() {
    const response = await fetch('http://localhost:3001/transactions');
    const transactions = await response.json();
    this.setState({transactions});
  }

  render() {
    const {account} = this.props.me;
    return (
        <div className="card">
          <div className="card-body">
            <h2 className="card-title d-block w-100 mb-1 h5">Histórico de Transações</h2>
            <table className="card-text d-block w-100">
  
            </table>
          </div>
        </div>

    )
  }


}
