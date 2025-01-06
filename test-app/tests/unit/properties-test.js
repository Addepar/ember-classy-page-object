import PageObject, { collection } from 'ember-classy-page-object';
import { module, test } from 'qunit';

module('properties tests');

test('it properly merges collections', function(assert) {
  let page = PageObject.extend({
    foo: 123,
    content: collection('scope1', {
      bar: 456,
      baz: 'qux'
    })
  }).extend({
    content: collection({
      scope: 'scope2',
      baz: 789
    })
  });

  assert.equal(page._definition.foo, 123);
  assert.equal(page._definition.content._scope, 'scope2');
  assert.equal(page._definition.content._definition.bar, 456);
  assert.equal(page._definition.content._definition.baz, 789);
});

test('getters can be used in collection definitions', function(assert) {
  let Page = PageObject.extend({
    foo: 123,
    content: collection({
      scope: 'foo',
      get foo() {
        assert.ok(false, 'getter called prematurely')
        return 123;
      },
      get bar() {
        return 123;
      }
    })
  }).extend({
    foo: 456,
    content: collection({
      get baz() {
        return 789;
      }
    })
  });

  let page = new Page();

  page.content.objectAt(0);
  assert.equal(page.content.objectAt(0).bar, 123, 'getter gets merged correctly');
  assert.equal(page.content.objectAt(0).baz, 789, 'getter gets merged correctly');
});
