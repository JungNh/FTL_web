const { concat } = require('lodash')
const page = require('./plopconfig/page')
const component = require('./plopconfig/component')
const componentofpage = require('./plopconfig/componentofpage')

module.exports = plop => {
  plop.setHelper('openBrace', () => '{')
  plop.setHelper('closeBrace', () => '}')

  plop.setGenerator('page', page)

  plop.setGenerator('component', component)

  plop.setGenerator('componentofpage', componentofpage)
}
