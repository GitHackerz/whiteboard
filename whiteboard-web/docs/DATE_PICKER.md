# Date Picker Components

Reusable shadcn/ui date picker components with proper z-index handling for modals and dialogs.

## Components

### 1. DatePicker

A single date picker component with full customization options.

**Location:** `src/components/ui/date-picker.tsx`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `date` | `Date \| undefined` | - | The selected date |
| `onDateChange` | `(date: Date \| undefined) => void` | - | Callback when date changes |
| `placeholder` | `string` | `"Pick a date"` | Placeholder text when no date selected |
| `disabled` | `boolean` | `false` | Disable the date picker |
| `disabledDates` | `(date: Date) => boolean` | - | Function to disable specific dates |
| `className` | `string` | - | Additional CSS classes |
| `fromDate` | `Date` | - | Minimum selectable date |
| `toDate` | `Date` | - | Maximum selectable date |

#### Usage Example

```tsx
import { DatePicker } from '@/components/ui/date-picker';

function MyComponent() {
  const [startDate, setStartDate] = useState<Date>();

  return (
    <DatePicker
      date={startDate}
      onDateChange={setStartDate}
      placeholder="Pick start date"
      disabledDates={(date) => date < new Date()}
    />
  );
}
```

### 2. DateRangePicker

A date range picker for selecting start and end dates.

**Location:** `src/components/ui/date-range-picker.tsx`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dateRange` | `DateRange \| undefined` | - | The selected date range |
| `onDateRangeChange` | `(range: DateRange \| undefined) => void` | - | Callback when range changes |
| `placeholder` | `string` | `"Pick a date range"` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the picker |
| `disabledDates` | `(date: Date) => boolean` | - | Function to disable specific dates |
| `className` | `string` | - | Additional CSS classes |
| `numberOfMonths` | `number` | `2` | Number of months to display |

#### Usage Example

```tsx
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

function MyComponent() {
  const [dateRange, setDateRange] = useState<DateRange>();

  return (
    <DateRangePicker
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      placeholder="Select date range"
      numberOfMonths={2}
    />
  );
}
```

## Features

### ✅ Modal Support
- Uses `modal={true}` for Popover to ensure calendar renders outside scrollable containers
- Proper z-index (`z-[100]`) to appear above dialogs and modals
- `sideOffset={4}` for better spacing

### ✅ Date Format
- Displays dates in clean "MMM dd, yyyy" format (e.g., "Oct 17, 2025")
- Consistent formatting across all date pickers

### ✅ Accessibility
- Keyboard navigation support
- `initialFocus` on calendar for better UX
- Proper ARIA labels and roles

### ✅ Customization
- Disable past/future dates
- Custom date validation
- Theming support (dark mode compatible)
- Custom placeholders

## Common Use Cases

### 1. Disable Past Dates
```tsx
<DatePicker
  date={date}
  onDateChange={setDate}
  disabledDates={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
/>
```

### 2. End Date After Start Date
```tsx
<DatePicker
  date={endDate}
  onDateChange={setEndDate}
  disabledDates={(date) => 
    startDate ? date < startDate : date < new Date()
  }
/>
```

### 3. Date Range with Minimum Date
```tsx
<DateRangePicker
  dateRange={range}
  onDateRangeChange={setRange}
  disabledDates={(date) => date < new Date()}
  numberOfMonths={2}
/>
```

## Integration with Forms

The date pickers work seamlessly with form state management:

```tsx
function CourseForm() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error('Please select dates');
      return;
    }

    // Convert to ISO string for API
    const data = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    
    // Submit data...
  };

  return (
    <form onSubmit={handleSubmit}>
      <DatePicker
        date={startDate}
        onDateChange={setStartDate}
        placeholder="Start date"
      />
      <DatePicker
        date={endDate}
        onDateChange={setEndDate}
        placeholder="End date"
        disabledDates={(date) => startDate ? date < startDate : false}
      />
    </form>
  );
}
```

## Updated Components

The following components have been updated to use the new DatePicker:

1. ✅ `create-course-dialog.tsx` - Course creation
2. ✅ `edit-course-dialog.tsx` - Course editing
3. ✅ `create-assignment-dialog.tsx` - Assignment creation
4. ✅ `edit-assignment-dialog.tsx` - Assignment editing

## Benefits

- **Consistency**: Same date picker behavior across entire app
- **Maintainability**: Single source of truth for date picker logic
- **Reusability**: Easy to use in any component
- **Type Safety**: Full TypeScript support
- **Accessibility**: Built-in keyboard navigation and ARIA support
- **Z-Index Handling**: Works correctly in modals and dialogs
- **Clean Code**: Simplified date picker implementation

## Styling

The component uses Tailwind CSS and follows shadcn/ui conventions:
- Responsive button styling
- Dark mode support
- Consistent spacing and sizing
- Proper focus states

## Dependencies

- `date-fns` - Date formatting
- `react-day-picker` - Calendar component
- `lucide-react` - Calendar icon
- `@/components/ui/button` - Button component
- `@/components/ui/calendar` - Calendar component
- `@/components/ui/popover` - Popover component
