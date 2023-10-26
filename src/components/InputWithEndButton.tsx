import { X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export interface InputWithEndCloseButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCloseClick: () => void,
}

export default function InputWithEndCloseButton({ onCloseClick, ...props }: InputWithEndCloseButtonProps) {
    return (
        <div className="flex items-center relative">
            <Input {...props} />
            <Button
                variant="secondary"
                className="px-1.5 h-6 absolute end-2"
                onClick={onCloseClick}
            >
                <X size={12} />
            </Button>
        </div>
    );
}