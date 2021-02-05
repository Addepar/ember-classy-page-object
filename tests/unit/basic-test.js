import PageObject from 'ember-classy-page-object';

import { module, test } from 'ember-qunit';

module('basic tests');

test('it properly converts descriptors', function(assert) {
  assert.expect(1);

  let page = new PageObject({
    get foo() {
      return 'bar';
    }
  });

  assert.equal(page.foo, 'bar', 'getter converted correctly');
});

test('descriptors are not called prematurely', function(assert) {
  assert.expect(0);

  new PageObject({
    get foo() {
      assert.ok(false, 'getter called prematurely');
      return 123;
    }
  });
});

test('it properly merges subcontexts', function(assert) {
  assert.expect(3);

  let Page = PageObject.extend({
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
  });

  let page = new Page();

  assert.equal(page.foo, 123);
  assert.equal(page.content.bar, 456);
  assert.equal(page.content.baz, 789);
});

test('it properly merges subcontexts that are PageObjects', function(assert) {
  assert.expect(3);

  let Page = PageObject.extend({
    foo: 123,
    content: PageObject.extend({
      bar: 456
    })
  }).extend({
    content: PageObject.extend({
      get baz() {
        return 789;
      }
    })
  });

  let page = new Page();

  assert.equal(page.foo, 123);
  assert.equal(page.content.bar, 456);
  assert.equal(page.content.baz, 789);
});

test('it properly merges normal objects into PageObjects', function(assert) {
  assert.expect(3);

  let Page = PageObject.extend({
    foo: 123,
    content: PageObject.extend({
      bar: 456
    })
  }).extend({
    content: {
      get baz() {
        return 789;
      }
    }
  });

  let page = new Page();

  assert.equal(page.foo, 123);
  assert.equal(page.content.bar, 456);
  assert.equal(page.content.baz, 789);
});

test('it properly merges PageObjects into normal objects', function(assert) {
  assert.expect(3);

  let Page = PageObject.extend({
    foo: 123,
    content: {
      bar: 456
    }
  }).extend({
    content: PageObject.extend({
      get baz() {
        return 789;
      }
    })
  });

  let page = new Page();

  assert.equal(page.foo, 123);
  assert.equal(page.content.bar, 456);
  assert.equal(page.content.baz, 789);
});

test('Passing a string to extend adds scope', function(assert) {
  let Page = PageObject.extend({
    foo: 123
  });

  let ScopedPage = Page.extend('bar');

  assert.equal(ScopedPage._definition.scope, 'bar');
});
