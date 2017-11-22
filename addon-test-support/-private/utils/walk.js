export default function walk(object, ...cbs) {
  Object.getOwnPropertyNames(object).forEach((name) => {
    // Extract descriptors so we don't trigger getters or setters
    let descriptor = Object.getOwnPropertyDescriptor(object, name);

    for (let i = 0; i < cbs.length; i++) {
      cbs[i](object, name, descriptor);
    }

    // Get the descriptor again, since it could have been modified
    descriptor = Object.getOwnPropertyDescriptor(object, name);

    if (typeof descriptor.value === 'object' && descriptor.value !== null) {
      walk(descriptor.value, ...cbs);
    }
  });

  return object;
}
