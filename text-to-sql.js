module.exports = function(RED) {
    "use strict";
    const { JigsawStack } = require("jigsawstack");

    function JigsawStackTextToSqlNode(config) {
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
            const sql_schema = msg.payload?.sql_schema || config.sql_schema;
            const database = msg.payload?.database || config.database;

            if (!prompt) {
                node.status({fill:"red", shape:"dot", text:"Input missing"});
                node.error("Please provide a prompt in the message payload or node configuration.");
                return;
            }

            node.status({fill:"yellow", shape:"dot", text:"Converting to SQL..."});
            try {
                const result = await jigsawstack.text_to_sql({
                    prompt: prompt,
                    sql_schema: sql_schema,
                    database: database,
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

    RED.nodes.registerType("jigsawstack-text-to-sql", JigsawStackTextToSqlNode);
}
