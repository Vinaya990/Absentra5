import { pgTable, serial, varchar, text, timestamp, boolean, integer, foreignKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const userRoles = ['employee', 'line_manager', 'hr', 'admin'] as const;
export const leaveStatuses = ['pending', 'approved', 'rejected'] as const;
export const leaveTypes = ['casual', 'sick', 'paid', 'personal', 'maternity', 'paternity'] as const;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  employee_id: varchar("employee_id", { length: 50 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  last_login: timestamp("last_login"),
});

// Departments table
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Employees table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  employee_id: varchar("employee_id", { length: 50 }).notNull().unique(),
  department_id: integer("department_id").notNull().references(() => departments.id),
  position: varchar("position", { length: 200 }).notNull(),
  manager_id: integer("manager_id"),
  joining_date: varchar("joining_date", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).default('active').notNull(),
  email: varchar("email", { length: 255 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  managerRef: foreignKey({ columns: [table.manager_id], foreignColumns: [table.id] }),
}));

// Holidays table
export const holidays = pgTable("holidays", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  date: varchar("date", { length: 20 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Leave policies table
export const leavePolicies = pgTable("leave_policies", {
  id: serial("id").primaryKey(),
  leave_type: varchar("leave_type", { length: 50 }).notNull(),
  annual_limit: integer("annual_limit").notNull(),
  min_days_notice: integer("min_days_notice").notNull(),
  max_consecutive_days: integer("max_consecutive_days").notNull(),
  carry_forward_allowed: boolean("carry_forward_allowed").default(false).notNull(),
  carry_forward_limit: integer("carry_forward_limit"),
  requires_medical_certificate: boolean("requires_medical_certificate").default(false),
  is_active: boolean("is_active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Leave balances table
export const leaveBalances = pgTable("leave_balances", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id").notNull().references(() => employees.id),
  leave_type: varchar("leave_type", { length: 50 }).notNull(),
  total_days: integer("total_days").notNull(),
  used_days: integer("used_days").default(0).notNull(),
  remaining_days: integer("remaining_days").notNull(),
  year: integer("year").notNull(),
});

// Leave requests table
export const leaveRequests = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  employee_id: integer("employee_id").notNull().references(() => employees.id),
  leave_type: varchar("leave_type", { length: 50 }).notNull(),
  from_date: varchar("from_date", { length: 20 }).notNull(),
  to_date: varchar("to_date", { length: 20 }).notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).default('pending').notNull(),
  days_count: integer("days_count").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Approval steps table
export const approvalSteps = pgTable("approval_steps", {
  id: serial("id").primaryKey(),
  leave_request_id: integer("leave_request_id").notNull().references(() => leaveRequests.id, { onDelete: 'cascade' }),
  step_order: integer("step_order").notNull(),
  approver_role: varchar("approver_role", { length: 50 }).notNull(),
  approver_id: integer("approver_id"),
  status: varchar("status", { length: 20 }).default('pending').notNull(),
  comments: text("comments"),
  approved_at: timestamp("approved_at"),
  is_current: boolean("is_current").default(false).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  employee: one(employees, {
    fields: [users.employee_id],
    references: [employees.employee_id],
  }),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  employees: many(employees),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  department: one(departments, {
    fields: [employees.department_id],
    references: [departments.id],
  }),
  manager: one(employees, {
    fields: [employees.manager_id],
    references: [employees.id],
  }),
  leaveRequests: many(leaveRequests),
  leaveBalances: many(leaveBalances),
  user: one(users, {
    fields: [employees.employee_id],
    references: [users.employee_id],
  }),
}));

export const leaveRequestsRelations = relations(leaveRequests, ({ one, many }) => ({
  employee: one(employees, {
    fields: [leaveRequests.employee_id],
    references: [employees.id],
  }),
  approvals: many(approvalSteps),
}));

export const approvalStepsRelations = relations(approvalSteps, ({ one }) => ({
  leaveRequest: one(leaveRequests, {
    fields: [approvalSteps.leave_request_id],
    references: [leaveRequests.id],
  }),
  approver: one(employees, {
    fields: [approvalSteps.approver_id],
    references: [employees.id],
  }),
}));

export const leaveBalancesRelations = relations(leaveBalances, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveBalances.employee_id],
    references: [employees.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = typeof departments.$inferInsert;
export type Holiday = typeof holidays.$inferSelect;
export type InsertHoliday = typeof holidays.$inferInsert;
export type LeavePolicy = typeof leavePolicies.$inferSelect;
export type InsertLeavePolicy = typeof leavePolicies.$inferInsert;
export type LeaveBalance = typeof leaveBalances.$inferSelect;
export type InsertLeaveBalance = typeof leaveBalances.$inferInsert;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = typeof leaveRequests.$inferInsert;
export type ApprovalStep = typeof approvalSteps.$inferSelect;
export type InsertApprovalStep = typeof approvalSteps.$inferInsert;

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertEmployeeSchema = createInsertSchema(employees);
export const insertDepartmentSchema = createInsertSchema(departments);
export const insertHolidaySchema = createInsertSchema(holidays);
export const insertLeavePolicySchema = createInsertSchema(leavePolicies);
export const insertLeaveBalanceSchema = createInsertSchema(leaveBalances);
export const insertLeaveRequestSchema = createInsertSchema(leaveRequests);
export const insertApprovalStepSchema = createInsertSchema(approvalSteps);

// Export existing type aliases for compatibility
export type UserRole = typeof userRoles[number];
export type LeaveStatus = typeof leaveStatuses[number];
export type LeaveType = typeof leaveTypes[number];