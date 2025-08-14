import React from "react";
// import logo from './logo.svg';
import "./App.css";

type User = {
  name: string;
  imageUrl: string;
  imageSize: number;
};

const user: User = {
  name: "Hedy Lamarr",
  imageUrl: "https://i.imgur.com/yXOvdOSs.jpg",
  imageSize: 120,
};

function MyButton() {
  return <button>I'm a button</button>;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
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
        </a> */}
        <h1>{user.name}</h1>
        <img
          src={user.imageUrl}
          alt={`avatar ${user.name}`}
          style={{ width: user.imageSize, height: user.imageSize }}
        />
        <MyButton />
      </header>
    </div>
  );
}

export { MyButton, App };
// export default App;
