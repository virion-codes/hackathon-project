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
  ImageBackground,
} from 'react-native';
import colors from '../theme/colors';

const BG_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200';

export default function LoginScreen({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.wrapper}>
      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bgImage} resizeMode="cover">
          <View style={styles.overlay} pointerEvents="none" />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={styles.formCard}>
              <Text style={styles.title}>CommonRoom</Text>
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
          </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 41, 66, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  formCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.sidebar,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  forgot: {
    marginTop: 10,
    alignSelf: 'center',
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
