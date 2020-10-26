const { injectBabelPlugin } = require("react-app-rewired");
const rewireLess = require("react-app-rewire-less");

module.exports=(config,env)=>{
    config = injectBabelPlugin(
        ['import',{libraryName: 'antd', libraryDirectory: 'es', style: 'css'}],
        config,
    );
    config = rewireLess.withLoaderOptions({
        modifyVars: {"@primary-color":"#1Da57A"},
        javascriptEnabled: true,
    })(config,env);
    return config;
}