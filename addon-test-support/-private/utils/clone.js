export default function cloneWalk(object, ...cbs) {
  let clone = {};

  Object.getOwnPropertyNames(object).forEach((name) => {
    // Extract descriptors so we don't trigger getters or setters
    let descriptor = Object.getOwnPropertyDescriptor(object, name);

    for (let i = 0; i < cbs.length; i++) {
      // run functions over the descriptor to update it if they want to
      cbs[i](name, descriptor);
    }

    if (typeof descriptor.value === 'object' && descriptor.value !== null) {
      descriptor.value = cloneWalk(descriptor.value, ...cbs);
    }

    Object.defineProperty(clone, name, descriptor);
  });

  return clone;
}
