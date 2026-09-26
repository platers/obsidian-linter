// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
    ['@babel/plugin-transform-class-properties'],
    ['@babel/plugin-transform-private-methods'],
    ['@babel/plugin-transform-class-static-block'],
    ['@jteppinette/babel-plugin-import-glob'],
  ],
};
