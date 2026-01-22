import colors from '@/styles/colors';

export const getCodeColor = (code: number): string => {
  return code === 0 ? colors.green : colors.orange;
};
