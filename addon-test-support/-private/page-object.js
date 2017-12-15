import { assert } from '@ember/debug';

import { create } from 'ember-cli-page-object';
import deepMergeDescriptors from './utils/deep-merge-descriptors';
import clone from './utils/clone';

import { useNativeEvents } from 'ember-cli-page-object/extend';

// pre-emptively turn on native events since we'll need them
useNativeEvents();

// Turns a native getter into a Ceibo getter
function replaceDescriptors(property, descriptor) {
  const { get, set } = descriptor;

  if (!get && !set) return;

  delete descriptor.get;
  delete descriptor.set;

  descriptor.value = {
    isDescriptor: true,
    get,
    set
  };
}

function extractDefinitions(property, descriptor) {
  const { value } = descriptor;

  if (!(value instanceof PageObject)) return;

  descriptor.value = value.definition;
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
    return create(clone(this.definition, replaceDescriptors, extractDefinitions));
  }
}

export default new PageObject({});
