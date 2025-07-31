module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackSpeechToTextNode(config) {
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
            const language = msg.payload?.language || config.language;
            const translate = msg.payload?.translate || config.translate;
            const by_speaker = msg.payload?.by_speaker || config.by_speaker;

            if (!url) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide a URL in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Transcribing..."});
            try {
                const result = await jigsawstack.audio.speech_to_text({
                    url: url,
                    language: language,
                    translate: translate,
                    by_speaker: by_speaker,
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

    RED.nodes.registerType("jigsawstack-speech-to-text", JigsawStackSpeechToTextNode);
}
