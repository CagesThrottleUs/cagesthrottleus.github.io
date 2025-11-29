import { describe, expect, it } from "vitest";

import { URL_BLOG, URL_RESUME } from "./constants";

describe("URL Constants", () => {
  it("exports correct resume URL", () => {
    expect(URL_RESUME).toBe("/");
  });

  it("exports correct blog URL", () => {
    expect(URL_BLOG).toBe("/blog");
  });

  it("all URLs are strings", () => {
    expect(typeof URL_RESUME).toBe("string");
    expect(typeof URL_BLOG).toBe("string");
  });

  it("all URLs start with forward slash", () => {
    expect(URL_RESUME).toMatch(/^\//);
    expect(URL_BLOG).toMatch(/^\//);
  });
});
