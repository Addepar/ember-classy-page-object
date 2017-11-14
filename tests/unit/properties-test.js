import PageObject, { collection } from 'ember-classy-page-object';

import { module, test } from 'ember-qunit';

module('basic tests');

test('it properly merges collections', function(assert) {
  assert.expect(4);

  let page = new PageObject({
    foo: 123,
    content: collection({
      bar: 456
    })
  }).extend({
    content: {
      baz: 789
    }
  });

  assert.equal(page.foo, 123);
  assert.ok(page.content.isCollection);
  assert.equal(page.content.bar, 456);
  assert.equal(page.content.baz, 789);
});

test('it properly replaces collections', function(assert) {
  assert.expect(1);

  let page = new PageObject({
    foo: 123,
    content: collection({
      bar: 456
    })
  }).extend({
    content: {
      baz: 789
    }
  }).create();

  let collectionDescriptor = Object.getOwnPropertyDescriptor(page, 'content');

  assert.equal(typeof collectionDescriptor.get, 'function', 'correctly replaced with collection');
});
