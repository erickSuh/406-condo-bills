import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { SvgIcon } from './SvgIcon';

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
        <SvgIcon name="trash" size={20} color={colors.icon_light_gray} />
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
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontFamily: fonts.primary,
    height: 56,
  },
  content: {
    flex: 1,
  },
  code: {
    fontSize: fonts.sizes.base,
    marginBottom: 4,
    fontFamily: fonts.listItemTitle,
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
