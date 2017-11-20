import PageObject, { collection } from 'ember-classy-page-object';

import { module, test } from 'ember-qunit';

module('basic tests');

test('it properly merges collections', function(assert) {
  assert.expect(3);

  let page = PageObject.extend({
    foo: 123,
    content: collection({
      bar: 456,
      baz: 'qux'
    })
  }).extend({
    content: collection({
      baz: 789
    })
  });

  assert.equal(page.definition.foo, 123);
  assert.equal(page.definition.content._definition.bar, 456);
  assert.equal(page.definition.content._definition.baz, 789);
});
