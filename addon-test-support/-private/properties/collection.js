import Ceibo from 'ceibo';

import { assert } from '@ember/debug';
import { count } from 'ember-cli-page-object';
import { buildSelector } from 'ember-cli-page-object/extend';

import create from '../utils/create';
import extractGetters from '../utils/extract-getters';

class CollectionProxy {
  constructor(definition, parent, key) {
    this.definition = definition;
    this.parent = parent;
    this.key = key;

    this._countPage = create({ count: count(definition.scope) }, { parent });

    this._items = [];
  }

  eq(index) {
    if (this._items[index] === undefined) {
      let { definition, parent, key } = this;
      let scope = buildSelector({}, definition.scope, { at: index });

      let finalizedDefinition = extractGetters(definition);

      finalizedDefinition.scope = scope;

      let tree = create(finalizedDefinition, { parent });

      // Change the key of the root node
      Ceibo.meta(tree).key = `${key}(${index})`;

      this._items[index] = tree;
    }

    return this._items[index];
  }

  get length() {
    return this._countPage.count;
  }

  toArray() {
    let { length } = this;

    let array = [];

    for (let i = 0; i < length; i++) {
      array.push(this.eq(i));
    }

    return array;
  }

  map(...args) {
    return this.toArray().map(...args);
  }

  forEach(...args) {
    return this.toArray().forEach(...args);
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

    return this.toArray().filter(predicate);
  }
}

export function collection(definition) {
  // Collection proxies need to be created for each of instances of this collection,
  // and there may be many since page objects can be reused in many locations. We use
  // a WeakMap to store each instance relative to its node.
  let collectionProxyMap = new WeakMap();

  return {
    isDescriptor: true,

    setup(node, key) {
      let collectionProxy = new CollectionProxy(definition, node, key);

      collectionProxyMap.set(node, collectionProxy);
    },

    get() {
      return collectionProxyMap.get(this);
    },

    _definition: definition
  };
}
