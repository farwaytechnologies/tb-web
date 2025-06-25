const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = []; // Temporary in-memory store

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    role,
    // Optional additional fields for profile editing
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
  };

  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
};

// Log in existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      gender: user.gender,
    },
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const {
    name, title, gender, firstName, middleName, lastName, profilePic
  } = req.body;

  const userIndex = users.findIndex(u => u.id == id);
  if (userIndex === -1)
    return res.status(404).json({ message: 'User not found' });

  users[userIndex] = {
    ...users[userIndex],
    name,
    title,
    gender,
    firstName,
    middleName,
    lastName,
    profilePic: profilePic || users[userIndex].profilePic,
  };

  return res.json({
    message: 'User profile updated successfully',
    user: {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      role: users[userIndex].role,
      title: users[userIndex].title,
      gender: users[userIndex].gender,
      firstName: users[userIndex].firstName,
      middleName: users[userIndex].middleName,
      lastName: users[userIndex].lastName,
      profilePic: users[userIndex].profilePic || '',
    },
  });
};
