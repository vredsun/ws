import styled from 'styled-components';

type PropsT = {
  isSelected: boolean;
}

export const Box = styled.div<PropsT>`
  width: 200px;
  height: 200px;

  border: 1px solid grey;

  background-color: ${({ isSelected }) => isSelected ? 'red' : 'blue'};
`