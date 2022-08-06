import styles from "./chatTypingBubble.module.css";

export const ChatTypingBubble = () => {
	return (
		<li className="flex justify-start bg-gray-400 p-2 w-16 h-8 rounded shadow-lg">
			<div className={styles["dot-typing"]}></div>
		</li>
	);
};
