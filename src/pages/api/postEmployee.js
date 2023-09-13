import pool from '@/app/database';
export default async function postEmployee(req, res) {
	const calculateAge = birthday => {
		const today = new Date();
		const birthDate = new Date(birthday);

		let age = today.getFullYear() - birthDate.getFullYear();

		const m = today.getMonth() - birthDate.getMonth();

		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}

		return age;
	};

	try {
		const { first_name, last_name, birthday } = req.body;

		const age = calculateAge(birthday);

		const [rows] = await pool.query(
			'INSERT INTO employees (first_name, last_name, birthday, age) VALUES (?, ?, ?, ?)',
			[first_name, last_name, birthday, age]
		);
		res.status(200).json(rows);
	} catch (err) {
		console.error('MySQL error:', err);
		res.status(500).send('Database error');
		return;
	}
}
