import { RubikScrollAnimation } from './animations/RubikScrollAnimation';
import './App.css';
import { Box } from '@mui/system';
import { Header } from './content/header/Header';
import { Main } from './content/main/Main';
import { Footer } from './content/footer/Footer';
import { UnderFooter } from './content/footer/Underfooter';
import { useEffect } from 'react';

export type ScrollState = {
  alpha: number,
  maxScrollY: number,
}

function App() {

  // const movementString = generateMovementString();
  // useEffect(() => {

  // }, []);

  return (
    <div className="App">
      <Header/>
      <Main/>
      <Footer/>
      <UnderFooter/>
      <RubikScrollAnimation movementString={"UFMES"}/>
    </div>
  );
}

export default App;
