import deepMergeDescriptors from '../utils/deep-merge-descriptors';

export function collection(definition) {
  const collectionDefinition = { isCollection: true };

  deepMergeDescriptors(collectionDefinition, definition);

  return collectionDefinition;
}
