import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Button } from 'antd';
import Dynamic from 'charts/Dynamic';
import logo from 'src/logo.svg';
import styles from './App.css';

class App extends Component {
  render() {
    return (
      <div styleName="App">
        <header styleName="App-header">
          <img src={logo} styleName="App-logo" alt="logo" />
          <h1 styleName="App-title">欢迎进入服务治理平台</h1>
        </header>
        <p styleName="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button type="primary">Button</Button>
        <div styleName="App-img"></div>
        <Dynamic/>
      </div>
    );
  }
}

export default CSSModules(App, styles);