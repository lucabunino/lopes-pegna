import { HomeIcon, ImageIcon, ProjectsIcon, InfoOutlineIcon, DocumentVideoIcon, StarIcon } from "@sanity/icons";
import { Preview } from "sanity";

export default {
    name: 'homepage',
    type: 'document',
    icon: HomeIcon,
    groups: [
        { name: 'hero', title: 'Hero', icon: HomeIcon },
		{ name: 'products', title: 'Products', icon: StarIcon },
        { name: 'about', title: 'About', icon: InfoOutlineIcon },
        { name: 'sets', title: 'Sets', icon: ProjectsIcon },
        { name: 'beads', title: 'Beads', icon: ImageIcon },
    ],
    fieldsets: [
        { name: 'hero', title: 'Hero' },
		{ name: 'products', title: 'Products', icon: StarIcon },
        { name: 'about', title: 'About' },
        { name: 'sets', title: 'Sets' },
        { name: 'beads', title: 'Beads' },
    ],
    fields: [
        {
            name: 'title',
            type: 'string',
			hidden: true,
            validation: Rule => Rule.required(),
        },
        {
            name: 'heroText',
            title: 'Text',
            type: 'internationalizedArrayText2',
            group: 'hero',
			fieldset: 'hero',
        },
		{
            name: 'heroMedia',
            title: 'Media',
            type: 'object',
            group: 'hero',
			fieldset: 'hero',
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
            name: 'productsText',
			title: 'Text',
            type: 'internationalizedArrayText2',
            group: 'products',
			fieldset: 'products',
        },
		{
            name: 'products',
			title: 'Selection',
            type: 'array',
            group: 'products',
			fieldset: 'products',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'product' }],
                }
            ],
            validation: Rule => Rule.unique().max(4)
        },
		{
            name: 'aboutSlider1',
			title: 'Slider 1',
            type: 'array',
            group: 'about',
			fieldset: 'about',
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
            name: 'aboutText1',
			title: 'Text 1',
            type: 'internationalizedArrayText2',
            group: 'about',
			fieldset: 'about',
        },
        {
            name: 'aboutText2',
			title: 'Text 2',
            type: 'internationalizedArrayText2',
            group: 'about',
			fieldset: 'about',
        },
		{
            name: 'aboutSlider2',
			title: 'Slider 2',
            type: 'array',
            group: 'about',
			fieldset: 'about',
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
            name: 'setsProducts',
			title: 'Products',
            type: 'array',
            group: 'sets',
			fieldset: 'sets',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'product' }],
                }
            ],
            validation: Rule => Rule.unique().max(6)
        },
		{
            name: 'setsText',
			title: 'Text',
            type: 'internationalizedArrayText2',
            group: 'sets',
			fieldset: 'sets',
        },
        {
            name: 'setsMedia',
			title: 'Media',
            type: 'object',
            group: 'sets',
			fieldset: 'sets',
            fields: [
                { name: 'video', type: 'file', title: 'Video', options: { accept: 'video/*' }, hidden: ({ parent }) => !!parent?.image?.asset },
                { name: 'poster', type: 'image', title: 'Poster', hidden: ({ parent }) => !parent?.video?.asset },
                { name: 'image', type: 'image', title: 'Image', hidden: ({ parent }) => !!parent?.video?.asset },
            ]
        },
        {
            name: 'beadsText',
            title: 'Text',
            type: 'internationalizedArrayText2',
            group: 'beads',
			fieldset: 'beads',
        },
		{
            name: 'beadsImages',
			title: 'Images (max 2)',
            type: 'array',
            group: 'beads',
			fieldset: 'beads',
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
            ],
			validation: Rule => Rule.max(2).error('Max 2 images allowed'),
        },
    ],
}