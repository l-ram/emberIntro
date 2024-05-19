import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import AuthService from '../services/auth'; // Correct path to the auth service
import { action } from '@ember/object';

export default class AuthBaseComponent extends Component {
  @service auth!: AuthService;

  @action
  loginUser() {
    this.auth.login(false);
  }

  @action
  loginAdmin() {
    this.auth.login(true);
  }

  @action
  logout() {
    this.auth.logout();
  }
}
