import i18next, { Modules, LanguageDetectorModule, LoggerModule, ThirdPartyModule } from 'i18next';

const languageDetectorModule: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => null,
  detect: () => '',
  cacheUserLanguage: () => null,
};

const loggerModule: LoggerModule = {
  type: 'logger',
  log: () => null,
  warn: () => null,
  error: () => null,
};

const thirdPartyModule: ThirdPartyModule = {
  type: '3rdParty',
  init: () => null,
};

const externalModules = [thirdPartyModule];

const modules: Modules = {
  languageDetector: languageDetectorModule,
  logger: loggerModule,
  external: externalModules,
};

i18next.use(languageDetectorModule);
i18next.use(loggerModule);
i18next.use(externalModules);

// exercise class usage
class MyLoggerModule implements LoggerModule {
  type: 'logger' = 'logger';
  log = () => null;
  warn = () => null;
  error = () => null;
}

i18next.use(MyLoggerModule);
