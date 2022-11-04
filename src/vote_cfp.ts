import { DynamoDB, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDB({});
const TABLENAME = process.env.TABLENAME || "";

export const handler = async (event: any = {}): Promise<any> => {
    
    const globalIp = String(event.globalIp);
    if (!globalIp) {
            throw new Error('Error400: cannot get global ip');
    }
    const eventAbbr =  String(event.eventAbbr);
    if (!eventAbbr) {
            throw new Error('Error400: cannot get eventAbbr');
    }
    const talkId =  parseInt(event.talkId);
    if (isNaN(talkId)) {
            throw new Error('Error400: cannot get talkId');
    }
    
    // Timezone is in UTC.
    const timestamp = Date.now();
    try {
        const command = new PutItemCommand({
            TableName: TABLENAME,
            Item: {
                eventAbbr: { S: String(eventAbbr)},
                timestamp: { N: String(timestamp)},
                globalIp: { S: String(globalIp)},
                talkId: { N: String(talkId) },
            },
        });
        await dynamodb.send(command);
    } catch(error) {
        console.log(error);
    }

    return { 'message' : 'ok' }
};
