export default {
  name: 'cookies',
  type: 'document',
  fieldsets: [

  ],
  fields: [
    {
		name: 'title',
		type: 'string',
		validation: Rule => Rule.required(),
	},
	{
		name: 'slug',
		type: 'slug',
		validation: Rule => Rule.required(),
		options: {
			source: 'title',
			maxLength: 96,
		},
	},
    {
		name: 'content',
		type: 'array',
		of: [
			{
			type: 'block',
			}
		]
    },
  ],
}