/**
 * indexer that is open to any value
 */
export type StringMap = { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

export type FormatFunction = (value: any, format?: string, lng?: string) => string; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface Logger {
  log(...args: any[]): void; // eslint-disable-line @typescript-eslint/no-explicit-any
  warn(...args: any[]): void; // eslint-disable-line @typescript-eslint/no-explicit-any
  error(...args: any[]): void; // eslint-disable-line @typescript-eslint/no-explicit-any
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
  defaultValue?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Count value used for plurals
   */
  count?: number;
  /**
   * Used for contexts (eg. male\female)
   */
  context?: string;
}

/**
 * Options that allow open ended values for interpolation unless type is provided.
 */
export type TOptions<TInterpolationMap extends object = StringMap> = TOptionsBase & TInterpolationMap;

/**
 * Uses similar args as the t function and returns true if a key exists.
 */
export interface ExistsFunction<TKeys extends string = string, TInterpolationMap extends object = StringMap> {
  (key: TKeys | TKeys[], options?: TOptions<TInterpolationMap>): boolean;
}

export type TFunctionResult = string | undefined | null;
export type TFunctionKeys = string | TemplateStringsArray;
export interface TFunction {
  // basic usage
  <
    TResult extends TFunctionResult = string,
    TKeys extends TFunctionKeys = string,
    TInterpolationMap extends object = StringMap
  >(
    key: string | string[],
    options?: TOptions<TInterpolationMap>
  ): TResult;
  // overloaded usage
  <
    TResult extends TFunctionResult = string,
    TKeys extends TFunctionKeys = string,
    TInterpolationMap extends object = StringMap
  >(
    key: TKeys | TKeys[],
    defaultValue?: string
  ): TResult;
}

export interface Interpolator {
  interpolate(str: string, data: object, lng: string, options: TOptions): string;
  nest(str: string, t: TFunction, lng: string, options: TOptions): string;
}

export type InterpolatorFactory = (options: I18nOptions) => Interpolator;

export class Translator {
  exists(keys: string | string[], options: TOptions): boolean;
  translate: TFunction;
  resolve(
    keys: string | string[],
    options: TOptions
  ): { res: string; usedKey: string; exactUsedKey: string } | undefined;
}

export interface I18n {
  /*
   * Expose the options
   */
  options: TOptions;

  /*
   * Expose the translator instance
   */
  interpolator: Interpolator;

  /*
   * Expose the translator instance
   */
  translator: Translator;

  /*
   * Expose parameterized t in the i18next interface hierarchy
   */
  t: TFunction;

  /**
   * Uses similar args as the t function and returns true if a key exists.
   */
  exists: ExistsFunction;

  /**
   * Returns rtl or ltr depending on languages read direction.
   */
  dir(lng?: string): "ltr" | "rtl";
}

declare let i18next: (options?: I18nOptions) => I18n;

export default i18next;
