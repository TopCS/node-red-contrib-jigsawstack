module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackWebSearchNode(config) {
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
            const query = msg.payload?.query || config.query;
            const safe_search = msg.payload?.safe_search || config.safe_search;

            if (!query) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide a query in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Searching..."});
            try {
                const result = await jigsawstack.web.search({
                    query: query,
                    safe_search: safe_search,
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

    RED.nodes.registerType("jigsawstack-web-search", JigsawStackWebSearchNode);
}
