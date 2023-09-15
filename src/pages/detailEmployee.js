import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { Typography, Button, Input, Form, DatePicker } from 'antd';
const { Title } = Typography;

export default function DetailEmployee() {
	const router = useRouter();
	const { id } = router.query;
	const [errors, setErrors] = useState({});
	const [update, setUpdate] = useState(false);

	const [formData, setFormData] = useState({
		id,
		first_name: '',
		last_name: '',
		birthday: '',
		age: ''
	});

	const validationSchema = Yup.object().shape({
		first_name: Yup.string()
			.required('First name is required')
			.min(2, 'First name must be at least 2 characters')
			.matches(/^[A-Za-z]+$/, 'Only letters allowed'), // Regex to match only letters

		last_name: Yup.string()
			.required('Last name is required')
			.min(2, 'Last name must be at least 2 characters')
			.matches(/^[A-Za-z]+$/, 'Only letters allowed'), // Regex to match only letters

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
		if (!res.ok) {
			throw new Error('Could not update employee');
		}
		setUpdate(true);
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
				alert('invalid date');
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
		try {
			await validationSchema.validate(formData, { abortEarly: false });
			if (id) {
				setFormData(prevState => ({ ...prevState, id }));
				updateEmployeeMutation.mutate({ ...formData, id });
			}
			setErrors({});
		} catch (e) {
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
		<>
			<Head>
				<title>Employee Details</title>
			</Head>
			<div className="flex flex-col items-center justify-center text-center h-full">
				<Title className="title">Detail Employee with id: {id}</Title>
				{update && <h2 className="text-green-500 font-semibold">Employee updated successfully</h2>}
				<div className="flex flex-col items-center justify-center text-center border-3 rounded-lg p-0 mt-3">
					<Form
						layout="horizontal"
						className="flex flex-col items-stretch justify-center bg-white rounded-lg w-full p-5">
						<Form.Item
							label="First Name"
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}
							className="m-0 mt-4">
							<Input
								className="focus:outline-none border-2 border-black shadow-md rounded-md focus:shadow-sm focus:translate-y-1 text-black "
								value={formData.first_name}
								onChange={handleChange}
								name="first_name"
							/>
							{errors.first_name && (
								<div className="flex justify-center">
									<p className="sub_title text-red-500">{errors.first_name}</p>
								</div>
							)}
						</Form.Item>

						<Form.Item
							label="Last Name"
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}
							className="m-0 mt-4">
							<Input
								className="focus:outline-none border-2 border-black shadow-md rounded-md focus:shadow-sm focus:translate-y-1 text-black"
								value={formData.last_name}
								onChange={handleChange}
								name="last_name"
							/>
							{errors.last_name && (
								<div className="flex justify-center">
									<p className="sub_title text-red-500">{errors.last_name}</p>
								</div>
							)}
						</Form.Item>

						<Form.Item
							label="Birthday"
							labelCol={{ span: 8 }}
							wrapperCol={{ span: 16 }}
							className="m-0 mt-4">
							<div className="focus:outline-none border-2 border-black shadow-md rounded-md focus:shadow-sm focus:translate-y-1 text-black">
								<DatePicker
									bordered={false}
									value={formData.birthday ? dayjs(formData.birthday, 'YYYY-MM-DD') : null}
									onChange={(date, dateString) => {
										setFormData({ ...formData, birthday: dateString });
									}}
								/>
							</div>
							{errors.birthday && (
								<div className="flex justify-center">
									<p className="sub_title text-red-500">{errors.birthday}</p>
								</div>
							)}
						</Form.Item>
						{/*
					<Form.Item label="Birthday" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="m-0 mt-4">
						<Input
							type="date"
							className="focus:outline-none border-2 border-black shadow-md rounded-md focus:shadow-sm focus:translate-y-1 text-black"
							value={formData.birthday}
							onChange={handleChange}
							name="birthday"
						/>
						{errors.birthday && (
							<div className="flex justify-center">
								<p className="sub_title text-red-500">{errors.birthday}</p>
							</div>
						)}
					</Form.Item>
						*/}
						<Form.Item label="Age" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="m-0 mt-4">
							<Input
								type="text"
								className="focus:outline-none border-2 border-black shadow-md rounded-md focus:shadow-sm focus:translate-y-1 text-black"
								value={formData.age}
								readOnly
							/>
						</Form.Item>
						<div className="flex justify-center">
							<Form.Item wrapperCol={{ span: 24 }} className="flex justify-center m-0 mt-4 mr-1">
								<Button type="default" htmlType="submit" onClick={handleUpdate}>
									Update
								</Button>
							</Form.Item>
							<Form.Item wrapperCol={{ span: 24 }} className="flex justify-center m-0 mt-4 ml-1">
								<Button
									type="primary"
									htmlType="submit"
									className="text-white bg-blue-400 hover:bg-blue-500"
									onClick={handleBackHome}>
									Go Back
								</Button>
							</Form.Item>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
}
