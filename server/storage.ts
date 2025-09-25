import { eq, and, desc, asc } from "drizzle-orm";
import { db } from "./db";
import { 
  users, employees, departments, holidays, leavePolicies, leaveBalances, 
  leaveRequests, approvalSteps,
  type User, type Employee, type Department, type Holiday, 
  type LeavePolicy, type LeaveBalance, type LeaveRequest, type ApprovalStep,
  type InsertUser, type InsertEmployee, type InsertDepartment, type InsertHoliday,
  type InsertLeavePolicy, type InsertLeaveBalance, type InsertLeaveRequest, type InsertApprovalStep
} from "../shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<void>;
  
  // Employees
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined>;
  getEmployeeByUserId(userId: string): Promise<Employee | undefined>;
  createEmployee(insertEmployee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employeeData: Partial<Employee>): Promise<void>;
  
  // Departments
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(insertDepartment: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, departmentData: Partial<Department>): Promise<void>;
  deleteDepartment(id: number): Promise<void>;
  
  // Holidays
  getHolidays(): Promise<Holiday[]>;
  getHoliday(id: number): Promise<Holiday | undefined>;
  createHoliday(insertHoliday: InsertHoliday): Promise<Holiday>;
  updateHoliday(id: number, holidayData: Partial<Holiday>): Promise<void>;
  deleteHoliday(id: number): Promise<void>;
  
  // Leave Policies
  getLeavePolicies(): Promise<LeavePolicy[]>;
  getLeavePolicy(id: number): Promise<LeavePolicy | undefined>;
  createLeavePolicy(insertLeavePolicy: InsertLeavePolicy): Promise<LeavePolicy>;
  updateLeavePolicy(id: number, policyData: Partial<LeavePolicy>): Promise<void>;
  
  // Leave Balances
  getLeaveBalances(): Promise<LeaveBalance[]>;
  getLeaveBalancesByEmployee(employeeId: number): Promise<LeaveBalance[]>;
  createLeaveBalance(insertLeaveBalance: InsertLeaveBalance): Promise<LeaveBalance>;
  updateLeaveBalance(id: number, balanceData: Partial<LeaveBalance>): Promise<void>;
  
  // Leave Requests
  getLeaveRequests(): Promise<LeaveRequest[]>;
  getLeaveRequest(id: number): Promise<LeaveRequest | undefined>;
  getLeaveRequestsByEmployee(employeeId: number): Promise<LeaveRequest[]>;
  createLeaveRequest(insertLeaveRequest: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: number, requestData: Partial<LeaveRequest>): Promise<void>;
  
  // Approval Steps
  getApprovalSteps(leaveRequestId: number): Promise<ApprovalStep[]>;
  createApprovalStep(insertApprovalStep: InsertApprovalStep): Promise<ApprovalStep>;
  updateApprovalStep(id: number, stepData: Partial<ApprovalStep>): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<void> {
    await db.update(users).set({...userData, updated_at: new Date()}).where(eq(users.id, id));
  }

  // Employees
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(asc(employees.name));
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.employee_id, employeeId));
    return employee || undefined;
  }

  async getEmployeeByUserId(userId: string): Promise<Employee | undefined> {
    // Try to find by employee_id first (assuming userId might be employee_id like "EMP004")
    const employeeByEmpId = await this.getEmployeeByEmployeeId(userId);
    if (employeeByEmpId) return employeeByEmpId;
    
    // Otherwise try to find by numeric user ID
    if (!isNaN(parseInt(userId))) {
      const [result] = await db.select()
        .from(employees)
        .innerJoin(users, eq(employees.employee_id, users.employee_id))
        .where(eq(users.id, parseInt(userId)));
      return result?.employees || undefined;
    }
    
    return undefined;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db.insert(employees).values(insertEmployee).returning();
    return employee;
  }

  async updateEmployee(id: number, employeeData: Partial<Employee>): Promise<void> {
    await db.update(employees).set({...employeeData, updated_at: new Date()}).where(eq(employees.id, id));
  }

  // Departments
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments).orderBy(asc(departments.name));
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department || undefined;
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const [department] = await db.insert(departments).values(insertDepartment).returning();
    return department;
  }

  async updateDepartment(id: number, departmentData: Partial<Department>): Promise<void> {
    await db.update(departments).set({...departmentData, updated_at: new Date()}).where(eq(departments.id, id));
  }

  async deleteDepartment(id: number): Promise<void> {
    await db.delete(departments).where(eq(departments.id, id));
  }

  // Holidays
  async getHolidays(): Promise<Holiday[]> {
    return await db.select().from(holidays).orderBy(asc(holidays.date));
  }

  async getHoliday(id: number): Promise<Holiday | undefined> {
    const [holiday] = await db.select().from(holidays).where(eq(holidays.id, id));
    return holiday || undefined;
  }

  async createHoliday(insertHoliday: InsertHoliday): Promise<Holiday> {
    const [holiday] = await db.insert(holidays).values(insertHoliday).returning();
    return holiday;
  }

  async updateHoliday(id: number, holidayData: Partial<Holiday>): Promise<void> {
    await db.update(holidays).set({...holidayData, updated_at: new Date()}).where(eq(holidays.id, id));
  }

  async deleteHoliday(id: number): Promise<void> {
    await db.delete(holidays).where(eq(holidays.id, id));
  }

  // Leave Policies
  async getLeavePolicies(): Promise<LeavePolicy[]> {
    return await db.select().from(leavePolicies).orderBy(asc(leavePolicies.leave_type));
  }

  async getLeavePolicy(id: number): Promise<LeavePolicy | undefined> {
    const [policy] = await db.select().from(leavePolicies).where(eq(leavePolicies.id, id));
    return policy || undefined;
  }

  async createLeavePolicy(insertLeavePolicy: InsertLeavePolicy): Promise<LeavePolicy> {
    const [policy] = await db.insert(leavePolicies).values(insertLeavePolicy).returning();
    return policy;
  }

  async updateLeavePolicy(id: number, policyData: Partial<LeavePolicy>): Promise<void> {
    await db.update(leavePolicies).set({...policyData, updated_at: new Date()}).where(eq(leavePolicies.id, id));
  }

  // Leave Balances
  async getLeaveBalances(): Promise<LeaveBalance[]> {
    return await db.select().from(leaveBalances).orderBy(asc(leaveBalances.employee_id));
  }

  async getLeaveBalancesByEmployee(employeeId: number): Promise<LeaveBalance[]> {
    return await db.select().from(leaveBalances).where(eq(leaveBalances.employee_id, employeeId));
  }

  async createLeaveBalance(insertLeaveBalance: InsertLeaveBalance): Promise<LeaveBalance> {
    const [balance] = await db.insert(leaveBalances).values(insertLeaveBalance).returning();
    return balance;
  }

  async updateLeaveBalance(id: number, balanceData: Partial<LeaveBalance>): Promise<void> {
    await db.update(leaveBalances).set(balanceData).where(eq(leaveBalances.id, id));
  }

  // Leave Requests
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).orderBy(desc(leaveRequests.created_at));
  }

  async getLeaveRequest(id: number): Promise<LeaveRequest | undefined> {
    const [request] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return request || undefined;
  }

  async getLeaveRequestsByEmployee(employeeId: number): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).where(eq(leaveRequests.employee_id, employeeId)).orderBy(desc(leaveRequests.created_at));
  }

  async createLeaveRequest(insertLeaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const [request] = await db.insert(leaveRequests).values(insertLeaveRequest).returning();
    return request;
  }

  async updateLeaveRequest(id: number, requestData: Partial<LeaveRequest>): Promise<void> {
    await db.update(leaveRequests).set({...requestData, updated_at: new Date()}).where(eq(leaveRequests.id, id));
  }

  // Approval Steps
  async getApprovalSteps(leaveRequestId: number): Promise<ApprovalStep[]> {
    return await db.select().from(approvalSteps).where(eq(approvalSteps.leave_request_id, leaveRequestId)).orderBy(asc(approvalSteps.step_order));
  }

  async createApprovalStep(insertApprovalStep: InsertApprovalStep): Promise<ApprovalStep> {
    const [step] = await db.insert(approvalSteps).values(insertApprovalStep).returning();
    return step;
  }

  async updateApprovalStep(id: number, stepData: Partial<ApprovalStep>): Promise<void> {
    await db.update(approvalSteps).set(stepData).where(eq(approvalSteps.id, id));
  }
}

export const storage = new DatabaseStorage();