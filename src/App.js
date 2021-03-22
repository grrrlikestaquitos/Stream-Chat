import React, { Component } from 'react'
import { TwitchChat } from './components/TwitchChat';
import './css/App.css';

export default class App extends Component {

  render() {
    return (
      <div className="App">
        <TwitchChat newMessageReceived={this.newMessageReceived} />
      </div>
    )
  }
}
