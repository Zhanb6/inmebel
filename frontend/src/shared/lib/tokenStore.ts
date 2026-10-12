let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenStore = {
  get() {
    return {
      access: accessToken,
      refresh: refreshToken,
    };
  },

  set(access: string | null, refresh: string | null) {
    accessToken = access;
    refreshToken = refresh;
  },

  clear() {
    accessToken = null;
    refreshToken = null;
  },
};
