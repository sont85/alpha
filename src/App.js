import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { TextField, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import md5 from 'md5';
import { publicKey, privateKey } from './constants/apikeys'

// TESTING
const client = axios.create({
  baseURL: 'https://gateway.marvel.com:443/v1/public/',
  responseType: 'json',
  params: {
    apikey: publicKey,
  }
})

const getHash = () => {
  const ts = new Date().getTime()
  const hash = md5(`${ts}${privateKey}${publicKey}`)
  return { hash, ts }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      characterName: null,
      characterList: [],
      descriptionInfo: null,
      tabPage: 0,
    }
  }
  componentDidMount() {
    this.fetchCharacterList('a')
  }
  fetchCharacterList(searchText) {
    const { ts, hash } = getHash()
    client.get('/characters', { 
      params: {
        ts,
        hash,
        limit: 50,
        nameStartsWith: searchText,
      }
    }).then((response) => {
      console.log(response)
      this.setState({
        characterList: response.data.data.results
      })
    })
  }

  fetchCharacters(name) {
    const { ts, hash } = getHash()
    client.get('/characters', {
      params: {
        name,
        ts,
        hash,
        
      }
    }).then((response) => {
      console.log(response)
      if (response.data.data.results && response.data.data.results.length && response.data.data.results[0].name && response.data.data.results[0].description) {
        const { path, extension } = response.data.data.results[0].thumbnail
        this.setState({
          characterName: response.data.data.results[0].name,
          descriptionInfo: response.data.data.results[0].description,
          imageUrl: `${path}/portrait_xlarge.${extension}`
        })
      }
    })
  }
  handleCharactersChange = (e) => {
    const name = e.target.value
    this.fetchCharacters(name)
  }
  handleTabChange = (event, tabPage) => {
    this.setState({ tabPage: tabPage });
  };

  render() {
    return (
      <div>
        {this.state.tabPage === 0 &&
          <div>
            <TextField
              type="text"
              label="Characters Name"
              variant="filled"
              style={{ backgroundColor: '#e6ceff' }}
              onChange={(e) => {
                this.fetchCharacterList(e.target.value)
              }}
            />
            <h1>{this.state.characterName}</h1>
            <img src={this.state.imageUrl} />
            <p>{this.state.descriptionInfo}</p>
            {['a', 'b', 'c', 'd', 'z'].map((letter) => {
              return (
                <a
                  style={{ color: 'blue', cursor: 'pointer', margin: '5px' }}
                  onClick={() => this.fetchCharacterList(letter)} >{letter}
                </a>
              )
            })}
            {this.state.characterList.map((character) => (
              <li>{character.name}</li>
            ))}
          </div>
        }
        {this.state.tabPage === 1 &&
          <div>PAGE 1</div>
        }
        {this.state.tabPage === 2 &&
          <div>PAGE 2</div>
        }
        
        <BottomNavigation
          value={this.state.tabPage}
          onChange={this.handleTabChange}
          showLabels
        >
          <BottomNavigationAction label="Recents" />
          <BottomNavigationAction label="Favorites" />
          <BottomNavigationAction label="Nearby" />
        </BottomNavigation>
      </div>
    );
  }
}

export default App;
