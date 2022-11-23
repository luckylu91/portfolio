import React, { useRef, useState } from 'react';
import { Movement, parseMovementString } from './animations/rubik/utils';
import { RubikSliderAnimation } from './animations/RubikSliderAnimation';
import './App.css';
import logo from './logo.svg';

function App() {
  let [movements, setMovements] = useState<Movement[]>([]);
  let inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null);

  //forceUpdate
  let [_count, updateCount] = useState(0);
  const forceUpdate = () => updateCount(value => value + 1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value  = inputRef.current!.value;
    const parsedMovements = parseMovementString(value);
    if (parsedMovements === null) {
      console.error("Invalid movements string");
    }
    else {
      setMovements(parsedMovements);
    }
    forceUpdate();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text"/>
        <input type="submit"/>
      </form>
      {/* <ScrollAnimation draw={draw}></ScrollAnimation> */}
      {/* <RubikAnimation size={500} movementNotation={movementNotation}/> */}
      <RubikSliderAnimation size={500} movements={movements}/>
      <div id="d"></div>
    </div>
  );
}

export default App;
