import { InfoFilledIcon } from "@sanity/icons";

export default {
    name: 'info',
    type: 'document',
    icon: InfoFilledIcon,
    fields: [
        {
            name: 'title',
            type: 'string',
			hidden: true,
            validation: Rule => Rule.required(),
        },
		{
			name: 'vat',
			type: 'string',
		},
		{
			name: 'credits',
			type: 'internationalizedArrayWysiwyg',
		},
    ],
}