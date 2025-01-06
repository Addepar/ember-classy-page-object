import { getter } from 'ember-cli-page-object/macros';

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function walkObject(obj, fn) {
  Object.getOwnPropertyNames(obj).forEach((name) => {
    // Copy descriptor
    let descriptor = Object.getOwnPropertyDescriptor(obj, name);

    fn(obj, name, descriptor);
  });
}

export function extractPageObjects(definition) {
  let finalizedDefinition = {};

  walkObject(definition, (obj, name, descriptor) => {
    if (typeof descriptor.value === 'function' && descriptor.value._definition) {
        descriptor.value = descriptor.value._definition;
    }

    if (isObject(descriptor.value)) {
      descriptor.value = extractPageObjects(descriptor.value);
    }

    Object.defineProperty(finalizedDefinition, name, descriptor);
  });

  return finalizedDefinition;
}

export function extractGetters(definition) {
  let finalizedDefinition = {};

  walkObject(definition, (obj, name, descriptor) => {
    if (typeof descriptor.get === 'function') {
      descriptor.value = getter(descriptor.get);

      descriptor.writable = true;
      delete descriptor.get;
      delete descriptor.set;
    } else if (isObject(descriptor.value)) {
      descriptor.value = extractGetters(descriptor.value);
    }

    Object.defineProperty(finalizedDefinition, name, descriptor);
  });

  return finalizedDefinition;
}

export function deepMergeDescriptors(dest, src) {
  walkObject(src, (obj, name, descriptor) => {
    const { value: srcValue } = descriptor;

    // The property exists on both objects
    if (Object.hasOwnProperty.call(dest, name)) {
      let { value: destValue } = Object.getOwnPropertyDescriptor(dest, name);

      // Deep merge if both are objects
      if (isObject(destValue) && isObject(srcValue)) {
        descriptor.value = deepMergeDescriptors(destValue, srcValue);
      } else if (destValue === undefined) {
        descriptor.value = srcValue;
      } else {
        // Defer to the 'dest' value otherwise (ie, do not redefine property)
        return;
      }

    } else if (isObject(srcValue)) {
      // The property only exists on 'src'
      descriptor.value = deepMergeDescriptors({}, srcValue);
    }

    Object.defineProperty(dest, name, descriptor);
  });

  return dest;
}
