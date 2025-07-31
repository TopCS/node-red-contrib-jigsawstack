module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackTextToSpeechNode(config) {
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
            const accent = msg.payload?.accent || config.accent;
            const voice_clone_id = msg.payload?.voice_clone_id || config.voice_clone_id;

            if (!text) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide text in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Converting to speech..."});
            try {
                const result = await jigsawstack.audio.text_to_speech({
                    text: text,
                    accent: accent,
                    voice_clone_id: voice_clone_id,
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

    RED.nodes.registerType("jigsawstack-text-to-speech", JigsawStackTextToSpeechNode);
}
