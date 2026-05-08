import { InfoOutlineIcon } from "@sanity/icons";
import wysiwyg from "./fields/wysiwyg";

export default {
	name: 'about',
	type: 'document',
	icon: InfoOutlineIcon,
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
			validation: Rule => Rule.required(),
		},
		{
            name: 'beadsImages',
            title: 'Images (max 2)',
            type: 'array',
            of: [{ type: 'image' }],
            validation: Rule => Rule.max(2).error('Massimo 2 immagini consentite'),
			options: { layout: 'grid' },
        },
		{
			name: 'content',
			type: 'internationalizedArrayWysiwyg',
		},
	],
}