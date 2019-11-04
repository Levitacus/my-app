import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
Function components for components
that only have a render method
function takes props and returns
what needs to be rendered
*/
function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={{
      backgroundColor: props.victory ? 'red' : 'white',
    }}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
    <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      victory={this.props.victoryLine ? this.props.victoryLine.some((index) => {
        return(index === i);
      }) : false}
      />
    );
  }

  render() {
    const items = []      
    for(let i=0; i<9; i++) {
      items.push(this.renderSquare(i));
    }
    return (
      <div>
        <div className="board-row">
          {items.slice(0, 3)}
        </div>
        <div className="board-row">
          {items.slice(3, 6)}
        </div>
        <div className="board-row">
          {items.slice(6, 9)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      victoryLine: []
    }
  }

  handleClick(i) {
    //slice creates a copy instead of modifying it
    //It's best to retain immutability
    //and make copies of data and states
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]) {
      this.setState({
        victoryLine: calculateWinner(squares)
      })
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      victoryLine: []
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningLine = calculateWinner(current.squares);
    let winner = '';
    if(winningLine !== null){
      winner = current.squares[winningLine[0]]
    }

    //creates a jsx element that is a dynamic list
    //need key value for dynamic lists
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <p id="game-id">Game #{this.props.id}</p>
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            victoryLine={this.state.victoryLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol id="moves">{moves}</ol>
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
      
      return lines[i]; //returns the line
      //return squares[a]; //returns either X or O
    }
  }
  return null;
}

//Hmmmm this is my own work.
/* TODO: Add a win counter. May need to lift state to App so it knows when someone wins.*/
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameList: []
    }
    this.currentKey = 0;
  }

  addGame() {
    const gameList = this.state.gameList.slice();
    const id = this.currentKey;
    this.setState({
      gameList: gameList.concat([
        <Game id={id}/>
      ]),
    }
    );
    this.currentKey++;
  }

  resetGames() {
    this.setState({
      gameList: [],
    })
    this.currentKey = 0;
  }

  render() {
    const games = this.state.gameList.map((currentGame, index) => {
      return(
        <li key={index} className='individualGame'>
          <div> {currentGame}</div>
        </li>
      )
    })
    return(
      <div className='app'>
        <button onClick={() => this.addGame()}>Add game</button>
        <button onClick={() => this.resetGames()}>Reset games</button>
        <ul className='gameList' id='gameList'>{games}</ul>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);