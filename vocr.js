module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackVocrNode(config) {
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
            const prompt = msg.payload?.prompt || config.prompt;
            const url = msg.payload?.url || config.url;

            if (!prompt) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide a prompt in the message payload or node configuration.");
                return;
            }

            if (!url) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide a URL in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Extracting text..."});
            try {
                const result = await jigsawstack.vision.vocr({
                    prompt: prompt,
                    url: url,
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

    RED.nodes.registerType("jigsawstack-vocr", JigsawStackVocrNode);
}
