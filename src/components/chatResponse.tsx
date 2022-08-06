import { JOKER_CHAT_COLOR, USER_CHAT_COLOR } from "../utils/constants";
import { ChatBubble } from "./chatBubble";

interface Props {
	type: "joker" | "user";
	content: string;
}

export const ChatResponse = ({ type, content }: Props) => {
	if (type === "joker")
		return (
			<li className="flex justify-start">
				<ChatBubble color={JOKER_CHAT_COLOR} content={content} />
			</li>
		);

	if (type === "user")
		return (
			<li className="flex justify-end">
				<ChatBubble color={USER_CHAT_COLOR} content={content} />
			</li>
		);

	return (
		<li className="flex justify-end">
			<span>fail</span>
		</li>
	);
};
