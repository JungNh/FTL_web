declare namespace StylesScssNamespace {
  export interface IStylesScss {
    btn__options: string
    dictionary__modal: string
    'modal-content': string
    'modal-header': string
    'modal__header--title': string
    nav__container: string
    tab_EngEng: string
    tab_EngViet: string
    title: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
