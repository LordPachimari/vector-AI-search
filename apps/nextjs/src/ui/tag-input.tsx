import type React from "react";
import { useRef, useState } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";


const inputBaseStyles = cn(
	"caret-ui-fg-base bg-slate-1 hover:bg-slate-2 border-ui-border-base shadow-buttons-neutral placeholder-ui-fg-muted text-ui-fg-base transition-fg relative w-full appearance-none rounded-lg border outline-none",
	"focus:border-blue-6 focus:shadow-borders-active focus:shadow-blue-2 focus:shadow-input-shadow",
	"disabled:text-ui-fg-disabled disabled:!bg-ui-bg-disabled disabled:!border-ui-border-base disabled:placeholder-ui-fg-disabled disabled:cursor-not-allowed disabled:!shadow-none",
	"aria-[invalid=true]:!border-ui-border-error aria-[invalid=true]:focus:!shadow-borders-error invalid:!border-ui-border-error invalid:focus:!shadow-borders-error",
);
import { cn } from "~/utils/cn";

type TagInputProps = {
	onChange: (values: string[]) => void;
	onValidate?: (value: string) => void;
	label?: string;
	showLabel?: boolean;
	values: string[];
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
	withTooltip?: boolean;
	tooltipContent?: string;
	tooltip?: React.ReactNode;
	invalidMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TagInput: React.FC<TagInputProps> = ({
	onChange,
	onValidate,
	values = [],
	label,
	showLabel = true,
	containerProps,
	className,
	required,
	placeholder,
	withTooltip = false,
	tooltipContent,
	tooltip,
	invalidMessage = "is not a valid tag",
	...props
}) => {
	const [invalid, setInvalid] = useState(false);
	const [highlighted, setHighlighted] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleAddValue = (newVal: string) => {
		const update = newVal;

		if (update) {
			onChange([...values, update]);

			if (inputRef?.current) {
				inputRef.current.value = "";
			}
		} else {
			setInvalid(true);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (invalid) {
			setInvalid(false);
		}

		if (!inputRef?.current) {
			return;
		}

		const { value, selectionStart } = inputRef.current;

		switch (e.key) {
			case "ArrowLeft":
				if (highlighted !== -1) {
					// highlight previous element
					if (highlighted > 0) {
						setHighlighted(highlighted - 1);
					}
				} else if (!selectionStart) {
					// else highlight last element
					setHighlighted(values.length - 1);
					e.preventDefault();
				}
				break;
			case "ArrowRight":
				if (highlighted !== -1) {
					// highlight next element
					if (highlighted < values.length - 1) {
						setHighlighted(highlighted + 1);
						e.preventDefault();
					} else {
						// else remove highlighting entirely
						setHighlighted(-1);
					}
				}
				break;
			case "Enter": // Fall through
				e.preventDefault();
				break;
			case "Tab": // Creates new tag
				if (value) {
					handleAddValue(value);
					e.preventDefault();
				}
				break;

			case "Backspace": // Removes tag
				// if no element is currently highlighted, highlight last element
				if (!inputRef.current.selectionStart && highlighted === -1) {
					setHighlighted(values.length - 1);
					e.preventDefault();
				}

				// if element is highlighted, remove it
				if (highlighted !== -1) {
					const newValues = [...values];
					newValues.splice(highlighted, 1);
					onChange(newValues);
					setHighlighted(-1);
				}
				break;
			default:
				// Remove highlight from any tag
				setHighlighted(-1);
		}
	};

	const handleRemove = (index: number) => {
		const newValues = [...values];
		newValues.splice(index, 1);
		onChange(newValues);
	};

	const handleBlur = () => {
		const value = inputRef?.current?.value;
		setHighlighted(-1);

		if (value) {
			handleAddValue(value);
		}
	};

	const handleInput = () => {
		if (!inputRef?.current) {
			return;
		}

		const value = inputRef.current.value;

		if (value?.endsWith(",")) {
			inputRef.current.value = value.slice(0, -1);
			handleAddValue(value.slice(0, -1));
		}
	};

	return (
		<div className={className}>
			<div
				className={cn(
					inputBaseStyles,
					"flex h-10 w-full border-blue-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-9 focus-visible:ring-offset-2 rounded-md border-[1px] bg-background  p-1 px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 dark:text-white ",

					{
						"focus-within:outline-rose-60/10 shadow-error-border focus-within:shadow-error-border":
							invalid,
					},
				)}
			>
				<div className="flex h-full w-full gap-2  ">
					{values.map((v, index) => (
						<div
							key={v}
							className={cn(
								"rounded-md bg-blue-3 text-blue-9 flex w-max items-center justify-center gap-x-1 whitespace-nowrap p-2 ",

								{
									"bg-blue-5": index === highlighted,
								},
							)}
						>
							<span className="text-bold ">{v}</span>
							<Cross1Icon
								className="text-grey-40 inline cursor-pointer"
								fontSize="16"
								onClick={() => handleRemove(index)}
							/>
						</div>
					))}
					<input
						id="tag-input"
						ref={inputRef}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						onChange={handleInput}
						className={cn("w-full flex-1 bg-transparent focus:outline-none")}
						placeholder={values?.length ? "" : placeholder} // only visible if no tags exist
						{...props}
					/>
				</div>
			</div>
		</div>
	);
};

export default TagInput;
