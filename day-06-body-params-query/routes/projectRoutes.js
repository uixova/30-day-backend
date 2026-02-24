const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

const checkNewProject = (req, res, next) => {
    const { id, message } = req.body;
    if (!id || !message) {
        return res.status(400).json({ success: false, message: "Missing data!" });
    }
    next();
};

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getSingleProject);
router.post('/add', checkNewProject, projectController.addProject); 
router.delete('/delete/:id', projectController.deleteProject); 
router.put('/update/:id', projectController.updateProject); 

module.exports = router;