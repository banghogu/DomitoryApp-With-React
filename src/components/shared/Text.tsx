/** @jsxImportSource @emotion/react */
import { CSSProperties } from 'react';

import styled from '@emotion/styled';
import { Typography, typographyMap } from '@/styles/typography';
import { Colors, colors } from '@/styles/colorPalette';

//CSSProperties을 사용해서 display,textAlign,fontWeight에 해당하는 값만 받겠다.
//예를들어 display에서는 이상한 문자열 안받고 block 속성 이런거만 받겠다
interface TextProps {
  typography?: Typography;
  color?: Colors;
  display?: CSSProperties['display'];
  textAlign?: CSSProperties['textAlign'];
  fontWeight?: CSSProperties['fontWeight'];
  bold?: boolean;
}

const Text = styled.span<TextProps>(
  ({ color = 'black', display, textAlign, fontWeight, bold }) => ({
    color: colors[color],
    display,
    textAlign,
    fontWeight: bold ? 'bold' : fontWeight,
  }),

  ({ typography = 't5' }) => typographyMap[typography]
);

export default Text;

// styled.span(
//   함수가온다
// )
