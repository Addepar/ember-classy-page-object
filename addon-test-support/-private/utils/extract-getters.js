import { getter } from 'ember-cli-page-object/macros';

export default function extractGetters(definition) {
  let finalizedDefinition = {};

  // Clone the original definition one layer deep so we don't modify scope on it
  Object.getOwnPropertyNames(definition).forEach((name) => {
    let descriptor = Object.getOwnPropertyDescriptor(definition, name);

    if (typeof descriptor.get === 'function') {
      descriptor.value = getter(descriptor.get);

      descriptor.writable = true;
      delete descriptor.get;
      delete descriptor.set;
    }

    Object.defineProperty(finalizedDefinition, name, descriptor);
  });

  return finalizedDefinition;
}
