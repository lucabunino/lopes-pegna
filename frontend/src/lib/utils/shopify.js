import { PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN, PUBLIC_SHOPIFY_API_URL } from '$env/static/public';

/**
 * @param {string} query - GraphQL query
 * @param {object} variables - Query variables
 * @param {string} buyerIP - The IP address of the client (from getClientAddress())
 */
export async function shopifyFetch({ query, variables, lang = 'it', country = 'IT', buyerIP = '' }) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
        };

        if (buyerIP) {
            headers['Shopify-Storefront-Buyer-IP'] = buyerIP;
        }

        const result = await fetch(PUBLIC_SHOPIFY_API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables: {
                    ...variables,
                    language: lang.toUpperCase(),
					country: country.toUpperCase()
					// country: "US"
                }
            })
        });

        const { data, errors } = await result.json();
        if (errors) {
            console.error('Shopify GraphQL Errors:', errors);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Shopify connection failed:', error);
        return null;
    }
}

export const GET_LOCALIZATION = `
  query getLocalization($language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    localization {
      country {
        isoCode
        name
      }
    }
  }
`;

export const GET_PRODUCTS_BY_IDS = `
  query getProductsByIds($ids: [ID!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    localization {
      country { isoCode name }
      language { isoCode name }
    }
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
		availableForSale
        category { name }
        variants(first: 1) {
          nodes {
            id
			compareAtPrice {
				amount
				currencyCode
			}
			components(first: 10) {
				nodes {
					productVariant {
						id
					}
				}
			}
          }
        }
		collections(first: 1) {
          nodes {
            handle
            title
            singular: metafield(namespace: "custom", key: "singular_name") { value }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 2) {
          nodes { 
            url 
            lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
            altText 
            width 
            height 
          }
        }
        metafield(namespace: "custom", key: "details") { value }
      }
      ... on ProductVariant {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
		compareAtPrice {
          amount
          currencyCode
        }
        image {
          url
          lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
          altText
          width
          height
        }
        product {
          id
          title
          handle
          collections(first: 1) {
            nodes {
              handle
              title
              singular: metafield(namespace: "custom", key: "singular_name") { value }
            }
          }
          images(first: 1) {
            nodes {
              url
              lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = `
  query getProducts($language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    localization {
      country { isoCode name }
      language { isoCode name }
    }
    products(first: 250) {
      nodes {
        id
        title
        handle
        createdAt
        availableForSale
        collections(first: 1) {
          nodes {
            handle
            title
            singular: metafield(namespace: "custom", key: "singular_name") { value }
          }
        }
        listImage: metafield(namespace: "custom", key: "list_image") {
          reference {
            ... on MediaImage {
              image {
                url
                lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
                altText
                width
                height
              }
            }
          }
        }
        variants(first: 1) {
          nodes {
            id
			compareAtPrice {
				amount
				currencyCode
			}
			components(first: 10) {
				nodes {
					productVariant {
						id
					}
				}
			}
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 2) {
          nodes { 
            url 
            lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
            altText 
            width 
            height 
          }
        }
      }
    }
  }
`;

export const GET_BUNDLES = `
  query getBundles($language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    products(first: 250, query: "collection:set") {
      nodes {
        id
        title
        handle
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          nodes {
            url
            lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
            altText
            width
            height
          }
        }
        variants(first: 1) {
          nodes {
            id
			compareAtPrice {
				amount
				currencyCode
			}
            components(first: 20) {
              nodes {
                productVariant {
                  id
                }
              }
            }
          }
        }
		collections(first: 1) {
          nodes {
            handle
            title
            singular: metafield(namespace: "custom", key: "singular_name") { value }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  query getProductByHandle($handle: String!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      availableForSale
      seo {
        description
        title
      }
      options {
        name
        values
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 20) {
        nodes {
          id
          url
          lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
          altText
          width
          height
        }
      }
      variants(first: 100) {
        nodes {
			id
			title
			requiresComponents
			compareAtPrice {
				amount
				currencyCode
			}
			quantityAvailable
			components(first: 10) {
				nodes {
					quantity
					productVariant {
						id
						title
						sku
						price {
							amount
							currencyCode
						}
						compareAtPrice {
							amount
							currencyCode
						}
						product {
							id
							title
							handle
							collections(first: 1) {
								nodes {
									handle
									title
									singular: metafield(namespace: "custom", key: "singular_name") { value }
								}
							}
							images(first: 20) {
								nodes {
									id
									url
									lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
									altText
									width
									height
								}
							}
						}
					}
				}
			}
			availableForSale
			price {
				amount
				currencyCode
			}
			selectedOptions {
				name
				value
			}
			image {
				url
				lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
				altText
				width
				height
			}
        }
      }
		collections(first: 1) {
          nodes {
            handle
            title
            singular: metafield(namespace: "custom", key: "singular_name") { value }
          }
        }
		details: metafield(namespace: "custom", key: "details") {key, value, namespace }
		length: metafield(namespace: "custom", key: "length") {key, value, namespace }
		total_length: metafield(namespace: "custom", key: "total_length") {key, value, namespace }
      custom_keys_values: metafields(identifiers: [
        {namespace: "custom", key: "custom_keys"},
        {namespace: "custom", key: "custom_values"}
      ]) {key, value, namespace }
    }
  }
`;

export const FETCH_PRODUCTS_PAGE = `
  query getProductsPage($first: Int!, $after: String, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    shop {
      name
      description
    }
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        handle
        createdAt
        availableForSale
        collections(first: 1) {
          nodes {
            handle
            title
            singular: metafield(namespace: "custom", key: "singular_name") { value }
          }
        }
        listImage: metafield(namespace: "custom", key: "list_image") {
          reference {
            ... on MediaImage {
              image {
                url
                lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
                altText
                width
                height
              }
            }
          }
        }
        variants(first: 1) {
          nodes {
            id
			compareAtPrice {
				amount
				currencyCode
			}
			components(first: 10) {
				nodes {
					productVariant {
						id
					}
				}
			}
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 2) {
          nodes { 
            url 
            lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
            altText 
            width 
            height 
          }
        }
      }
    }
  }
`;

export const GET_RELATED_PRODUCTS = `
  query getRelatedProducts($handle: String!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      collections(first: 5) {
        nodes {
          products(first: 10) {
            nodes {
              id
              title
              handle
              availableForSale
              collections(first: 1) {
                nodes {
                  handle
                  title
                  singular: metafield(namespace: "custom", key: "singular_name") { value }
                }
              }
              variants(first: 1) {
                nodes {
                  id
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 2) {
                nodes {
                  url
                  lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
    products(first: 10, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
		collections(first: 1) {
			nodes {
				handle
				title
				singular: metafield(namespace: "custom", key: "singular_name") { value }
			}
		}
        variants(first: 1) {
          nodes {
            id
			compareAtPrice {
				amount
				currencyCode
			}
			components(first: 10) {
				nodes {
					productVariant {
						id
					}
				}
			}
          }
        }
        images(first: 2) {
          nodes {
            url
            lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const CART_QUERY = `
  query getCart($cartId: ID!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 100) {
        nodes {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
			  compareAtPrice {
				amount
				currencyCode
			  }
			  components(first: 10) {
				nodes {
				  productVariant {
					id
				  }
				}
			  }
              price {
                amount
                currencyCode
              }
              product {
                title
                handle
				collections(first: 1) {
					nodes {
						handle
						title
						singular: metafield(namespace: "custom", key: "singular_name") { value }
					}
				}
              }
              image {
                url
                lqip: url(transform: { maxWidth: 20, maxHeight: 20, preferredContentType: JPG })
                altText
                width
                height
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
      }
    }
  }
`;

export function renderRichText(metafield) {
    if (!metafield?.value) return '';

    try {
        const root = JSON.parse(metafield.value);

        const walk = (node) => {
            if (node.type === 'text') {
                let text = node.value;
                if (node.bold) text = `<strong>${text}</strong>`;
                if (node.italic) text = `<em>${text}</em>`;
                return text;
            }

            const children = node.children ? node.children.map(walk).join('') : '';

            switch (node.type) {
                case 'root': return children;
                case 'paragraph': return `<p>${children}</p>`;
                case 'list': return node.listType === 'ordered' ? `<ol>${children}</ol>` : `<ul>${children}</ul>`;
                case 'list-item': return `<li>${children}</li>`;
                case 'heading': return `<h${node.level}>${children}</h${node.level}>`;
                case 'link': return `<a href="${node.url}" target="_blank">${children}</a>`;
                default: return children;
            }
        };

        return walk(root);
    } catch (e) {
        return metafield.value;
    }
}