const express = require("express");
const router = express.Router();

const blogController = require('../controllers/blogController');
const { isValidId } = require('../middlewares/validation');

const { protect } = require('../middlewares/auth');

router.get('/', blogController.getAllBlogs);
router.get('/:id', isValidId, blogController.getBlogById);
router.post('/', protect, blogController.createBlog);
router.delete('/:id', isValidId, protect, blogController.deleteBlog);
router.put('/:id', isValidId, blogController.updateBlog);

module.exports = router;