import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

interface TokenInfo {
  access_token: string;
  refresh_token: string;
  expiry_date?: number | null;
}

class TokenManager {
  private static instance: TokenManager;
  private oauth2Client: OAuth2Client;
  private currentTokens: TokenInfo = {
    // Ideally, these initial tokens should come from persistent storage.
    // For demonstration, we're using tokens obtained from OAuth Playground.
    access_token: "ya29.a0AXeO80QjLXbKFIbcSckI3fiHx-EZMlmFhwtrt5gC5nL5G_Xq9UvWLZrPJWdWn6DgWqxq20YZ7v33Ce5Vtr9NuyPL-WZQLFIEdO03fLT4AD0oamkzNIUde3ZXGokSM3apEw8zBZmcpCob704166KhcHgYOqZDgJGUbweEpS8TaCgYKAeMSARASFQHGX2MiOP89nhMK-00gsHOSJxrFGw0175",
    refresh_token: "1//04DNrm6bElreXCgYIARAAGAQSNwF-L9IruJBKvQ5laePVnfXxM9XJEX43t5rNVOPGJRyp1FIOrjhqe_ct3OyFKel3g8T63mOoXHQ"
  };

  private constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set initial credentials
    this.oauth2Client.setCredentials({
      access_token: this.currentTokens.access_token,
      refresh_token: this.currentTokens.refresh_token,
    });

    // Listen for token refresh events
    this.oauth2Client.on('tokens', (tokens) => {
      console.log('Token refresh occurred');
      if (tokens.access_token) {
        this.currentTokens.access_token = tokens.access_token;
      }
      if (tokens.refresh_token) {
        this.currentTokens.refresh_token = tokens.refresh_token;
        // In production, update the persistent store with the new refresh token.
      }
      if (tokens.expiry_date) {
        this.currentTokens.expiry_date = tokens.expiry_date;
      }
    });
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  public async getValidClient(): Promise<OAuth2Client> {
    try {
      if (this.shouldRefreshToken()) {
        await this.refreshAccessToken();
      }
      return this.oauth2Client;
    } catch (error) {
      console.error('Error getting valid client:', error);
      // In a production system, notify an administrator or trigger a fallback.
      throw error;
    }
  }

  private shouldRefreshToken(): boolean {
    if (!this.currentTokens.expiry_date) {
      return true;
    }
    // Refresh if token expires in less than 5 minutes.
    return Date.now() >= this.currentTokens.expiry_date - 5 * 60 * 1000;
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      console.log('Access token refreshed successfully');
      
      // Update current tokens; if no new refresh token is provided, keep the existing one.
      this.currentTokens = {
        access_token: credentials.access_token!,
        refresh_token: this.currentTokens.refresh_token,
        expiry_date: credentials.expiry_date || null,
      };

      // Update client credentials
      this.oauth2Client.setCredentials(this.currentTokens);
    } catch (error: any) {
      console.error('Error refreshing access token:', error);
      // If the error indicates an invalid refresh token, reauthorization is needed.
      if (error.response && error.response.data && error.response.data.error === 'invalid_grant') {
        console.error('Refresh token is invalid. Manual reauthorization required.');
      }
      throw error;
    }
  }

  public getCurrentTokens(): TokenInfo {
    return { ...this.currentTokens };
  }
}

export default TokenManager;
