import { module, test } from 'qunit';

import { setupTest } from 'intro/tests/helpers';

module('Unit | Serializer | supabase', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('supabase');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('supabase', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
