import pool from '@/app/database';
import { calculateAge } from '@/utils';

export default async function updateEmployee(req, res) {
	if (req.method !== 'PUT') {
		res.status(405).end(); // Method Not Allowed
		return;
	}

	try {
		const { id, first_name, last_name, birthday, age } = req.body;

		const newAge = calculateAge(birthday);
		const [rows] = await pool.query(
			'UPDATE employees SET first_name = ?, last_name = ?, birthday = ?, age= ? WHERE id = ?',
			[first_name, last_name, birthday, newAge, id]
		);

		res.status(200).json(rows);
	} catch (err) {
		console.error('MySQL error:', err);
		res.status(500).send('Database error');
		return;
	}
}
