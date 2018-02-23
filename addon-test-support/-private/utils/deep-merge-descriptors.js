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
        if (destValue.__isPageObjectClass && !srcValue.__isPageObjectClass) {
          descriptor.value = deepMergeDescriptors(destValue, { definition: srcValue });
        } else if (!destValue.__isPageObjectClass && srcValue.__isPageObjectClass) {
          descriptor.value = deepMergeDescriptors(destValue, srcValue.definition);
        } else {
          descriptor.value = deepMergeDescriptors(destValue, srcValue);
        }
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
