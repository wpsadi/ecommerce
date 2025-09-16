import { ai } from "#config/ai.ts";
import { getSignedUrl } from "#src':/config/s3.ts";

interface ProductInput {
	name: string;
	description: string;
	images: string[]; // image URLs
}

interface ProductTagsOutput {
	tags: string[]; // 8–12 SEO-friendly product tags
}

async function _generateProductTags(product: ProductInput) {
	// get signed urls for images
	const signedImageUrls = await Promise.all(
		product.images.map((img) => getSignedUrl(img)),
	);
	product.images = signedImageUrls;

	const response = await ai.chat.completions.create({
		model: "gpt-4o-mini", // or gpt-4o if you want better reasoning
		temperature: 0.6,
		messages: [
			{
				role: "system",
				content: `You are an AI assistant that generates only SEO-friendly product tags.
For each product:
- Ignore images when generating text, just use them as context for the product.
- Focus on the product name and description.
- Output only tags as JSON array of strings.
- Provide 8–12 concise, relevant tags.`,
			},
			{
				role: "user",
				content: JSON.stringify(product, null, 2),
			},
		],
	});

	return JSON.parse(
		response.choices[0]?.message?.content || "[]",
	) as ProductTagsOutput;
}
