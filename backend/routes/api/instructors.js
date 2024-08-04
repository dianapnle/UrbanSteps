//holds route paths to /api/spots
const express = require('express');
const { Op } = require('sequelize');
const { User, Instructor } = require('../../db/models');
const { requireAuth, validateInstructorUser} = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateInstructor = [
    check('profilePic')
    .exists({ checkFalsy: true })
    .withMessage('Profile pic img url is required'),
    handleValidationErrors
  ];

//Get all instructors
router.get("/", async (req, res) => {

    const instructors = await User.findAll({
            where: { isInstructor: true },
            attributes: ['id', 'firstName', 'lastName', 'email', 'username', 'isInstructor']
        });


    res.status(200);
    return res.json({
      Instructors:  instructors
    });
  })


//edit an instructor
router.put('/:instructorId', requireAuth, validateInstructor, validateInstructorUser, async (req, res) => {
    const { userId, profilePic } = req.body;
    const { instructorId } = req.params

    let result = await Instructor.findByPk(Number(instructorId));

     await result.update({
      id: instructorId,
      studioId: result.studioId,
      userId: userId,
      profilePic: profilePic
    });


    res.status(201);
    return res.json({
      id: result.id,
      userId: result.userId,
      studioId: result.studioId,
      profilePic: result.profilePic
    }
    );
})




//delete instructor
router.delete('/:instructorId', requireAuth, validateInstructorUser, async (req, res) => {
    //use param
    const instructorId = req.params.instructorId;
     await Instructor.destroy({
       where: {id: instructorId}
        })

    return res.json({
         message:"Successfully deleted"
      });

});


module.exports = router;
