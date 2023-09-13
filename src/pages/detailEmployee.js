import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';

export default function DetailEmployee() {
	const router = useRouter();
	const { id } = router.query;

	const [formData, setFormData] = useState({
		id,
		first_name: '',
		last_name: '',
		birthday: '',
		age: ''
	});

	const queryClient = useQueryClient();

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
	const updateEmployee = async data => {
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
	const {
		data: employee,
		isLoading,
		error
	} = useQuery(['employee', id], () => fetchEmployee(id), { enabled: id !== undefined });

	const updateEmployeeMutation = useMutation(updateEmployee, {
		onSuccess: () => {
			queryClient.invalidateQueries(['employee', id]); // Invalidate specific query instance
		}
	});

	useEffect(() => {
		if (employee) {
			// Convert incoming date string to YYYY-MM-DD format
			const incomingDate = new Date(employee.birthday);
			const formattedDate = `${incomingDate.getFullYear()}-${String(incomingDate.getMonth() + 1).padStart(
				2,
				'0'
			)}-${String(incomingDate.getDate()).padStart(2, '0')}`;

			setFormData({
				first_name: employee.first_name,
				last_name: employee.last_name,
				birthday: formattedDate,
				age: employee.age
			});
		}
	}, [employee]);

	useEffect(() => {
		if (id) {
			setFormData(prevState => ({ ...prevState, id }));
		}
	}, [id]);

	const handleChange = e => {
		const { name, value } = e.target;

		// If the field being changed is 'birthday', format it to YYYY-MM-DD
		if (name === 'birthday') {
			const date = new Date(value);
			const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
				date.getDate()
			).padStart(2, '0')}`;

			setFormData({
				...formData,
				[name]: formattedDate
			});
		} else {
			setFormData({
				...formData,
				[name]: value
			});
		}
	};

	const handleUpdate = e => {
		e.preventDefault();
		if (id) {
			setFormData(prevState => ({ ...prevState, id }));
			updateEmployeeMutation.mutate({ ...formData, id });
		}
	};

	const handleBackHome = e => {
		e.preventDefault();
		router.push(`/`);
	};

	if (isLoading) {
		return <p>Loading...</p>;
	}
	if (error) {
		return <p>Error: {error.message}</p>;
	}

	return (
		<div className="container-form">
			<h1 className="title">Detail Employee: {id}</h1>
			<div className="form-area">
				<form>
					<div className="form_group">
						<label className="sub_title" htmlFor="first_name">
							First Name:
						</label>
						<input
							className="form_style"
							name="first_name"
							value={formData.first_name}
							onChange={handleChange}
						/>
					</div>
					<div className="form_group">
						<label className="sub_title" htmlFor="last_name">
							Last Name:
						</label>
						<input
							className="form_style"
							name="last_name"
							value={formData.last_name}
							onChange={handleChange}
						/>
					</div>
					<div className="form_group">
						<label className="sub_title" htmlFor="birthday">
							Birthday:
						</label>
						<input
							className="form_style"
							name="birthday"
							value={formData.birthday}
							onChange={handleChange}
						/>
					</div>
					<div className="form_group">
						<label className="sub_title" htmlFor="birthday">
							Age:
						</label>
						<input className="form_style" name="age" value={formData.age} onChange={handleChange} />
					</div>
					<div>
						<button className="employee-buttons btn" onClick={handleUpdate}>
							Update Employee
						</button>
						<button className="employee-buttons btn" onClick={handleBackHome}>
							Back to Home
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
