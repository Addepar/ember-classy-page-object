import { create, collection as ecpoCollection } from 'ember-cli-page-object';
import { assert, inspect } from '@ember/debug';

class CollectionProxy {
  constructor(scope, definition, key, parent) {
    this._key = key;
    this._page = create({
      [key]: ecpoCollection(scope, definition)
    }, { parent });

    // Hack: Trick the page object into thinking it has a different parent
    this._collection.parent = parent;
  }

  get _collection() {
    return this._page[this._key];
  }

  objectAt(index) {
    return this._collection.objectAt(index);
  }

  get length() {
    return this._collection.length;
  }

  toArray() {
    return this._collection.toArray();
  }

  filter(...args) {
    return this._collection.filter(...args);
  }

  filterBy(...args) {
    return this._collection.filterBy(...args);
  }

  map(...args) {
    return this._collection.map(...args);
  }

  mapBy(...args) {
    return this._collection.mapBy(...args);
  }

  forEach(...args) {
    return this.toArray().forEach(...args);
  }

  findOne(query) {
    let result = this.findAll(query);

    assert(
      `Expected at most one result from 'findOne' query in '${
        this._collection.key
      }' collection, but found ${result.length} using query ${inspect(query)}`,
      result.length === 1
    );

    return result[0];
  }

  findAll(query) {
    let predicate;

    if (typeof query === 'object') {
      predicate = item => {
        let isMatch = true;

        for (let key in query) {
          isMatch = isMatch && item[key] === query[key];
        }

        return isMatch;
      };
    } else if (typeof query === 'function') {
      predicate = query;
    } else {
      assert(
        `Expected query for findAll to be either an object or function, received: ${inspect(
          query
        )}`,
        false
      );
    }

    return this.filter(predicate);
  }
}

export function collection(scopeOrDefinition, definitionOrNull) {
  // Collection proxies need to be created for each of instances of this collection,
  // and there may be many since page objects can be reused in many locations. We use
  // a WeakMap to store each instance relative to its node.
  let collectionProxyMap = new WeakMap();

  let definition = definitionOrNull || scopeOrDefinition;

  if (definition._definition) {
    definition = definition._definition;
  }

  let scope = definitionOrNull ? scopeOrDefinition : definition.scope;

  delete definition.scope;

  return {
    isDescriptor: true,

    setup(node, key) {
      let collectionProxy = new CollectionProxy(this._scope, this._definition, key, node);

      collectionProxyMap.set(node, collectionProxy);
    },

    get() {
      return collectionProxyMap.get(this);
    },

    _scope: scope,
    _definition: definition
  };
}
