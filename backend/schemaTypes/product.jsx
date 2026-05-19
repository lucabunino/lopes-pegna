import { useFormValue } from 'sanity'
import ShopifyIcon from "./icons/shopify";

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  readOnly: true,
  fields: [
    {
      name: 'shopifyLink',
      title: 'Quick Links',
      type: 'string',
      components: {
        field: () => {
          const store = useFormValue(['store'])
          const productId = store?.id

          if (!productId) {
            return (
              <div style={{ 
                padding: '12px', border: '1px dashed #ccc', borderRadius: '8px',
                fontSize: '12px', color: '#666', marginBottom: '20px' 
              }}>
                ⌛ In attesa dei dati...
              </div>
            )
          }

          return (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
			  	<a 
					href={`https://admin.shopify.com/store/lopes-pegna/products/${productId}`}
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
      }
    },
    {
      name: 'store',
      title: 'Shopify Store',
      type: 'object',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'id', type: 'number' },
        { name: 'gid', title: 'Shopify GID', type: 'string' },
        { name: 'slug', type: 'slug' },
        { name: 'status', type: 'string' },
        { name: 'createdAt', title: 'Created at Shopify', type: 'datetime' },
        { name: 'isDeleted', type: 'boolean' },
        { 
          name: 'priceRange', 
          type: 'object',
          fields: [
            { name: 'minVariantPrice', type: 'number' },
            { name: 'maxVariantPrice', type: 'number' }
          ]
        },
        { name: 'previewImageUrl', title: 'Preview Image URL', type: 'string' },
        { name: 'productType', type: 'string' },
        { name: 'vendor', type: 'string' },
        { name: 'tags', type: 'string' },
        { name: 'descriptionHtml', title: 'HTML Description', type: 'text' },
        { 
          name: 'shop', 
          type: 'object',
          fields: [{ name: 'domain', type: 'string' }]
        },
        {
          name: 'options',
          type: 'array',
          of: [{
            type: 'object',
            name: 'option',
            fields: [
              { name: 'name', type: 'string' },
              { name: 'values', type: 'array', of: [{ type: 'string' }] }
            ]
          }]
        },
        {
          name: 'variants',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'productVariant' }], weak: true }]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'store.title',
      imageUrl: 'store.previewImageUrl',
      status: 'store.status',
      price: 'store.priceRange.minVariantPrice'
    },
    prepare({ title, imageUrl, status, price }) {
      return {
        title: title || 'Senza titolo',
        subtitle: `${status || 'no status'} €${price || 0}`,
        media: imageUrl ? <img src={imageUrl} alt={title} style={{ objectFit: 'cover' }} /> : null
      }
    }
  }
}