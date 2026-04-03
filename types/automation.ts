/** Shared automation types used across web automation pages */

export interface StepState {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: string;
}
