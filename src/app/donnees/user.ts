export class User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;

  constructor() {
    this.id = '';
    this.email = '';
    this.username = '';
    this.createdAt = new Date();
  }
}
