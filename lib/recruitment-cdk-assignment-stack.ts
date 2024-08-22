import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class RecruitmentCdkAssignmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function to handle API requests
    const lambdaHandler = new lambda.Function(this, "LambdaHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: new lambda.AssetCode("dist/lambda"),
      functionName: "RecruitmentLambdaHandler",
      description: "Handles requests for the Recruitment API"
    });

    // API Gateway
    const api = new apigateway.RestApi(this, "RecruitmentApi", {
      restApiName: "Recruitment API",
      description: "API for Recruitment",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST"]
      }
    });

    // GET /hello/
    const helloResource = api.root.addResource("hello");
    helloResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(lambdaHandler),
      {
        operationName: "api.v1.hello.get",
        methodResponses: [
          {
            statusCode: "200"
          },
          {
            statusCode: "400"
          }
        ],
        requestParameters: {
          "method.request.path.name": true
        }
      }
    );
    // GET /hello/{name}
    const nameResource = helloResource.addResource("{name}");
    nameResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(lambdaHandler),
      {
        operationName: "api.v1.hello.name.get",
        methodResponses: [
          {
            statusCode: "200"
          },
          {
            statusCode: "400"
          }
        ],
        requestParameters: {
          "method.request.path.name": true
        }
      }
    );

    // POST /hello
    helloResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(lambdaHandler),
      {
        operationName: "api.v1.hello.post",
        apiKeyRequired: true,
        methodResponses: [
          {
            statusCode: "200"
          },
          {
            statusCode: "400"
          }
        ],
        requestModels: {
          "application/json": new apigateway.Model(this, "HelloPostModel", {
            restApi: api,
            contentType: "application/json",
            modelName: "HelloPostModel",
            schema: {
              type: apigateway.JsonSchemaType.OBJECT,
              required: ["name"],
              properties: {
                name: { type: apigateway.JsonSchemaType.STRING }
              }
            }
          })
        }
      }
    );
    // API Key for secured POST /hello
    const apiKey = api.addApiKey("ApiKey", {
      apiKeyName: "RecruitmentApiKey",
      description: "API Key for Recruitment API"
    });

    const usagePlan = api.addUsagePlan("UsagePlan", {
      name: "RecruitmentApiUsagePlan",
      apiStages: [{ api, stage: api.deploymentStage }]
    });

    usagePlan.addApiKey(apiKey);
  }
}
