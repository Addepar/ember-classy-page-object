import { create as pageObjectCreate } from 'ember-cli-page-object';
import dsl from 'ember-cli-page-object/-private/dsl';

const builder = {
  object(node, blueprintKey, blueprint, defaultBuilder) {
    let finalizedBlueprint = Object.assign({}, dsl);

    if (blueprint.__isPageObjectClass) {
      blueprint = blueprint.definition;
    }

    Object.getOwnPropertyNames(blueprint).forEach((property) => {
      const { get, value } = Object.getOwnPropertyDescriptor(blueprint, property);

      if (typeof get === 'function') {
        finalizedBlueprint[property] = { isDescriptor: true, get };
      } else {
        finalizedBlueprint[property] = value;
      }
    });

    return defaultBuilder(node, blueprintKey, finalizedBlueprint, defaultBuilder);
  }
}

export default function create(blueprint, options) {
  return pageObjectCreate(blueprint, Object.assign({ builder }, options));
}
