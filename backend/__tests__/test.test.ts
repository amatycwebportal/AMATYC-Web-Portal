import request from "supertest";
import { app } from "../src/server";
import { describe, test, expect } from "vitest";
describe("API tests", () => {

  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("POST /add returns sum", async () => {
    const res = await request(app)
      .post("/add")
      .send({ a: 2, b: 3 });

    expect(res.status).toBe(200);
    expect(res.body.result).toBe(5);
  });

});