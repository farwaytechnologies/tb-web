const Blog = require('../models/Blog');

// CREATE Blog
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      author,
      image,
      images,
      category,
      tags,
      detailedSections,
    } = req.body;

    const newBlog = new Blog({
      title,
      description,
      content,
      author,
      image,
      images,
      category,
      tags,
      detailedSections,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Error creating blog' });
  }
};

// GET All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

// GET Blog By ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog' });
  }
};

// UPDATE Blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ message: 'Error updating blog' });
  }
};

// DELETE Blog
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog' });
  }
};
