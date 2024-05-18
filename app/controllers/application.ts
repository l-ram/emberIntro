import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthService from 'intro/services/auth';

export default class ApplicationController extends Controller {
  @service auth!: AuthService;

  loginUser = () => {
    this.auth.login(false);
  };

  loginAdmin = () => {
    this.auth.login(true);
  };

  logout = () => {
    this.auth.logout();
  };
}
