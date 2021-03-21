import React, { Component } from 'react'
import { TwitchChat } from './twitch-chat';
import './App.css';

export default class App extends Component {

  render() {
    return (
      <div className="App">
        <TwitchChat newMessageReceived={this.newMessageReceived} />
      </div>
    )
  }
}
