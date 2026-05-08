import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

/** @type {import('@sveltejs/kit').Handle} */
const handleParaglide = ({ event, resolve }) => {
    return paraglideMiddleware(event.request, ({ request, locale }) => {
        event.request = request;

        return resolve(event, {
            transformPageChunk: ({ html }) => 
                html.replace('%paraglide.lang%', locale)
                    .replace('%paraglide.dir%', getTextDirection(locale))
        });
    });
};

/** @type {import('@sveltejs/kit').Handle} */
const handlePreload = async ({ event, resolve }) => {
    return await resolve(event, {
        preload: ({ type }) => {
            return type === 'font' || type === 'js' || type === 'css';
        }
    });
};

export const handle = sequence(handleParaglide, handlePreload);