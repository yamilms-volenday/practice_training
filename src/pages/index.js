import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import CreateForm from '@/component/createForm';
import { Button, Row, Col } from 'antd';
import Head from 'next/head';

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
		<>
			<Head>
				<title>Employee Management System</title>
			</Head>
			<div className="text-black flex flex-col items-center justify-around m-0 p-0">
				<h1 className="text-4xl font-extrabold mt-12 mb-10 border-b-2 border-red-400">Employee List</h1>
				<Row gutter={[16, 16]} align="middle" className="my-4">
					{employees.map((employee, index) => (
						<Col key={employee.id} xs={24} sm={8} align="middle" justify="center">
							<h2 className="text-2xl font-semibold mb-2">{employee.first_name}</h2>
							<div className="my-4">
								<Button
									className="text-white bg-blue-400 mr-1"
									type="primary"
									onClick={() => handleUpdateEmployee(employee.id)}>
									Details
								</Button>
								<Button
									type="primary"
									className="ml-1"
									danger
									onClick={() => handleDeleteEmployee(employee.id)}>
									Delete
								</Button>
							</div>
						</Col>
					))}
				</Row>
				<Button
					className="flex items-center text-xl px-5 py-2 bg-blue-500 text-white mt-6"
					type="primary"
					onClick={() => setShowCreateForm(!showCreateForm)}>
					{showCreateForm ? 'Cancel' : 'Create Employee'}
				</Button>
				{showCreateForm && <CreateForm onSubmit={handleCreateEmployee} />}
			</div>
		</>
	);
};

export default Home;
