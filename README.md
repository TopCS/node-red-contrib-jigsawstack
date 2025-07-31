# JigsawStack Node-RED Nodes

This repository contains a collection of Node-RED nodes that provide integration with JigsawStack's powerful AI and data processing APIs. These nodes allow you to easily incorporate various AI capabilities into your Node-RED flows.

## Available Nodes

This collection includes the following nodes:

- **AI Scrape**: Scrape websites with AI.
- **Embedding**: Generate embeddings for text.
- **HTML to Any**: Convert HTML to PDF, PNG, or JPEG.
- **Image**: Generate images from text.
- **NSFW**: Detect NSFW content in images.
- **Object Detection**: Detect objects in images.
- **Profanity**: Detect profanity in text.
- **Sentiment**: Analyze the sentiment of text.
- **Spam**: Detect spam in text.
- **Speech-to-Text**: Transcribe audio to text.
- **Spell**: Check spelling.
- **Summary**: Summarize text.
- **Text-to-Speech**: Convert text to speech.
- **Text-to-SQL**: Convert text to SQL.
- **Translate Image**: Translate text in images.
- **Translate Text**: Translate text.
- **VOCR**: OCR for videos.
- **Web Search**: Search the web.
- **Web Suggestion**: Get web suggestions.

## Prerequisites

- Node-RED instance
- JigsawStack API key

## Installation

1. Navigate to the `node-red-jigsawstack` directory:
   ```bash
   cd node-red-jigsawstack
   ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Link the node to your Node-RED installation:
    ```bash
    npm link
    ```
4. Restart your Node-RED instance.

## Usage

1. Add any of the JigsawStack nodes to your flow.
2. Double-click the node to open its configuration.
3. Click the pencil icon to add a new JigsawStack configuration.
4. Enter your JigsawStack API key.
5. Provide the payload for the API call in `msg.payload`. The payload should be a JSON object containing the parameters for the selected endpoint.
6. Connect the node to other nodes in your flow. The output of the API call will be in `msg.payload`.

## Resources

- [JigsawStack Documentation](https://docs.jigsawstack.com)
- [Node-RED Documentation](https://nodered.org/docs/)

## Support

For support with these nodes:
- Open an issue on [GitHub](https://github.com/JigsawStack/node-red-jigsawstack/issues)

## License

[MIT](LICENSE.md)