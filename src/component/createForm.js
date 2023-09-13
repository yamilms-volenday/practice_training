import { useState } from 'react';

export default function CreateForm({ onSubmit }) {
	const [newEmployee, setNewEmployee] = useState({
		first_name: '',
		last_name: '',
		birthday: ''
	});

	const handleSubmit = () => {
		onSubmit(newEmployee);
		setNewEmployee({
			first_name: '',
			last_name: '',
			birthday: ''
		});
	};

	return (
		<div className="container-form">
			<div className='form-area'>
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
