import { LucideIcon } from "lucide-react";

export interface ButtonStyledProps {
    text: string;
    icon?: LucideIcon;
    className?: string;
    onClick?: () => void;
}

export default function ButtonStyled({
    text,
    icon: Icon,
    className,
    onClick
}: ButtonStyledProps) {
    return (
        <button
            onClick={onClick}
            className={` flex flex-row-reverse items-center justify-center gap-2 md:gap-2.5 px-4 py-2.5
            md:px-7 md:py-4 text-[11px] md:text-[13px] font-bold font-mono tracking-[0.4px]
            text-[#f7f7f7] border-0 border-[#57413a]/30 rounded-full transition-all duration-200
            shadow-[-4px_-2px_16px_#fff,4px_2px_16px_rgba(250,0,0,.98)]
            hover:text-black hover:bg-[#e5edf5] active:shadow-none whitespace-nowrap shadow-none
            ${className ?? ""}
            `
            }
            onMouseEnter={() => {

            }}
        >
            {Icon && <Icon size={16} className="md:w-[18px] md:h-[18px]" />}
            <span>{text}</span>
        </button>
    );
}