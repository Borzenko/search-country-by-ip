import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchIpAddressInformation } from "./index";

// Mock fetch globally
global.fetch = vi.fn();

describe("fetchIpAddressInformation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return IP information when the API response is successful", async () => {
    const mockResponse = {
      country: "United States",
      countryCode: "US",
      timezone: "America/New_York",
    };

    (fetch as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchIpAddressInformation("8.8.8.8");
    expect(result).toEqual({
      country: "United States",
      countryCode: "US",
      timezone: "America/New_York",
    });
    expect(fetch).toHaveBeenCalledWith("http://ip-api.com/json/8.8.8.8");
  });

  it("should throw an error when the API response status is fail", async () => {
    const mockResponse = {
      status: "fail",
      message: "Invalid IP address",
    };

    (fetch as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    await expect(fetchIpAddressInformation("invalid-ip")).rejects.toThrow(
      "Invalid IP address"
    );
    expect(fetch).toHaveBeenCalledWith("http://ip-api.com/json/invalid-ip");
  });

  it("should throw an error when the fetch call fails", async () => {
    (fetch as vi.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchIpAddressInformation("8.8.8.8")).rejects.toThrow(
      "Network error"
    );
    expect(fetch).toHaveBeenCalledWith("http://ip-api.com/json/8.8.8.8");
  });
});
