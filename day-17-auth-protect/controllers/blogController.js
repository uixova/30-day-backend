const Blog = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllBlogs = asyncHandler(async(req, res, next) => {
    let query;
    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    let searchObj = JSON.parse(queryStr);
    if (req.query.search) {
        searchObj.title = { $regex: req.query.search, $options: 'i' }; 
    }

    query = Blog.find(searchObj);

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); 
    }

    const blogs = await query;
    res.status(200).json({
        success: true,
        count: blogs.length,
        data: blogs
    });
});

exports.createBlog = asyncHandler(async(req, res, next) => { 
    const newBlog = await Blog.create(req.body);
    res.status(201).json({
        success: true,
        data: newBlog
    });
});

exports.getBlogById = asyncHandler(async(req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found!" });
    }

    res.status(200).json({ success: true, data: blog });
});

exports.deleteBlog = asyncHandler(async(req, res, next) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
        return res.status(404).json({ success: false, message: "No blog found to delete!" });
    }

    res.status(200).json({ success: true, message: "Blog successfully deleted!" });
});

exports.updateBlog = asyncHandler(async(req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!blog) {
        return res.status(404).json({ success: false, message: "No blog found to update!" });
    }

    res.status(200).json({
        success: true,
        message: "Blog updated successfully!",
        data: blog 
    });
});