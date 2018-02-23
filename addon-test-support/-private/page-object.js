import { assert } from '@ember/debug';

import { useNativeEvents } from 'ember-cli-page-object/extend';

import create from './utils/create';
import deepMergeDescriptors from './utils/deep-merge-descriptors';
import extractGetters from './utils/extract-getters';

// pre-emptively turn on native events since we'll need them
useNativeEvents();

export class PageObject {
  constructor(definition) {
    this.definition = definition;

    Object.defineProperty(this, '__isPageObjectClass', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: true
    });
  }

  extend(extension) {
    assert('must provide a definition with atleast one key when extending a PageObject', extension && Object.keys(extension).length > 0);

    let finalizedDefinition = deepMergeDescriptors(
      extractGetters(extension), this.definition
    );

    return new PageObject(finalizedDefinition);
  }

  scope(scope) {
    return this.extend({ scope });
  }

  create() {
    return create(this);
  }
}

export default new PageObject({});
