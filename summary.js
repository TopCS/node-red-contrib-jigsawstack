module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackSummaryNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const configNode = RED.nodes.getNode(config.jigsawstackConfig);

        if (!configNode || !configNode.apiKey) {
            node.status({fill:"red", shape:"dot", text:"API Key not configured"});
            node.error("API Key not configured. Please create and configure a JigsawStack config node.");
            return;
        }

        const jigsawstack = JigsawStack({ apiKey: configNode.apiKey });

        node.on('input', async function(msg) {
            const text = msg.payload?.text || config.text;
            const url = msg.payload?.url || config.url;
            const type = msg.payload?.type || config.type;

            if (!text && !url) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide text or a URL in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Summarizing..."});
            try {
                const result = await jigsawstack.summary({
                    text: text,
                    url: url,
                    type: type,
                });
                node.status({fill:"green", shape:"dot", text:"Done"});
                msg.payload = result;
                node.send(msg);
            } catch (error) {
                node.status({fill:"red", shape:"dot", text:error.message});
                node.error(error.message, msg);
            }
        });
    }

    RED.nodes.registerType("jigsawstack-summary", JigsawStackSummaryNode);
}
