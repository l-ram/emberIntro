import { module, test } from 'qunit';
import { setupTest } from 'intro/tests/helpers';

module('Unit | Service | auth', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const service = this.owner.lookup('service:auth');
    assert.ok(service);
  });
});
