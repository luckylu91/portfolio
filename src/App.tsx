import React, { useRef, useState } from 'react';
import { Movement, parseMovementString } from './animations/rubik/utils/movements';
import { RubikScrollAnimation } from './animations/RubikScrollAnimation';
import './App.css';
import logo from './logo.svg';
import { Section } from './Section';

function App() {
  let [movements, setMovements] = useState<Movement[]>([]);
  let inputRef: React.MutableRefObject<HTMLInputElement | null> = useRef(null);


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
  }

  return (
    <div className="App">
      {/* <header className="App-header">
      </header> */}
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} type="text"/>
        <input type="submit"/>
      </form>
      <RubikScrollAnimation size={500}/>
      <Section title="Jeux-vidéo">
        <p>
            J'aime les jeux vidéo depuis que je suis petit.
        </p>
      </Section>
    </div>
  );
}

export default App;
