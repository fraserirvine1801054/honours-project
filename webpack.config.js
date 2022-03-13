const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const CURRENT_WORKING_DIR = process.cwd();

module.exports = {
    entry: [path.join(CURRENT_WORKING_DIR, "index.js")],
    mode: "development",
    target: "node",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                //exclude: /(node_modules|bower_components)/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: { presets: ["@babel/preset-env", "@babel/preset-react"], plugins:["@babel/transform-runtime"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
        path: path.join(CURRENT_WORKING_DIR, "/dist"),
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    externals: [nodeExternals()],
    /*
    devServer: {
        contentBase: path.join(__dirname, "public/"),
        port: 3000,
        publicPath: "http://localhost:3000/dist/",
        hotOnly: true
    },
    */
    plugins: [new webpack.HotModuleReplacementPlugin()]
};