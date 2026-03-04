const express = require("express");
const router = express.Router();

const blogController = require('../controllers/blogController');
const { isValidId } = require('../middlewares/validation');

router.get('/', blogController.getAllBlogs);
router.get('/:id', isValidId, blogController.getBlogById);
router.post('/', blogController.createBlog);
router.delete('/:id', isValidId, blogController.deleteBlog);
router.put('/:id', isValidId, blogController.updateBlog);

module.exports = router;