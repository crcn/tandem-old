module.exports = {
  port: (process.env.PORT || 8080),
  vscode: {
    tandemcodeDirectory: __dirname + "/../../../tandem-app/",
    devServerScript: ["node", "../../../tandem-paperclip-dev-tools"] 
  },
}