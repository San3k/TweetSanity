import React, { Component } from 'react';
import Main from './components/Main';

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = { amount: 0 };
  }
  render() {
    return (
      <div>
        <Main />
      </div>
    );
  }
}

export default Counter;
