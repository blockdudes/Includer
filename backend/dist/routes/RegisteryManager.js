"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.loginUser = exports.registerUser = void 0;
const express_1 = __importDefault(require("express"));
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const firebaseConfig_1 = require("../config/firebaseConfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../utils/helper");
const registerUser = async (req, res) => {
    try {
        const { name, email, password, imageUrl = null } = req.body;
        const stellarAccount = stellar_sdk_1.Keypair.random();
        const docRef = firebaseConfig_1.db.collection('users').doc(stellarAccount.publicKey());
        const newUser = {
            id: stellarAccount.publicKey(),
            name,
            email,
            password,
            imageUrl,
            publicKey: stellarAccount.publicKey(),
            privateKey: stellarAccount.secret(),
        };
        await docRef.set(newUser);
        res.status(200).send({ message: 'User registered successfully', publicKey: stellarAccount.publicKey() });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send({ message: 'Email and password are required' });
            return;
        }
        const usersRef = firebaseConfig_1.db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();
        if (snapshot.empty) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        let userData = null;
        snapshot.forEach(doc => {
            const data = doc.data();
            userData = { ...data, id: doc.id };
        });
        if (!userData || !userData.password || userData.password !== password) {
            res.status(401).send({ message: 'Invalid password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ email: userData.email, publicKey: userData.publicKey }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).send({ message: 'Login successful', token });
    }
    catch (error) {
        res.status(500).send({ message: 'Login failed', error: error.message });
    }
};
exports.loginUser = loginUser;
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.user;
        const usersRef = firebaseConfig_1.db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();
        if (snapshot.empty) {
            res.status(404).send({ message: 'No matching documents.' });
            return;
        }
        let userData = null;
        snapshot.forEach(doc => {
            const data = doc.data();
            userData = {
                id: doc.id,
                name: data.name,
                email: data.email,
                imageUrl: data.imageUrl,
                publicKey: data.publicKey,
            };
        });
        if (!userData) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        res.status(200).send(userData);
    }
    catch (error) {
        res.status(500).send({ message: 'Failed to retrieve user', error: error.message });
    }
};
exports.getUserByEmail = getUserByEmail;
const registeryManager = express_1.default.Router();
registeryManager.post('/registerUser', exports.registerUser);
registeryManager.post('/loginUser', exports.loginUser);
registeryManager.get('/getUserByEmail', helper_1.authenticateToken, exports.getUserByEmail);
exports.default = registeryManager;
