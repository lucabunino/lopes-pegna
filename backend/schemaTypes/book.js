import { BookIcon } from "@sanity/icons";

export default {
    name: 'book',
    type: 'document',
    icon: BookIcon,
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
            name: 'cover',
            type: 'image',
        },
		{
			name: 'coverBackground',
			type: 'color',
		},
		{
            name: 'info',
            type: 'internationalizedArrayText2',
        },
		{
            name: 'href',
            type: 'internationalizedArrayUrl',
        },
    ],
	preview: {
        select: {
            titleArray: 'title',
            media: 'cover',
        },
        prepare(selection) {
            const { titleArray, media } = selection;

            const itTitle = titleArray?.find(item => item.language === 'it')?.value;
            const enTitle = titleArray?.find(item => item.language === 'en')?.value;

            const mainTitle = itTitle || enTitle || 'No title set';
            const subTitle = itTitle && enTitle ? enTitle : '';

            return {
                title: mainTitle,
                subtitle: subTitle,
                media: media,
            };
        },
    },
}