import { Copy } from 'lucide-react';

interface PasswordCopyButtonProps {
  password: string;
  onCopy: (password: string) => void;
}

export default function PasswordCopyButton({ password, onCopy }: PasswordCopyButtonProps) {
  return (
    <button
      className="w-full flex justify-between items-center hover:underline"
      onClick={() => onCopy(password)}
    >
      <span className="block w-[90%] whitespace-normal break-words text-left">
        {password}
      </span>
      <Copy className="h-4 w-4 ml-2" />
    </button>
  );
}
