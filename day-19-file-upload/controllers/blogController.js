const Blog = require('../models/Blog');
const path = require('path');
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
    req.body.user = req.user.id;
    const blog = await Blog.create(req.body);

    res.status(201).json({
        success: true,
        data: blog
    });
});

exports.blogPhotoUpload = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found!' });
    }

    if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ success: false, message: 'You are not authorized to do so' });
    }

    if (!req.files) {
        return res.status(400).json({ success: false, message: 'Please select a file' });
    }

    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return res.status(400).json({ success: false, message: 'Please just upload image file' });
    }

    if (file.size > 3000000) {
        return res.status(400).json({ success: false, message: 'Please upload an image less than 3MB' });
    }

    file.name = `photo_${blog._id}${path.parse(file.name).ext}`;

    file.mv(`./public/uploads/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error moving file' });
        }

        await Blog.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
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
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).json({ success: false, message: "No blog found to delete!" });
    }

    if (blog.user.toString() !== req.user.id && req.user.role !== 'Admin') {
        return res.status(401).json({ 
            success: false, 
            message: `User (${req.user.id}) is not authorized to delete this content.` 
        });
    }

    await blog.deleteOne();

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