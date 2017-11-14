export default function deepMergeDescriptors(dest, src) {
  Object.getOwnPropertyNames(src).forEach((name) => {
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
