# ember-classy-page-object

Provides a super simple class-like wrapper around ember-cli-page-object.

## Usage

Given a simple ToggleButton component that just toggles its active state with a
template like so:

```hbs
<!-- note activeClass defaults to `is-active` -->
<button {{action "toggleActive"}} data-test-toggle-button class="{{if active activeClass}}">
  {{if active "Deactivate" "Activate"}}
</button>
```

You can represent it and test like this:

```js
import { module, test } from 'ember-qunit';

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
	const myToggleButton = ToggleButtonPage.create();

	myToggleButton.toggle();

	assert.ok(myToggleButton.isActive, 'it toggled!');
});
```

If you later need to reuse a component, you can extend it to override properties:

```hbs
{{toggle-button data-test-first-toggle=true}}
{{toggle-button data-test-second-toggle=true activeClass="is-activated"}}
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

const myDoubleToggle = DoubleToggleButtonPage.create();

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
  * `clickOnText`
  * `clickable`
  * `contains`
  * `count`
  * `fillable`
  * `hasClass`
  * `is`
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
  * `getContext`

Some helpers like `collection` have been modified to make them extendible, so it is highly recommended
that you import the helpers from classy page object instead of ember-cli-page-object.

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
