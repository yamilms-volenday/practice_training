import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import CreateForm from '@/component/createForm';

const Home = () => {
	const [showCreateForm, setShowCreateForm] = useState(false);

	const router = useRouter();

	// Function to fetch employees
	const fetchEmployees = async () => {
		const res = await fetch('/api/getEmployees');
		if (!res.ok) {
			throw new Error('Could not fetch employees');
		}
		return res.json();
	};

	// Function to create a new employee
	const createEmployee = async newEmployee => {
		const res = await fetch('/api/postEmployee', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newEmployee)
		});
		if (!res.ok) {
			throw new Error('Could not create employee');
		}
		return res.json();
	};

	//Function to delete an employee
	const deleteEmployee = async id => {
		const res = await fetch('/api/deleteEmployee', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
		});
		if (!res.ok) {
			throw new Error('Could not delete employee');
		}
		return res.json();
	};

	// React Query to get employees
	const { data: employees, error, isLoading } = useQuery('employees', fetchEmployees);

	const queryClient = useQueryClient();

	// React Query to create a new employee
	const createEmployeeMutation = useMutation(createEmployee, {
		onSuccess: () => {
			queryClient.invalidateQueries('employees');
		}
	});

	// React Query to delete an employee
	const deleteEmployeeMutation = useMutation(deleteEmployee, {
		onSuccess: () => queryClient.invalidateQueries('employees')
	});

	// Function to handle the creation of a new employee
	const handleCreateEmployee = newEmployee => {
		createEmployeeMutation.mutate(newEmployee);
		setShowCreateForm(false);
	};

	// Function to handle the deletion of an employee
	const handleDeleteEmployee = id => {
		deleteEmployeeMutation.mutate(id);
	};

	// Function to handle the update of an employee
	const handleUpdateEmployee = id => {
		router.push(`/detailEmployee?id=${id}`);
	};

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	return (
		<div className="container">
			<h1 className="header">Employee List</h1>
			<ul className="get-list">
				{employees.map(employee => (
					<li key={employee.id}>
						<h2 className="employee-name">{employee.first_name}</h2>
						<div className="container-buttons">
							<button className="employee-buttons" onClick={() => handleDeleteEmployee(employee.id)}>
								Delete
							</button>
							<button className="employee-buttons" onClick={() => handleUpdateEmployee(employee.id)}>
								Details
							</button>
						</div>
					</li>
				))}
			</ul>
			<button className="form-button" onClick={() => setShowCreateForm(!showCreateForm)}>
				Create Employee
			</button>
			{showCreateForm && <CreateForm onSubmit={handleCreateEmployee} />}
		</div>
	);
};

export default Home;
