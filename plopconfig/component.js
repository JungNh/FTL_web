module.exports = {
  description: 'Tạo một component mới',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Tên của component:',
    },
  ],
  actions: [
    // =========== Add components===========
    {
      type: 'add',
      path: 'src/components/{{pascalCase name}}/index.tsx',
      templateFile: 'plop-templates/template/Component.tsx.hbs',
    },
    {
      type: 'add',
      path: 'src/components/{{pascalCase name}}/styles.scss',
      templateFile: 'plop-templates/template/stylesComponent.scss.hbs',
    },
    {
      type: 'append',
      path: 'src/components/index.ts',
      pattern: '/* PLOP IMPORT COMPONENT */',
      template: 'import {{pascalCase name}} from \'./{{pascalCase name}}\'',
    },
    {
      type: 'append',
      path: 'src/components/index.ts',
      pattern: '/* PLOP EXPORT COMPONENT */',
      template: '{{pascalCase name}},',
    },
  ],
}
