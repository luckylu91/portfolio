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
  // let [scrollState, setScrollState] = useState<ScrollState>({
  //   alpha: 0,
  //   maxScrollY: 0,
  // })

  // // optimisation with regard to requestAnimationFrame;
  // const handleScroll = () => {
  //   const maxScrollY = Math.max(
  //     document.body.scrollHeight,
  //     document.body.offsetHeight,
  //     document.documentElement.clientHeight,
  //     document.documentElement.scrollHeight,
  //     document.documentElement.offsetHeight
  //   ) - window.innerHeight;
  //   const scrollY = window.scrollY;
  //   setScrollState({
  //     alpha: scrollY / maxScrollY,
  //     maxScrollY: maxScrollY,
  //   });
  // }

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll)
  //   };
  // }, []);

  // useEffect(() => handleScroll(), []);

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
        height: "100%",
        right: 0,
        position: "fixed",
        top: 0,
      }}>
        <RubikScrollAnimation movementString={"UFMES"}/>
      </Box>
    </div>
  );
}

export default App;
