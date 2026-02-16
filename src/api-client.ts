import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const API_URL = process.env.ODYBOOK_API_URL || "https://odybook.com/api";
const API_KEY = process.env.ODYBOOK_API_KEY;

export class ApiClient {
  private async request(path: string, options: RequestInit = {}) {
    const url = `${API_URL}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (API_KEY) {
      headers["Authorization"] = `Bearer ${API_KEY}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `API Request failed with status ${response.status}`);
    }

    return response.json();
  }

  /**
   * Search for experiences/tours
   */
  async searchTours(location?: string, date?: string) {
    // Note: This calls the MCP-specific route on the web server which is already optimized for this
    // If you prefer REST, you could call /api/public/experiences?org=... but MCP route is internal auth
    return this.mcpCall("search_tours", { location, date });
  }

  /**
   * Check availability for a specific tour
   */
  async checkAvailability(experience_id: string, date: string, pax: number) {
    return this.mcpCall("check_availability", { experience_id, date, pax });
  }

  /**
   * Create a booking hold
   */
  async createBookingHold(params: any) {
    return this.mcpCall("create_booking_hold", params);
  }

  /**
   * Execute an MCP tool on the remote server
   * We use the remote /api/mcp as the source of truth
   */
  private async mcpCall(method: string, params: any) {
    const body = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: method,
        arguments: params,
      }
    };

    const response = await this.request("/mcp", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // Handle JSON-RPC response format
    if (response.error) {
      throw new Error(response.error.message || "Remote MCP call failed");
    }

    // The remote server returns tool results in { content: [...] }
    return response.result;
  }
}

export const apiClient = new ApiClient();
