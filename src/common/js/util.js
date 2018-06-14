// 解析当前url的query 参数
const getQueryString = (href) => {
    const url = String(href === undefined ? window.location.href : href).replace(/#.*$/, '');
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        const query = String(decodeURIComponent($2));
        obj[name] = query;
        return rs;
    });
    return obj;
};

const roundNumber = (num, dec = 1) => {
    const result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec); // eslint-disable-line
    let resultString = result.toString();
    if (resultString.indexOf('.') === -1) {
        resultString = `${resultString}.0`;
    }
    return resultString;
};

export {
    getQueryString,
    roundNumber
};
