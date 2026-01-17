import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  StyleSheetProperties,
} from 'react-native';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

type ButtonType = 'button' | 'pill';
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  color?: string;
  type?: ButtonType;
  textStyle?: StyleSheetProperties;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  type = 'button',
  color,
  style,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[styles(type, color ? color : colors.blue).container, style]}
      activeOpacity={0.7}
      {...rest}
    >
      <Text style={styles(type, color ? color : colors.blue).text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = (type: ButtonType, color: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: type === 'button' ? color : colors.font_inverse,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      height: type === 'button' ? 56 : 30,
      paddingHorizontal: type === 'button' ? 20 : 10,
      ...(type !== 'button' && { borderColor: color }),
      borderWidth: type === 'button' ? 0 : 2,
    },
    text: {
      fontSize: 16,
      color: type === 'button' ? colors.font_inverse : color,
      fontFamily: fonts.heading,
    },
  });
