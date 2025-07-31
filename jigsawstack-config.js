module.exports = function(RED) {
    "use strict";
    function JigsawStackConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.apiKey = this.credentials.apiKey;
        this.name = n.name;
    }
    RED.nodes.registerType("jigsawstack-config", JigsawStackConfigNode, {
        credentials: {
            apiKey: {type:"password"}
        }
    });
}