import { APIGatewayEvent } from "aws-lambda";

const createResponse = (code: number, body: any) => {
  return {
    statusCode: code,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  };
};

export const handler = async (event: APIGatewayEvent) => {
  const { httpMethod, pathParameters, body } = event;

  switch (httpMethod) {
    case "GET":
      const name = pathParameters?.name;
      if (!name) {
        return createResponse(400, { message: "Bad request" });
      }
      return createResponse(200, { message: `Hello ${name}` });

    case "POST":
      if (!body) {
        return createResponse(400, { message: "Bad request" });
      }
      const bodyValue = typeof body === "string" ? JSON.parse(body) : body;
      const bodyName = bodyValue?.name;
      if (!bodyName) {
        return createResponse(400, { message: "Bad request" });
      }
      return createResponse(200, { message: `Hello ${bodyName}` });
    default:
      return createResponse(500, { message: "Error: Resource was not found" });
  }
};
