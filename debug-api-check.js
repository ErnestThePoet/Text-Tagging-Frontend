const fs = require("fs");
const chalk = require("chalk");

const apisContent = fs.readFileSync("./modules/apis.ts").toString("utf8");

if (!apisContent.replace(/\s/g, "").includes("DEBUG:boolean=false")) {
    console.error(
        chalk.red("Debug API is used. Set DEBUG=false in modules/apis before build."));
    process.exit(1);
}
