import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import environment from '../config/environment';

export default class TokenAuthenticator extends BaseAuthenticator {
  async authenticate(...args: unknown[]): Promise<unknown> {
    return {};
  }

  async restore() {}

  async invalidate(data: Data, ...args: unknown[]): Promise<unknown> {
    return {};
  }
}
