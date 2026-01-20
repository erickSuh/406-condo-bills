import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
} from 'react-native';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import spaces from '@/styles/spaces';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  color?: string;
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  color,
  style,
  ...rest
}) => {
  const buttonColor =
    color || (variant === 'primary' ? colors.red : colors.red);
  const dynamicStyle = styles(variant, buttonColor);

  return (
    <TouchableOpacity
      style={[dynamicStyle.container, style]}
      activeOpacity={0.7}
      {...rest}
    >
      <Text style={dynamicStyle.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = (variant: ButtonVariant, color: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: variant === 'primary' ? color : colors.font_inverse,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      height: 48,
      paddingHorizontal: spaces.base,
      borderWidth: variant === 'secondary' ? 2 : 0,
      borderColor: variant === 'secondary' ? colors.font_label : 'transparent',
    },
    text: {
      fontSize: fonts.sizes.base,
      color:
        variant === 'primary'
          ? colors.font_inverse
          : variant === 'tertiary'
            ? colors.red
            : colors.font_label,
      fontFamily: fonts.primary,
    },
  });
