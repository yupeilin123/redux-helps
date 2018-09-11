import React from 'react';
import { connect } from 'react-redux';

class Counter extends React.PureComponent {
  onIncrement = () => {
    this.props.dispatch({
      type: 'setState', payload: {
        count: this.props.count + 1
      }
    })
  }
  onDecrement = () => {
    this.props.dispatch({
      type: 'setState', payload: {
        count: this.props.count - 1
      }
    })
  }
  incrementIfOdd = () => {
    this.props.dispatch({ type:'incrementIfOdd',payload: {
      count: this.props.count
    }})
  }
  incrementAsync = () => {
    this.props.dispatch({ type:'incrementAsync',payload: {
      count: this.props.count
    }})
  }
  render() {
    const { count } = this.props;
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
