import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ScrollAnimation } from './animations/ScrollAnimation';
import { RubikAnimation } from './animations/rubik/RubikAnimation';

// function draw(ctx: CanvasRenderingContext2D, scrollFactor: number) {
//   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//   let r = Math.floor(scrollFactor * 255).toString()
//   let g = Math.floor((1-scrollFactor) * 255).toString()
//   let b = Math.floor(scrollFactor * 255).toString()
//   ctx.fillStyle = `rgb(${r},${g},${b})`
//   ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//   ctx.fillStyle = "black";
//   ctx.fillRect(70 * (-Math.cos(scrollFactor * Math.PI) + 1) / 2, 35 + Math.sin(scrollFactor * Math.PI) * 15, 30, 30);
//   // ctx.fillText(scrollFactor.toString(), 50, 50);
// }

function App() {
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
      {/* <ScrollAnimation draw={draw}></ScrollAnimation> */}
      <RubikAnimation size={500}/>
      <div id="d"></div>
    </div>
  );
}

export default App;
