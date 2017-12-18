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

test('getters can be used in collection definitions', function(assert) {
  assert.expect(1);

  let page = PageObject.extend({
    foo: 123,
    content: collection({
      get foo() {
        assert.ok(false, 'getter called prematurely')
      }
    })
  }).extend({
    foo: 456,
    content: collection({
      get bar() {
        return 123;
      }
    })
  }).create();

  page.content.eq(0);
  assert.equal(page.content.eq(0).bar, 123, 'getter gets merged correctly');
});
