export {
  buildSelector,
  fullScope
} from 'ember-cli-page-object/extend';

import {
  findElement as originalFindElement,
  findElementWithAssert as originalFindElementWithAssert
} from 'ember-cli-page-object/extend';

export function findElement(node, selector, options = {}) {
  const result = originalFindElement(node, selector, options);

  return options.multiple ? result.toArray() : result[0];
}

export function findElementWithAssert(node, selector, options = {}) {
  const result = originalFindElementWithAssert(node, selector, options);

  return options.multiple ? result.toArray() : result[0];
}
