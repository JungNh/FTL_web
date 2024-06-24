module.exports = {
  description: 'Tạo một component trong page',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Tên của component:',
    },
    {
      type: 'input',
      name: 'ofpage',
      message: 'Component này thuộc page nào?',
    },
  ],
  actions: [
    // =========== Add components of page ===========
    {
      type: 'add',
      path: 'src/pages/{{ofpage}}/components/{{pascalCase name}}.tsx',
      templateFile: 'plop-templates/template/ComponentOfPage.tsx.hbs',
    },
  ],
}
