import {myStructure} from './structure'
import {defineConfig, defineField} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {colorInput} from '@sanity/color-input'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import wysiwyg from "./schemaTypes/fields/wysiwyg";

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const singletonTypes = new Set(['homepage', 'shop', 'about', 'beads', 'contacts', 'seo', 'privacy', 'cookies', 'terms'])

export default defineConfig({
  name: 'default',
  title: 'Lopes Pegna',

  projectId: 'vj46ri0x',
  dataset: 'production',

  plugins: [
		structureTool({
			structure: myStructure,
		}),
		visionTool(),
		media({
			locales: [
				{id: 'it', title: 'Italian'},
				{id: 'en', title: 'English'},
			],
		}),
		colorInput(),
		internationalizedArray({
			languages: [
				{id: 'it', title: 'Italian'},
				{id: 'en', title: 'English'},
			],
			defaultLanguages: ['it'],
			fieldTypes: [
				'string',
				'text',
				defineField({
					name: 'text2',
					type: 'text',
					rows: 2,
				}),
				'url',
				'slug',
				defineField(
					wysiwyg('Wysiwyg')
				)
			],
		}),
	],

	schema: {
		types: schemaTypes,
	},

	form: {
		image: {
			assetSources: () => [mediaAssetSource],
		},
	},

	document: {
		actions: (input, context) =>
			singletonTypes.has(context.schemaType)
				? input.filter(({ action }) => action && singletonActions.has(action))
				: input,
		badges: [StatusBadge]
	},
})


export function StatusBadge(props) {
	const status = props.published?.status || props.draft?.status
	if (!status) return null

	let color = 'primary'
	if (status === 'public') color = 'success'
	if (status === 'hidden') color = 'warning'

	return {
		label: status.charAt(0).toUpperCase() + status.slice(1),
		title: `Status: ${status}`,
		color,
	}
}