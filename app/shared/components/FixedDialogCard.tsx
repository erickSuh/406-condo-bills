import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

interface FixedDialogCardProps {
  code: string;
  title: string;
  onDelete: () => void;
  codeColor?: string;
}

export const FixedDialogCard: React.FC<FixedDialogCardProps> = ({
  code,
  title,
  onDelete,
  codeColor = colors.red,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.code, { color: codeColor }]}>
          {code?.length ? `${code} - ${title}` : title}
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons
          name="trash-outline"
          size={20}
          color={colors.icon_light_gray}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.font_inverse,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  code: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: fonts.heading,
  },
  title: {
    fontSize: 14,
    color: colors.font_primary,
    fontFamily: fonts.primary,
  },
  deleteButton: {
    padding: 8,
  },
});
