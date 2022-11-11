import { Construct } from 'constructs'
import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'
import { BuildConfig } from './build-config'

export function tableNameMap(env: string) {
  return {
    viewerCount: `viewerCount-${env}`,
    profilePoint: `profilePoint-${env}`,
    pointEvent: `pointEvent-${env}`,
    vote: `vote-${env}`,
  }
}

export class StatefulStack extends Stack {
  viewerCountTable: Table
  profilePointTable: Table
  pointEventTable: Table
  voteTable: Table

  constructor(
    scope: Construct,
    id: string,
    props: StackProps,
    buildConfig: BuildConfig,
  ) {
    super(scope, id, props)

    const tableNames = tableNameMap(buildConfig.Environment)

    // Dynamo DB
    this.viewerCountTable = new Table(this, 'ViewerCountTable', {
      tableName: tableNames.viewerCount,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'trackId', type: AttributeType.NUMBER },
      removalPolicy: RemovalPolicy.DESTROY,
    })

    this.profilePointTable = new Table(this, 'ProfilePointTable', {
      tableName: tableNames.profilePoint,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'profileId', type: AttributeType.NUMBER },
      sortKey: { name: 'conference#timestamp', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.RETAIN,
    })

    this.pointEventTable = new Table(this, 'PointEventTable', {
      tableName: tableNames.pointEvent,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'conference', type: AttributeType.STRING },
      sortKey: { name: 'pointEventId', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.RETAIN,
    })

    this.voteTable = new Table(this, 'VoteTable', {
      tableName: tableNames.vote,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'eventAbbr', type: AttributeType.STRING },
      sortKey: { name: 'timestamp', type: AttributeType.NUMBER },
      removalPolicy: RemovalPolicy.RETAIN,
    })
  }
}
