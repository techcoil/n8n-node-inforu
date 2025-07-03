import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class InforUCredentialsApi implements ICredentialType {
    name = 'inforUCredentialsApi';
    displayName = 'InforU Credentials API';

    documentationUrl =
        'https://www.inforu.co.il/%d7%a9%d7%9c%d7%99%d7%97%d7%aa-sms-2/?_gl=1*pnnsga*_gcl_au*MzUwMzA4MTA3LjE3NTE1NDkwNTE.';

    properties: INodeProperties[] = [
        {
            displayName: 'User Name',
            name: 'username',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Token',
            name: 'token',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ];

    // This credential is currently not used by any node directly
    // but the HTTP Request node can use it to make requests.
    // The credential is also testable due to the `test` property below
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            auth: {
                username: '={{ $credentials.username }}',
                password: '={{ $credentials.password }}',
            },
            qs: {
                // Send this as part of the query string
                n8n: 'rocks',
            },
        },
    };

    // The block below tells how this credential can be tested
    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.inforu.co.il',
            url: '',
        },
    };
}
