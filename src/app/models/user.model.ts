export interface User {
  id?: number;
  email?: number;
  firstName?: string;
  lastName?: string;
  password?: string;
  profilePicUrl?: string | null;
  isAdmin?: boolean;
  isMod?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
