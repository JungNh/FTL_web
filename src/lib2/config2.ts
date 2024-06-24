// const isDevEnv = process.env.NODE_ENV === 'development'
// const isProductionEnv = process.env.NODE_ENV === 'production'

const api2 = { apiBaseUrl2: '' }
// List api for development here
// const apiProduct = process.env.REACT_APP_API_V2 // * api cho production
const apiDevelop = process.env.REACT_APP_API_V2 // * api cho dev

// api2.apiBaseUrl2 = (isProductionEnv ? apiProduct : apiDevelop) as string
api2.apiBaseUrl2 = process.env.REACT_APP_API_V2 as string

// Builf API enpoint in file .env
// if (isProductionEnv) {
//   api2.apiBaseUrl2 = process.env.REACT_APP_API_V2 || ''
// }

export default api2
