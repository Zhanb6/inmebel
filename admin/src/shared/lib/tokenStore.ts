export const tokenStore = {
  get() {
    if (typeof window !== 'undefined') {
      const access = localStorage.getItem('accessToken');
      return { access, refresh: null };
    }
    return { access: null, refresh: null };
  },

  set(access: string | null) {
    if (access && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', access);
    } else if (access === null && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  },

  clear() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  },
};

// Инициализация токена при загрузке
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('accessToken');
  if (storedToken) {
    tokenStore.set(storedToken);
  }
}