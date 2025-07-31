module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackHtmlToAnyNode(config) {
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
            const html = msg.payload?.html || config.html;
            const url = msg.payload?.url || config.url;
            const type = msg.payload?.type || config.type;
            const width = msg.payload?.width || config.width;
            const height = msg.payload?.height || config.height;
            const full_page = msg.payload?.full_page || config.full_page;

            if (!html && !url) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide html or a URL in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Converting HTML..."});
            try {
                const result = await jigsawstack.web.html_to_any({
                    html: html,
                    url: url,
                    type: type,
                    width: width,
                    height: height,
                    full_page: full_page,
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

    RED.nodes.registerType("jigsawstack-html-to-any", JigsawStackHtmlToAnyNode);
}
