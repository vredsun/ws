import app, { port } from './app';

// @ts-ignore TODO
app.listen(port, (error: Error): void => {
  if (error) {
    console.error(error, 'Server startup failed');
    return;
  }

  console.info(`Server started on port ${port}/`);
});