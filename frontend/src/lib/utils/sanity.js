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

export async function getSeo(lang) {
	return await client.fetch(
		`*[_type == "seo" && !(_id in path('drafts.**'))] {
			seoTitle,
			"seoDescription": seoDescription[language == $lang][0].value,
			seoImage,
		}|order(year desc)`,
		{lang}
	);
}
export async function getPolicies(lang) {
    return await client.fetch(
        `
        *[ _type == "policy" && inFooter == true && !(_id in path('drafts.**'))]|order(orderRank asc) {
            "title": title[language == $lang][0].value,
            slug,
        }
        `,
        { lang }
    );
}
export async function getPolicy(slug, lang) {
	return await client.fetch(
		`*[_type == "policy" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
			"title": title[language == $lang][0].value,
			"content": content[language == $lang][0].value
		}`,
		{ slug, lang }
	)
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
            "cartInfo": cartInfo[language == $lang][0].value,
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
				"seoDescription": seoDescription[language == $lang][0].value,
				seoImage,
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
            },
            "seoDescription": seoDescription[language == $lang][0].value,
            seoImage,
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
            "seoDescription": seoDescription[language == $lang][0].value,
            seoImage,
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
                "title": title[language == $lang][0].value,
                slug,
                "content": content[language == $lang][0].value
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
            },
            "seoDescription": seoDescription[language == $lang][0].value,
            seoImage,
        }`,
        { lang }
    );
}