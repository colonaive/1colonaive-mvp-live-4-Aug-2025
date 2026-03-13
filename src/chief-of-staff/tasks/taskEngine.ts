// Chief-of-Staff — Task Management Engine
// Tracks development tasks, agent assignments, completion, and deploy verification.

export type TaskState = 'pending' | 'in-progress' | 'blocked' | 'completed' | 'verified';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface DevTask {
  id: string;
  title: string;
  description: string;
  state: TaskState;
  priority: TaskPriority;
  assignedAgent?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  verifiedAt?: string;
  deployStatus?: 'not-deployed' | 'deploying' | 'deployed' | 'failed';
  blockedReason?: string;
  tags: string[];
}

// In-memory task registry (populated from Supabase or static data)
let taskRegistry: DevTask[] = [];

export const taskEngine = {
  /** Get all tasks */
  getAllTasks(): DevTask[] {
    return [...taskRegistry];
  },

  /** Get tasks by state */
  getTasksByState(state: TaskState): DevTask[] {
    return taskRegistry.filter((t) => t.state === state);
  },

  /** Get tasks by priority */
  getTasksByPriority(priority: TaskPriority): DevTask[] {
    return taskRegistry.filter((t) => t.priority === priority);
  },

  /** Create a new task */
  createTask(task: Omit<DevTask, 'id' | 'createdAt' | 'updatedAt'>): DevTask {
    const now = new Date().toISOString();
    const newTask: DevTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    taskRegistry.push(newTask);
    return newTask;
  },

  /** Update task state */
  updateState(taskId: string, state: TaskState): DevTask | null {
    const task = taskRegistry.find((t) => t.id === taskId);
    if (!task) return null;
    task.state = state;
    task.updatedAt = new Date().toISOString();
    if (state === 'completed') task.completedAt = task.updatedAt;
    if (state === 'verified') task.verifiedAt = task.updatedAt;
    return task;
  },

  /** Assign task to an agent */
  assignAgent(taskId: string, agent: string): DevTask | null {
    const task = taskRegistry.find((t) => t.id === taskId);
    if (!task) return null;
    task.assignedAgent = agent;
    task.updatedAt = new Date().toISOString();
    return task;
  },

  /** Update deploy status */
  setDeployStatus(taskId: string, status: DevTask['deployStatus']): DevTask | null {
    const task = taskRegistry.find((t) => t.id === taskId);
    if (!task) return null;
    task.deployStatus = status;
    task.updatedAt = new Date().toISOString();
    return task;
  },

  /** Get summary statistics */
  getStats(): { total: number; pending: number; inProgress: number; blocked: number; completed: number; verified: number } {
    return {
      total: taskRegistry.length,
      pending: taskRegistry.filter((t) => t.state === 'pending').length,
      inProgress: taskRegistry.filter((t) => t.state === 'in-progress').length,
      blocked: taskRegistry.filter((t) => t.state === 'blocked').length,
      completed: taskRegistry.filter((t) => t.state === 'completed').length,
      verified: taskRegistry.filter((t) => t.state === 'verified').length,
    };
  },

  /** Load tasks from external data (e.g. Supabase) */
  loadTasks(tasks: DevTask[]): void {
    taskRegistry = [...tasks];
  },

  /** Clear all tasks */
  reset(): void {
    taskRegistry = [];
  },
};
