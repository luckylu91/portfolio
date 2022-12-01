import { Grid } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Movement, parseMovementString } from './animations/rubik/utils/movements';
import { RubikScrollAnimation } from './animations/RubikScrollAnimation';
import './App.css';
import { Sections } from './content/Sections';

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
      <Grid container>
        <Grid item xs={10} lg={8}>
          <Sections />
        </Grid>
        <Grid item xs={0} lg={2}>
          <RubikScrollAnimation movementString={"UFMES"} size={500}/>
        </Grid>

      </Grid>
    </div>
  );
}

export default App;
