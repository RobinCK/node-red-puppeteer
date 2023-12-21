module.exports = function (RED) {
  function PuppeteerPageViewport(config) {
    RED.nodes.createNode(this, config);
    var node = this; // Referencing the current node

    this.on("input", async function (msg, send, done) {
      try {
        // Capturing screen
        node.status({
          fill: "blue",
          shape: "dot",
          text: `Change viewport ...`,
        });
        await msg.puppeteer.page.setViewport({
          width: parseInt(config.width),
          height: parseInt(config.height),
          deviceScaleFactor: parseInt(config.scale)
        });

        // Screen captured
        node.status({ fill: "green", shape: "dot", text: `viewport changed` });
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
      setTimeout(() => {
        done();
        node.status({});
      }, (msg.error) ? 10000 : 3000);
    });
    this.on("close", function () {
      node.status({});
    });
    oneditprepare: function oneditprepare() {
      $("#node-input-name").val(this.name);
    }
  }
  RED.nodes.registerType("puppeteer-page-viewport", PuppeteerPageViewport);
};
