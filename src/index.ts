#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { apiClient } from "./api-client.js";

const server = new McpServer({
  name: "odybook-mcp-server",
  version: "1.0.0",
});

/**
 * Tool: search_tours
 */
server.tool(
  "search_tours",
  {
    location: z.string().optional().describe("Location filter (city or country name)"),
    date: z.string().optional().describe("Optional date to check availability (YYYY-MM-DD)"),
  },
  async ({ location, date }) => {
    try {
      const result = await apiClient.searchTours(location, date);
      return result;
    } catch (error: any) {
      return { 
        content: [{ type: "text", text: `Error: ${error.message}` }], 
        isError: true 
      };
    }
  }
);

/**
 * Tool: check_availability
 */
server.tool(
  "check_availability",
  {
    experience_id: z.string().describe("UUID of the experience"),
    date: z.string().describe("Date (YYYY-MM-DD)"),
    pax: z.number().min(1).describe("Number of guests"),
  },
  async ({ experience_id, date, pax }) => {
    try {
      const result = await apiClient.checkAvailability(experience_id, date, pax);
      return result;
    } catch (error: any) {
      return { 
        content: [{ type: "text", text: `Error: ${error.message}` }], 
        isError: true 
      };
    }
  }
);

/**
 * Tool: create_booking_hold
 */
server.tool(
  "create_booking_hold",
  {
    experience_id: z.string().describe("UUID of the experience"),
    date: z.string().describe("Date (YYYY-MM-DD)"),
    pax: z.number().min(1).describe("Number of guests"),
    customer_name: z.string().describe("Customer full name"),
    customer_email: z.string().email().describe("Customer email"),
  },
  async (params) => {
    try {
      const result = await apiClient.createBookingHold(params);
      return result;
    } catch (error: any) {
      return { 
        content: [{ type: "text", text: `Error: ${error.message}` }], 
        isError: true 
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log to stderr as stdout is used for MCP messages
  console.error("Odybook MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
