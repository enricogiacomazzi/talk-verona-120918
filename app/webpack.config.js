
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: 'bundle.js',
        library: "biz"
    },
    devtool: 'eval-source-map',
    plugins: []
    
};