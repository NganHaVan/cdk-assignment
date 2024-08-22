import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { RecruitmentCdkAssignmentStack } from "../lib/recruitment-cdk-assignment-stack";

describe("RecruitmentCdkAssignmentStack", () => {
  let app: cdk.App;
  let stack: RecruitmentCdkAssignmentStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new RecruitmentCdkAssignmentStack(
      app,
      "RecruitmentCdkAssignmentStack"
    );
    template = Template.fromStack(stack);
  });

  test("Lambda Function Created", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "index.handler",
      Runtime: "nodejs18.x"
    });
  });

  test("API Gateway RestApi Created", () => {
    template.hasResourceProperties("AWS::ApiGateway::RestApi", {
      Name: "Recruitment API",
      Description: "API for Recruitment"
    });
  });

  test("GET /hello/{name} Method Created", () => {
    template.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "GET",
      RequestParameters: {
        "method.request.path.name": true
      }
    });
  });

  test("POST /hello Method Created with API Key Required", () => {
    template.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "POST",
      ApiKeyRequired: true
    });
  });

  test("API Key Created", () => {
    template.hasResourceProperties("AWS::ApiGateway::ApiKey", {
      Name: "RecruitmentApiKey",
      Description: "API Key for Recruitment API"
    });
  });

  test("Usage Plan Created", () => {
    template.hasResource("AWS::ApiGateway::UsagePlan", {});
  });
});
