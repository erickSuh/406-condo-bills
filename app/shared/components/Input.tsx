import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../styles/colors';

export const Input = ({
  onChange,
  placeholder,
  onFocus,
  onBlur,
  ref,
  style,
  icon,
  ...rest
}: TextInputProps & { ref?: React.Ref<TextInput>; icon?: string }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused, style]}>
      {!focused && icon && (
        <Ionicons
          name={icon as any}
          size={20}
          color={colors.icon_light_gray}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.input]}
        onChange={onChange}
        ref={ref}
        onFocus={e => {
          if (onFocus) {
            onFocus(e);
          }
          setFocused(prev => !prev);
        }}
        onBlur={e => {
          if (onBlur) {
            onBlur(e);
          }
          setFocused(prev => !prev);
        }}
        placeholder={focused ? '' : placeholder}
        placeholderTextColor={colors.font_caption}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.font_inverse,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  containerFocused: {
    borderColor: colors.blue,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    textAlign: 'left',
    color: colors.font_primary,
    paddingVertical: 12,
    minWidth: 24,
    minHeight: 24,
    height: '100%',
  },
  inputFocused: {
    borderColor: colors.blue,
  },
});
