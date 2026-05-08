import { EnvelopeIcon, ImageIcon, DocumentVideoIcon } from "@sanity/icons";

export default {
    name: 'contacts',
    type: 'document',
    icon: EnvelopeIcon,
	fieldsets: [
        { name: 'showroom', title: 'Showroom' },
    ],
    fields: [
        {
            name: 'title',
            type: 'string',
			hidden: true,
            validation: Rule => Rule.required(),
        },
		{
            name: 'heroMedia',
            title: 'Media',
            type: 'object',
			fieldsets: [
				{ name: 'desktop', title: 'Desktop' },
				{ name: 'mobile', title: 'Mobile (optional)' },
			],
            fields: [
				{ name: 'video', type: 'file', title: 'Video', fieldset: 'desktop', options: { accept: 'video/*' }, hidden: ({ parent }) => !!parent?.image?.asset },
                { name: 'poster', type: 'image', title: 'Poster', fieldset: 'desktop', hidden: ({ parent }) => !parent?.video?.asset },
                { name: 'image', type: 'image', title: 'Image', fieldset: 'desktop', hidden: ({ parent }) => !!parent?.video?.asset },
				{ name: 'videoMobile', type: 'file', title: 'Video mobile', fieldset: 'mobile', description: 'Optional', options: { accept: 'video/*' }, hidden: ({ parent }) => !!parent?.image?.asset },
                { name: 'posterMobile', type: 'image', title: 'Poster mobile', fieldset: 'mobile', description: 'Optional', hidden: ({ parent }) => !parent?.video?.asset },
                { name: 'imageMobile', type: 'image', title: 'Image mobile', fieldset: 'mobile', description: 'Optional', hidden: ({ parent }) => !!parent?.video?.asset },
            ],
        },
		{
			name: 'infoEmail',
			type: 'string',
		},
		{
			name: 'phone',
			type: 'string',
		},
		{
			name: 'salesEmail',
			type: 'string',
		},
		{
			name: 'instagram',
			type: "object",
			options: { columns: 2 },
			fields: [
				{
					name: 'instagramHandle',
					title: 'Handle',
					type: 'string',
				},
				{
					name: 'instagramHref',
					title: 'Href',
					type: 'url',
				},
			],
		},
		{
			name: 'showroomAdressLabel',
			title: 'Adress Label',
			type: 'internationalizedArrayText2',
			rows: 2,
			fieldset: 'showroom',
		},
		{
			name: 'showroomAdressHref',
			title: 'Adress Href',
			type: 'url',
			fieldset: 'showroom',
		},
		{
            name: 'slider',
            type: 'array',
            of: [
                { name: 'image', type: 'image', icon: ImageIcon },
                { 
                    name: 'videoItem', 
                    type: 'object', 
                    title: 'Video',
                    icon: DocumentVideoIcon,
                    fields: [
                        { name: 'video', type: 'file' },
                        { name: 'poster', type: 'image' }
                    ],
					preview: {
						select: {
							filename: 'video.asset.originalFilename',
							poster: 'poster'
						},
						prepare(selection) {
							const { filename, poster } = selection
							return {
								title: filename,
								media: poster || DocumentVideoIcon 
							}
						}
					}
                }
            ]
        },
		{
			name: 'appointmentText',
			type: 'internationalizedArrayText2',
		},
		{
            name: 'closingMedia',
            title: 'Media',
            type: 'object',
			fieldsets: [
				{ name: 'desktop', title: 'Desktop' },
				{ name: 'mobile', title: 'Mobile (optional)' },
			],
            fields: [
				{ name: 'video', type: 'file', title: 'Video', fieldset: 'desktop', options: { accept: 'video/*' }, hidden: ({ parent }) => !!parent?.image?.asset },
                { name: 'poster', type: 'image', title: 'Poster', fieldset: 'desktop', hidden: ({ parent }) => !parent?.video?.asset },
                { name: 'image', type: 'image', title: 'Image', fieldset: 'desktop', hidden: ({ parent }) => !!parent?.video?.asset },
				{ name: 'videoMobile', type: 'file', title: 'Video mobile', fieldset: 'mobile', description: 'Optional', options: { accept: 'video/*' }, hidden: ({ parent }) => !!parent?.image?.asset },
                { name: 'posterMobile', type: 'image', title: 'Poster mobile', fieldset: 'mobile', description: 'Optional', hidden: ({ parent }) => !parent?.video?.asset },
                { name: 'imageMobile', type: 'image', title: 'Image mobile', fieldset: 'mobile', description: 'Optional', hidden: ({ parent }) => !!parent?.video?.asset },
            ],
        },
    ],
}