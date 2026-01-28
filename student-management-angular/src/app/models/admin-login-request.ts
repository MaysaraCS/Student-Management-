export interface AdminLoginRequest {
    email: string;
    password: string; // For simplified OAuth
    oauthProvider?: string;
    oauthToken?: string;
}