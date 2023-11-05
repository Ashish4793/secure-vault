import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import AWS from "aws-sdk"
import bodyParser from "body-parser"
import passport from 'passport';
import ejs from 'ejs';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import MongoStore from 'connect-mongo'

import authRoutes from './routes/auth.js'
import indexRoutes from './routes/index.js'
import fileHandlingRoutes from './routes/file-handling.js'

const app = express();


app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.use("/", authRoutes);
app.use("/", indexRoutes);
app.use("/", fileHandlingRoutes);





//mongoose initialization

mongoose.set("strictQuery", false);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true)
mongoose.set('useCreateIndex', true);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};



//connecting to db and spinning up the server

connectDB().then(() => {
    console.log("SecureVault DB Connected Succesfully");
    app.listen(process.env.PORT || 3000, () => {
        console.log(`SecureVault Server Listening on ${process.env.PORT || 3000}`);
    });
});
