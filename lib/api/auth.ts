import { api } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "CUSTOMER" | "ADMIN";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/login", data);
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/register", data);
  },

  refreshToken: async (token: string): Promise<AuthResponse> => {
    return api.post<AuthResponse>(
      "/auth/refresh",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },
};
