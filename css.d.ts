/**
 * Side-effect imports of stylesheets carry no runtime type surface.
 * TypeScript 6 rejects such imports without an explicit module declaration.
 */
declare module '*.css'
