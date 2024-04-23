import { css } from '@emotion/react';
import { colors } from './colorPalette';

//기본 버튼 색상이 fill되어있음
export const buttonColorMap = {
  //기본
  primary: css`
    background-color: ${colors.blue};
    color: ${colors.white};
  `,
  //성공시
  success: css`
    background-color: ${colors.teal900};
    color: ${colors.white};
  `,
  //에러시
  error: css`
    background-color: ${colors.red};
    color: ${colors.white};
  `,
};

//테두리만 색 있고 배경색상은 없는 버튼
export const buttonWeakMap = {
  primary: css`
    background-color: ${colors.white};
    color: ${colors.blue};
    border: 1px solid ${colors.blue};
  `,
  success: css`
    background-color: ${colors.white};
    color: ${colors.teal900};
    border: 1px solid ${colors.teal900};
  `,
  error: css`
    background-color: ${colors.white};
    color: ${colors.red};
    border: 1px solid ${colors.red};
  `,
};

//버튼 사이즈 설정
export const buttonSizeMap = {
  small: css`
    font-size: 13px;
    padding: 8px 9px;
  `,
  medium: css`
    font-size: 15px;
    padding: 10px 15px;
  `,
  large: css`
    font-size: 18px;
    padding: 12px 10px;
  `,
};

export type ButtonColor = keyof typeof buttonColorMap;
export type ButtonSize = keyof typeof buttonSizeMap;
