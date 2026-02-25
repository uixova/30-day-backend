const express = require("express");
const router = express.Router();

const taskController = require('../controller/taskController');
const { validateTask, validateId } = require('../middlewares/validation');

router.get('/', taskController.getAllTask);
router.get('/:id', validateId, taskController.getSingleTask);
router.post('/add', validateTask, taskController.addTask);
router.delete('/delete/:id', validateId, taskController.deleteTask);
router.put('/update/:id', validateId, validateTask, taskController.updateTask);

module.exports = router;