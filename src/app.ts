import express from 'express';
import { json } from 'body-parser';
import 'reflect-metadata';
import DrugsController from "./service-layer/controllers/DrugsController";

const app = express();

app.use(json());

const drugsController = new DrugsController();

drugsController.mount(app);

export default app;