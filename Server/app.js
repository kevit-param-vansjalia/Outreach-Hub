const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose')

app.use(cors());
app.use(express.json());

const authRoutes = require('../Server/api/routes/Auth');
const userRoutes = require('../Server/api/routes/User');
const contactRoutes = require('../Server/api/routes/Contact');
const campaignRoutes = require('../Server/api/routes/Campaign');
const messageTemplateRoutes = require('../Server/api/routes/MessageTemplate');
const workspaceRoutes = require('../Server/api/routes/Workspace');


mongoose.connect(process.env.MongoUrl , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/contact', contactRoutes);
app.use('/campaign', campaignRoutes);
app.use('/workspace', workspaceRoutes);
app.use('/messageTemplate', messageTemplateRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
})

module.exports = app;