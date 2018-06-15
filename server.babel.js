// enable runtime transpilation to use ES6/7 in node
// babel registration (runtime transpilation for node)

// target a specific .babelrc for configuration

const fs = require('fs');
// the fs module provides read/write access to the filesystem
const babelrc = fs.readFileSync('./.babelrc');
// fs.readFileSync function > read this specific './.babelrc' from the file system

let config;
try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

require('babel-register')(config);

//   * (Require hook) > (require('babel-register')) : 
//     - All subsequent files required by node with the extensions .es6, .es, .jsx and .js will be transformed by Babel. 
//     - The polyfill specified in polyfill is also automatically required.


// Babel Lookup behavior:
// 
//   * Babel will look for a .babelrc in the current directory of the file being transpiled. 
//     If one does not exist, it will travel up the directory tree until it finds either a .babelrc, 
//     or a package.json with a "babel": {} hash within.
// 
//   * Use "babelrc": false in options to stop lookup behavior, or provide the --no-babelrc CLI flag.