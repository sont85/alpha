import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { TextField } from '@material-ui/core';

import md5 from 'md5';
import { publicKey, privateKey } from './constants/apikeys'

const client = {
  marvel: axios.create({
    baseURL: 'https://gateway.marvel.com:443/v1/public/',
    responseType: 'json',
    params: {
      apikey: publicKey,
    }
  }),
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      characterName: null,
      characterList: []
    }
  }
  componentDidMount() {
    const ts = new Date().getTime()
    const hash = md5(`${ts}${privateKey}${publicKey}`) //https://developer.marvel.com/documentation/authorization
    client.marvel.get('/characters', {
      params: {
        ts,
        hash,
        limit: 50,
      }
    }).then((response) => {
      console.log(response)
      this.setState({
        characterList: response.data.data.results.map((char) => {
          return char.name
        })
      })
    })
  }
  fetchCharacters(name) {
    const ts = new Date().getTime()
    const hash = md5(`${ts}${privateKey}${publicKey}`)
    client.marvel.get('/characters', {
      params: {
        name,
        ts,
        hash,
      }
    }).then((response) => {
      console.log(response)
      if (response.data.data.results && response.data.data.results.length && response.data.data.results[0].name) {
        this.setState({
          characterName: response.data.data.results[0].name
        })
      }
    })
  }
  handleCharactersChange = (e) => {
    const name = e.target.value
    this.fetchCharacters(name)
  }
  render() {
    return (
      <div>
        <TextField
          type="text"
          label="Characters Name"
          variant="filled"
          style={{ backgroundColor: '#e6ceff' }}
          onChange={this.handleCharactersChange}
        />
        {this.state.characterList.map((character) => (
          <li>{character}</li>
        ))}
      </div>
    );
  }
}

export default App;
