const isDevEnv = process.env.NODE_ENV === 'development'
const isProductionEnv = process.env.NODE_ENV === 'production'

const api = { apiBaseUrl: '' }
// List api for development here
const apiProduct = process.env.REACT_APP_END_POINT // * api cho production
const apiDevelop = process.env.REACT_APP_END_POINT // * api cho dev

api.apiBaseUrl = (isProductionEnv ? apiProduct : apiDevelop) as string

// Builf API enpoint in file .env
if (isProductionEnv) {
  api.apiBaseUrl = process.env.REACT_APP_END_POINT || ''
}

export default api
