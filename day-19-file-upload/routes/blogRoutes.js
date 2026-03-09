const express = require("express");
const router = express.Router();

const { 
    getAllBlogs, 
    getBlogById, 
    createBlog,
    deleteBlog,    
    updateBlog,    
    blogPhotoUpload 
} = require('../controllers/blogController');

const { isValidId } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');

router.get('/', getAllBlogs);
router.get('/:id', isValidId, getBlogById);
router.post('/', protect, createBlog);
router.delete('/:id', isValidId, protect, deleteBlog);
router.put('/:id', isValidId, protect, updateBlog);
router.put('/:id/photo', isValidId, protect, blogPhotoUpload);

module.exports = router;