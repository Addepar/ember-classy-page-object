import { assert } from '@ember/debug';

import { create } from 'ember-cli-page-object';
import dsl from 'ember-cli-page-object/-private/dsl';
import { useNativeEvents } from 'ember-cli-page-object/extend';

import deepMergeDescriptors from './utils/deep-merge-descriptors';

// pre-emptively turn on native events since we'll need them
useNativeEvents();

// See https://github.com/san650/ceibo#examples for more info on how Ceibo
// builders work.
const builder = {
  object(node, blueprintKey, blueprint, defaultBuilder) {
    let finalizedBlueprint = Object.assign({}, dsl);

    Object.getOwnPropertyNames(blueprint).forEach((property) => {
      const { get, value } = Object.getOwnPropertyDescriptor(blueprint, property);

      if (value instanceof PageObject) {
        finalizedBlueprint[property] = value.definition;
      } else if (typeof get === 'function') {
        finalizedBlueprint[property] = { isDescriptor: true, get };
      } else {
        finalizedBlueprint[property] = value;
      }
    });

    return defaultBuilder(node, blueprintKey, finalizedBlueprint, defaultBuilder);
  }
}

class PageObject {
  constructor(definition) {
    this.definition = definition;
  }

  extend(extension) {
    assert('must provide a definition with atleast one key when extending a PageObject', extension && Object.keys(extension).length > 0);

    return new PageObject(deepMergeDescriptors(extension, this.definition))
  }

  scope(scope) {
    return this.extend({ scope });
  }

  create() {
    return create(this.definition, { builder });
  }
}

export default new PageObject({});
