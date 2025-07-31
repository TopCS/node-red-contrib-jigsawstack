module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackProfanityNode(config) {
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
            const censor_replacement = msg.payload?.censor_replacement || config.censor_replacement;

            if (!text) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide text in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Checking for profanity..."});
            try {
                const result = await jigsawstack.validate.profanity({
                    text: text,
                    censor_replacement: censor_replacement,
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

    RED.nodes.registerType("jigsawstack-profanity", JigsawStackProfanityNode);
}
