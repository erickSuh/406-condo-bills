import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import spaces from '@/styles/spaces';
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
    <>
      {Platform.OS === 'ios' ? (
        <View style={[styles.container, style]}>
          <TouchableOpacity
            onPress={() => editable && setIsOpen(true)}
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
              name="caret-down-outline"
              size={20}
              color={colors.icon_gray}
              style={styles.icon}
            />
          </TouchableOpacity>

          <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsOpen(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.overlay}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setIsOpen(false)}>
                    <Text style={styles.pickerDoneButton}>Done</Text>
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={value}
                  onValueChange={itemValue => {
                    onValueChange(itemValue);
                  }}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {options.map(option => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      ) : (
        <View style={[styles.container, style]}>
          <View style={styles.androidPickerWrapper}>
            <Picker
              enabled={editable}
              selectedValue={value}
              onValueChange={itemValue => {
                onValueChange(itemValue);
              }}
              style={styles.androidPicker}
              itemStyle={styles.androidPickerItem}
            >
              {options.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spaces.small,
  },
  selectButton: {
    backgroundColor: colors.font_inverse,
    borderRadius: 8,
    paddingHorizontal: spaces.base,
    paddingVertical: spaces.base,
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  focused: {
    borderColor: colors.background_primary,
  },
  disabled: {
    opacity: 0.5,
  },
  selectText: {
    fontFamily: fonts.primary,
    color: colors.font_primary,
    flex: 1,
  },
  placeholder: {
    color: colors.font_caption,
  },
  icon: {
    marginLeft: spaces.small,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: colors.font_inverse,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spaces.large,
    paddingVertical: spaces.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.icon_light_gray,
  },
  pickerDoneButton: {
    fontSize: 16,
    fontFamily: fonts.primary,
    color: colors.background_primary,
  },
  picker: {
    height: 200,
    backgroundColor: colors.font_inverse,
  },
  androidPicker: {
    backgroundColor: colors.font_inverse,
    color: colors.font_label,
  },
  androidPickerWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    color: colors.font_inverse,
    height: 43,
    justifyContent: 'center',
  },
  pickerItem: {
    fontSize: 16,
    fontFamily: fonts.primary,
    color: colors.font_primary,
  },
  androidPickerItem: {
    fontSize: 16,
    fontFamily: fonts.primary,
    color: colors.font_primary,
  },
});
