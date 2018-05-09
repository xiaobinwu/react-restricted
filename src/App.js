import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Button } from 'antd';
import logo from './logo.svg';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div styleName="App">
        <header styleName="App-header">
          <img src={logo} styleName="App-logo" alt="logo" />
          <h1 styleName="App-title">Welcome to React</h1>
        </header>
        <p styleName="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button type="primary">Button</Button>
        <div styleName="App-img"></div>
      </div>
    );
  }
}

export default CSSModules(App, styles);