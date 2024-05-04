import { cors } from "@elysiajs/cors";
import { Index } from "@upstash/vector";
import { Elysia, error } from "elysia";
import { Client, auth } from "twitter-api-sdk";

const STATE = "uni-soulmate";
const authClient = new auth.OAuth2User({
	client_id: process.env.TWITTER_CLIENT_ID ?? "",
	client_secret: process.env.TWITTER_CLIENT_SECRET,
	callback: process.env.TWITTER_REDIRECT_URL ?? "",
	scopes: ["tweet.read", "users.read", "bookmark.read", "like.read"],
});
const app = new Elysia()
	.use(
		cors({
			origin: /localhost.*/,
			methods: ["POST", "OPTIONS", "GET", "PUT"],
			credentials: true,
		}),
	)
	.post("/twitter-auth-url", async ({ store }) => {
		try {
			const url = authClient.generateAuthURL({
				state: STATE,
				code_challenge_method: "s256",
			});

			return url;
		} catch (err) {
			console.error(err);
			return error(500, "Internal Server Error");
		}
	})
	.post("/store-twitter-data", async ({ store, headers }) => {
		const code = headers["x-twitter-code"];
		if (!code) return error(400, "Bad Request");
		const client = new Client(authClient);
		const userID = headers["x-user-id"];
		try {
			await authClient.requestAccessToken(code as string);

			const index = new Index({
				url: process.env.UPSTASH_URL,
				token: process.env.UPSTASH_TOKEN,
			});
			const user = (
				await client.users.findMyUser({
					"user.fields": ["id", "username", "description"],
				})
			).data;
			console.log("user", user);

			//THESE ENDPOINTS ARE NOT FREE -> bookmarks, likes, follows
			//THATS WHY WE ONLY STORE USER USERNAME AND DESCRIPTION. CAPPED EVERYONE

			user &&
				(await index.upsert({
					id: `twitter-${user.id}`,
					data: `${user.username} ${user.description}`,
					metadata: {
						description: user.description,
						userID,
					},
				}));
		} catch (err) {
			console.error("ERROR CATCHED", JSON.stringify(err));
			return error(500, "Internal Server Error");
		}
	})
	.listen(8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
