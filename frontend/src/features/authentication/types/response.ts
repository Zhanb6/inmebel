export interface ITokenOut {
	access_token: {
    token: string;
    expires_at: string;
  };
}

export interface ILoginOut {
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

