import pool from '@/app/database';
import { calculateAge } from '@/utils'
export default async function postEmployee(req, res) {

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
