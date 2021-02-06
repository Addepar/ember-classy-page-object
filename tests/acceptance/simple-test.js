import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';
import wait from 'ember-test-helpers/wait';

import PageObject, { clickable } from 'ember-classy-page-object';
import { findElement } from 'ember-classy-page-object/extend';

const ToggleButtonPage = PageObject.extend({
  toggle: clickable('[data-test-toggle-button]'),

  get activeClass() {
    return 'is-active';
  },

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

    get activeClass() {
      return 'is-activated';
    }
  })
});

module('Acceptance | simple', async function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    const doubleToggle = new DoubleTogglePage();

    await visit('/');

    assert.equal(doubleToggle.firstToggle.isActive, false);
    assert.equal(doubleToggle.secondToggle.isActive, false);

    await wait();

    doubleToggle.firstToggle.toggle()
    doubleToggle.secondToggle.toggle()

    await wait();

    assert.equal(doubleToggle.firstToggle.isActive, true);
    assert.equal(doubleToggle.secondToggle.isActive, true);

    await wait();

    doubleToggle.firstToggle.toggle()
    doubleToggle.secondToggle.toggle()

    await wait();

    assert.equal(doubleToggle.firstToggle.isActive, false);
    assert.equal(doubleToggle.secondToggle.isActive, false);
  });
});
