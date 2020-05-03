/**
 * indexer that is open to any value
 */
export type StringMap = { [key: string]: any };

export type FormatFunction = (value: any, format?: string, lng?: string) => string;

export interface Logger {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export interface I18nOptions {
  /**
   * Logs info level to console output. Helps finding issues with loading not working.
   * @default false
   */
  debug?: boolean;

  /**
   * Resources map (key => translation)
   * @default {}
   */
  resources?: StringMap;

  /**
   * Language to use for pluralization handling
   * @default undefined
   */
  lng?: string;

  /**
   * After how many interpolation runs to break out before throwing a stack overflow
   * @default 1000
   */
  maxReplaces?: number;

  /**
   * Format function see formatting for details
   * @default noop
   */
  interpolationFormat?: FormatFunction;

  /**
   * Override the built-in console logger.
   */
  logger?: Logger;
}

export interface TOptionsBase {
  /**
   * Default value to return if a translation was not found
   */
  defaultValue?: any;
  /**
   * Count value used for plurals
   */
  count?: number;
  /**
   * Used for contexts (eg. male\female)
   */
  context?: any;
}

/**
 * Options that allow open ended values for interpolation unless type is provided.
 */
export type TOptions<TInterpolationMap extends object = StringMap> = TOptionsBase &
  TInterpolationMap;

/**
 * Uses similar args as the t function and returns true if a key exists.
 */
export interface ExistsFunction<
  TKeys extends string = string,
  TInterpolationMap extends object = StringMap
> {
  (key: TKeys | TKeys[], options?: TOptions<TInterpolationMap>): boolean;
}

export interface WithT {
  // Expose parameterized t in the i18next interface hierarchy
  t: TFunction;
}

export type TFunctionResult = string | object | Array<string | object> | undefined | null;
export type TFunctionKeys = string | TemplateStringsArray;
export interface TFunction {
  // basic usage
  <TResult extends TFunctionResult = string, TInterpolationMap extends object = StringMap>(
    key: string | string[],
    options?: TOptions<TInterpolationMap> | string,
  ): TResult;
  // overloaded usage
  <TResult extends TFunctionResult = string, TKeys extends TFunctionKeys = string>(
    key: TKeys | TKeys[],
    defaultValue?: string,
  ): TResult;
}

export class Interpolator {
  constructor(options: I18nOptions);
  reset(): undefined;
  resetRegExp(): undefined;
  interpolate(str: string, data: object, lng: string, options: TOptions): string;
  nest(str: string, t: (...args: any[]) => any, lng: string, options: TOptions): string;
}

// helper to identify class https://stackoverflow.com/a/45983481/2363935
export type Newable<T> = { new (...args: any[]): T };

export interface I18nT {
  // Expose parameterized t in the i18next interface hierarchy
  t: TFunction;

  /**
   * Uses similar args as the t function and returns true if a key exists.
   */
  exists: ExistsFunction;

  /**
   * Returns rtl or ltr depending on languages read direction.
   */
  dir(lng?: string): 'ltr' | 'rtl';
}

export type I18n = (options: I18nOptions) => I18nT;

export default I18n;
