import { createApp } from './app';
createApp().then(app=>app.listen(Number(process.env.PORT || 3001),process.env.HOST || '127.0.0.1'));
