import { BillIcon, BasketIcon, DocumentsIcon } from "@sanity/icons";
import ShopifyIcon from "./icons/shopify";

export default {
    name: 'shop',
    type: 'document',
    icon: BasketIcon,
	groups: [
        { name: 'shop', title: 'Shop', icon: ShopifyIcon },
        { name: 'cart', title: 'Cart', icon: BasketIcon },
        { name: 'policies', title: 'Policies', icon: BillIcon },
    ],
    fields: [
		{
            name: 'title',
            type: 'string',
			hidden: true,
            validation: Rule => Rule.required(),
        },
		{
			name: 'shopifyLinks',
			type: 'string',
			components: {
				field: () => {
				return (
					<div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
					<a 
						href={`https://admin.shopify.com/store/lopes-pegna`} 
						target="_blank" 
						rel="noopener noreferrer"
						style={{
						display: 'flex', alignItems: 'center', gap: '8px',
						padding: '8px 12px', backgroundColor: '#f4f4f4', border: '1px solid #ccc',
						borderRadius: '4px', textDecoration: 'none', color: '#333', fontSize: '13px'
						}}
					>
						<ShopifyIcon />
						View in Shopify Admin ↗
					</a>
					</div>
				)
				}
			},
			group: 'shop',
		},
        {
            name: 'heroMedia',
            type: 'object',
            fields: [
				{ name: 'video', type: 'file', title: 'Video', options: { accept: 'video/*' }, hidden: ({ parent }) => !!parent?.image?.asset },
                { name: 'poster', type: 'image', title: 'Poster', hidden: ({ parent }) => !parent?.video?.asset },
                { name: 'image', type: 'image', title: 'Image', hidden: ({ parent }) => !!parent?.video?.asset },
            ],
			group: 'shop',
        },
		{
			name: 'cartInfo',
			type: 'internationalizedArrayWysiwyg',
			group: 'cart',
		},
		{
            name: 'shopPolicies',
            description: 'Select and order the policies to display in the Shop section (Shipping, Maintenance, Gifts, etc.)',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'policy' }],
                }
            ],
			group: 'policies',
        }
    ],
}