import i18next, { TOptions, TFunction } from 'i18next';

const i18n = i18next();

interface InterpolationValues {
  myVar: string;
}
type Keys = 'friend' | 'tree';

// check keys
i18n.t<string, Keys>('friend', { myVar: 'someValue' });
i18n.t<string, Keys>(['friend', 'tree'], { myVar: 'someValue' });

// check interpolation values
i18n.t<string, Keys, InterpolationValues>('friend', { myVar: 'someValue' });
i18n.t<string, Keys, InterpolationValues>(['friend', 'tree'], { myVar: 'someValue' });

// NOTION: disable no-unnecessary-generics for generic pattern test.
/* tslint:disable:no-unnecessary-generics */
interface WithT {
  t: TFunction;
}
interface ExWithT extends WithT {
  // t: TFunction;
  t<CustomKeys extends Keys = Keys, Val extends object = object, R = string>(
    keys: CustomKeys | CustomKeys[],
    options?: TOptions<Val>,
  ): R;
  t<CustomKeys extends OtherKeyList = OtherKeyList, Val extends object = object, R = string>(
    keys: CustomKeys | CustomKeys[],
    options?: TOptions<Val>,
  ): R;
  t<CustomKeys extends string = Keys, R = string>(keys: CustomKeys | CustomKeys[]): R;
}

type OtherKeyList = 'private' | 'public';

(i18n as ExWithT).t('friend');
(i18n as ExWithT).t('tree');
(i18n as ExWithT).t('private');
(i18n as ExWithT).t('public');
(i18n as ExWithT).t('friend', {});
(i18n as ExWithT).t('private', {});
(i18n as ExWithT).t<Keys, { myVar: 'someValue' }>('friend', { myVar: 'someValue' });
(i18n as ExWithT).t<OtherKeyList, { myVar: 'someValue' }>('private', { myVar: 'someValue' });
const result = (i18n as ExWithT).t<Keys, { myVar: 'someValue' }, { result: 'result' }>('friend', {
  myVar: 'someValue',
});
type Check<T extends { result: 'result' }> = T;
type ExWithTResult = Check<typeof result>;
