module.exports = {
  description: 'Tạo một page mới',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Tên của page:',
    },
    {
      type: 'input',
      name: 'route',
      message: 'Đường dẫn tới page này:',
    },
  ],
  actions: [
    // =========== Add pages and route ===========
    {
      type: 'add',
      path: 'src/pages/{{pascalCase name}}/index.tsx',
      templateFile: 'plop-templates/template/Page.tsx.hbs',
    },
    {
      type: 'add',
      path: 'src/pages/{{pascalCase name}}/styles.scss',
      templateFile: 'plop-templates/template/styles.scss.hbs',
    },
    {
      type: 'append',
      path: 'src/routes.tsx',
      pattern: '/* PLOP_IMPORT */',
      template: 'import {{pascalCase name}} from \'./pages/{{pascalCase name}}\'',
    },
    {
      type: 'append',
      path: 'src/routes.tsx',
      pattern: '{/* PLOP_ROUTE */}',
      template: '      <Route exact path="/{{route}}" component={{openBrace}}{{pascalCase name}}{{closeBrace}} />',
    },

    // ============ add store function ============
    {
      type: 'add',
      path: 'src/store/{{camelCase name}}/actions.ts',
      templateFile: 'plop-templates/store/actions.ts.hbs',
    },
    {
      type: 'add',
      path: 'src/store/{{camelCase name}}/reducer.ts',
      templateFile: 'plop-templates/store/reducer.ts.hbs',
    },
    {
      type: 'add',
      path: 'src/store/{{camelCase name}}/states.ts',
      templateFile: 'plop-templates/store/states.ts.hbs',
    },
    {
      type: 'add',
      path: 'src/store/{{camelCase name}}/types.ts',
      templateFile: 'plop-templates/store/types.ts.hbs',
    },
    {
      type: 'append',
      path: 'src/store/index.ts',
      pattern: '/* PLOP IMPORT STORE */',
      template: 'import {{camelCase name}}States from \'./{{camelCase name}}/states\'',
    },
    {
      type: 'append',
      path: 'src/store/index.ts',
      pattern: '/* PLOP STORE STATE */',
      template: '  {{camelCase name}}: {{camelCase name}}States,',
    },
    {
      type: 'append',
      path: 'src/store/index.ts',
      pattern: '/* PLOP IMPORT STORE */',
      template: 'import {{camelCase name}}Reducer from \'./{{camelCase name}}/reducer\'',
    },
    {
      type: 'append',
      path: 'src/store/index.ts',
      pattern: '/* PLOP STORE REDUCER */',
      template: '    {{camelCase name}}: {{camelCase name}}Reducer,',
    },
  ],
}
