import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import spaces from '@/styles/spaces';
import { borderRadius } from '@/styles/borderRadius';
import { SvgIcon } from './SvgIcon';
import { Button } from './Button';

export interface AlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onDismiss: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const getAlertStyles = (type: string) => {
  switch (type) {
    case 'success':
      return {
        bgColor: colors.background_secondary,
        borderColor: colors.green,
        textColor: colors.green,
        icon: 'check',
      };
    case 'error':
      return {
        bgColor: colors.background_secondary,
        borderColor: colors.red,
        textColor: colors.red,
        icon: 'alert',
      };
    case 'warning':
      return {
        bgColor: colors.background_secondary,
        borderColor: colors.orange,
        textColor: colors.orange,
        icon: 'alert',
      };
    case 'info':
    default:
      return {
        bgColor: colors.background_secondary,
        borderColor: colors.blue,
        textColor: colors.blue,
        icon: 'info',
      };
  }
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  title,
  message,
  type,
  onDismiss,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  const alertStyle = getAlertStyles(type);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.container,
                {
                  borderColor: alertStyle.borderColor,
                  backgroundColor: alertStyle.bgColor,
                },
              ]}
            >
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: alertStyle.textColor },
                ]}
              >
                <SvgIcon
                  name={
                    type === 'success'
                      ? 'done'
                      : type === 'warning'
                        ? 'chevron-back'
                        : 'chevron-back'
                  }
                  size={24}
                  color={colors.font_inverse}
                />
              </View>

              <Text style={[styles.title, { color: alertStyle.textColor }]}>
                {title}
              </Text>

              <Text style={styles.message}>{message}</Text>

              <View style={styles.buttonContainer}>
                {onConfirm && (
                  <>
                    <Button
                      title={cancelText}
                      variant="secondary"
                      color={alertStyle.textColor}
                      onPress={onDismiss}
                      style={styles.button}
                    />
                    <Button
                      title={confirmText}
                      variant="primary"
                      color={alertStyle.textColor}
                      onPress={() => {
                        onConfirm();
                        onDismiss();
                      }}
                      style={styles.button}
                    />
                  </>
                )}
                {!onConfirm && (
                  <Button
                    title={confirmText}
                    variant="primary"
                    color={alertStyle.textColor}
                    onPress={onDismiss}
                    style={styles.singleButton}
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: colors.font_inverse,
    borderRadius: borderRadius.medium,
    padding: spaces.large,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spaces.large,
  },
  title: {
    fontSize: fonts.sizes.large,
    fontFamily: fonts.listItemTitle,
    marginBottom: spaces.small,
    textAlign: 'center',
  },
  message: {
    fontSize: fonts.sizes.base,
    fontFamily: fonts.primary,
    color: colors.font_primary,
    textAlign: 'center',
    marginBottom: spaces.large,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spaces.large,
    width: '100%',
  },
  button: {
    flex: 1,
  },
  singleButton: {
    width: '100%',
  },
});
