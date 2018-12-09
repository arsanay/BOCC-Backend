const mongoose = require("mongoose");
const Task = require("../models/task");

exports.tasks_get_all = (req, res, next) => {
  Task.find()
    .select("id title content creator deadline taskImage progress ")
    .exec()
    .then(docs => {
      console.log(docs)
      const response = {
        count: docs.length,
        task: docs.map(doc => {
          return {
            title: doc.title,
            content: doc.content,
            creator: doc.creator,
            deadline: doc.deadline,
            taskImage: doc.taskImage,
            _id: doc._id,
            progress: doc.progress,
            request: {
              type: "GET",
              url: "http://localhost:3000/tasks/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.tasks_create_task = (req, res, next) => {
    console.log(req.body)
  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    creator: req.body.creator,
    deadline: req.body.deadline,
    imageFile: req.body.imageFile,
    progress:req.body.progress
  });
  console.log(task)
  task
    .save()
    .then(result => {
// console.log(result);
      res.status(201).json({
        message: "Created task successfully",
      });
    })
    .catch(err => {
      console.log(err);
    //   res.status(500).json({
    //     error: err
    //   });
    });
};

exports.tasks_get_task = (req, res, next) => {
  const id = req.params.taskId;
  Task.findById(id)
    .select("id title content creator deadline taskImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          task: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/task"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.tasks_update_task = (req, res, next) => {
  const id = req.params.taskId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Task.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Task updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/tasks/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.tasks_delete = (req, res, next) => {
  const id = req.params.taskId;
  Task.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Task deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/tasks",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};