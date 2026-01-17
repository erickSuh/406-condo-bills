import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import colors from '../../styles/colors';

export const Input = ({
  onChange,
  placeholder,
  onFocus,
  onBlur,
  ref,
  ...rest
}: TextInputProps & { ref?: React.Ref<TextInput> }) => {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      style={focused ? [styles.input, styles.inputFocused] : styles.input}
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
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    textAlign: 'center',
    borderColor: colors.icon_light_gray,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
  },
  inputFocused: {
    borderColor: colors.blue,
  },
});
