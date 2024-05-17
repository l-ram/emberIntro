import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type SessionService from 'ember-simple-auth/services/session';

export default class ApplicationController extends Controller {
  @service declare session: SessionService<{}>;

  @action
  logout() {
    this.session.invalidate();
  }
}
