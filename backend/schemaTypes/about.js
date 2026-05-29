import { InfoOutlineIcon } from '@sanity/icons'
import seoFields from './fields/seoFields'
import wysiwyg from './fields/wysiwyg'

export default {
	name: 'about',
	type: 'document',
	icon: InfoOutlineIcon,
	groups: [
		{name: 'content'},
		{name: 'seo', title: 'Seo'},
	],
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
			validation: Rule => Rule.required(),
			group: 'content',
		},
		{
			name: 'beadsImages',
			title: 'Images (max 2)',
			type: 'array',
			of: [{type: 'image'}],
			validation: Rule => Rule.max(2).error('Massimo 2 immagini consentite'),
			options: {layout: 'grid'},
			group: 'content',
		},
		{
			name: 'content',
			type: 'internationalizedArrayWysiwyg',
			group: 'content',
		},
		...seoFields('seo'),
	],
}
