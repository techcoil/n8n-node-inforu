import axios from 'axios';
import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class InforUNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'InforU Mobile',
        name: 'inforUNode',
        group: ['transform'],
        version: 1,
        description: 'InforU Node',
        defaults: {
            name: 'InforU Node',
        },
        credentials: [
            {
                name: 'inforUCredentialsApi',
                required: true,
            },
        ],
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        usableAsTool: true,
        properties: [
            // Node properties which the user gets displayed and
            // can change on the node.
            {
                displayName: 'Content',
                name: 'content',
                type: 'string',
                default: '',
                placeholder: 'SMS Content',
                description: 'SMS Content',
            },
            {
                displayName: 'Recipients',
                name: 'recipients',
                type: 'string',
                default: '',
                placeholder: '0555555555;0545555555',
                description: 'Phone numbers',
            },
            {
                displayName: 'Sender',
                name: 'sender',
                type: 'string',
                default: '',
                placeholder: 'MyOrg',
                description: 'Name of the sender to be displayed in the SMS title',
            },
        ],
    };

    // The function below is responsible for actually doing whatever this node
    // is supposed to do. In this case, we're just appending the `myString` property
    // with whatever the user has entered.
    // You can make async calls and use `await`.
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const content = this.getNodeParameter('content', 0) as string;
        const recipients = this.getNodeParameter('recipients', 0) as string;
        const sender = this.getNodeParameter('sender', 0) as string;
        const credentials = await this.getCredentials('inforUCredentialsApi');
        const username = credentials?.['username'];
        const token = credentials?.['token'];
        if (!username || !token || !content || !recipients) {
            throw new Error('Missing data');
        }
        const host = `https://api.inforu.co.il/SendMessageXml.ashx?InforuXML=`;
        const xml = generateSmsXml();
        const url = host + xml;
        const res = await axios.post(url);

        const isSuccessfulResponse = res.data.includes(`<Status>1</Status>`);

        if (!isSuccessfulResponse) {
            throw new Error(`Failed to send SMS. Response Body: ${res.data}`);
        }

        return [
            this.helpers.returnJsonArray({
                success: true,
                message: 'Successfully sent SMS',
            }),
        ];
        function generateSmsXml() {
            return `
    <Inforu>
        <User>
        <Username>${username}</Username>
        <ApiToken>${token}</ApiToken>
        </User>
        <Content Type="sms">
        <Message>${content}</Message>
        </Content>
        <Recipients>
        <PhoneNumber>${recipients}</PhoneNumber>
        </Recipients>
        <Settings>
        <Sender>${sender}</Sender>
        </Settings>
    </Inforu>`;
        }
    }
}
