import { useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "./components/input";
import { fetchJokes } from "./utils/apiCalls";
import { Joke, Message } from "./utils/types";

import Avatar from "./avatar.jpg";
import { ChatResponse } from "./components/chatResponse";
import { ChatTypingBubble } from "./components/chatTypingBubble";

import stringSimilarity from "string-similarity";
import { randomInt } from "./utils/math";

function App() {
	const {
		data: jokes,
		isLoading: fetchingJokes,
		error: jokesError,
	} = useQuery<Joke[], Error>(["jokes"], fetchJokes, {
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		retry: false,
	});

	const [message, setMessage] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [showBubble, setShowBubble] = useState<boolean>(true);
	const [currentJoke, setCurrentJoke] = useState<Joke | null>();
	const [currentLine, setCurrentLine] = useState<number>(0);

	const chatRef = useRef<HTMLDivElement | null>(null);
	const messageInputDiv = useRef<HTMLDivElement | null>(null);

	const getRandomJoke = (): Joke => {
		let index = -1;
		let joke: Joke | null = null;
		do {
			index = randomInt(0, jokes?.length! - 1);
			joke = jokes![index]!;
		} while (joke === currentJoke);

		return joke;
	};

	const createMessage = (
		content: string,
		lineIndex: number,
		type: "joker" | "user"
	) => {
		const message: Message = {
			content: content.trim(),
			type,
		};
		if (!message.content) return;
		setCurrentLine(lineIndex);
		setMessages((prev) => [...prev, message]);
		scrollToChat();
	};

	const initializeJoke = () => {
		createMessage(currentJoke?.content.split(";")[0] || "", 0, "joker");
	};

	useEffect(() => {
		if (!fetchingJokes) {
			setTimeout(() => {
				if (jokes) setCurrentJoke(getRandomJoke());
				setShowBubble(false);
			}, 1000);
		}
	}, [fetchingJokes]);

	useEffect(() => {
		initializeJoke();
	}, [currentJoke]);

	const scrollToChat = () => {
		return;
		const scroll =
			chatRef.current?.scrollHeight! -
			chatRef.current?.clientHeight! +
			messageInputDiv.current?.clientHeight!;
		chatRef.current?.scroll(0, scroll);
	};

	if (fetchingJokes)
		return (
			<div>
				<p>fetching jokes...</p>
			</div>
		);

	if (jokesError)
		return (
			<div>
				<p>couldnt fetch jokes...</p>
			</div>
		);

	const handleMessageInput = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setMessage(value);
	};

	const handleOnMessageSubmit = () => {
		if (message.length === 0) return;
		if (showBubble) return;
		const jokeLines = currentJoke?.content.split(";")!;
		const expectedResponse = jokeLines[currentLine + 1];
		if (!expectedResponse) {
			setMessages((prev) => [
				...prev,
				{ content: message.trim(), type: "user" },
			]);
			setMessage("");
			setCurrentJoke(getRandomJoke());
			setShowBubble(false);
			return;
		}
		const similarity = stringSimilarity.compareTwoStrings(
			message.toLowerCase(),
			jokeLines[currentLine + 1].toLowerCase()
		);

		setMessages((prev) => [
			...prev,
			{ content: message.trim(), type: "user" },
		]);
		setMessage("");
		scrollToChat();
		setShowBubble(true);
		if (similarity >= 0.75) nextLine();
		else {
			setTimeout(() => {
				setShowBubble(true);
				setMessages((prev) => [
					...prev,
					{
						content: "Sorry I didn't understand you.",
						type: "joker",
					},
				]);
				setShowBubble(false);
				scrollToChat();
			}, 1200);
		}
	};

	const nextLine = () => {
		const lines = currentJoke?.content.split(";")!;
		const newLineIndex = currentLine + 2;
		if (newLineIndex > lines.length) {
			setCurrentLine(0);
			setTimeout(() => {
				initializeJoke();
				setShowBubble(false);
			}, 2000);
			return;
		}
		const newLine = lines.at(newLineIndex);
		if (!newLine) return;
		setCurrentLine((prev) => {
			if (newLineIndex > lines?.length) return lines?.length - 1;
			return newLineIndex;
		});
		setTimeout(() => {
			createMessage(newLine, newLineIndex, "joker");
			setShowBubble(false);
		}, 1500);
	};

	return (
		<div className="flex flex-col h-screen">
			<div className="w-full">
				<div className="relative flex items-center p-3 border-b border-gray-300">
					<img
						className="object-cover w-10 h-10 rounded-full"
						src={Avatar}
						alt="avatar"
					/>
					<span className="block ml-2 font-bold text-gray-600">
						The Joker
					</span>
					<span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 bottom-3" />
				</div>
				<div
					ref={chatRef}
					className="relative flex-1 p-6 overflow-y-auto"
				>
					<ul className="space-y-2">
						{messages.map((message, i) => {
							return (
								<ChatResponse
									content={message.content}
									type={message.type}
									key={`message-${i}`}
								/>
							);
						})}
						{showBubble && <ChatTypingBubble />}
					</ul>
				</div>
			</div>
			<span className="flex-1" />
			<div
				ref={messageInputDiv}
				className="flex items-center justify-between w-full p-3 border-t bg-white border-gray-300"
			>
				<Input
					onChange={handleMessageInput}
					onSubmit={handleOnMessageSubmit}
					value={message}
					placeholder="Message"
				/>
				<button type="submit" onClick={() => handleOnMessageSubmit()}>
					<svg
						className="w-5 h-5 text-blue-500 origin-center transform rotate-90"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export default App;
