import React from 'react'
import { useFormValue } from 'sanity'

export default {
  name: 'productVariant',
  title: 'Product Variant',
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
          const productId = store?.productId
          const variantId = store?.id

          if (!productId || !variantId) {
            return (
              <div style={{ 
                padding: '12px', border: '1px dashed #ccc', borderRadius: '8px',
                fontSize: '12px', color: '#666' 
              }}>
                ⌛ In attesa dei dati variante...
              </div>
            )
          }

          return (
            <div style={{ marginBottom: '20px' }}>
              <a 
                href={`https://admin.shopify.com/store/lopes-pegna/products/${productId}/variants/${variantId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  backgroundColor: '#95bf47',
                  color: '#111',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                Shopify Variant Admin ↗
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
        { name: 'sku', title: 'SKU', type: 'string' },
        { name: 'id', type: 'number' },
        { name: 'productId', type: 'number' },
        { name: 'gid', title: 'Shopify GID', type: 'string' },
        { name: 'productGid', title: 'Shopify product GID', type: 'string' },
        { name: 'slug', type: 'slug' },
        { name: 'status', type: 'string' },
        { name: 'createdAt', title: 'Created at Shopify', type: 'datetime' },
        { name: 'isDeleted', type: 'boolean' },
        { name: 'price', type: 'number' },
        { name: 'compareAtPrice', type: 'number' },
        { 
          name: 'inventory', 
          type: 'object', 
          fields: [
            { name: 'management', type: 'string' },
            { name: 'policy', type: 'string' },
            { name: 'quantity', type: 'number' },
            { name: 'isAvailable', type: 'boolean' },
          ]
        },
        { name: 'option1', type: 'string' },
        { name: 'option2', type: 'string' },
        { name: 'option3', type: 'string' },
        { 
          name: 'shop', 
          type: 'object',
          fields: [
            { name: 'domain', type: 'string' },
          ]
        },
        { name: 'previewImageUrl', type: 'string' },
      ]
    }
  ],
  preview: {
    select: {
      title: 'store.title',
      price: 'store.price',
      sku: 'store.sku',
      imageUrl: 'store.previewImageUrl',
    },
    prepare({ title, price, sku, imageUrl }) {
      return {
        title: title || 'Default Variant',
        subtitle: `€${price || '0'} ${sku ? `— SKU: ${sku}` : ''}`,
        media: imageUrl ? <img src={imageUrl} alt={title} style={{ objectFit: 'cover' }} /> : null
      }
    }
  }
}