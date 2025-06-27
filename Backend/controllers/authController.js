const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        gender: user.gender,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        profilePic: user.profilePic || '',
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE PROFILE
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, title, gender, firstName, middleName, lastName, profilePic
    } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { name, title, gender, firstName, middleName, lastName, profilePic },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'User updated successfully',
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        title: updated.title,
        gender: updated.gender,
        firstName: updated.firstName,
        middleName: updated.middleName,
        lastName: updated.lastName,
        profilePic: updated.profilePic || '',
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Incorrect current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// SAVE PREFERENCES
exports.savePreferences = async (req, res) => {
  try {
    const { language, theme } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { language, theme },
      { new: true }
    );
    res.json({ message: 'Preferences saved', user });
  } catch (err) {
    res.status(500).json({ message: 'Error saving preferences' });
  }
};

// SAVE PRIVACY SETTINGS
exports.savePrivacy = async (req, res) => {
  try {
    const { showProfile, emailNotifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { showProfile, emailNotifications },
      { new: true }
    );
    res.json({ message: 'Privacy settings saved', user });
  } catch (err) {
    res.status(500).json({ message: 'Error saving privacy settings' });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting account' });
  }
};
