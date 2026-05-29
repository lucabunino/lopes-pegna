import {DiamondIcon} from '@sanity/icons'
import seoFields from './fields/seoFields'

export default {
	name: 'beads',
	type: 'document',
	icon: DiamondIcon,
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
			name: 'heroMedia',
			title: 'Media',
			type: 'object',
			group: 'content',
			fieldsets: [
				{name: 'desktop', title: 'Desktop'},
				{name: 'mobile', title: 'Mobile (optional)'},
			],
			fields: [
				{name: 'video', type: 'file', title: 'Video', fieldset: 'desktop', options: {accept: 'video/*'}, hidden: ({parent}) => !!parent?.image?.asset},
				{name: 'poster', type: 'image', title: 'Poster', fieldset: 'desktop', hidden: ({parent}) => !parent?.video?.asset},
				{name: 'image', type: 'image', title: 'Image', fieldset: 'desktop', hidden: ({parent}) => !!parent?.video?.asset},
				{name: 'videoMobile', type: 'file', title: 'Video mobile', fieldset: 'mobile', description: 'Optional', options: {accept: 'video/*'}, hidden: ({parent}) => !!parent?.image?.asset},
				{name: 'posterMobile', type: 'image', title: 'Poster mobile', fieldset: 'mobile', description: 'Optional', hidden: ({parent}) => !parent?.video?.asset},
				{name: 'imageMobile', type: 'image', title: 'Image mobile', fieldset: 'mobile', description: 'Optional', hidden: ({parent}) => !!parent?.video?.asset},
			],
		},
		{
			name: 'content',
			type: 'internationalizedArrayWysiwyg',
			group: 'content',
		},
		...seoFields('seo'),
	],
}
