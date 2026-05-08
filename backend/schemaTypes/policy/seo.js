import { EarthGlobeIcon } from "@sanity/icons";
import seoFields from "../fields/seoFields";

export default {
	name: 'seo',
	type: 'document',
	icon: EarthGlobeIcon,
	fieldsets: [

	],
	fields: [
		{
			name: 'seoTitle',
			type: 'string',
			validation: Rule => Rule.required(),
		},
		...seoFields(),
	],
}