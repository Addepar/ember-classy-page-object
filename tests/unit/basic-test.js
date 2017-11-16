import PageObject from 'ember-classy-page-object';

import { module, test } from 'ember-qunit';

module('basic tests');

test('it properly converts descriptors', function(assert) {
  assert.expect(3);

  let page = PageObject.extend({
    get foo() {
      assert.ok(true, 'getter converted correctly');
    },

    set foo(value) {
      assert.ok(true, 'setter converted correctly');
    }
  });

  assert.ok(page.foo.isDescriptor, 'function marked as descriptor correctly')

  page.foo.get();
  page.foo.set();
});

test('it properly merges subcontexts', function(assert) {
  assert.expect(4);

  let page = PageObject.extend({
    foo: 123,
    content: {
      bar: 456
    }
  }).extend({
    content: {
      get baz() {
        assert.ok(true, 'nested function merged correctly')
      }
    }
  });

  assert.equal(page.foo, 123);
  assert.equal(page.content.bar, 456);

  assert.ok(page.content.baz, 'nested function marked as descriptor correctly')

  page.content.baz.get();
});
