// Local storage utilities for persisting app data
import { Event, Task, Category, AppSettings, DEFAULT_CATEGORIES } from './types';

const STORAGE_KEYS = {
  EVENTS: 'calendar_events',
  TASKS: 'calendar_tasks',
  CATEGORIES: 'calendar_categories',
  SETTINGS: 'calendar_settings',
} as const;

// Helper to safely parse JSON from localStorage
function safeJsonParse<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    const parsed = JSON.parse(item);
    // Convert date strings back to Date objects for events and tasks
    if (key === STORAGE_KEYS.EVENTS) {
      return parsed.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
        recurringPattern: event.recurringPattern ? {
          ...event.recurringPattern,
          endDate: event.recurringPattern.endDate ? new Date(event.recurringPattern.endDate) : undefined
        } : undefined
      })) as T;
    }
    
    if (key === STORAGE_KEYS.TASKS) {
      return parsed.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      })) as T;
    }
    
    if (key === STORAGE_KEYS.CATEGORIES) {
      return parsed.map((category: any) => ({
        ...category,
        createdAt: new Date(category.createdAt),
      })) as T;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Helper to safely stringify and store to localStorage
function safeJsonStringify(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key} to localStorage:`, error);
  }
}

// Events storage
export const eventStorage = {
  getAll: (): Event[] => safeJsonParse(STORAGE_KEYS.EVENTS, []),
  
  save: (events: Event[]): void => {
    safeJsonStringify(STORAGE_KEYS.EVENTS, events);
  },
  
  add: (event: Event): void => {
    const events = eventStorage.getAll();
    events.push(event);
    eventStorage.save(events);
  },
  
  update: (eventId: string, updates: Partial<Event>): Event | null => {
    const events = eventStorage.getAll();
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) return null;
    
    events[index] = { ...events[index], ...updates, updatedAt: new Date() };
    eventStorage.save(events);
    return events[index];
  },
  
  remove: (eventId: string): boolean => {
    const events = eventStorage.getAll();
    const filteredEvents = events.filter(e => e.id !== eventId);
    if (filteredEvents.length === events.length) return false;
    
    eventStorage.save(filteredEvents);
    return true;
  },
  
  getByDateRange: (startDate: Date, endDate: Date): Event[] => {
    const events = eventStorage.getAll();
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart <= endDate && eventEnd >= startDate;
    });
  }
};

// Tasks storage
export const taskStorage = {
  getAll: (): Task[] => safeJsonParse(STORAGE_KEYS.TASKS, []),
  
  save: (tasks: Task[]): void => {
    safeJsonStringify(STORAGE_KEYS.TASKS, tasks);
  },
  
  add: (task: Task): void => {
    const tasks = taskStorage.getAll();
    tasks.push(task);
    taskStorage.save(tasks);
  },
  
  update: (taskId: string, updates: Partial<Task>): Task | null => {
    const tasks = taskStorage.getAll();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return null;
    
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
    taskStorage.save(tasks);
    return tasks[index];
  },
  
  remove: (taskId: string): boolean => {
    const tasks = taskStorage.getAll();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    if (filteredTasks.length === tasks.length) return false;
    
    taskStorage.save(filteredTasks);
    return true;
  },
  
  getByStatus: (completed: boolean): Task[] => {
    return taskStorage.getAll().filter(task => task.completed === completed);
  },
  
  getByDueDate: (date: Date): Task[] => {
    const tasks = taskStorage.getAll();
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  }
};

// Categories storage
export const categoryStorage = {
  getAll: (): Category[] => {
    const stored = safeJsonParse(STORAGE_KEYS.CATEGORIES, []);
    
    // Initialize with default categories if empty
    if (stored.length === 0) {
      const defaultCategories: Category[] = DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `default_${index}`,
        createdAt: new Date(),
      }));
      categoryStorage.save(defaultCategories);
      return defaultCategories;
    }
    
    return stored;
  },
  
  save: (categories: Category[]): void => {
    safeJsonStringify(STORAGE_KEYS.CATEGORIES, categories);
  },
  
  add: (category: Category): void => {
    const categories = categoryStorage.getAll();
    categories.push(category);
    categoryStorage.save(categories);
  },
  
  update: (categoryId: string, updates: Partial<Category>): Category | null => {
    const categories = categoryStorage.getAll();
    const index = categories.findIndex(c => c.id === categoryId);
    if (index === -1) return null;
    
    categories[index] = { ...categories[index], ...updates };
    categoryStorage.save(categories);
    return categories[index];
  },
  
  remove: (categoryId: string): boolean => {
    const categories = categoryStorage.getAll();
    const filteredCategories = categories.filter(c => c.id !== categoryId);
    if (filteredCategories.length === categories.length) return false;
    
    categoryStorage.save(filteredCategories);
    return true;
  }
};

// Settings storage
export const settingsStorage = {
  get: (): AppSettings => {
    const defaultSettings: AppSettings = {
      theme: 'system',
      defaultView: 'month',
      weekStartsOn: 0,
      timeFormat: '12h',
      defaultEventDuration: 60,
      showWeekends: true,
    };
    
    return safeJsonParse(STORAGE_KEYS.SETTINGS, defaultSettings);
  },
  
  save: (settings: AppSettings): void => {
    safeJsonStringify(STORAGE_KEYS.SETTINGS, settings);
  },
  
  update: (updates: Partial<AppSettings>): AppSettings => {
    const currentSettings = settingsStorage.get();
    const newSettings = { ...currentSettings, ...updates };
    settingsStorage.save(newSettings);
    return newSettings;
  }
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const exportData = () => {
  const data = {
    events: eventStorage.getAll(),
    tasks: taskStorage.getAll(),
    categories: categoryStorage.getAll(),
    settings: settingsStorage.get(),
    exportedAt: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `calendar-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.events) eventStorage.save(data.events);
    if (data.tasks) taskStorage.save(data.tasks);
    if (data.categories) categoryStorage.save(data.categories);
    if (data.settings) settingsStorage.save(data.settings);
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};