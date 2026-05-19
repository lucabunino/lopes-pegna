import { createClient } from '@sanity/client';
import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';
import { dev } from '$app/environment';

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
	throw new Error('Did you forget to run sanity init --env?');
}

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	useCdn: !dev, // `false` if you want to ensure fresh data
	apiVersion: '2026-04-27', // date of setup
});

const mediaProjection = `
    _type == "image" => {
        "image": { "asset": asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
        "imageMobile": imageMobile { "asset": asset->{ _id, metadata { dimensions, lqip } } }
    },
    _type == "videoItem" => {
        video { asset->{ url, extension, size } },
        videoMobile { asset->{ url, extension, size } },
        "poster": poster { "asset": asset->{ _id, metadata { dimensions, lqip } } },
        "posterMobile": posterMobile { "asset": asset->{ _id, metadata { dimensions, lqip } } }
    }
`;

export async function getSeo() {
	return await client.fetch(
		`*[_type == "seo" && !(_id in path('drafts.**'))] {
			seoTitle,
			seoDescription,
			seoImage,
		}|order(year desc)`
	);
}
export async function getPolicies(lang) {
	console.log(lang);
	
    return await client.fetch(
        `
        *[ _type == "policy" && inFooter == true && !(_id in path('drafts.**'))]|order(orderRank asc) {
            kind,
            "title": title[language == $lang][0].value,
            slug,
            kind
        }
        `,
        { lang }
    );
}
export async function getInfo(lang) {	
    return await client.fetch(
        `
        *[ _type == "info" && !(_id in path('drafts.**'))][0] {
            vat,
            "credits": credits[language == $lang][0].value,
        }
        `,
        { lang }
    );
}
export async function getCartInfo(lang) {	
    return await client.fetch(
        `
        *[ _type == "shop" && !(_id in path('drafts.**'))][0] {
            "cartInfo": cartInfo[language == $lang][0].value[0],
        }
        `,
        { lang }
    );
}
export async function getHomepage(lang) {
    return await client.fetch(
        `*[_type == "homepage"][0] {
				"heroText": heroText[language == $lang][0].value,
				heroMedia {
					video { asset->{ url, extension, size } },
					poster { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
					videoMobile { asset->{ url, extension, size } },
					posterMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
					imageMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } }
				},
				"productsText": productsText[language == $lang][0].value,
				products[]->{
					store {
						gid
					},
				},
				aboutSlider1[] { ${mediaProjection} },
				"aboutText1": aboutText1[language == $lang][0].value,
				"aboutText2": aboutText2[language == $lang][0].value,
				aboutSlider2[] { ${mediaProjection} },
				setsProducts[]->,
				"setsText": setsText[language == $lang][0].value,
				setsMedia {
					video { asset->{ url, extension, size } },
					poster { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
					image { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } }
				},
				"beadsText": beadsText[language == $lang][0].value,
				beadsImages[] { ${mediaProjection} },
		}`,
        { lang }
    );
}
export async function getBeads(lang) {
    return await client.fetch(
        `*[_type == "beads"][0] {
            title,
            heroMedia {
                video { asset->{ url, extension, size } },
                poster { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                image { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                videoMobile { asset->{ url, extension, size } },
                posterMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                imageMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } }
            },
            "content": content[language == $lang][0].value[] {
                ...,
                _type == "image" => {
                    ...,
                    asset-> {
                        _id, _ref, _type, title, description, altText,
                        metadata { dimensions, lqip }
                    }
                }
            }
        }`,
        { lang }
    );
}
export async function getBooks(lang) {
    return await client.fetch(
        `*[_type == "book"]|order(orderRank asc) {
            _id,
            "title": title[language == $lang][0].value,
			cover { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
            coverBackground,
            "info": info[language == $lang][0].value,
            "href": href[language == $lang][0].value,
        }`,
        { lang }
    );
}
export async function getBooksIntro(lang) {
    return await client.fetch(
        `*[_type == "booksIntro"][0] {
			"introText": introText[language == $lang][0].value,
        }`,
        { lang }
    );
}
export async function getContacts(lang) {
    return await client.fetch(
        `*[_type == "contacts"][0] {
            title,
            heroMedia {
                video { asset->{ url, extension, size } },
                poster { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                image { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                videoMobile { asset->{ url, extension, size } },
                posterMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                imageMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } }
            },
			infoEmail,
			phone,
			salesEmail,
			instagram,
			"showroomAdressLabel": showroomAdressLabel[language == $lang][0].value,
			showroomAdressHref,
			slider[] { ${mediaProjection} },
			"appointmentText": appointmentText[language == $lang][0].value,
			closingMedia {
                video { asset->{ url, extension, size } },
                poster { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                image { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                videoMobile { asset->{ url, extension, size } },
                posterMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                imageMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } }
            },
        }`,
        { lang }
    );
}

export async function getShop(lang) {
    return await client.fetch(
        `*[_type == "shop"][0] {
            heroMedia {
                video { asset->{ url, extension, size } },
                poster { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                image { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                videoMobile { asset->{ url, extension, size } },
                posterMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                imageMobile { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } }
            },
            shopPolicies[]->{
                kind,
                "title": title[language == $lang][0].value,
                slug,
            }
        }`,
        { lang }
    );
}
export async function getInfoEmail() {	
    return await client.fetch(
        `
        *[ _type == "contacts" && !(_id in path('drafts.**'))][0] {
            infoEmail,
        }
        `
    );
}





export async function getAbout(lang) {
    return await client.fetch(
        `*[_type == "about" && !(_id in path('drafts.**'))][0] {
            "content": content[language == $lang][0].value[] {
                ...,
                _type == "image" => {
                    ...,
                    asset-> {
                        _id, _ref, _type, title, description, altText,
                        metadata { dimensions, lqip }
                    }
                }
            },
            "heroMedia": beadsImages[] {
                _type == "image" => {
                    "image": { "asset": asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
                },
            }
        }`,
        { lang }
    );
}
export async function getWorks() {
    return await client.fetch(
        `*[_type == "work" && status == "public" && !(_id in path('drafts.**'))]|order(orderRank) {
			_id,
            kind,
			title,
			slug,
			date,
			city->{ title, slug },
			gridThumbnail { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
			listThumbnail { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
        }`
    );
}
export async function getWork(slug) {
	return await client.fetch(
		`
		*[_type == "work" && slug.current == $slug] {
			_id,
			title,
			slug,
			date,
			kind,
			city->{ title, slug },
			moreInfo,
			images[] { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
			"seoSingle": {
				"seoTitle": title,
				seoDescription,
				seoImage,
			},
			orderRank,
            "prev": coalesce(
                *[_type == "work" && orderRank < ^.orderRank] | order(orderRank desc)[0],
                *[_type == "work"] | order(orderRank desc)[0],
            ) { title, slug, "imagesCount": count(images) },
            "next": coalesce(
                *[_type == "work" && orderRank > ^.orderRank] | order(orderRank asc)[0],
                *[_type == "work"] | order(orderRank asc)[0],
            ) { title, slug }
		}
		`, { slug });
}
export async function getVideo() {
    return await client.fetch(
        `*[_type == "video" && !(_id in path('drafts.**'))][0] {
			videoDesktop {
				"url": video.asset->url,
				poster { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
			},
			videoMobile {
				"url": video.asset->url,
				poster { asset->{ _id, _ref, _type, title, description, altText, metadata { dimensions, lqip } } },
			}
        }`
    );
}