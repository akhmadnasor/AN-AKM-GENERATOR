export const api = {
  async fetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "An error occurred");
    }
    return data;
  },

  login(credentials: any) {
    return this.fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register(userData: any) {
    return this.fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  getBootstrap() {
    return this.fetch("/api/bootstrap");
  },

  getAdminData() {
    return this.fetch("/api/admin/data");
  },
};
