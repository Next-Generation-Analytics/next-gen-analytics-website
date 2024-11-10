import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';

export const handle: Handle = async ({ event, resolve }) => {
    try {
        const response = await i18n.handle()({ event, resolve });
        return response;
    } catch (error) {
        console.error('i18n error:', error);
        return resolve(event);
    }
};
