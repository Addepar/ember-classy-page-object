import { create } from 'ember-cli-page-object';

function deepMergeDescriptors(dest, src) {
  Object.getOwnPropertyNames(src).forEach(function forEachOwnPropertyName(name) {
    // Copy descriptor
    let descriptor = Object.getOwnPropertyDescriptor(src, name)

    if (Object.hasOwnProperty.call(dest, name)) {
      const { value: destValue } = Object.getOwnPropertyDescriptor(dest, name);
      const { value: srcValue } = descriptor;

      if (
        typeof destValue === 'object' && destValue !== null
        && typeof srcValue === 'object' && srcValue !== null
      ) {
        descriptor.value = deepMergeDescriptors(destValue, srcValue);
      } else {
        return;
      }
    }

    Object.defineProperty(dest, name, descriptor)
  });

  return dest;
}

function replaceDescriptors(object) {
  Object.getOwnPropertyNames(object).forEach((name) => {
    // Extract descriptors for getters/setters
    let descriptor = Object.getOwnPropertyDescriptor(object, name);

    if (descriptor.get || descriptor.set) {
      const { get, set } = descriptor;

      delete object[name];

      object[name] = {
        isDescriptor: true,
        get,
        set
      };
    } else if (typeof descriptor.value === 'object' && descriptor.value !== null) {
      replaceDescriptors(descriptor.value);
    }
  });

  return object;
}

export class PageObject {
  constructor(definition) {
    Object.assign(this, replaceDescriptors(definition));
  }

  extend(extension) {
    return new PageObject(deepMergeDescriptors(extension, this))
  }

  create() {
    return create(this);
  }
}
