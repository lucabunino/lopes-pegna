import { RobotIcon, AccessDeniedIcon, TextIcon, BillIcon } from '@sanity/icons'

export default {
  name: 'policy',
  type: 'document',
  fieldsets: [

  ],
  fields: [
	{
		name: 'orderRank',
		type: 'string',
		hidden: true,
	},
    {
		name: 'title',
		type: 'internationalizedArrayString',
		validation: Rule => Rule.required(),
	},
	{
		name: 'slug',
		type: 'slug',
		validation: Rule => Rule.required(),
		options: {
			source: (doc) => doc.title?.find(m => m.language === 'en')?.value || doc.title?.[0]?.value,
			maxLength: 96,
		},
	},
	{
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Cookies', value: 'cookies' },
          { title: 'Privacy', value: 'privacy' },
          { title: 'Terms', value: 'terms' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio'
      }
    },
	{
		name: 'inFooter',
		type: 'boolean'
	},
	{
		name: 'content',
		type: 'internationalizedArrayWysiwyg',
    },
  ],
  preview: {
        select: {
            titleArray: 'title',
			kind: 'kind'
        },
        prepare(selection) {
            const { titleArray, kind } = selection;

            const itTitle = titleArray?.find(item => item.language === 'it')?.value;
            const enTitle = titleArray?.find(item => item.language === 'en')?.value;

            const mainTitle = itTitle || enTitle || 'No title set';
            const subTitle = itTitle && enTitle ? enTitle : '';

			const icons = {
				cookies: RobotIcon,
				privacy: AccessDeniedIcon,
				terms: TextIcon,
				other: BillIcon
			}

            return {
                title: mainTitle,
                subtitle: subTitle,
				media: icons[kind] || BillIcon
            };
        },
    },
}