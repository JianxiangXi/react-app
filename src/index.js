import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.toItalics) {
    return (
      <button className="square" 
      onClick={props.onClick}>
        <i>{props.value}</i>
      </button>
    );
  } else {
    return (
      <button className="square" 
      onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (<Square value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        // the toItalics passed to square as a prop is a boolean,
        // which is true if and only if i is equal to the index 
        // passed in as props.toItalics
        toItalics={this.props.toItalics === i}
      />);
    }

    render() {
      const squares = []
      for (let row = 0; row < 3; row++) {
        let squareRow = []
        for (let col = 0; col < 3; col++) {
          squareRow.push(<span key={row * 3 + col}>{this.renderSquare(row * 3 + col)}</span>)
        }
        squares.push(<div key={row}>{squareRow}</div>)
      }
      return <div>{squares}</div>
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          squareEdited: null
        }],
        stepNumber: 0,
        xIsNext: true,
        descend: false
      }
      this.switchOrder = this.switchOrder.bind(this)
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1)
      const current = history[history.length - 1]
      const squares = current.squares.slice()
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O'
      this.setState({
        history: history.concat([{
        squares,
        squareEdited: i
      }]), 
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  switchOrder() {
    this.setState({
      descend: !this.state.descend
    })
  }

    render() {
      const reversed = this.state.descend ? this.state.history.slice().reverse() : undefined
      const history = reversed ? reversed : this.state.history
      const current = this.state.history[this.state.stepNumber] 
      const winner = calculateWinner(current.squares)
      console.log(reversed)

      const moves = history.map((step, move) => {
        const index = history[move].squareEdited
        const col = Math.floor(index % 3) + 1
        const row = Math.floor(index / 3) + 1
        let desc = move ? 
        `Go to move #${move} that happened at (${row}, ${col})`:
        'Go to game start';
        if (reversed) {
          desc = (move !== history.length - 1) ? 
          `Go to move #${move} that happened at (${row}, ${col})`:
          'Go to game start';
        }

        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })
      
      let status;
      if (winner) {
        status = 'Winner: ' + winner
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            // toItalics at this point is the index of the square that
            // was edited in the move selected by the user
            toItalics={this.state.history[this.state.stepNumber].squareEdited} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={this.switchOrder}>
              Switch Order
            </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );