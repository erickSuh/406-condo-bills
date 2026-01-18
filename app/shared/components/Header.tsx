import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { minActions } from '@/styles/sizes';

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
          <Ionicons name={icon as any} size={22} color={colors.font_inverse} />
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
    minHeight: minActions.action.minHeight,
    minWidth: minActions.action.minWidth,
  },
  title: {
    fontSize: fonts.sizes.header,
    color: colors.font_inverse,
    fontFamily: fonts.heading,
    lineHeight: fonts.lineHeights.header,
    textAlignVertical: 'bottom',
  },
  button: {
    width: 21,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
