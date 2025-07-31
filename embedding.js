module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackEmbeddingNode(config) {
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
            const token_overflow_mode = msg.payload?.token_overflow_mode || config.token_overflow_mode;

            if (!text && !url) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide text or a URL in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Generating embedding..."});
            try {
                const result = await jigsawstack.embedding({
                    text: text,
                    url: url,
                    type: type,
                    token_overflow_mode: token_overflow_mode,
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

    RED.nodes.registerType("jigsawstack-embedding", JigsawStackEmbeddingNode);
}
