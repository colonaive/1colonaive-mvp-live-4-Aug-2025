export type ActionType =
  | 'generate_post'
  | 'generate_image'
  | 'improve_prompt'
  | 'publish_post'
  | 'radar_generate'
  | 'manual_generate';

export type ActionStatus = 'pending' | 'running' | 'success' | 'failed';

export interface CockpitAction {
  id: string;
  type: ActionType;
  status: ActionStatus;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
  created_at: string;
  /** Callback to re-run the action with the same input */
  retry?: () => void;
}
