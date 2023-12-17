module.exports = function (RED) {
  function PuppeteerRename(nodeConfig) {
    RED.nodes.createNode(this, nodeConfig);
    var node = this; // Referencing the current node

    this.on("input", async function (msg, send, done) {
      try {
        // Parsing the oldFilePath from string input or from msg object
        let oldFilePath =
          nodeConfig.oldFilePathtype != "str"
            ? eval(nodeConfig.oldFilePathtype + "." + nodeConfig.oldFilePath)
            : nodeConfig.oldFilePath;
        // If the type of oldFilePath is set to flow or global, it needs to be parsed differently
        if (
          nodeConfig.oldFilePathtype == "flow" ||
          nodeConfig.oldFilePathtype == "global"
        ) {
          // Parsing the oldFilePath
          oldFilePath = this.context()[nodeConfig.oldFilePathtype].get(
            nodeConfig.oldFilePathtype
          );
        }

        // Parsing the newFilePath from string input or from msg object
        let newFilePath =
          nodeConfig.newFilePathtype == "msg"
            ? eval(nodeConfig.newFilePathtype + "." + nodeConfig.newFilePath)
            : nodeConfig.newFilePath;
        // If the type of newFilePath is set to flow or global, it needs to be parsed differently
        if (
          nodeConfig.newFilePathtype == "flow" ||
          nodeConfig.newFilePathtype == "global"
        ) {
          // Parsing the newFilePath
          newFilePath = this.context()[nodeConfig.newFilePathtype].get(
            nodeConfig.newFilePath
          );
        }

        if(oldFilePath && newFilePath && oldFilePath != '' && newFilePath != '') {
          const fs = require('fs');
          fs.renameSync(oldFilePath, newFilePath);
        } else {
          throw 'Please enter a valid file path';
        }

        // oldFilePath clicked sucessfully
        node.status({
          fill: "green",
          shape: "dot",
          text: `Clicked ${oldFilePath}`,
        });
        // Sending the msg
        send(msg);
      } catch (e) {
        // If an error occured
        node.error(e);
        // Update the status
        node.status({ fill: "red", shape: "dot", text: e });
        // And update the message error property
        msg.error = e;
        send(msg);
      }

      // Clear status of the node
      setTimeout(
        () => {
          done();
          node.status({});
        },
        msg.error ? 10000 : 3000
      );
    });
    this.on("close", function () {
      node.status({});
    });
    oneditprepare: function oneditprepare() {
      $("#node-input-oldFilePath").val(nodeConfig.oldFilePath);
      $("#node-input-newFilePath").val(nodeConfig.newFilePath);
    }
  }
  RED.nodes.registerType("puppeteer-rename", PuppeteerRename);
};
