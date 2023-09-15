import { useState, useEffect } from 'react';
import { calculateAge } from '../utils';
import { Button, Form, Input, DatePicker } from 'antd';
import * as Yup from 'yup';

export default function CreateForm({ onSubmit }) {
	const [newEmployee, setNewEmployee] = useState({
		first_name: '',
		last_name: '',
		birthday: ''
	});
	const [calculatedAge, setCalculatedAge] = useState(null);
	const [errors, setErrors] = useState({});

	// Validation Schema
	const validationSchema = Yup.object().shape({
		first_name: Yup.string()
			.required('First name is required')
			.min(2, 'First name must be at least 2 characters')
			.matches(/^[A-Za-z]+$/, 'Only letters allowed for first name'), // Regex to match only letters

		last_name: Yup.string()
			.required('Last name is required')
			.min(2, 'Last name must be at least 2 characters')
			.matches(/^[A-Za-z]+$/, 'Only letters allowed for last name'), // Regex to match only letters

		birthday: Yup.date().required('Birthday is required').max(new Date(), 'Birthday must be in the past')
	});

	// Call calculateAge function whenever the birthday field changes
	useEffect(() => {
		if (newEmployee.birthday) {
			setCalculatedAge(calculateAge(newEmployee.birthday));
		}
	}, [newEmployee.birthday]);

	const handleSubmit = async () => {
		try {
			await validationSchema.validate(newEmployee, { abortEarly: false });
			onSubmit(newEmployee);
			setNewEmployee({
				first_name: '',
				last_name: '',
				birthday: ''
			});
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

	return (
		<div className="flex flex-col items-center justify-center text-center border-3 rounded-lg p-0 mt-3">
			<Form
				layout="horizontal"
				className="flex flex-col items-stretch justify-center bg-white rounded-lg w-full p-5">
				<Form.Item label="First Name" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="m-0 mt-4">
					<Input
						className="focus:outline-none border-2 border-black shadow-md rounded-md focus:shadow-sm focus:translate-y-1 text-black"
						value={newEmployee.first_name}
						onChange={e => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
					/>
					{errors.first_name && (
						<div className="flex justify-center">
							<p className="sub_title text-red-500">{errors.first_name}</p>
						</div>
					)}
				</Form.Item>

				<Form.Item label="Last Name" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="m-0 mt-4">
					<Input
						className="focus:outline-none border-2 border-black shadow-md rounded-md focus:shadow-sm focus:translate-y-1 text-black"
						value={newEmployee.last_name}
						onChange={e => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
					/>
					{errors.last_name && (
						<div className="flex justify-center">
							<p className="sub_title text-red-500">{errors.last_name}</p>
						</div>
					)}
				</Form.Item>

				<Form.Item label="Birthday" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className="m-0 mt-4">
					<div className="focus:outline-none border-2 border-black shadow-md rounded-md focus:shadow-sm focus:translate-y-1 text-black">
						<DatePicker
							bordered={false}
							onChange={(date, dateString) => setNewEmployee({ ...newEmployee, birthday: dateString })}
						/>
					</div>
					{errors.birthday && (
						<div className="flex justify-center">
							<p className="sub_title text-red-500">{errors.birthday}</p>
						</div>
					)}
				</Form.Item>

				{calculatedAge !== null && (
					<div className="flex justify-center">
						<p className="font-bold text-purple-900 mt-4">{`Your age is: ${calculatedAge}`}</p>
					</div>
				)}

				<Form.Item wrapperCol={{ span: 24 }} className="flex justify-center m-0 mt-4">
					<Button
						type="primary"
						htmlType="submit"
						className="text-white bg-blue-400 hover:bg-blue-500"
						onClick={handleSubmit}>
						Create
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
