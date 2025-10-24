import { Icon } from "@iconify-icon/react";
import { type ComponentProps, useEffect, useRef } from "react";
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const CalendarRoot = ({
  className,
  rootRef,
  ...props
}: ComponentProps<"div"> & { rootRef?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...props}
    />
  );
};

const CalendarChevron = ({
  className,
  orientation,
  ...props
}: Omit<ComponentProps<typeof Icon>, "icon"> & {
  orientation?: "left" | "right" | "up" | "down";
}) => {
  return (
    <Icon
      icon={
        orientation === "left"
          ? "material-symbols:chevron-left"
          : orientation === "right"
            ? "material-symbols:chevron-right"
            : orientation === "up"
              ? "material-symbols:keyboard-arrow-up"
              : "material-symbols:keyboard-arrow-down"
      }
      className={cn("size-4", className)}
      {...props}
    />
  );
};

const CalendarWeekNumber = ({ children, ...props }: ComponentProps<"td">) => {
  return (
    <td {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </td>
  );
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: ComponentProps<typeof DayPicker> & {
  buttonVariant?: ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-white group/calendar p-3 [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-teal-600 border border-gray-400 shadow-xs has-focus:ring-gray-900/50 has-focus:ring-2 rounded",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-white inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "rounded pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-gray-500 [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-gray-500 rounded flex-1 font-normal text-[0.8rem] select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-gray-500",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l [&:last-child[data-selected=true]_button]:rounded-r group/day aspect-square select-none",
          defaultClassNames.day
        ),
        range_start: cn("rounded-l bg-gray-100", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r bg-gray-100", defaultClassNames.range_end),
        today: cn(
          "ring ring-teal-600 text-teal-600 rounded data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-gray-500 aria-selected:text-gray-500",
          defaultClassNames.outside
        ),
        disabled: cn("text-gray-500 opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-teal-600 data-[selected-single=true]:text-white data-[range-middle=true]:bg-gray-100 data-[range-middle=true]:text-gray-900 data-[range-start=true]:bg-teal-600 data-[range-start=true]:text-white data-[range-end=true]:bg-teal-600 data-[range-end=true]:text-white group-data-[focused=true]/day:border-teal-600 group-data-[focused=true]/day:ring-gray-900/50 dark:hover:text-gray-900 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring data-[range-end=true]:rounded data-[range-end=true]:rounded-r data-[range-middle=true]:rounded-none data-[range-start=true]:rounded data-[range-start=true]:rounded-l [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
