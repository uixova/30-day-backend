const Blog = require('../models/Blog');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllBlogs = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
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
    const blog = await Blog.findById(req.params.id).populate({
        path: 'user',
        select: 'name email'
    });

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

    res.status(200).json({ success: true, message: "Blog successfully deleted!", data: blog });
});

exports.updateBlog = asyncHandler(async(req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!blog) {
        return res.status(404).json({ success: false, message: "No blog found to update!" });
    }

    if (blog.user.toString() !== req.user.id && req.user.role !== 'Admin') {
        return res.status(401).json({ 
            success: false, 
            message: `User (${req.user.id}) is not authorized to update this content.` 
        });
    }

    res.status(200).json({
        success: true,
        message: "Blog updated successfully!",
        data: blog 
    });
});