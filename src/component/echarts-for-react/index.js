import echarts, { registerTheme } from 'echarts';
import theme from 'themes/echart/halloween';
import { connect } from 'react-redux';
import EchartsReactCore from './core';

// 默认ehart主题
registerTheme('halloween', theme);

// export the Component the echarts Object.
class EchartsReact extends EchartsReactCore {
    constructor(props) {
        super(props);
        this.echartsLib = echarts;
    }
}
const stateToProps = ({ themeState }) => ({
    theme: themeState.theme
});

export default connect(stateToProps)(EchartsReact);