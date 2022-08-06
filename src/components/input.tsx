import { ChangeEvent } from "react";

interface Props {
	value: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
	onSubmit: () => void;
}

export const Input = ({ value, onChange, placeholder, onSubmit }: Props) => {
	return (
		<input
			onChange={onChange}
			onKeyDown={(evt) => {
				if (evt.key === "Enter") {
					onSubmit();
				}
			}}
			value={value}
			className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
			type="text"
			placeholder={placeholder}
		/>
	);
};
