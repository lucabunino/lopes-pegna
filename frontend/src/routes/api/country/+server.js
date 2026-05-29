import { json } from '@sveltejs/kit'

export async function POST({ request, cookies }) {
	const { country } = await request.json()
	if (!country || typeof country !== 'string') {
		return json({ error: 'Invalid country' }, { status: 400 })
	}
	cookies.set('selected_country', country.toUpperCase(), {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: false,
		sameSite: 'lax',
	})
	return json({ ok: true })
}
