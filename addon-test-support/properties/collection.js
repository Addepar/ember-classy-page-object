export function collection(definition) {
  const collectionDefinition = { isCollection: true };

  Object.assign(collectionDefinition, definition);

  return collectionDefinition;
}
