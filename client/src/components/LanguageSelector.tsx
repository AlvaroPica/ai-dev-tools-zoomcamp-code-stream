import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiJavascript, SiPython } from "react-icons/si";
import { useSessionStore } from "@/store/sessionStore";

interface LanguageSelectorProps {
  onLanguageChange?: (language: "javascript" | "python") => void;
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const language = useSessionStore((state) => state.language);
  const setLanguage = useSessionStore((state) => state.setLanguage);

  const handleChange = (value: "javascript" | "python") => {
    setLanguage(value);
    onLanguageChange?.(value);
  };

  return (
    <Select value={language} onValueChange={handleChange}>
      <SelectTrigger
        className="w-[140px]"
        data-testid="select-language"
        aria-label="Select programming language"
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="javascript" data-testid="option-javascript">
          <div className="flex items-center gap-2">
            <SiJavascript className="h-4 w-4 text-yellow-500" />
            <span>JavaScript</span>
          </div>
        </SelectItem>
        <SelectItem value="python" data-testid="option-python">
          <div className="flex items-center gap-2">
            <SiPython className="h-4 w-4 text-blue-500" />
            <span>Python</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
