'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AppSettings, Category, DEFAULT_COLORS } from '@/lib/types';
import { categoryStorage, settingsStorage, exportData, importData, generateId } from '@/lib/storage';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('calendar_settings', {
    theme: 'system',
    defaultView: 'month',
    weekStartsOn: 0,
    timeFormat: '12h',
    defaultEventDuration: 60,
    showWeekends: true,
  });

  const [categories, setCategories] = useState<Category[]>(() => categoryStorage.getAll());
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(DEFAULT_COLORS[0]);
  const [newCategoryType, setNewCategoryType] = useState<'event' | 'task' | 'both'>('both');

  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    settingsStorage.save(newSettings);
    toast.success('Settings updated successfully');
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    const newCategory: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      color: newCategoryColor,
      type: newCategoryType,
      createdAt: new Date(),
    };

    categoryStorage.add(newCategory);
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setNewCategoryColor(DEFAULT_COLORS[0]);
    setNewCategoryType('both');
    toast.success('Category added successfully');
  };

  const removeCategory = (categoryId: string) => {
    categoryStorage.remove(categoryId);
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast.success('Category removed successfully');
  };

  const handleExport = () => {
    try {
      exportData();
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importData(content);
        if (success) {
          setCategories(categoryStorage.getAll());
          toast.success('Data imported successfully');
          window.location.reload();
        } else {
          toast.error('Failed to import data');
        }
      } catch (error) {
        toast.error('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your calendar preferences and categories.
          </p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultView">Default View</Label>
                <Select
                  value={settings.defaultView}
                  onValueChange={(value: 'month' | 'week' | 'day') => 
                    updateSettings({ defaultView: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekStartsOn">Week Starts On</Label>
                <Select
                  value={settings.weekStartsOn.toString()}
                  onValueChange={(value) => 
                    updateSettings({ weekStartsOn: parseInt(value) as 0 | 1 })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select
                  value={settings.timeFormat}
                  onValueChange={(value: '12h' | '24h') => 
                    updateSettings({ timeFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hour</SelectItem>
                    <SelectItem value="24h">24 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultEventDuration">Default Event Duration (minutes)</Label>
                <Input
                  id="defaultEventDuration"
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={settings.defaultEventDuration}
                  onChange={(e) => 
                    updateSettings({ defaultEventDuration: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showWeekends">Show Weekends</Label>
                <p className="text-sm text-muted-foreground">
                  Display Saturday and Sunday in calendar views
                </p>
              </div>
              <Switch
                id="showWeekends"
                checked={settings.showWeekends}
                onCheckedChange={(checked) => updateSettings({ showWeekends: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add New Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Name</Label>
                  <Input
                    id="categoryName"
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryColor">Color</Label>
                  <Select value={newCategoryColor} onValueChange={setNewCategoryColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_COLORS.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: color }}
                            />
                            {color}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryType">Type</Label>
                  <Select value={newCategoryType} onValueChange={(value: 'event' | 'task' | 'both') => setNewCategoryType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="event">Events Only</SelectItem>
                      <SelectItem value="task">Tasks Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={addCategory} className="w-full">
                    Add Category
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Existing Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Categories</h3>
              {categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {category.type}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(category.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No categories created yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExport} variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Data
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="import-file" className="cursor-pointer">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Import Data
                  </label>
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Export your calendar data as a JSON file or import from a previously exported file.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}