export const capitalize = (s: string, locale?: Intl.LocalesArgument) =>
  s.charAt(0).toLocaleUpperCase(locale) + s.slice(1)
