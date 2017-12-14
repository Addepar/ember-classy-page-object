function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

export default function deepMergeDescriptors(dest, src) {
  Object.getOwnPropertyNames(src).forEach((name) => {
    // Copy descriptor
    let descriptor = Object.getOwnPropertyDescriptor(src, name);
    const { value: srcValue } = descriptor;

    // The property exists on both objects
    if (Object.hasOwnProperty.call(dest, name)) {
      let { value: destValue } = Object.getOwnPropertyDescriptor(dest, name);

      // Deep merge if both are objects
      if (isObject(destValue) && isObject(srcValue)) {
        descriptor.value = deepMergeDescriptors(destValue, srcValue);

      // Defer to the dest value otherwise
      } else {
        return;
      }

    // The property only exists on the src
    } else {
      descriptor.value = isObject(srcValue) ? deepMergeDescriptors({}, srcValue) : srcValue;
    }

    Object.defineProperty(dest, name, descriptor);
  });

  return dest;
}
