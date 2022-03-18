import config from './../config/config';
import app from './express';

app.listen(config.port, (err) => {
    console.info('Database is at %s.', config.mongoUri);
    if (err) {
        console.log(err);
    }
    console.info('Server started on port %s.', config.port);
});