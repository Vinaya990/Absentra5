import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, employees, departments, holidays, leavePolicies, leaveBalances, 
  leaveRequests, approvalSteps
} from "../shared/schema";

export async function seedDatabase() {
  console.log("Starting database seeding...");

  // Check if data already exists
  const existingDepartments = await db.select().from(departments).limit(1);
  if (existingDepartments.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  // Create departments
  const [engDept, hrDept, marketingDept] = await db.insert(departments).values([
    { name: 'Engineering', description: 'Software Development' },
    { name: 'Human Resources', description: 'HR Management' },
    { name: 'Marketing', description: 'Marketing and Sales' },
  ]).returning();

  // Create employees
  const [adminEmp, hrEmp, managerEmp, devEmp] = await db.insert(employees).values([
    { 
      name: 'Admin User', 
      employee_id: 'EMP001', 
      department_id: hrDept.id, 
      position: 'System Admin', 
      joining_date: '2024-01-01', 
      status: 'active' 
    },
    { 
      name: 'Sarah Johnson', 
      employee_id: 'EMP002', 
      department_id: hrDept.id, 
      position: 'HR Manager', 
      joining_date: '2024-01-15', 
      status: 'active' 
    },
    { 
      name: 'Mike Chen', 
      employee_id: 'EMP003', 
      department_id: engDept.id, 
      position: 'Team Lead', 
      joining_date: '2024-02-01', 
      status: 'active' 
    },
    { 
      name: 'Emily Davis', 
      employee_id: 'EMP004', 
      department_id: engDept.id, 
      position: 'Software Developer', 
      manager_id: null, // Will update after creation
      joining_date: '2024-02-15', 
      status: 'active' 
    },
  ]).returning();

  // Update Emily's manager
  await db.update(employees)
    .set({ manager_id: managerEmp.id })
    .where(eq(employees.id, devEmp.id));

  // Create users
  await db.insert(users).values([
    { 
      username: 'admin', 
      email: 'admin@company.com', 
      employee_id: 'EMP001', 
      role: 'admin', 
      is_active: true,
      last_login: new Date('2024-12-20T10:30:00Z')
    },
    { 
      username: 'hr.manager', 
      email: 'hr@company.com', 
      employee_id: 'EMP002', 
      role: 'hr', 
      is_active: true,
      last_login: new Date('2024-12-19T10:30:00Z')
    },
    { 
      username: 'line.manager', 
      email: 'manager@company.com', 
      employee_id: 'EMP003', 
      role: 'line_manager', 
      is_active: true,
      last_login: new Date('2024-12-18T10:30:00Z')
    },
    { 
      username: 'employee', 
      email: 'employee@company.com', 
      employee_id: 'EMP004', 
      role: 'employee', 
      is_active: true,
      last_login: new Date('2024-12-17T10:30:00Z')
    },
  ]);

  // Create holidays
  await db.insert(holidays).values([
    { name: 'New Year\'s Day', date: '2024-01-01', description: 'Public Holiday' },
    { name: 'Independence Day', date: '2024-07-04', description: 'National Holiday' },
    { name: 'Christmas Day', date: '2024-12-25', description: 'Religious Holiday' },
  ]);

  // Create leave policies
  await db.insert(leavePolicies).values([
    {
      leave_type: 'casual',
      annual_limit: 12,
      min_days_notice: 2,
      max_consecutive_days: 5,
      carry_forward_allowed: true,
      carry_forward_limit: 5,
      is_active: true,
    },
    {
      leave_type: 'sick',
      annual_limit: 10,
      min_days_notice: 0,
      max_consecutive_days: 10,
      carry_forward_allowed: false,
      requires_medical_certificate: true,
      is_active: true,
    },
    {
      leave_type: 'paid',
      annual_limit: 20,
      min_days_notice: 7,
      max_consecutive_days: 15,
      carry_forward_allowed: true,
      carry_forward_limit: 10,
      is_active: true,
    }
  ]);

  // Create leave balances for Emily (the employee)
  await db.insert(leaveBalances).values([
    { employee_id: devEmp.id, leave_type: 'casual', total_days: 12, used_days: 2, remaining_days: 10, year: 2024 },
    { employee_id: devEmp.id, leave_type: 'sick', total_days: 10, used_days: 1, remaining_days: 9, year: 2024 },
    { employee_id: devEmp.id, leave_type: 'paid', total_days: 20, used_days: 5, remaining_days: 15, year: 2024 },
  ]);

  // Create a sample leave request
  const [leaveReq] = await db.insert(leaveRequests).values({
    employee_id: devEmp.id,
    leave_type: 'casual',
    from_date: '2024-12-20',
    to_date: '2024-12-22',
    reason: 'Family vacation',
    status: 'pending',
    days_count: 3,
  }).returning();

  // Create approval steps for the leave request
  await db.insert(approvalSteps).values([
    {
      leave_request_id: leaveReq.id,
      step_order: 1,
      approver_role: 'line_manager',
      status: 'pending',
      is_current: true
    },
    {
      leave_request_id: leaveReq.id,
      step_order: 2,
      approver_role: 'hr',
      status: 'pending',
      is_current: false
    }
  ]);

  console.log("Database seeding completed successfully!");
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0)).catch(console.error);
}