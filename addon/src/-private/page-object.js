import { assert } from '@ember/debug';

import { create } from 'ember-cli-page-object';

import { extractPageObjects, extractGetters, deepMergeDescriptors } from './utils/descriptors';

function extendDefinition(definition, extension) {
  assert('must provide a string or an object to extend', extension !== null && (typeof extension === 'string' || typeof extension === 'object'));
  assert('must provide a definition with atleast one key when extending a PageObject', extension && Object.keys(extension).length > 0);

  let finalizedDefinition = typeof extension === 'string' ? { scope: extension } : extension;

  finalizedDefinition = extractPageObjects(finalizedDefinition);
  finalizedDefinition = extractGetters(finalizedDefinition);

  finalizedDefinition = deepMergeDescriptors(
    finalizedDefinition, definition
  );

  return finalizedDefinition;
}

export default class PageObject {
  constructor(extension) {
    let definition = this.constructor._definition;

    definition = extension ? extendDefinition(definition, extension) : definition;

    return create(definition);
  }

  static extend(extension) {
    let Page = class extends this {};

    Page._definition = extendDefinition(this._definition, extension);

    return Page;
  }
}

PageObject._definition = {};
