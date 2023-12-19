import express from 'express';
import expressWsWrap from 'express-ws';

export const port = 3001;
const { app } = expressWsWrap(express());

const connectedWs = new Map<string, WebSocket>();
let state = {
  activeBox: null,
  cursorPosition: {
    x: null,
    y: null,
  }
}

app.get('/', function(req, res, next){
  res.end();
});

app.ws('/', function(ws, req) {
  ws.on('open', () => {
    ws.send('hello client');

    console.log('server open')
  })

  ws.on('message', function(msg) {
    const action = JSON.parse(msg.toString());

    switch (action.type) {
      case 'INIT': {
        connectedWs.set(
          action.user,
          // @ts-expect-error TODO
          ws,
        );

        console.log('init')

        connectedWs.forEach(savedWs => {
          savedWs.send(JSON.stringify({ type: 'UPDATE_USERS', count: connectedWs.size, state }))
        })

        console.log('connectedWs', connectedWs.size)
        
        break;
      }
      case 'CLOSE': {
        console.log('CLOSE')

        connectedWs.delete(
          action.user,
        );

        connectedWs.forEach(savedWs => {
          savedWs.send(JSON.stringify({ type: 'UPDATE_USERS', count: connectedWs.size, state }))
        })
        break;
      }

      case 'SET_ACTIVE': {
        state = {
          ...state,
          activeBox: action.activeBox
        }

        console.log('state', state, connectedWs.size)

        connectedWs.forEach(savedWs => {
          savedWs.send(JSON.stringify({ type: 'UPDATE_STATE', state }))
        })

        break;
      }

      case 'SET_CURSOR_POSITION': {
        state = {
          ...state,
          cursorPosition: action.cursorPosition
        }

        connectedWs.forEach(savedWs => {
          savedWs.send(JSON.stringify({ type: 'UPDATE_STATE', state }))
        })

        break;
      }
    }
  });
});

export default app;