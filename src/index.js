import renderApp from "./App";

// Test what exactly PostCSS plugins do!
//
// 1. Add plugins you want to check as dependencies
// 2. Add them to the config below
// 3. Modify the input CSS
const postcssConfig = {
  plugins: [
    require("postcss-calc"),
    require("postcss-color-function"),
    require("postcss-short")
  ]
};

renderApp(postcssConfig.plugins);
