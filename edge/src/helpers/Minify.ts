export const isJsURI = (uri: string) => uri.match(/\.m?js$/)?.length > 0
export const isCssURI = (uri: string) => uri.match(/\.css$/)?.length > 0

export const resolveNonMinifiedURI = (uri: string) => uri.replace(/\.min\.(m?js|css)$/, '.$1')

/**
 * Minify CSS
 */
export const minifyCSS = (code: string): string =>
  code
    // Comments
    // - remove /* comments */
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')
    // Trim
    // - remove newlines
    .replace(/\n+/g, '')
    // - trim spaces
    .replace(/\s*([,;{}])\s*/gm, '$1')
    // - remove ";" before "}"
    .replace(/;}/g, '}')
    // - remove spaces after ":"
    .replace(/: /g, ':')
    // Floats
    //-  replace 0.5 with .5
    .replace(/([: ])0\./g, '$1.')
    // Colors
    // - replace #333333 with #333 and #333333ff with #333
    .replace(/([: ])#(0-9a-f){6}(?:ff)?(?!\w)/gi, '$1#$1$1$1')
    // - replace named colors with hex
    .replace(/([: ])black(?!\w)/g, '$1#000')
    .replace(/([: ])white(?!\w)/g, '$1#fff')

/**
 * Minify JS
 */
export const minifyJS = (code: string): string =>
  code
    // remove comments
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '')
    .replace(/;\n */g, ';')
    // remove newlines
    .replace(/\n+/g, '')
    // remove tabs
    .replace(/\t+/g, ' ')
    // remove spaces
    .replace(/\s+(?= )/g, '')
