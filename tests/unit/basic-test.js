import PageObject from 'ember-classy-page-object';

import { module, test } from 'ember-qunit';

module('basic tests');

test('it properly converts descriptors', function(assert) {
  assert.expect(1);

  let page = PageObject.extend({
    get foo() {
      return 'bar';
    }
  }).create();

  assert.equal(page.foo, 'bar', 'getter converted correctly');
});

test('descriptors are not called prematurely', function(assert) {
  assert.expect(0);

  PageObject.extend({
    get foo() {
      assert.ok(false, 'getter called prematurely');
    }
  }).create();
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
        return 789;
      }
    }
  }).create();

  assert.equal(page.foo, 123);
  assert.equal(page.content.bar, 456);
  assert.equal(page.content.baz, 789);
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
