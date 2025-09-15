export interface User {
  ID: number; // Capitalizado para corresponder ao GORM
  email: string;
  name: string;
  isAdmin: boolean;
}
