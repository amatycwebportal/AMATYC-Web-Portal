import request from "supertest";
import app from "../src/app";
import { describe, test, expect } from "vitest";
describe("API tests", () => {

  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
})

describe("Rubric pulling", () => {
  test("Pull all rubrics", async () => {
    const response = await request(app).get("/rubrics/all");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
