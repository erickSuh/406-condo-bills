import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const ChevronLeftIcon = ({
  width = 24,
  height = 24,
  color = 'white',
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11.67 3.87001L9.9 2.10001L0 12L9.9 21.9L11.67 20.13L3.54 12L11.67 3.87001Z"
      fill={color}
    />
  </Svg>
);
