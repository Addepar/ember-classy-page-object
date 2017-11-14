export default function walk(object, ...cbs) {
  Object.getOwnPropertyNames(object).forEach((name) => {
    // Extract descriptors so we don't trigger getters or setters
    const descriptor = Object.getOwnPropertyDescriptor(object, name);

    for (let i = 0; i < cbs.length; i++) {
      cbs[i](object, name, descriptor);
    }

    if (typeof descriptor.value === 'object' && descriptor.value !== null) {
      walk(descriptor.value, ...cbs);
    }
  });

  return object;
}
