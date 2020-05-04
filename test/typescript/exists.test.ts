import i18next from 'i18next';

const i18n = i18next();

i18n.exists('friend');
i18n.exists(['friend', 'tree']);
i18n.exists('friend', { myVar: 'someValue' });
i18n.exists(['friend', 'tree'], { myVar: 'someValue' });

const a: boolean = i18n.exists('my.key');
