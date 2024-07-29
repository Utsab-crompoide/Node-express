import express from 'express'
import { getAllItems, addUser, updateUser, deleteUser, getById, login } from '../controller/userController.js';

const route = express.Router();

route.get('/home', (req, res) => {
    res.render('home')
})

route.get('/login', (req, res) => {
    res.render('login')
})

route.get('/signup', (req, res) => {
    res.render('signUp')
})

route.post('/login_post', login)

/**
 * @swagger
 * /user/getAllUsers:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
route.get('/user/getAllUsers', getAllItems)

/**
 * @swagger
 * /users/getById/{userId}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [User]
 *     description: Retrieve details of a user by their unique ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error
 */
route.get('/users/getById/:userId', getById)

/**
 * @swagger
 * /user/addUser:
 *   post:
 *     summary: Add a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - userId
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The user's full name
 *               email:
 *                 type: string
 *                 description: The user's email
 *               userId:
 *                 type: string
 *                 description: The user's unique ID
 *     responses:
 *       200:
 *         description: User created successfully or existing user found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       500:
 *         description: Internal server error
 */
route.post('/user/createUser', addUser);

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Update an existing user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's unique ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email
 *     responses:
 *       200:
 *         description: User updated successfully or no existing user found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *       500:
 *         description: Internal server error
 */
route.put('/user/updateUser/:userId', updateUser);

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's unique ID
 *     responses:
 *       200:
 *         description: User deleted successfully or no existing user found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       500:
 *         description: Internal server error
 */
route.delete('/user/deleteUser/:userId', deleteUser);


export default route