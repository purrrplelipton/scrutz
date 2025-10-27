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
        "group/calendar bg-white in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent p-3 [--cell-size:--spacing(8)]",
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
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 font-medium text-sm",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded border border-gray-400 shadow-xs has-focus:border-teal-600 has-focus:ring-2 has-focus:ring-gray-900/50",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-white opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-8 items-center gap-1 rounded pr-1 pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-gray-500",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "grow select-none rounded font-normal text-[0.8rem] text-gray-500",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "select-none text-[0.8rem] text-gray-500",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l [&:last-child[data-selected=true]_button]:rounded-r",
          defaultClassNames.day
        ),
        range_start: cn("rounded-l bg-gray-100", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r bg-gray-100", defaultClassNames.range_end),
        today: cn(
          "rounded text-teal-600 ring ring-teal-600 data-[selected=true]:rounded-none",
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
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded data-[range-start=true]:rounded data-[range-middle=true]:rounded-none data-[range-end=true]:rounded-r data-[range-start=true]:rounded-l data-[range-end=true]:bg-teal-600 data-[range-middle=true]:bg-gray-100 data-[range-start=true]:bg-teal-600 data-[selected-single=true]:bg-teal-600 data-[range-end=true]:text-white data-[range-middle=true]:text-gray-900 data-[range-start=true]:text-white data-[selected-single=true]:text-white group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-teal-600 group-data-[focused=true]/day:ring group-data-[focused=true]/day:ring-gray-900/50 dark:hover:text-gray-900 [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
