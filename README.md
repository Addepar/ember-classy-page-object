# ember-classy-page-object

Provides a super simple class-like wrapper around [ember-cli-page-object](https://github.com/san650/ember-cli-page-object).

Supports Ember 3.28 LTS and also Ember 4 and 5 LTS versions.
This addon is embroider-safe.

## Usage

Given a simple ToggleButton component that just toggles its active state with a
template like so:

```hbs
<!-- note activeClass defaults to `is-active` -->
<button {{action "toggleActive"}} data-test-toggle-button class="{{if this.active this.activeClass}}">
  {{if this.active "Deactivate" "Activate"}}
</button>
```

You can represent it and test like this:

```js
import { module, test } from 'qunit';
import PageObject, { clickable } from 'ember-classy-page-object';
import { findElement } from 'ember-classy-page-object/extend';

const ToggleButtonPage = PageObject.extend({
  toggle: clickable('[data-test-toggle-button]'),

  activeClass: 'is-active',

  get isActive() {
    return findElement(this, '[data-test-toggle-button]').classList.contains(this.activeClass);
  }
});

module('toggle button');

test('can toggle', function(assert) {
	const myToggleButton = new ToggleButtonPage();

	myToggleButton.toggle();

	assert.ok(myToggleButton.isActive, 'it toggled!');
});
```

If you later need to reuse a component, you can extend it to override properties:

```hbs
<ToggleButton data-test-first-toggle />
<ToggleButton data-test-second-toggle @activeClass="is-activated" />
```

```js
const DoubleToggleButtonPage = PageObject.extend({
  firstToggle: ToggleButtonPage.extend({
	  scope: '[data-test-first-toggle]'
  }),

  secondToggle: ToggleButtonPage.extend({
	  scope: '[data-test-second-toggle]',
	  activeClass: 'is-activated'
  })
});

const myDoubleToggle = new DoubleToggleButtonPage();

myDoubleToggle.firstToggle.toggle();
// etc...
```

Extending deep merges the new definition into the previous definition. When you want to finally
use the page object, just call `create` which finalizes the object.

## Jquery vs Native

Classy page object defaults to running in native-dom mode, meaning it sends native events and
uses native-dom helpers under the hood. Results from functions like `findElement` and
`findElementWithAssert` return actual elements, not jquery selectors. However, ember-cli-page-object
hasn't been able to get rid of the jquery dependency yet, so it's still possible to use jquery
selectors within page objects themselves. It is _highly_ recommended that you avoid this to prevent
tying yourself to jquery in your tests, as Ember continues to remove the dependency in the future.

## Helpers

Classy page object re-exports all of the helpers from ember-cli-page-object with the exception of
`getter`, you can now use native ES getters instead. The list of exports is as follows:

* `ember-classy-page-object`
  * `default as PageObject`
  * `alias`
  * `attribute`
  * `blurrable`
  * `clickOnText`
  * `clickable`
  * `contains`
  * `count`
  * `fillable`
  * `hasClass`
  * `isHidden`
  * `isPresent`
  * `isVisible`
  * `notHasClass`
  * `property`
  * `text`
  * `triggerable`
  * `value`
  * `visitable`
* `ember-classy-page-object/extend`
  * `findElement`
  * `findElementWithAssert`
  * `buildSelector`
  * `fullScope`

Some helpers have been overridden to make them mergeable and easier to use, such as `collection`,
so it's highly recommended that you use these helpers from `ember-classy-page-object` and not
from `ember-cli-page-object` directly.

### Collection

The collection helper in `ember-cli-page-object` has some shortcomings, mostly the fact that it
requires users to call it as a function to generate an enumerable, and can only query directly by
index. It also confusingly refers to both the enumerable items, and their immediate parent (which is
why you must provide `itemScope` and `item` to the definition, for instance). Classy PageObject's
collection simplifies the collection helper.

`collection` should now receive the definition for just the items that are enumerable themselves.

```js
// before

let page = create({
  rows: collection({
    scope: 'table',

    itemScope: 'tr',

    item: {
      firstName: text('td.first-name'),
      lastName: text('td.last-name')
    }
  })
});

// after

let Page = PageObject.extend({
  table: {
    scope: 'table',

    rows: collection({
      scope: 'tr',
      firstName: text('td.first-name'),
      lastName: text('td.last-name')
    })
  }
});

let page = new Page();
```

Collections now return an instance of a class with the following public API methods:

* `objectAt(index: number): Page`: Return the page for the item at the specified index
* `forEach(fn: (item, index, list) => void): void`: Run a function for every item in the collection
* `map(fn: (item, index, list) => any): Array<any>`: Map a transform over every item in the collection
* `findAll(query: object | fn(item, index, list) => boolean): Array<Page>`: Find all items in the collection
  which match the query. If the query is an object, it will return all items whose properties
  are equal to every key/property on the query object. If it is a function it will return any
  item that returns true when passed to the function.
* `findOne(query: object | fn(item, index, list) => boolean): Page | undefined`: Find the first item in the
  collection that matches the query. If the query is an object, it will return all items whose properties
  are equal to every key/property on the query object. If it is a function it will return any
  item that returns true when passed to the function. If more than one item is matched, the helper will
  throw an error.
* `toArray(): Array<Page>`: Convert the collection into a native array

And the following properties

* `length: number`: The number of items in the collection (`count`)

## Installation

* `git clone <repository-url>` this repository
* `cd ember-classy-page-object`
* `yarn install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `yarn test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
