import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.css';

class Dubbo extends Component {
    state = {

    };
    render() {
        return (
            <div className="forDubbo"></div>
        );
    }
}

export default CSSModules(Dubbo, styles);
