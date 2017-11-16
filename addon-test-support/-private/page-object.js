import { assert } from '@ember/debug';

import { create, collection } from 'ember-cli-page-object';
import deepMergeDescriptors from './utils/deep-merge-descriptors';
import walk from './utils/walk';

import { useNativeEvents } from 'ember-cli-page-object/extend';

// pre-emptively turn on native events since we'll need them
useNativeEvents();

// Turns a native getter into a Ceibo getter
function replaceDescriptors(object, property, descriptor) {
  const { get, set } = descriptor;

  if (!get && !set) return;

  delete object[property];

  object[property] = {
    isDescriptor: true,
    get,
    set
  };
}

// Turns an extendible collection placeholder into an ember-cli-page-object collection
function replaceCollections(object, property, descriptor) {
  const { value } = descriptor;

  if (!value || !value.isCollection) return;

  delete value.isCollection;

  object[property] = collection(value);
}

class PageObject {
  constructor(definition) {
    definition = walk(definition, replaceDescriptors);

    Object.assign(this, definition);
  }

  extend(extension) {
    assert('must provide a definition with atleast one key when extending a PageObject', extension && Object.keys(extension).length > 0);

    return new PageObject(deepMergeDescriptors(extension, this))
  }

  create() {
    return create(walk(this, replaceCollections));
  }
}

export default new PageObject({});
