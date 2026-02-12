import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import colors from '../theme/colors';

export default function LoginScreen({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.bg}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.formCard}>
          <Text style={styles.title}>Study Spot</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.placeholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => onSignIn(email, password)}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgot}
            onPress={() => Alert.alert('Forgot password?', 'A reset link would be sent to your email. (Demo)')}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
          <View style={styles.logo} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: colors.sidebarLight,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.sidebar,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  forgot: {
    marginTop: 14,
    alignSelf: 'center',
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.text,
  },
});
