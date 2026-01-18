import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

interface HeaderProps {
  title: string;
  icon?: string;
  callToAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  icon = 'add',
  callToAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {callToAction && (
        <TouchableOpacity style={styles.button} onPress={callToAction}>
          <Ionicons name={icon as any} size={28} color={colors.font_inverse} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.font_inverse,
    fontFamily: fonts.heading,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
