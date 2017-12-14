import { assert } from '@ember/debug';
import { create, collection as pageObjectCollection } from 'ember-cli-page-object';

class CollectionProxy {
  constructor(collectionPage, key) {
    this.item = collectionPage[key];
    this.enumerable = collectionPage[key]();
  }

  eq(index) {
    return this.item(index);
  }

  get length() {
    return this.enumerable.count;
  }

  toArray() {
    return this.enumerable.toArray();
  }

  map(...args) {
    return this.enumerable.map(...args);
  }

  forEach(...args) {
    return this.enumerable.forEach(...args);
  }

  findOne(query) {
    let result = this.findAll(query);

    assert(`Expected at most one result from findOne query, but found ${result.length}`, result.length <= 1);

    return result[0];
  }

  findAll(query) {
    let predicate;

    if (typeof query === 'object') {
      predicate = (item) => {
        let isMatch = true;

        for (let key in query) {
          isMatch = isMatch && item[key] === query[key];
        }

        return isMatch;
      }
    } else if (typeof query === 'function') {
      predicate = query;
    } else {
      assert(`Expected query for findAll to be either an object or function, received: ${query}`, false);
    }

    return this.enumerable.filter(predicate);
  }
}

export function collection(definition) {
  let collectionProxy,
      collectionKey,
      pageDefinition = {};

  return {
    isDescriptor: true,

    setup(node, key) {
      collectionKey = key;

      const {
        scope: itemScope,
        resetScope
      } = this._definition;

      pageDefinition[key] = pageObjectCollection({
        itemScope,
        resetScope,
        item: this._definition
      });
    },

    get() {
      if (!collectionProxy) {
        collectionProxy = new CollectionProxy(create(pageDefinition, { parent: this }), collectionKey)
      }
      return collectionProxy;
    },

    _definition: definition
  };
}
