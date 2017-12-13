function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

export default function deepMergeDescriptors(dest, src) {
  Object.getOwnPropertyNames(src).forEach((name) => {
    // Copy descriptor
    let descriptor = Object.getOwnPropertyDescriptor(src, name);
    const { value: srcValue } = descriptor;

    if (isObject(srcValue)) {
      let mergeTarget = {};

      if (Object.hasOwnProperty.call(dest, name)) {
        let { value: destValue } = Object.getOwnPropertyDescriptor(dest, name);

        mergeTarget = isObject(destValue) ? destValue : mergeTarget;
      }

      descriptor.value = deepMergeDescriptors(mergeTarget, srcValue);

    } else if (Object.hasOwnProperty.call(dest, name)) {
      return;
    }

    Object.defineProperty(dest, name, descriptor);
  });

  return dest;
}
