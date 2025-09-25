import express from 'express';
import cors from 'cors';
import { storage } from './storage';
import { db } from './db';
import { users, insertEmployeeSchema, insertDepartmentSchema, insertHolidaySchema, insertLeavePolicySchema, insertLeaveRequestSchema } from '../shared/schema';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Employees endpoints
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await storage.getEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await storage.getEmployee(parseInt(req.params.id));
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const validatedData = insertEmployeeSchema.parse(req.body);
    const employee = await storage.createEmployee(validatedData);
    res.status(201).json(employee);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid employee data', details: error.message });
    }
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    await storage.updateEmployee(parseInt(req.params.id), req.body);
    const updatedEmployee = await storage.getEmployee(parseInt(req.params.id));
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/by-username/:username', async (req, res) => {
  try {
    const user = await storage.getUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Departments endpoints
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await storage.getDepartments();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const validatedData = insertDepartmentSchema.parse(req.body);
    const department = await storage.createDepartment(validatedData);
    res.status(201).json(department);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid department data', details: error.message });
    }
    res.status(500).json({ error: 'Failed to create department' });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  try {
    await storage.updateDepartment(parseInt(req.params.id), req.body);
    const updatedDepartment = await storage.getDepartment(parseInt(req.params.id));
    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    await storage.deleteDepartment(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// Holidays endpoints
app.get('/api/holidays', async (req, res) => {
  try {
    const holidays = await storage.getHolidays();
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch holidays' });
  }
});

app.post('/api/holidays', async (req, res) => {
  try {
    const holiday = await storage.createHoliday(req.body);
    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create holiday' });
  }
});

app.put('/api/holidays/:id', async (req, res) => {
  try {
    await storage.updateHoliday(parseInt(req.params.id), req.body);
    const updatedHoliday = await storage.getHoliday(parseInt(req.params.id));
    res.json(updatedHoliday);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update holiday' });
  }
});

app.delete('/api/holidays/:id', async (req, res) => {
  try {
    await storage.deleteHoliday(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete holiday' });
  }
});

// Leave policies endpoints
app.get('/api/leave-policies', async (req, res) => {
  try {
    const policies = await storage.getLeavePolicies();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave policies' });
  }
});

app.post('/api/leave-policies', async (req, res) => {
  try {
    const policy = await storage.createLeavePolicy(req.body);
    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leave policy' });
  }
});

app.put('/api/leave-policies/:id', async (req, res) => {
  try {
    await storage.updateLeavePolicy(parseInt(req.params.id), req.body);
    const updatedPolicy = await storage.getLeavePolicy(parseInt(req.params.id));
    res.json(updatedPolicy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leave policy' });
  }
});

// Leave balances endpoints
app.get('/api/leave-balances', async (req, res) => {
  try {
    const balances = await storage.getLeaveBalances();
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave balances' });
  }
});

app.get('/api/leave-balances/employee/:employeeId', async (req, res) => {
  try {
    const balances = await storage.getLeaveBalancesByEmployee(parseInt(req.params.employeeId));
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee leave balances' });
  }
});

// Leave requests endpoints
app.get('/api/leave-requests', async (req, res) => {
  try {
    const requests = await storage.getLeaveRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

app.get('/api/leave-requests/employee/:employeeId', async (req, res) => {
  try {
    const requests = await storage.getLeaveRequestsByEmployee(parseInt(req.params.employeeId));
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee leave requests' });
  }
});

app.post('/api/leave-requests', async (req, res) => {
  try {
    const request = await storage.createLeaveRequest(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leave request' });
  }
});

app.put('/api/leave-requests/:id', async (req, res) => {
  try {
    await storage.updateLeaveRequest(parseInt(req.params.id), req.body);
    const updatedRequest = await storage.getLeaveRequest(parseInt(req.params.id));
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leave request' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});