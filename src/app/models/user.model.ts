export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
}
