import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';
import md5 from 'md5';
import { publicKey, privateKey } from './constants/apikeys'

const client = {
  marvel: axios.create({
    baseURL: 'https://gateway.marvel.com:443/v1/public/',
    responseType: 'json',
  }),
}

class App extends Component {
  componentDidMount() {
    const ts = new Date().getTime()
    const hash = md5(`${ts}${privateKey}${publicKey}`) //https://developer.marvel.com/documentation/authorization
    client.marvel.get('/characters', {
      params: {
        name: 'HULK',
        ts,
        apikey: publicKey,
        hash,
      }})
    .then(function (response) {
      console.log(response);
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Button variant="contained" color="primary">
            Hello World
          </Button>
        </header>
      </div>
    );
  }
}

export default App;
