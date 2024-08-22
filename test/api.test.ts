import axios from "axios";

// Set the base URL for your API
const BASE_URL = "http://127.0.0.1:3000/api/v1"; // Adjust the port and URL as necessary

const API_KEY = "my-secret-api-key";

describe("API Tests", () => {
  // Test GET /hello/{name}
  test("GET /hello/{name} should return a greeting message", async () => {
    const name = "John";
    try {
      const response = await axios.get(`${BASE_URL}/hello/${name}`);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: `Hello ${name}` });
    } catch (error: any) {
      console.log({ error });
    }
  });

  // Test GET /hello/{name} with missing name
  test("GET /hello/ should return 400 Bad Request", async () => {
    try {
      await axios.get(`${BASE_URL}/hello/`);
    } catch (error: any) {
      console.log({ error: error.response.data });
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({ message: "Bad request" });
    }
  });

  // Test POST /hello with valid name
  test("POST /hello should return a greeting message", async () => {
    const name = "Jane";
    try {
      const response = await axios.post(
        `${BASE_URL}/hello`,
        { name },
        {
          headers: {
            "api-key": API_KEY
          }
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: `Hello ${name}` });
    } catch (error: any) {
      console.log({ error: error.response.data });
    }
  });

  // Test POST /hello with missing name
  test("POST /hello should return 400 Bad Request when name is missing", async () => {
    try {
      await axios.post(`${BASE_URL}/hello`, {});
    } catch (error: any) {
      console.log({ error: error.response });
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({ message: "Bad request" });
    }
  });
});
