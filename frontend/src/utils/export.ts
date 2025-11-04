/**
 * Export utility for downloading data as JSON or CSV
 */

export interface ExportOptions {
  filename?: string;
  format?: 'json' | 'csv';
  includeTimestamp?: boolean;
}

const getFilename = (base: string, format: 'json' | 'csv', includeTimestamp: boolean): string => {
  const ext = format === 'json' ? 'json' : 'csv';
  const timestamp = includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
  return `${base}${timestamp}.${ext}`;
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const convertToCSV = <T extends Record<string, any>>(data: T[]): string => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(item =>
    headers.map(header => {
      const value = item[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value).includes(',') ? `"${value}"` : value;
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
};

export const exportService = {
  /**
   * Export array of objects to JSON or CSV
   */
  export<T extends Record<string, any>>(
    data: T[],
    baseFilename: string,
    options: ExportOptions = {}
  ): void {
    const {
      format = 'json',
      includeTimestamp = true,
    } = options;
    
    const filename = getFilename(baseFilename, format, includeTimestamp);
    
    if (format === 'json') {
      const json = JSON.stringify(data, null, 2);
      downloadFile(json, filename, 'application/json');
    } else {
      const csv = convertToCSV(data);
      downloadFile(csv, filename, 'text/csv');
    }
  },

  /**
   * Export single object to JSON
   */
  exportObject<T extends Record<string, any>>(
    data: T,
    baseFilename: string,
    includeTimestamp = true
  ): void {
    const filename = getFilename(baseFilename, 'json', includeTimestamp);
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, filename, 'application/json');
  },

  /**
   * Export favorites
   */
  exportFavorites(): void {
    try {
      const favorites = JSON.parse(localStorage.getItem('astroai_favorites') || '[]');
      exportService.export(favorites, 'astroai_favorites', { format: 'json' });
    } catch (error) {
      console.error('Failed to export favorites:', error);
      throw new Error('Failed to export favorites');
    }
  },

  /**
   * Export chat history
   */
  exportChatHistory(messages: any[]): void {
    exportService.export(messages, 'astroai_chat_history', { format: 'json' });
  },
};

