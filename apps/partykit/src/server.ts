import type * as Party from "partykit/server";
export default class WebSocketServer implements Party.Server {
	options: Party.ServerOptions = {
		hibernate: true,
	};
	constructor(readonly room: Party.Room) {}
	async onRequest(request: Party.Request) {
		// push new message
		if (request.method === "POST") {
			this.room.broadcast("");
			return new Response("OK");
		}

		return new Response("Method not allowed", { status: 405 });
	}
}
