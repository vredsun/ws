import styled from 'styled-components';

type PropsT = {
  gap?: number;
}

export const LineContainer = styled.div<PropsT>`
  display: flex;
  gap: ${({ gap }) => `${gap ?? 4}px`}
`