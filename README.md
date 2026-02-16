# Odybook Model Context Protocol (MCP) Server

A professional-grade implementation of the Model Context Protocol (MCP) for Odybook, enabling AI assistants to interact directly with Odybook's experience management platform. This server acts as a secure proxy, providing AI tools for tour searching, availability verification, and booking management.

## Overview

The Odybook MCP server allows AI models (like Claude and ChatGPT) to perform real-time operations on the Odybook platform. It implements the standard MCP Toolkit, ensuring compatibility with any MCP-compliant client.

### Features

- **Experience Search**: Discover tours and activities by location and date.
- **Real-time Availability**: Verify slot capacity for specific dates and guest counts.
- **Booking Management**: Create temporary booking holds for customers.
- **Secure Integration**: Uses Odybook Partner API authentication.

## Prerequisites

- Node.js 18.x or higher
- An active Odybook Partner API Key
- Odybook API URL (default: `https://odybook.com/api`)

## Installation

1. Clone the repository and navigate to the directory:
   ```bash
   cd odybook-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

The server expects the following environment variables. You can define these in a `.env` file for development or pass them directly to the MCP client.

| Variable | Description |
|----------|-------------|
| `ODYBOOK_API_KEY` | (Optional) Your partner API key for protected routes like booking holds. |
| `ODYBOOK_API_URL` | The Odybook API endpoint (default: `https://odybook.com/api`). |

## Client Integration

### Claude Desktop

Claude Desktop provides native support for MCP servers. To integrate Odybook:

1. Locate your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the following to the `mcpServers` object:

```json
{
  "mcpServers": {
    "odybook": {
      "command": "node",
      "args": ["/absolute/path/to/odybook-mcp/dist/index.js"],
      "env": {
        "ODYBOOK_API_KEY": "YOUR_API_KEY_HERE",
        "ODYBOOK_API_URL": "https://odybook.com/api"
      }
    }
  }
}
```

3. Restart Claude Desktop.

### ChatGPT (Custom GPTs)

To use Odybook with ChatGPT, you can use the Odybook backend as a Custom Action.

1.  **Open Specification**: Use the provided OpenAPI spec at `specs/openapi.json`.
2.  **Create Action**: In your Custom GPT configuration, under "Actions", click "Create new action".
3.  **Import Schema**: Paste the content of `specs/openapi.json`.
4.  **Authentication**: Select "API Key" as the authentication type and "Bearer" as the auth scheme. Paste your `ODYBOOK_API_KEY`.
5.  **Test**: ChatGPT will now be able to call Odybook tools via the `/api/mcp` bridge.

## Marketplace Submission

This server is designed to meet the requirements for official MCP registries:

- **Safety Annotations**: All tools include clear descriptions and follow security best practices.
- **Vendor Neutrality**: Implements the standard Model Context Protocol without proprietary extensions.
- **Portability**: Verified to run on macOS and Windows via Node.js.

### Submission Links
- [Claude MCP Directory Form](https://modelcontextprotocol.io)
- [GPT Store Guidelines](https://openai.com/blog/introducing-the-gpt-store)

## Tool Reference

### `search_tours`
Search for experiences by location and date.
- **Arguments**:
  - `location` (string, optional): City or country name.
  - `date` (string, optional): Target date in `YYYY-MM-DD` format.

### `check_availability`
Verify if an experience has enough capacity for a given date.
- **Arguments**:
  - `experience_id` (string): UUID of the experience.
  - `date` (string): Date in `YYYY-MM-DD` format.
  - `pax` (number): Number of guests.

### `create_booking_hold`
Initiate a temporary booking hold.
- **Arguments**:
  - `experience_id` (string): UUID of the experience.
  - `date` (string): Target date.
  - `pax` (number): Number of guests.
  - `customer_name` (string): Customer's full name.
  - `customer_email` (string): Customer's email address.

## Development

Run the server in development mode with automatic reloading:
```bash
npm run dev
```

## Security

This server does not store any customer data. All requests are proxied directly to the Odybook backend. Ensure your `ODYBOOK_API_KEY` is kept secure and never committed to version control.
