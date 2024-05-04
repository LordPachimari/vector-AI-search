export type ChatHistory = {
	question: string;
	answer: {
		texts: string[];
	};
};
export type ProfileChatHistory = {
	question: string;
	answer: {
		profileIDs: string[];
	};
};
