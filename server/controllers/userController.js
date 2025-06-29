const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, address, phone } = req.body;
    const profileImage = req.file ? req.file.path : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPass,
      profileImage,
      fullName,
      address,
      phone
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user).select('-password');
  res.json(user);
};
//  create controller to change the user pass  the user must send the old pass and the new pass
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user);
    console.log(user)
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Old password is incorrect' });
    const hashedNewPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPass;
    await user.save();
    res.json({ msg: 'Password changed successfully' });
    
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
    
  }
}
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
}
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, fullName, address, phone, role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.username = username || user.username;
    user.email = email || user.email;
    user.fullName = fullName || user.fullName;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    if (req.file) {
      user.profileImage = req.file.path;
    }
    await user.save();
    res.json({ msg: 'User updated successfully', user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.userId);
    if (!deleteUser) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted successfully' });
    
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ msg: 'Server error', error: error.message });
    
  }
};