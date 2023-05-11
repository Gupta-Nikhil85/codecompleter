import { ExtensionContext, SecretStorage } from "vscode";

export default class AuthSettings {
    private static _instance: AuthSettings;

    constructor(private secretStorage: SecretStorage) {}
 
    // Initialize the AuthSettings instance with the given ExtensionContext
    static init(context: ExtensionContext): void {
        AuthSettings._instance = new AuthSettings(context.secrets);
    }

    // Get the AuthSettings instance
    static get instance(): AuthSettings {
        return AuthSettings._instance;
    }

    // Store the given token in the secret storage
    async setAuthToken(tokenName:string, token?: string): Promise<void> {
        if (token) {
            this.secretStorage.store(tokenName, token);
        }
    }

    // Get the token from the secret storage
    async getAuthToken(tokenName:string): Promise<string | undefined> {
        return await this.secretStorage.get(tokenName);
    }
}