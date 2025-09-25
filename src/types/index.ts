// Re-export types from shared schema to maintain compatibility
export type {
  User,
  Employee, 
  Department,
  Holiday,
  LeavePolicy,
  LeaveBalance,
  LeaveRequest,
  ApprovalStep,
  UserRole,
  LeaveStatus,
  LeaveType
} from '../../shared/schema';

// Import UserRole for local use
import type { UserRole } from '../../shared/schema';

// Legacy interfaces for backward compatibility
export interface NotificationMetadata {
  employeeId?: string;
  employeeName?: string;
  batchNumber?: string;
  leaveType?: string;
  leaveDates?: string;
  approverName?: string;
  requestId?: string;
}

export interface WorkflowConfig {
  id: string;
  name: string;
  steps: WorkflowStep[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  order: number;
  role: UserRole;
  required: boolean;
}