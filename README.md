# aws-federated-login

Amazon Federated Login Client

# Installation

```
npm i aws-federated-login
```

# Introduction

With this package you can choose between popup and redirection during federated login via AWS

# API:

## 1. awsFederatedLogin

trigger popup function
[Detailed meaning of fields](https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html)

```js
interface LoginParams {
    awsAuthorizedUrl: string;
    client_id: string;
    identity_provider: string;
    redirect_uri: string;
    response_type: string;
    scope: string;
    mode?: 'popup' | 'redirect'; // default 'redirect'
    callback: (params: any) => void;
}
export declare const awsFederatedLogin: (loginParams: LoginParams) => void;
```

## 2. awsRedirect:

popup middle page send message to the callback function that triggers the popup function

```js
export declare const awsRedirect: () => void;
```

# Demo

```js
// trigger popup page
import { awsFederatedLogin } from 'aws-federated-login'
<button
    onClick={() => {
        awsFederatedLogin({
            awsAuthorizedUrl: 'https://XXX.amazoncognito.com/oauth2/authorize',
            client_id: 'XXX',
            identity_provider: 'Google', // 'Google' 'Facebook'
            redirect_uri: 'http://localhost:3000/pages/callback.html',
            response_type: 'CODE',
            scope: 'email openid phone',
            mode: 'popup',
            callback: (response) => {
                console.log('response is:', response)
            }
        })
    }
>
</button>

```

```js
// callback.html
import { awsFederatedLogin } from 'aws-federated-login'
awsRedirect()
```
