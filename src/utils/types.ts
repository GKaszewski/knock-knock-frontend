export interface Joke {
	title: string;
	content: string;
}

export interface Message {
	content: string;
	type: "joker" | "user";
}
