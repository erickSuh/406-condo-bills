import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgIcon } from './SvgIcon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import sizes, { minActions } from '@/styles/sizes';
import { useNavigation } from '@react-navigation/native';
import spaces from '@/styles/spaces';

interface HeaderProps {
  testID?: string;
  title: string;
  icon?: 'add' | 'trash' | 'chevron-back' | 'done' | 'search';
  callToAction?: () => void;
  showGoBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  testID,
  title,
  icon = 'add',
  callToAction,
  showGoBack = false,
}) => {
  const { goBack } = useNavigation();

  const handleGoBack = () => {
    try {
      goBack();
    } catch (error) {
      console.warn('[Header] Navigation error:', error);
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.tileContainer}>
        {showGoBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            testID="back-button"
          >
            <SvgIcon
              name="chevron-back"
              size={24}
              color={colors.font_inverse}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {callToAction && (
        <TouchableOpacity
          style={styles.button}
          onPress={callToAction}
          testID="header-action-button"
        >
          <SvgIcon
            name={icon as HeaderProps['icon']}
            size={20}
            color={colors.font_inverse}
          />
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
    paddingHorizontal: spaces.small,
  },
  tileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spaces.base,
    width: sizes.large,
    height: sizes.large,
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
