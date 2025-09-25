import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

// Simple component to test database integration
export default function DatabaseTest() {
  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['/api/employees'],
    queryFn: () => apiRequest('/api/employees'),
  });

  const { data: departments } = useQuery({
    queryKey: ['/api/departments'],
    queryFn: () => apiRequest('/api/departments'),
  });

  if (isLoading) return <div className="p-4">Loading database data...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {String(error)}</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Database Integration Test</h2>
      
      <div>
        <h3 className="text-lg font-semibold">Employees from Database:</h3>
        <ul className="space-y-1">
          {employees?.map((emp: any) => (
            <li key={emp.id} className="flex gap-2">
              <span className="font-medium">#{emp.id}</span>
              <span>{emp.name}</span>
              <span className="text-gray-600">({emp.employee_id})</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Departments from Database:</h3>
        <ul className="space-y-1">
          {departments?.map((dept: any) => (
            <li key={dept.id} className="flex gap-2">
              <span className="font-medium">#{dept.id}</span>
              <span>{dept.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}