import {Component} from 'react'

import {StyledButton} from './styledComponents'

class Counter extends Component {
  render() {
    return (
      <div>
        <StyledButton type="button" onClick={this.onDecrement}>
          -
        </StyledButton>
        <div>0</div>
        <button type="button" onClick={this.onIncrement}>
          +
        </button>
      </div>
    )
  }
}

export default Counter
