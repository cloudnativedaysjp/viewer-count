import { DynamoDB, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDB({});
const TABLENAME = process.env.TABLENAME || "";

// the profileId#conference is separated by symbol '#'.
const separotorChar = '#'

export const handler = async (event: any = {}): Promise<any> => {
    
    const profileId =  Number(event.profileId);
    if (!profileId) {
            throw new Error('Error400: cannot get profileId');
    }
    
    const point =  Number(event.point);
    if (!point) {
            throw new Error('Error400: cannot get point');
    }

    const conference = String(event.conference);
    if (!conference) {
        throw new Error('Error400: cannot get conference')
    }

    const reasonId = Number(event.reasonId);
    if (!reasonId) {
        throw new Error('Error400: cannot get reason')
    }

    // Timezone is UTC.
    const timestamp = Date.now();
    
    try {
        const command = new PutItemCommand({
            TableName: TABLENAME,
            Item: {
                'profileId#conference': { S: String(profileId)+ separotorChar + String(conference)},
                'timestamp': { N: String(timestamp)},
                'point': { N: String(point)},
                'reasonId': { N: String(reasonId)},
            },
        });
        await dynamodb.send(command);
    } catch(error) {
        console.log(error);
        throw new Error("Error500: don't put item")
    }

    return { 'message' : 'ok' }
};