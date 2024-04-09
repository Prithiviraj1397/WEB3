const router = require('express').Router();
const validate = require('../middlewares/validate');
const user_validation = require('../validations/user_validation');
const user_controller = require('../controller/user_controller');

router.post('/register', validate(user_validation.register), user_controller.register);
router.post('/login', validate(user_validation.login), user_controller.login);
router.get('/:userId', validate(user_validation.userId), user_controller.get_single_user);
router.delete('/:userId', validate(user_validation.userId), user_controller.delete_single_user);

module.exports = router;