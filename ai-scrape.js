module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackAiScrapeNode(config) {
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
            const element_prompts = msg.payload?.element_prompts || config.element_prompts;
            const selectors = msg.payload?.selectors || config.selectors;
            const root_element_selector = msg.payload?.root_element_selector || config.root_element_selector;

            if (!url) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide a URL in the message payload or node configuration.");
                return;
            }

            if (!element_prompts) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide element prompts in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Scraping..."});
            try {
                const result = await jigsawstack.web.ai_scrape({
                    url: url,
                    element_prompts: element_prompts,
                    selectors: selectors,
                    root_element_selector: root_element_selector,
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

    RED.nodes.registerType("jigsawstack-ai-scrape", JigsawStackAiScrapeNode);
}
