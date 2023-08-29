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
    .replace(/^\s+/gm, '')
    // - remove ";" before "}"
    .replace(/;}/g, '}')
    // - remove spaces after ":"
    .replace(/:\s+/g, ':')
    // Floats
    //-  replace 0.5 with .5
    .replace(/([: ])0\./g, '$1.')
    // Colors
    // - replace #333333 with #333 and #333333ff with #333
    .replace(/([: ])#([0-9a-f]){6}(?:ff)?(?!\w)/gi, '$1#$2$2$2')
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
    // trim spaces
    .replace(/^[\s\n]+/, '')
    .replace(/[\s\n]+$/, '')
    // remove newlines
    .replace(/,\s*\n[\s\n]*([}\]])/g, '$1')
    .replace(/\s*\n[\s\n]*/g, ' ')
    .replace(/;\s*}/g, '}')
    // remove tabs
    .replace(/\t+/g, ' ')
    // trim spaces
    .replace(/\s+(?= )/g, '')
    .replace(/^\s+/gm, '')
