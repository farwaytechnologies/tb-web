const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const StudentReward = require('../models/StudentReward');
const TutorReward = require('../models/TutorReward');
const { logFailedLogin } = require('../middleware/security');

function generateReferralCode() {
  return 'TB-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, referralCode } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Generate unique referral code
    let code;
    let attempts = 0;
    do {
      code = generateReferralCode();
      attempts++;
    } while (await User.findOne({ referralCode: code }) && attempts < 10);

    // Resolve referrer
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name, email, password: hashedPassword, role,
      referralCode: code,
      referredBy: referrer?._id || null,
    });
    await newUser.save();

    // Award referrer points
    if (referrer) {
      if (referrer.role === 'student') {
        let reward = await StudentReward.findOne({ userId: referrer._id });
        if (!reward) reward = new StudentReward({ userId: referrer._id, points: 0, history: [] });
        reward.points += 25;
        reward.history.push({ points: 25, reason: `Referral: ${name} joined` });
        await reward.save();
      } else if (referrer.role === 'tutor') {
        let reward = await TutorReward.findOne({ tutorId: referrer._id });
        if (!reward) reward = new TutorReward({ tutorId: referrer._id, points: 0, bonusPoints: 0 });
        reward.bonusPoints += 25;
        reward.bonusHistory.push({ bonus: 25, reason: `Referral: ${name} joined` });
        await reward.save();
      }
    }

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
    if (!user) {
      await logFailedLogin(req, email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logFailedLogin(req, email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.isBanned) {
      return res.status(403).json({
        message: 'Your account has been banned.',
        banReason: user.banReason || 'No reason provided.',
        banned: true,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        gender: user.gender,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        profilePic: user.profilePic || '',
        phone: user.phone || '',
        bio: user.bio || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        language: user.language,
        emailNotifications: user.emailNotifications,
        showProfile: user.showProfile,
        referralCode: user.referralCode || '',
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL USERS (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// UPDATE PROFILE
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, title, gender, firstName, middleName, lastName,
      profilePic, phone, bio, website, linkedin, twitter
    } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { name, title, gender, firstName, middleName, lastName, profilePic, phone, bio, website, linkedin, twitter } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updated._id,
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        title: updated.title,
        gender: updated.gender,
        firstName: updated.firstName,
        middleName: updated.middleName,
        lastName: updated.lastName,
        profilePic: updated.profilePic || '',
        phone: updated.phone || '',
        bio: updated.bio || '',
        website: updated.website || '',
        linkedin: updated.linkedin || '',
        twitter: updated.twitter || '',
        language: updated.language,
        emailNotifications: updated.emailNotifications,
        showProfile: updated.showProfile,
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


// UPDATE SETTINGS (notifications, privacy, language)
exports.updateSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { language, emailNotifications, showProfile } = req.body;
    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { language, emailNotifications, showProfile } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    const u = updated;
    res.json({
      message: 'Settings updated',
      user: {
        id: u._id, _id: u._id, name: u.name, email: u.email, role: u.role,
        title: u.title, gender: u.gender, firstName: u.firstName,
        middleName: u.middleName, lastName: u.lastName, profilePic: u.profilePic || '',
        phone: u.phone || '', bio: u.bio || '', website: u.website || '',
        linkedin: u.linkedin || '', twitter: u.twitter || '',
        language: u.language, emailNotifications: u.emailNotifications, showProfile: u.showProfile,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Settings update failed' });
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

// UPDATE BANK DETAILS
exports.updateBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountHolderName, accountNumber, ifscCode, bankName, branchName, upiId, accountType } = req.body;
    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { bankDetails: { accountHolderName, accountNumber, ifscCode, bankName, branchName, upiId, accountType } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Bank details saved', bankDetails: updated.bankDetails });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save bank details' });
  }
};

// GET BANK DETAILS
exports.getBankDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('bankDetails');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.bankDetails || {});
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bank details' });
  }
};

// BAN USER
exports.banUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isBanned: true, banReason: reason || 'Banned by admin', bannedAt: new Date() } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User banned', isBanned: true, banReason: user.banReason });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UNBAN USER
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isBanned: false, banReason: '', bannedAt: null } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unbanned', isBanned: false });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// FORGOT PASSWORD — sends reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Always respond OK to prevent email enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const nodemailer = require('nodemailer');
    const port = Number(process.env.EMAIL_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'TechBorg <support@techborg.in>',
      to: user.email,
      subject: 'Reset your TechBorg password',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#0a0a0f;color:#e2e8f0;border-radius:16px;overflow:hidden;border:1px solid #2a2a3e;">
          <div style="background:linear-gradient(135deg,#12121a,#1a1a2e);padding:32px 36px;border-bottom:1px solid #2a2a3e;">
            <div style="font-size:22px;font-weight:800;color:#f0f0f0;">⚡ TechBorg</div>
          </div>
          <div style="padding:36px;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#f0f0f0;">Reset your password</h2>
            <p style="color:#888;font-size:14px;line-height:1.6;margin:0 0 28px;">
              Hi ${user.name}, we received a request to reset your password. Click the button below — this link expires in 1 hour.
            </p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
              Reset Password
            </a>
            <p style="color:#555;font-size:12px;margin:24px 0 0;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Failed to send reset email.' });
  }
};

// RESET PASSWORD — validates token and sets new password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired.' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
