const express = require("express");
const router = express.Router();

const taskController = require('../controllers/taskController');
const { isValidId } = require('../middlewares/validation');

router.get('/', taskController.getAllTasks);
router.get('/:id', isValidId, taskController.getTaskById);
router.post('/', taskController.createTask);
router.delete('/:id', isValidId, taskController.deleteTask);
router.put('/:id', isValidId, taskController.updateTask);

module.exports = router;