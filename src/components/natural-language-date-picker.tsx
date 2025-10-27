import { Icon } from "@iconify-icon/react";
import { parseDate } from "chrono-node";
import { format } from "date-fns";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { InputGroup, InputGroupInput } from "./ui/input-group";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return format(date, "do 'of' MMMM, yyyy");
}

interface NaturalLanguageDatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  error?: string;
}

export function NaturalLanguageDatePicker({
  label,
  value,
  onChange,
  placeholder = "e.g., tomorrow, next week, in 3 days",
  error,
}: NaturalLanguageDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ? formatDate(value) : "");
  const [date, setDate] = useState<Date | undefined>(value);
  const [month, setMonth] = useState<Date | undefined>(date);

  useEffect(() => {
    if (!value) {
      setDate(undefined);
      setInputValue("");
    } else {
      setDate(value);
      setInputValue(formatDate(value));
    }
  }, [value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const parsedDate = parseDate(newValue);
    if (parsedDate) {
      setDate(parsedDate);
      setMonth(parsedDate);
      onChange?.(parsedDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setMonth(selectedDate);
    if (selectedDate) {
      setInputValue(formatDate(selectedDate));
      onChange?.(selectedDate);
      setOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <InputGroup>
        <InputGroupInput
          value={inputValue}
          placeholder={placeholder}
          className="pr-8.5"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-invalid={error ? "true" : "false"}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="mr-2.5 self-center justify-self-end p-0.5"
            >
              <Icon icon="material-symbols:calendar-month" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              month={month}
              onMonthChange={setMonth}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </InputGroup>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
