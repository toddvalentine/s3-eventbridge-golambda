import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function } from '../myconstructs/function'
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class VtypeioS3EventbridgeLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.CfnBucket(this, 'sourceBucket', {
      notificationConfiguration: {
        eventBridgeConfiguration: {
          eventBridgeEnabled: true
        }
      }
    })
    bucket.bucketName = "vtypeio-source-bucket"
    
    const fn = new Function(this, 'lambdaFunc', {
      entry: 'go/cmd',
      memorySize: 512
    })

    const rule = new events.Rule(this, "putObjectRule", {
      eventPattern: {
        source: ["aws.s3"],
        detailType: ["Object Created"],
        detail: {
          bucket: {
              "name": ["vtypeio-source-bucket"]
          }    
        }
      }
    })
    rule.addTarget(new targets.LambdaFunction(fn))
  }
}
