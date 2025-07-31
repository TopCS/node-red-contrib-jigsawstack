module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackTranslateImageNode(config) {
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
            const url = msg.payload?.url || config.url;
            const target_language = msg.payload?.target_language || config.target_language;

            if (!url) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide a URL in the message payload or node configuration.");
                return;
            }

            if (!target_language) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide a target language in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Translating image..."});
            try {
                const result = await jigsawstack.translate.image({
                    url: url,
                    target_language: target_language,
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

    RED.nodes.registerType("jigsawstack-translate-image", JigsawStackTranslateImageNode);
}
