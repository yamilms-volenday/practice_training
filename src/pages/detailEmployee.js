import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

export default function DetailEmployee() {
	const router = useRouter();
	const { id } = router.query;

	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		birthday: '',
		age: ''
	  });

	//Function to fetch one employee by id using post to pass the id on the body
	const fetchEmployee = async id => {
		const res = await fetch('/api/getOneEmployee', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
		});
		if (!res.ok) {
			throw new Error('Could not fetch employee');
		}
		return res.json();
	};

	//Function to update one employee by id using post to pass the id on the body
	const updateEmployee = async (data) => {
		const res = await fetch('/api/updateEmployee', {
		  method: 'PUT',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(data)
		});
		return res.json();
	  };

	// React Query to get one employee
	const { data: employee, isLoading, error } = useQuery(['employee', id], () => fetchEmployee(id), { enabled: !!id });

	useEffect(() => {
		if (employee) {
			setFormData({
			first_name: employee.first_name,
			last_name: employee.last_name,
			birthday: employee.birthday,
			age: employee.age,
			});
		}
		}, [JSON.stringify(employee)]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
		  ...formData,
		  [name]: value
		});
	  };
	
	  const handleUpdate = () => {
		mutation.mutate({ ...formData, id });
	  };
	  const handleBackHome= (id) => {
		router.push(`/`);
	  };

	if (isLoading) {
		return <p>Loading...</p>;
	}
	if (error) {
		return <p>Error: {error.message}</p>;
	}

	return (
		<div>
		<h1>Detail Employee: {id}</h1>
		<ul>
		  <li>First Name: <input name="first_name" value={formData.first_name} onChange={handleChange} /></li>
		  <li>Last Name: <input name="last_name" value={formData.last_name} onChange={handleChange} /></li>
		  <li>Birthday: <input name="birthday" value={formData.birthday} onChange={handleChange} /></li>
		  <li>Age: <input name="age" value={formData.age} onChange={handleChange} /></li>
		</ul>
		<button onClick={handleUpdate}>Update Employee</button>
		<button onClick={handleBackHome}>Back to Home</button>
	  </div>
	);
}
