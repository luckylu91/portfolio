import { RubikScrollAnimation } from './animations/RubikScrollAnimation';
import './App.css';
import { Box } from '@mui/system';
import { Header } from './content/header/Header';
import { Main } from './content/main/Main';
import { Footer } from './content/footer/Footer';
import { UnderFooter } from './content/footer/Underfooter';
import { useEffect } from 'react';
import { generateMovementString } from './animations/rubik/utils/generate';

export type ScrollState = {
  alpha: number,
  maxScrollY: number,
}

function App() {

  // let movementString: string | undefined;
  // useEffect(() => {
  //   movementString = generateMovementString();
  // }, [])

  return (
    <div className="App">
      <div className="content">
        <Header/>
        <Main/>
      </div>
      <Footer/>
      <div className="rubik-container">
        <RubikScrollAnimation movementString={generateMovementString()}/>
        {/* <RubikScrollAnimation movementString={"FF"}/> */}
      </div>
    </div>
  );
}

export default App;
