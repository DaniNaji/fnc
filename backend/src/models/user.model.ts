export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
