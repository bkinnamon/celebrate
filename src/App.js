import React from 'react';
import './App.css';
import { Button } from './components/Button';
import startFireworks from './fireworks';

function App() {
  return (
    <div className="App">
      <canvas className="canvas" id="fireworks"></canvas>
      <Button className="button--celebrate" onClick={startFireworks}>Celebrate</Button>
    </div>
  );
}

export default App;
