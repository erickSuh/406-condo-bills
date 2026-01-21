import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SvgIcon } from '../SvgIcon';

describe('SvgIcon Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <SvgIcon name="trash" size={24} color="#000" />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });

  it('renders trash icon', () => {
    const { getByTestId } = render(
      <SvgIcon name="trash" size={24} color="#000" />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });

  it('renders chevron-back icon', () => {
    const { getByTestId } = render(
      <SvgIcon name="chevron-back" size={24} color="#000" />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });

  it('renders done icon', () => {
    const { getByTestId } = render(
      <SvgIcon name="done" size={24} color="#000" />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });

  it('renders add icon', () => {
    const { getByTestId } = render(
      <SvgIcon name="add" size={24} color="#000" />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });

  it('renders search icon', () => {
    const { getByTestId } = render(
      <SvgIcon name="search" size={24} color="#000" />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });

  it('renders with custom size', () => {
    const { getByTestId } = render(
      <SvgIcon name="trash" size={32} color="#000" />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });

  it('renders with custom color', () => {
    const { getByTestId } = render(
      <SvgIcon name="trash" size={24} color="#FF0000" />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });

  it('renders bin icon', () => {
    const { getByTestId } = render(
      <SvgIcon name="bin" size={24} color="#000" />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });

  it('accepts style prop', () => {
    const { getByTestId } = render(
      <SvgIcon
        name="trash"
        size={24}
        color="#000"
        style={{ marginRight: 8 }}
      />,
    );
    expect(getByTestId('svg-icon')).toBeTruthy();
  });
});
