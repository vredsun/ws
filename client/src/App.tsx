import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Box } from './ui/atoms/Box';
import { LineContainer } from './ui/atoms/LineContainer';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import { SmallBox } from './ui/atoms/SmallBox';

const socket = new WebSocket('ws://localhost:3001');

socket.onerror = function(error) {
  // @ts-expect-error TODO
  console.log(`Ошибка: ${error.message}`);
};

const user = Math.random();

// This implements the default behavior from styled-components v5
function shouldForwardProp(propName: string, target: any) {
  if (typeof target === "string") {
      // For HTML elements, forward the prop if it is a valid HTML attribute
      return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
}

type StateT = {
  activeBox: number | null;
  cursorPosition: {
    x: number | null;
    y: number | null;
  }
}

const initialState: StateT = {
  activeBox: null,
  cursorPosition: {
    x: null,
    y: null,
  }
}


function App() {
  const [countUser, setCountUser] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<StateT>(initialState)
  const [isActiveTab, setIsActiveTab] = useState(true);

  useEffect(
    () => {
      console.log('hrerer')
      socket.onopen = function() {
        console.log('here')
        socket.send(JSON.stringify({ type: 'INIT', user }))
        setIsOpen(true);
      };

      socket.onmessage = function(event) {
        const action = JSON.parse(event.data);

        switch (action.type) {
          case 'UPDATE_USERS': {
            console.log('action', action)
            setCountUser(action.count)
            setState(action.state);
            break;
          }

          case 'UPDATE_STATE': {
            setState(action.state);
            break;
          }
        }
      };
      
      socket.onclose = function(event) {
        console.log('Соединение закрыто');
      };
    },
    [],
  );

  useEffect(
    () => {
      if (isOpen) {
        document.addEventListener('visibilitychange', function (event) {
          if (document.hidden) {
            setIsActiveTab(false);
          } else {
            setIsActiveTab(true);
          }
        });

        window.addEventListener('focus', function (event) {
          setIsActiveTab(true);
        });
      
        window.addEventListener('blur', function (event) {
          setIsActiveTab(false);
        });
      

        window.onbeforeunload = function() {
          socket.send(JSON.stringify({ type: 'CLOSE', user }))
          socket.close();
        };
      }
    },
    [isOpen]
  );

  const handleClick = (activeBox: number) => {
    console.log('here')
    socket.send(JSON.stringify({ type: 'SET_ACTIVE', activeBox }))
  }

  const handleMouseMove: React.MouseEventHandler = (event) => {
    const cursorPosition = { x: event.clientX, y: event.clientY };
    setState((oldState) => {
      return {
        ...oldState,
        cursorPosition,
      }
    })
    socket.send(JSON.stringify({ type: 'SET_CURSOR_POSITION', cursorPosition }))
  }
  
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <div style={{ width: '100%', height: '100%' }} onMouseMove={handleMouseMove}>
        <div>{countUser}</div>
        <LineContainer>
          <Box isSelected={state.activeBox === 1} onClick={() => handleClick(1)} />
          <Box isSelected={state.activeBox === 2} onClick={() => handleClick(2)} />
        </LineContainer>
      </div>
      {
        !isActiveTab && state.cursorPosition.x && state.cursorPosition.y && (
          <SmallBox left={state.cursorPosition.x} top={state.cursorPosition.y} />
        )
      }
    </StyleSheetManager>
  );
}

export default App;
