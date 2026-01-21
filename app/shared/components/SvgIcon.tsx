import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { TrashIcon } from '../../assets/TrashIcon';
import { ChevronLeftIcon } from '../../assets/ChevronLeftIcon';
import { DoneIcon } from '../../assets/DoneIcon';
import { PlusIcon } from '../../assets/PlusIcon';
import { SearchIcon } from '../../assets/SearchIcon';

type IconName = 'trash' | 'chevron-back' | 'done' | 'add' | 'search' | 'bin';

interface SvgIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const iconMap: Record<IconName, React.ComponentType<any>> = {
  trash: TrashIcon,
  bin: TrashIcon, // alias for trash
  'chevron-back': ChevronLeftIcon,
  done: DoneIcon,
  add: PlusIcon,
  search: SearchIcon,
};

export const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  size = 24,
  color = '#000000',
  style,
  testID = 'svg-icon',
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  return (
    <View style={style} testID={testID}>
      <IconComponent width={size} height={size} color={color} />
    </View>
  );
};
