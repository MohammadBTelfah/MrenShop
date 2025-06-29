const categorises = require('../models/categories');
const path = require('path');
exports.getAllCategories = async (req, res) => {
  try {
    const categoriesList = await categorises.find();
    res.json(categoriesList);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getCategoryById = async (req, res) => {
  try {
    const category = await categorises.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newCategory = new categorises({
      name,
      description
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedCategory = await categorises.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await categorises.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllCategoriesbyName = async (req, res) => {
  try {
    const { name } = req.query;
    const categoriesList = await categorises.find({ name: new RegExp(name, 'i') });
    res.json(categoriesList);
  } catch (error) {
    console.error("Error fetching categories by name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}