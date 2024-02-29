import { renderSchema } from "./schema";

const testSchema = [
  {
    type: 'object',
    title: 'Test object',
    properties: {
      test1: {
        type: 'string',
        title: 'Test 1'
      },
      test2: {
        type: 'string',
        title: 'Test 2',
        enum: ['option 1', 'option 2', 3]
      }
    }
  }
]

for (const schema of testSchema) {
  console.log(renderSchema({ root: schema, schema, pathStack: [] }));
}
