export class User {
  id: number;
  authId: number;
  name: string;
  email: string;
  password: string;
  constructor(authId?: number, name?: string, email?:string, password?: string) {
    this.authId = authId;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
