import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  onValueChange: (value: string | number) => void;
  style?: any;
  editable?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  placeholder = 'Select an option',
  options,
  value,
  onValueChange,
  style,
  editable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => editable && setIsOpen(!isOpen)}
        disabled={!editable}
        style={[
          styles.selectButton,
          !editable && styles.disabled,
          isOpen && styles.focused,
        ]}
      >
        <Text
          style={[styles.selectText, !selectedOption && styles.placeholder]}
        >
          {displayText}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.background_primary}
          style={styles.icon}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                value === option.value && styles.selectedOption,
              ]}
              onPress={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  value === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  selectButton: {
    backgroundColor: colors.font_inverse,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.icon_light_gray,
  },
  focused: {
    borderColor: colors.background_primary,
  },
  disabled: {
    opacity: 0.5,
  },
  selectText: {
    fontSize: 16,
    fontFamily: fonts.primary,
    color: colors.font_primary,
    flex: 1,
  },
  placeholder: {
    color: colors.font_caption,
  },
  icon: {
    marginLeft: SPACING.sm,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.font_inverse,
    borderRadius: 8,
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: colors.icon_light_gray,
    zIndex: 1000,
    maxHeight: 250,
  },
  option: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.icon_light_gray,
  },
  selectedOption: {
    backgroundColor: colors.background_secondary,
  },
  optionText: {
    fontSize: 16,
    fontFamily: fonts.primary,
    color: colors.font_primary,
  },
  selectedOptionText: {
    fontFamily: fonts.heading,
    color: colors.background_primary,
  },
});
