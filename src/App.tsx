import React, { useRef, useState, useContext, useEffect } from 'react';
import { Movement, parseMovementString } from './animations/rubik/utils/movements';
import { RubikScrollAnimation } from './animations/RubikScrollAnimation';
import './App.css';
import { Sections } from './content/Sections';
import { Box } from '@mui/system';

export type ScrollState = {
  alpha: number,
  maxScrollY: number,
}

function App() {

  return (
    <div className="App">
      <Box sx={{
        width: "calc(100% - 10em)",
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Sections />
      </Box>
      <Box sx={{
        width: "10em",
        right: 0,
        position: "fixed",
        top: 0,
        bottom:0,
      }}>
        <RubikScrollAnimation movementString={"UFMES"}/>
      </Box>
    </div>
  );
}

export default App;
