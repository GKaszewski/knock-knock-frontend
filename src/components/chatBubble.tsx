interface Props {
	content: string;
	color: string;
}

export const ChatBubble = ({ content, color }: Props) => {
	return (
		<div
			className={`${color} text-gray-100 p-2 min-w-[8rem] w-fit rounded max-w-[16rem] shadow-lg`}
		>
			<span className="text-ellipsis overflow-hidden whitespace-pre-wrap break-words">
				{content}
			</span>
		</div>
	);
};
