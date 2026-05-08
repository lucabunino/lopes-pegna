import { EarthGlobeIcon, InfoOutlineIcon, ProjectsIcon, HomeIcon, RobotIcon, AccessDeniedIcon, UsersIcon, PlayIcon, TextIcon, DiamondIcon, BookIcon, EnvelopeIcon, BookmarkIcon, InfoFilledIcon, LinkIcon, BillIcon} from '@sanity/icons'
import ShopifyIcon from "./schemaTypes/icons/shopify";
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export const myStructure = (S, context) => {
  const entities = [
	S.divider(),
	S.listItem()
		.title('Homepage')
		.icon(HomeIcon)
		.child(S.document().schemaType('homepage').documentId('homepage2')),
	S.divider(),
	S.listItem()
		.title('Shop')
		.icon(ShopifyIcon)
		.child(S.document().schemaType('shop').documentId('shop')),
	S.documentTypeListItem('product').icon(ProjectsIcon).title('Products'),
	S.divider(),
	S.listItem()
		.title('About')
		.icon(InfoOutlineIcon)
		.child(S.document().schemaType('about').documentId('about')),
	S.divider(),
	S.listItem()
		.title('Beads')
		.icon(DiamondIcon)
		.child(S.document().schemaType('beads').documentId('beads')),
	S.listItem()
        .title('Sarah’s Favourites')
        .icon(BookIcon)
        .child(
            S.list()
                .title('Sarah’s Favourites')
                .items([
                    S.listItem()
                        .title('Intro')
                        .icon(TextIcon)
                        .child(
                            S.document()
                                .schemaType('booksIntro')
                                .documentId('booksIntro')
                        ),
                    S.divider(),
					orderableDocumentListDeskItem({type: 'book', title: 'Books', icon: BookIcon, S, context}),
                ])
        ),
	S.divider(),
	S.listItem()
		.title('Contacts')
		.icon(EnvelopeIcon)
		.child(S.document().schemaType('contacts').documentId('contacts')),
	S.listItem()
		.title('Info')
		.icon(InfoFilledIcon)
		.child(S.document().schemaType('info').documentId('info')),
  ];
  const siteSettings = [
    S.divider(),
    S.listItem()
      .title('Seo')
      .icon(EarthGlobeIcon)
      .child(S.document().schemaType('seo').documentId('seo')),
	orderableDocumentListDeskItem({type: 'policy', title: 'Policies', icon: BillIcon, S, context}),
	S.listItem()
      .title('Policies')
      .icon(BillIcon)
      .child(
        S.list()
          .title('Policies')
          .items([
            S.listItem()
              .title('Privacy')
              .icon(AccessDeniedIcon)
              .child(S.document().schemaType('policy').documentId('privacy')),
            S.listItem()
              .title('Cookies')
              .icon(RobotIcon)
              .child(S.document().schemaType('policy').documentId('cookies')),
            S.listItem()
              .title('Termini e condizioni')
              .icon(TextIcon)
              .child(S.document().schemaType('policy').documentId('terms')),
			S.divider(),
            S.listItem()
              .title('Other Policies')
              .icon(BillIcon)
              .child(
                S.documentList()
                  .title('Other Policies')
                  .filter('_type == "policy" && !(_id in ["privacy", "cookies", "terms", "drafts.privacy", "drafts.cookies", "drafts.terms"])')
              ),
          ]),
      ),
  ];

  return S.list()
    .title('Content')
    .items([
      ...entities,
      ...siteSettings,
    ]);
};