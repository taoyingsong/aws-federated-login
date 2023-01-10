interface LoginParams {
    awsAuthorizedUrl: string;
    client_id: string;
    identity_provider?: string;
    redirect_uri: string;
    response_type: string;
    scope: string;
    mode?: 'popup' | 'redirect';
    callback: (params: any) => void;
}
export declare const awsFederatedLogin: (loginParams: LoginParams) => void;
export declare const awsRedirect: () => void;
export {};
