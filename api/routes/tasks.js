const express = require("express");
var cookieParser = require('cookie-parser')
var app = express()
app.use(cookieParser())
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const TasksController = require('../controllers/tasks');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", /*checkAuth*/ TasksController.tasks_get_all);

router.post("/", /*checkAuth, /*upload.single('taskImage'),*/ TasksController.tasks_create_task);

router.get("/taskId", TasksController.tasks_get_task);

router.patch("/:taskId", /*checkAuth,*/ TasksController.tasks_update_task);

router.delete("/:taskId", checkAuth,  TasksController.tasks_delete);

module.exports = router;