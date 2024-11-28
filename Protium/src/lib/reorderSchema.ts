

export default function reorderProperties(schema: {
  type: string;
  items: { type: string; properties: any[] };
}): object {
  if (schema.type === 'array') {
    if (schema.items.type === 'object') {
      const properties = schema.items.properties;

      // Create an array from the properties object
      const propertiesArray = Object.entries(properties);

      // Sort the array based on the 'order' property
      propertiesArray.sort(([, a], [, b]) => {
        if (a.order === undefined) return 1; // If 'a' has no order, it goes to the end
        if (b.order === undefined) return -1; // If 'b' has no order, it goes to the end
        return a.order - b.order; // Otherwise, sort by order
      });

      // Create a new properties object from the sorted array
      const sortedProperties = Object.fromEntries(propertiesArray);

      // Return the new schema with sorted properties
      return {
        ...schema,
        items: {
          ...schema.items,
          properties: sortedProperties,
        },
      };
    }
  }

  // If the schema does not match the expected structure, return it as is
  return schema;
}
