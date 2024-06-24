declare namespace StylesScssNamespace {
  export interface IStylesScss {
    'course__general--info': string
    course__name: string
    course__note: string
    course__progress: string
    course__status: string
    course__tag: string
    logo__container: string
    leaderboard: string
    logo__subtitle: string
    logo__title: string
    'logo__title--text': string
    'logo__title--time': string
    overlay: string
    progess__line: string
    tag__container: string
    yellow__color: string
  }
}

declare const StylesScssModule: StylesScssNamespace.IStylesScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesScssNamespace.IStylesScss
}

export = StylesScssModule
