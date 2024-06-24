declare namespace StylesScssNamespace {
  export interface IStylesScss {
    btn__functional: string
    continue__btn: string
    img__functional: string
    'img__functional--holder': string
    navbarTest__components: string
    'progess__btn-functional': string
    progess__line: string
    progess__text: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
