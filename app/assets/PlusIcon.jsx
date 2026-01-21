import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const PlusIcon = ({ width = 18, height = 19, color = 'white' }) => (
  <Svg width={width} height={height} viewBox="0 0 18 19" fill="none">
    <Path
      d="M9.75586 8.19141H17.543V10.1602H9.75586V18.6328H7.62891V10.1602H0V8.19141H7.62891V0H9.75586V8.19141Z"
      fill={color}
    />
  </Svg>
);
