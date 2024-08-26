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
import { Hono } from 'hono'

interface Env {
	APP_NAME: "AI Syntax";
	AI: Ai;
}
const app = new Hono<{ Bindings: Env }>()

app.get('/', async c => {
	let aiPrompt = c.req.query('ai-prompt');
	console.log('aiPrompt', aiPrompt);

	if (!aiPrompt) {
		return c.text('You can ask the ai worker a question by setting the ai-prompt query string variable');
	} else {
		const res = await c.env.AI.run('@cf/mistral/mistral-7b-instruct-v0.1', { prompt: aiPrompt });
		return c.json({ hello: 'Discord', from: c.env.APP_NAME, prompt: aiPrompt, res });
	}
});

app.get('/translate', async c => {
	let source_lang = c.req.query('from') || 'en';
	let target_lang = c.req.query('to') || 'fr';
	let text = c.req.query('text') || 'I love you!';

	let input: AiTranslationInput = {
		text: text,
		source_lang: source_lang,
		target_lang: target_lang
	};


	const response = await c.env.AI.run("@cf/meta/m2m100-1.2b", input);
	return c.json({input, response});

});

export default app satisfies ExportedHandler<Env>;