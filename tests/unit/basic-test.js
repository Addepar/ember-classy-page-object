import PageObject from 'ember-classy-page-object';

import { module, test } from 'ember-qunit';

module('basic tests');

test('it properly converts descriptors', function(assert) {
  assert.expect(1);

  let page = PageObject.extend({
    get foo() {
      assert.ok(true, 'getter converted correctly');
    }
  }).create();

  page.foo;
});

test('it properly merges subcontexts', function(assert) {
  assert.expect(3);

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
  }).create();

  assert.equal(page.foo, 123);
  assert.equal(page.content.bar, 456);

  page.content.baz;
});

test('it adds scope with scope shortcut helper', function(assert) {
  assert.expect(2);

  let page = PageObject.extend({
    scope: 'foo'
  });

  let scopedPage = page.scope('bar');

  assert.equal(page.definition.scope, 'foo');
  assert.equal(scopedPage.definition.scope, 'bar');
});
