#!/usr/bin/env node

var args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`No command argument`);
  console.log(`usage: "build-scripts <command>"`);
  console.log(`commands:`);
  console.log(`start - Runs the widget in the HSC dev shell.`);
  console.log(`build-widget - Builds the widget.`);
  console.log(`build-lib - Builds the widget as a library.`);
  console.log(`tests - Tests the widget using jest.`);
  console.log(`upload - Uploads the widget to the HSC content server.`);
  console.log(`remove - Removes the widget from the local content server.`);
  process.exit(0);
}

switch (args[0]) {
  case "build": {
    import("../scripts/build.js");
    break;
  }
  default: {
    console.log(`Unknown script command: '${args[0]}'`);
    process.exit(1);
  }
}
