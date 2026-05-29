export default function seoFields(groupName) {
	return [
		{
			name: 'seoDescription',
			description: 'Optional. Fallback preview text for search engines and social sharing. Suggested length is 120–158 characters (including spaces).',
			type: 'internationalizedArrayText',
			group: groupName,
		},
		{
			name: 'seoImage',
			description: 'Optional. Fallback preview image for social sharing. Suggested dimension is 1200x630px.',
			type: 'image',
			group: groupName,
		}
	]
}
