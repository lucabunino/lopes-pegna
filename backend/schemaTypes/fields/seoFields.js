export default function seoFields(groupName) {
	return [
		{
			name: 'seoDescription',
			description: 'Optional. To be used as fallback preview text of website’s pages. Suggested length is 120–158 characters (including spaces).',
			type: 'text',
			rows: 5,
			group: groupName,
		},
		{
			name: 'seoImage',
			description: 'Optional. To be used as fallback preview image of website’s pages. Suggested dimension is 1200x630px.',
			type: 'image',
			group: groupName,
		}
	]
}