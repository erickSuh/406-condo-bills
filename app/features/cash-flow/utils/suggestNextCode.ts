import { CashFlowItem } from '../types';

export const suggestNextCode = (
  parentCode: string,
  childrenCodes: string[],
  allCashFlows: CashFlowItem[],
): string => {
  const parentSegments = parentCode.split('.');
  const requiredDepth = parentSegments.length + 1;

  if (!childrenCodes.length) {
    return `${parentCode}.1`;
  }

  const correctDepthChildren = childrenCodes.filter(code => {
    const segments = code.split('.');
    return segments.length === requiredDepth;
  });

  if (!correctDepthChildren.length) {
    return `${parentCode}.1`;
  }

  const lastSegments = correctDepthChildren.map(code => {
    const parts = code.split('.');
    return parseInt(parts[parts.length - 1], 10);
  });

  const maxSegment = Math.max(...lastSegments);
  const nextSegment = maxSegment + 1;

  if (nextSegment > 999) {
    let newParentSegments = [...parentSegments];
    let levelIndex = newParentSegments.length - 1;

    while (levelIndex >= 0) {
      const currentValue = Number(newParentSegments[levelIndex]);

      if (currentValue < 999) {
        newParentSegments[levelIndex] = String(currentValue + 1);
        newParentSegments = newParentSegments.slice(0, levelIndex + 1);

        let newCode = newParentSegments.join('.');

        let attempts = 0;
        while (attempts < 999) {
          const codeExists = allCashFlows.some(item => item.code === newCode);
          if (!codeExists) {
            return newCode;
          }

          const segments = newCode.split('.');
          segments[segments.length - 1] = String(
            Number(segments[segments.length - 1]) + 1,
          );
          newCode = segments.join('.');
          attempts++;
        }

        return newCode;
      }

      levelIndex--;
    }
  }

  return `${parentCode}.${nextSegment}`;
};
