/**
 * Validates given data against a Zod schema.
 *
 * @param {import("zod").AnyZodType} schema
 * @param {unknown} data
 * @returns {import("zod").SafeParseReturnType<unknown>}
 */
const validateSchema = (schema, data) => {
  const validate = schema.safeParse(data);
  return validate;
};

export { validateSchema };
