export interface User {
  id: string;
  email: string;
  username?: string;
  age?: number | string;
  gender?: string;
}

export type Page = 'dashboard' | 'tasks' | 'analytics' | 'profile' | 'settings';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Completed';
  dueDate: string;
}