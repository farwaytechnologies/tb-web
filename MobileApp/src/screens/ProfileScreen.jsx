import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import { getRewards } from '../api/misc';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors, font, spacing, radius } from '../theme';
import { BASE_URL } from '../api/client';

const MENU_ITEMS = [
  { label: 'My Learning', icon: 'book-outline', screen: 'MyLearning' },
  { label: 'Certificates', icon: 'ribbon-outline', screen: 'Certificates' },
  { label: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
  { label: 'Jobs', icon: 'briefcase-outline', screen: 'Jobs' },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [saving, setSaving] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(user._id, form);
      await refreshUser(res.data.user || res.data);
      setEditing(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const avatarUri = user?.profilePic
    ? (user.profilePic.startsWith('http') ? user.profilePic : `${BASE_URL}/${user.profilePic}`)
    : null;

  const roleColor = { student: colors.primary, tutor: colors.success, admin: colors.danger, sales_executive: colors.warning };

  return (
    <ScrollView style={styles.container}>
      {/* Avatar + name */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          {avatarUri
            ? <Image source={{ uri: avatarUri }} style={styles.avatar} />
            : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{user?.name?.[0]?.toUpperCase() || '?'}</Text>
              </View>
            )
          }
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: (roleColor[user?.role] || colors.primary) + '22' }]}>
          <Text style={[styles.roleText, { color: roleColor[user?.role] || colors.primary }]}>
            {user?.role?.replace('_', ' ')}
          </Text>
        </View>
      </View>

      {/* Edit profile */}
      {editing ? (
        <View style={styles.editCard}>
          <Input label="Name" value={form.name} onChangeText={set('name')} placeholder="Full name" />
          <Input label="Phone" value={form.phone} onChangeText={set('phone')} placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
          <Input label="Bio" value={form.bio} onChangeText={set('bio')} placeholder="Tell us about yourself" multiline />
          <View style={styles.editBtns}>
            <Button title="Cancel" variant="outline" onPress={() => setEditing(false)} style={{ flex: 1 }} />
            <Button title="Save" onPress={handleSave} loading={saving} style={{ flex: 1 }} />
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
          <Ionicons name="pencil-outline" size={16} color={colors.primary} />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      {/* Menu */}
      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'center', paddingTop: 48, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg },
  avatarWrap: { marginBottom: spacing.md },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.primary + '33', alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { color: colors.primary, fontSize: 36, fontWeight: '700' },
  name: { color: colors.text, fontSize: font.xl, fontWeight: '700' },
  email: { color: colors.textMuted, fontSize: font.md, marginTop: 2 },
  roleBadge: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.full },
  roleText: { fontSize: font.sm, fontWeight: '600', textTransform: 'capitalize' },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginHorizontal: spacing.lg, marginBottom: spacing.lg,
    backgroundColor: colors.card, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.primary + '55', paddingVertical: 10,
  },
  editBtnText: { color: colors.primary, fontWeight: '600', fontSize: font.base },
  editCard: {
    marginHorizontal: spacing.lg, marginBottom: spacing.lg,
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md,
  },
  editBtns: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  menu: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md, marginBottom: 8,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.primary + '22', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  menuLabel: { flex: 1, color: colors.text, fontSize: font.base },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: spacing.lg, marginBottom: 48,
    backgroundColor: colors.danger + '15', borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.danger + '44', paddingVertical: 12,
  },
  logoutText: { color: colors.danger, fontWeight: '600', fontSize: font.base },
});
