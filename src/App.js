import React, { Component } from 'react'
import { StreamChat } from './components/StreamChat';
import './css/App.css';

export default class App extends Component {

  render() {
    return (
      <div className="App">
        <StreamChat />
      </div>
    )
  }
}
