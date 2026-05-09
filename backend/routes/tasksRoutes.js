const router = require('express').Router();
const verifyToken = require('../middleWare/authMiddleWare');

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');


/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', verifyToken, createTask);


/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of all tasks
 */
router.get('/', verifyToken, getTasks);


/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put('/:id', verifyToken, updateTask);


/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete('/:id', verifyToken, deleteTask);

module.exports = router;