
import { BookmarkIcon } from "@sanity/icons";

export default {
    name: 'booksIntro',
    type: 'document',
    icon: BookmarkIcon,
   	fields: [
        {
            name: 'title',
            type: 'string',
            initialValue: 'Sarah’s Favourites Intro',
            hidden: true,
        },
        {
            name: 'introText',
            title: 'Intro Text',
            type: 'internationalizedArrayText',
            description: 'Text displayed above the books collection.'
        }
    ]
}