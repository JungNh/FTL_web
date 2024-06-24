declare namespace StylesScssNamespace {
  export interface IStylesScss {
    'course__item--bigNotDone': string
    'course__item--name': string
    'course__item--text': string
    logo__course: string
    percent__progress: string
    'progress__bar--notdone': string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
