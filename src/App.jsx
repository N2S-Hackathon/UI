import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Noise2Signal Hackathon</h1>
        <p>Welcome to your React project!</p>
        
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        
        <p className="description">
          Edit <code>src/App.jsx</code> and save to test hot module replacement.
        </p>
      </header>
    </div>
  )
}

export default App

