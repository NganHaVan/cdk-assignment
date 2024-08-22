import { APIGatewayEvent } from "aws-lambda";
import { handler as lambdaHandler } from "../lambda/index";

describe("Test lambda handler", () => {
  describe("GET /hello/{name}", () => {
    test("should return 200 with a greeting message when a name is provided", async () => {
      const event = {
        pathParameters: { name: "John" },
        httpMethod: "GET"
      } as unknown as APIGatewayEvent;

      const result = await lambdaHandler(event);
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ message: "Hello John" });
    });

    test("should return 400 when no name is provided", async () => {
      const event = {
        pathParameters: { name: "" },
        httpMethod: "GET"
      } as unknown as APIGatewayEvent;

      const result = await lambdaHandler(event);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ message: "Bad request" });
    });
  });

  describe("POST /hello", () => {
    test("should return 200 with a greeting message when a name is provided in the body", async () => {
      const event = {
        body: JSON.stringify({ name: "Jane" }),
        httpMethod: "POST"
      } as unknown as APIGatewayEvent;

      const result = await lambdaHandler(event);
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({ message: "Hello Jane" });
    });

    test("should return 400 when no name is provided in the body", async () => {
      const event = {
        body: JSON.stringify({}),
        httpMethod: "POST"
      } as unknown as APIGatewayEvent;

      const result = await lambdaHandler(event);
      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body)).toEqual({ message: "Bad request" });
    });
  });
});
