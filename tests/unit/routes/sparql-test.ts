import { module, test } from 'qunit';
import { setupTest } from 'intro/tests/helpers';

module('Unit | Route | sparql', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:sparql');
    assert.ok(route);
  });
});
