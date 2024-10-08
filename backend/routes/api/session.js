//holds route paths to /api/session
const express = require('express')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const { setTokenCookie, restoreUser } = require('../../utils/auth')
const { User } = require('../../db/models')
const router = express.Router()

//It checks to see whether or not req.body.credential and req.body.password are empty.
//If one of them is empty, then an error will be returned as the response.
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors,
]

//Login
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  })

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Invalid credentials')
    err.status = 401
    err.title = 'Login failed'
    err.errors = { credential: 'The provided credentials were invalid.' }
    return next(err)
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    isInstructor: user.isInstructor,
  }

  await setTokenCookie(res, safeUser)

  return res.json({
    user: safeUser,
  })
})

// Get the current user
router.get('/', (req, res) => {
  const { user } = req
  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isInstructor: user.isInstructor,
      username: user.username,
    }
    res.status(200)
    return res.json({
      user: safeUser,
    })
  } else {
    res.status(200)
    return res.json({ user: null })
  }
})

// Log out
router.delete('/', (_req, res) => {
  res.clearCookie('token')
  return res.json({ message: 'success' })
})

module.exports = router
