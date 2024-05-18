import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AuthService extends Service {
  @tracked isLoggedIn: boolean = false;
  @tracked isAdmin: boolean = false;

  login(isAdmin: boolean = false): void {
    this.isLoggedIn = true;
    this.isAdmin = isAdmin;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.isAdmin = false;
  }
}

declare module '@ember/service' {
  interface Registry {
    auth: AuthService;
  }
}
