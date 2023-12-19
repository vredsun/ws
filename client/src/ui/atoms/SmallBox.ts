import styled from 'styled-components';

type PropsT = {
  left: number;
  top: number;
}

export const SmallBox = styled.div<PropsT>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: 10px;
  height: 10px;

  transform: translate(-50%, -50%);

  border: 1px solid grey;

  transition: top 0.1s, left 0.1s;

  background-color: green;

  pointer-events: none;
`