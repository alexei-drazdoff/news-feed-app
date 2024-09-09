export function formatDate(dateString: string | undefined, includeTime: boolean = false): string {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC' 
    };
  
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
  
    return date.toLocaleString('ru-RU', options);
  }