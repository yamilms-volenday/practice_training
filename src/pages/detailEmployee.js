import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import * as Yup from 'yup';

export default function DetailEmployee() {
	const router = useRouter();
	const { id } = router.query;
	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		id,
		first_name: '',
		last_name: '',
		birthday: '',
		age: ''
	});

	const validationSchema = Yup.object().shape({
		first_name: Yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
		last_name: Yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
		birthday: Yup.date().required('Birthday is required').max(new Date(), 'Birthday must be in the past')
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
	
		// If the field being changed is 'birthday'
		if (name === 'birthday') {
			// Validate the date string before converting it to a Date object
			const dateParts = value.split('-'); // assuming input format is YYYY-MM-DD
			if (dateParts.length === 3 && dateParts.every(part => !isNaN(part))) {
				setFormData({
					...formData,
					[name]: value // Directly use the value
				});
			} else {
				alert("invalid date");
			}
		} else {
			setFormData({
				...formData,
				[name]: value
			});
		}
	};
	

	const handleUpdate = async e => {
		e.preventDefault();
		try{
			await validationSchema.validate(formData, { abortEarly: false });
			if (id) {
				setFormData(prevState => ({ ...prevState, id }));
				updateEmployeeMutation.mutate({ ...formData, id });
			}
			setErrors({});
		}catch(e){
			setErrors(
				e.inner.reduce((acc, curr) => {
					acc[curr.path] = curr.message;
					return acc;
				}, {})
			);
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
				<form className='create-form'>
					<div className="form_group">
						<label className="sub_title" htmlFor="first_name">
							First Name:
						</label>
						<input
							className="form_style"
							type='text'
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
							type='text'
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
							type='date'
							value={formData.birthday}
							onChange={handleChange}
						/>
					</div>
					<div className="form_group">
						<label className="sub_title" htmlFor="birthday">
							Age:
						</label>
						<input className="form_style" name="age" readOnly value={formData.age} onChange={handleChange} />
					</div>
					{errors.first_name && <p className="sub_title">{errors.first_name}</p>}
					{errors.last_name && <p className="sub_title">{errors.last_name}</p>}
					{errors.birthday && <p className="sub_title">{errors.birthday}</p>}
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
