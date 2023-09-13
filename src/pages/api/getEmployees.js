import pool from '@/app/database';

//GET ALL EMPLOYEES
export default async function getEmployees(req, res) {
	try {
		const [rows] = await pool.query('SELECT * FROM employees');
		res.status(200).json(rows);
	} catch (err) {
		console.error('MySQL error:', err);
		res.status(500).send('Database error');
		return;
	}
}
