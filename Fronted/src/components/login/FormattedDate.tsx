import React from 'react';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export function FormattedDate({
  date,
  ...props
}: React.ComponentPropsWithoutRef<'time'> & { date: string | Date }) {
  // Check if the passed date is valid
  if (typeof date !== 'string' && !(date instanceof Date)) {
    console.error('Invalid date prop passed to FormattedDate component:', date);
    return null;
  }

  // If date is a string, convert it to a Date object
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  return (
    <time dateTime={parsedDate.toISOString()} {...props}>
      {dateFormatter.format(parsedDate)}
    </time>
  );
}
