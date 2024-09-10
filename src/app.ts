import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { isCelebrateError } from 'celebrate';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import routes from './api/routes';
import errorHandler from './middlewares/validation/errorHandler';
import dbConnector from './config/database';
import cron from 'node-cron';
import { closeFtpConnection, connectFtp, downloadFile } from './services/connector/ftpConnector';
import path from 'path';
import os from 'os';

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(json({ limit: '50mb' }));


app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

app.use(helmet());

dbConnector();

app.get('/', (req: Request, res: Response) => { res.send('Welcome to Vendor-Management.') });

app.use('/api/v1', routes);

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (isCelebrateError(err)) {
        return errorHandler(err, req, res, next);
    }
});

// cron.schedule('0 0 * * *',async () => {  // todo: use this to kick-of other cron jobs
//     console.log('Cron job running at midnight (every 24 hours)');
//     try {
//         const connection = await connectFtp();
//         console.log('FTP connection:', connection);
//         const desktopPath = path.join(os.homedir(), 'Desktop', 'downloaded_file.csv');
//         await downloadFile('./ftp-test/products_export_1.csv', desktopPath);
//     } catch (error) {
//         console.error('FTP operation failed:', error);
//     } finally {
//         closeFtpConnection();
//     }
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});