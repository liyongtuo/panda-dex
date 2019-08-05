const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, '.', dir);
}

function getLoader(rules, matcher) {
    let match;

    rules.some(rule => {
        return (match = matcher(rule)
            ? { rules, rule }
            : getLoader(rule.use || rule.oneOf || [], matcher));
    });

    return match;
};

function deepClone(object) {
    return JSON.parse(JSON.stringify(object));
}

module.exports = function override(config, env) {

    config = injectBabelPlugin('babel-plugin-transform-decorators-legacy', config);
    
    // config antd or antd-mobile
    config = injectBabelPlugin([
        'import', {
            libraryName: 'antd', 
            libraryDirectory: 'es',
            style: 'css'
        }
    ], config);

    // config stylus
    config = ((config, env) => {
        const { rule: cssRule, rules } = getLoader(
            config.module.rules,
            rule => String(rule.test) === String(/\.css$/)
        );
    
        const stylusRule = deepClone(cssRule);
        stylusRule.test = /\.styl$/;
        if (env === 'production') {
            stylusRule.loader.splice(3, 0, require.resolve('stylus-loader'));
        } else {
            stylusRule.use.splice(2, 0, require.resolve('stylus-loader'));
        }
        rules.splice(rules.indexOf(cssRule), 0, stylusRule);
    
        return config;
    })(config, env);

    config = rewireLess.withLoaderOptions({
        modifyVars: {
            "@primary-color": "#8ea0f5"
        }
    })(config, env);

    config.resolve.alias = {
        '@': resolve('src')
    };

    config = rewireReactHotLoader(config, env)

    // config.server.port = '3001'

    return config;
};