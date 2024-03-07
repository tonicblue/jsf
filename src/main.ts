import './style.css'
import { renderSchema, resolveSchemaPath } from './schema';
import S from 'fluent-json-schema';
import { renderHtmlNode } from './renderer';

const output: string[] = [];
const testSchema: any[] = [
  S.object()
    .title('Test object')
    .prop('test1', S.string().title('Test 1').format(S.FORMATS.URI))
    .prop('test2', S.string().title('Test 2').enum(['option 1', 'option 2', 'option 3']))
    .valueOf(),

  {
    type: 'object',
    title: 'Test object',
    properties: {
      test1: {
        type: 'string',
        title: 'Test 1',
        format: 'uri'
      },
      test2: {
        type: 'string',
        title: 'Test 2',
        enum: ['option 1', 'option 2', 'option 3'],
        $input: {
          type: 'radio'
        }
      }
    },
    allOf: [
      {
        type: 'object',
        title: 'Personal info',
        properties: {
          name: {
            type: 'string',
            title: 'Name'
          },
          age: {
            type: 'integer',
            title: 'Age',
            minimum: 13,
            maximum: 130,
          }
        }
      },
      {
        type: 'object',
        title: 'Address',
        properties: {
          streetAddress: {
            type: 'string',
            title: 'Street address'
          },
          postcode: {
            type: 'string',
            title: 'Postcode'
          }
        }
      }
    ],
    oneOf: [
      {
        type: 'object',
        title: 'Test other one',
        properties: {
          test_other_1_1: {
            type: 'string',
            title: 'Test other one 1'
          },
          test_other_1_2: {
            type: 'string',
            title: 'Test other one 2'
          },
        },
      },

      {
        type: 'object',
        title: 'Test other two',
        properties: {
          test_other_2_1: {
            type: 'string',
            title: 'Test other two 1'
          },
          test_other_2_2: {
            type: 'string',
            title: 'Test other two 2'
          },
        }
      },
    ]
  }
];

for (const schema of testSchema) {
  output.push(renderSchema({ root: schema, schema, pathStack: [] }));
}

const resolveTests = [
  {
    schema: testSchema[1],
    path: '/properties/test1',
  },
  {
    schema: testSchema[1],
    path: '/oneOf/1/properties/test_other_2_1',
  },
]

for (const { schema, path } of resolveTests) {
  output.push(renderHtmlNode('pre', {},
    `Resolving: ${path}\n`,
    JSON.stringify(resolveSchemaPath(schema, path), null, 2),
  ));
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = output.join('\n');
