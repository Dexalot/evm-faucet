/* eslint-disable no-unused-vars */
var zipdir = require("zip-dir")
const fs = require('fs')

console.log(process.argv)

// for ProcFile
fs.writeFileSync("./dist/Procfile", "web: node src/server/index.js");

zipdir(
    process.argv[3],
  {
    saveTo: "./faucet-release-" + process.argv[2] + ".zip",
    filter: (path, stat) => !/node_modules|\.env*|\.git|\.zip$/.test(path)
  },
  function(err, buffer) {
    console.log("Done zipping release binaries");
  },
  function(err, buffer) {
    console.log(err)
  }
)
