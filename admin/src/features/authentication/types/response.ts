export interface AuthResponse {
  user: {
    id: number;
    name: string;
  };
  role: string;
  access_token: {
    token: string;
    expires_at: string;
  };
}
