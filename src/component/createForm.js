import { useState, useEffect } from 'react';
import { calculateAge } from '../utils';
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
		first_name: Yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
		last_name: Yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
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
		<div className="container-form">
			<div className="form-area">
				<form>
					<div className="form_group">
						<label className="sub_title" htmlFor="first_name">
							First Name:
						</label>
						<input
							className="form_style"
							type="text"
							id="first_name"
							name="first_name"
							value={newEmployee.first_name}
							onChange={e => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
						/>
					</div>
					<div className="form_group">
						<label className="sub_title" htmlFor="last_name">
							Last Name:
						</label>
						<input
							className="form_style"
							type="text"
							id="last_name"
							name="last_name"
							value={newEmployee.last_name}
							onChange={e => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
						/>
					</div>
					<div className="form_group">
						<label className="sub_title" htmlFor="birthday">
							Birthday:
						</label>
						<input
							className="form_style"
							type="date"
							id="birthday"
							name="birthday"
							value={newEmployee.birthday}
							onChange={e => setNewEmployee({ ...newEmployee, birthday: e.target.value })}
						/>
					</div>
					{calculatedAge !== null && (
						<div className="form_group">
							<label className="sub_title" htmlFor="birthday">
								Age:
							</label>
							<input className="form_style" type="text" id="age" name="age" value={calculatedAge} />
						</div>
					)}
					<div>
						{errors.first_name && <p className="sub_title">{errors.first_name}</p>}
						{errors.last_name && <p className="sub_title">{errors.last_name}</p>}
						{errors.birthday && <p className="sub_title">{errors.birthday}</p>}
					</div>
					<div>
						<button className="employee-buttons btn" type="button" onClick={handleSubmit}>
							Create
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
