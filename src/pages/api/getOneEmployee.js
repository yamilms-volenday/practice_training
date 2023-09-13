import pool from "@/app/database";

export default async function getOneEmployee(req, res) {
	try {
		const { id } = req.body;

		const [employee] = await pool.query(
			'SELECT * FROM employees WHERE id = ?',
			[id]
		);

		if (employee.affectedRows === 0) {
			res.status(404).json({ employee: 'Employee not found' });
			return;
		}

		res.json(employee[0]);
	} catch (error) {
		console.error(error.message);  // Log error
		res.status(500).json({ message: 'Internal Server Error' });  // Step 3
	}
}
