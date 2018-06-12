import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

import PageObject, { clickable } from 'ember-classy-page-object';
import { findElement } from 'ember-classy-page-object/extend';

const ToggleButtonPage = PageObject.extend({
  toggle: clickable('[data-test-toggle-button]'),

  activeClass: 'is-active',

  get isActive() {
    return findElement(this, '[data-test-toggle-button]').classList.contains(this.activeClass);
  }
});

const DoubleTogglePage = PageObject.extend({
  firstToggle: ToggleButtonPage.extend({
    scope: '[data-test-first-toggle]'
  }),

  secondToggle: ToggleButtonPage.extend({
    scope: '[data-test-second-toggle]',
    activeClass: 'is-activated'
  })
});


moduleForAcceptance('Acceptance | simple');

test('visiting /', function(assert) {
  const doubleToggle = new DoubleTogglePage();

  visit('/');

  andThen(() => {
    assert.equal(doubleToggle.firstToggle.isActive, false);
    assert.equal(doubleToggle.secondToggle.isActive, false);
  });

  doubleToggle.firstToggle.toggle()
  doubleToggle.secondToggle.toggle()

  andThen(() => {
    assert.equal(doubleToggle.firstToggle.isActive, true);
    assert.equal(doubleToggle.secondToggle.isActive, true);
  });
});
