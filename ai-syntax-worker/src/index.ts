/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Ai } from '@cloudflare/ai'
import { Hono } from 'hono'

const app = new Hono<{ Bindings: Env }>()

app.get('/', async c => {
	const ai = new Ai(c.env.AI);

	const prompt = c.req.query('ai-prompt') || 'I didn\'t enter a prompt, oh no!';
	const inputs = { prompt }
	const res = await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', inputs);

	return c.json({ hello: 'Discord', from: c.env.APP_NAME })
});

export default app satisfies ExportedHandler<Env>;