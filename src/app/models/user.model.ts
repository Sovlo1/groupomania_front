export class User {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  profilePicUrl?: string | null;
  isAdmin?: boolean;
  isMod?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  bio?: string;
}
