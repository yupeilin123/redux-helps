import React from 'react';
import { connect } from 'react-redux';

class Counter extends React.PureComponent {
  onIncrement = () => {
    this.props.dispatch({
      type: 'counter/setState', payload: {
        count: this.props.counter.count + 1
      }
    })
  }
  onDecrement = () => {
    this.props.dispatch({
      type: 'counter/setState', payload: {
        count: this.props.counter.count - 1
      }
    })
  }
  incrementIfOdd = () => {
    this.props.dispatch({
      type: 'counter/incrementIfOdd', payload: {
        count: this.props.counter.count
      }
    })
  }
  incrementAsync = () => {
    this.props.dispatch({
      type: 'counter/incrementAsync', payload: {
        count: this.props.counter.count
      }
    })
  }
  render() {
    const { count } = this.props.counter;
    return (
      <p>
        Clicked: {count} times
        {' '}
        <button onClick={this.onIncrement}>
          +
        </button>
        {' '}
        <button onClick={this.onDecrement}>
          -
        </button>
        {' '}
        <button onClick={this.incrementIfOdd}>
          Increment if odd
        </button>
        {' '}
        <button onClick={this.incrementAsync}>
          Increment async
        </button>
      </p>
    );
  }
}

export default connect((state) => (state))(Counter);
