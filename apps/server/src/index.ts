import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const app = new Elysia()
	.use(
		cors({
			origin: ["http://localhost:3000"],
			methods: ["POST", "OPTIONS", "GET", "PUT"],
		}),
	)
	.get("/", () => "Hello Elysia")
	.listen(8080);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
