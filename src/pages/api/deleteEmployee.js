import pool from "@/app/database";

export default async function deleteEmployee(req, res) {
	try {
		const { id } = req.body;

		const [deletedEmployee] = await pool.query(
			'DELETE FROM employees WHERE id = ?',
			[id]
		);

		if (deletedEmployee.affectedRows === 0) {
			res.status(404).json({ message: 'Employee not found' });
			return;
		}

		res.json({ message: 'Employee was deleted successfully!' });
	} catch (error) {
		console.error(error.message);  // Log error
		res.status(500).json({ message: 'Internal Server Error' });  // Step 3
	}
}
