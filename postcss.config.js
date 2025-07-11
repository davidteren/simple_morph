export default {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    require('cssnano')({ preset: 'default' })
  ]
};
