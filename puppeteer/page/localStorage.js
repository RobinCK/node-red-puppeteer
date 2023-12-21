module.exports = function (RED) {
  function PuppeteerPageLocalstorage(nodeConfig) {
    RED.nodes.createNode(this, nodeConfig);
    var node = this; // Referencing the current node

    this.on("input", async function (msg, send, done) {
      try {
        await msg.puppeteer.page.evaluate((c) => {
          window.localStorage.setItem(c.key, c.value);
        }, nodeConfig);
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
      $("#node-input-waitUntil").val(this.waitUntil);
    }
  }
  RED.nodes.registerType("puppeteer-page-localstorage", PuppeteerPageLocalstorage);
};
