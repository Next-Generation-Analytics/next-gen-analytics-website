export const prerender = true;
export const trailingSlash = 'never';

export async function GET() {
	return new Response(null, {
		status: 301,
		headers: { Location: '/team' }
	});
}
