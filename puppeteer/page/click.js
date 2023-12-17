module.exports = function (RED) {
  function PuppeteerPageClick(nodeConfig) {
    RED.nodes.createNode(this, nodeConfig);
    // Parse the click count to integer
    nodeConfig.clickCount = parseInt(nodeConfig.clickCount);
    var node = this; // Referencing the current node

    this.on("input", async function (msg, send, done) {
      try {
        // Parsing the selector from string input or from msg object
        let selector =
          nodeConfig.selectortype != "str"
            ? eval(nodeConfig.selectortype + "." + nodeConfig.selector)
            : nodeConfig.selector;
        // If the type of selector is set to flow or global, it needs to be parsed differently
        if (
          nodeConfig.selectortype == "flow" ||
          nodeConfig.selectortype == "global"
        ) {
          // Parsing the selector
          selector = this.context()[nodeConfig.selectortype].get(
            nodeConfig.selectortype
          );
        }

        // Waiting for the specified selector
        node.status({
          fill: "blue",
          shape: "ring",
          text: `Wait for ${selector}`,
        });
        await msg.puppeteer.page.waitForSelector(selector);

        // Clicking on the specified selector
        node.status({ fill: "blue", shape: "dot", text: `Click ${selector}` });
        await msg.puppeteer.page.click(selector, nodeConfig);

        // Selector clicked sucessfully
        node.status({
          fill: "green",
          shape: "dot",
          text: `Clicked ${selector}`,
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
      setTimeout(() => {
        done();
        node.status({});
      }, (msg.error) ? 10000 : 3000);
    });
    this.on("close", function () {
      node.status({});
    });
    oneditprepare: function oneditprepare() {
      $("#node-input-clickCount").val(nodeConfig.clickCount);
      $("#node-input-delay").val(nodeConfig.delay);
      $("#node-input-button").val(nodeConfig.button);
      $("#node-input-name").val(nodeConfig.name);
    }
  }
  RED.nodes.registerType("puppeteer-page-click", PuppeteerPageClick);
};
