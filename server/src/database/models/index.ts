export interface IUser {
  name: string;
  username: string; // @
  email: string;
  password: string;
  profilePhoto?: string; // path
  darkThemeActive: boolean;  
}
