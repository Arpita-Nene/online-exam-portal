var mongoose = require('mongoose');
var subjectModel = require('../models/subject')
var questionModel = require('../models/question');
var testModel = require('../models/test');

var addQuestion = (req,res,next)=>{
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }
  req.check('body','Empty Question').notEmpty();
  req.check('marks','Invalid marks').isNumeric({min:1,max:4});
  req.check('options','Invalid length of list of options').isArray({min:1,max:4})
  req.check('options.*','Invalid Null option').isLength({min:1,max:256})
  req.check('subject','Invalid Subject').notEmpty()
  req.check('answer','Invalid Answer').notEmpty()
  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
  } 
  else {
    if(req.body.options.includes(req.body.answer) == false) {
      res.json({
        success : false,
        message : 'Invalid inputs',
        error : 'Answer is not in list of options'
      })
    }
    else {
    // check for valid subject
      subjectModel.findOne({_id:req.body.subject, status: true}).then((subject)=>{
        //subject found
        if(subject) {
          var explanation = req.body.explanation || null;
          var tempdata = new questionModel({
            body : req.body.body,
            explanation : explanation,
            options : req.body.options,
            subject : subject._id,
            marks : req.body.marks,
            answer : req.body.answer,
            status : true,
            createdBy : creator._id
          })
          tempdata.save((err, que)=>{
            if (err){
              console.log(err);
              res.status(500).json({
                success : false,
                message : "Unable to add question"
              })
            } else {
              res.json({
                success : true,
                message : 'Question created successfully!'
              })
            }  
          })
        }
        else {
          res.json({
            success : false,
            message : 'Subject not found'
          })
        }
      })
    }
  }
}


var getAllQuestions = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || creator.usertype != 'TEACHER') {
    return res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  if(req.query.subjects !== undefined) {
    var subjectIds = String(req.query.subjects).split(',').filter(Boolean);
    var marks = req.query.marks === undefined || req.query.marks === ''
      ? []
      : String(req.query.marks).split(',').map(Number);

    if(subjectIds.some((id)=>!mongoose.Types.ObjectId.isValid(id)) ||
       marks.some((mark)=>!Number.isInteger(mark) || mark < 1 || mark > 4)) {
      return res.status(400).json({
        success : false,
        message : 'Invalid question filters'
      })
    }

    if(subjectIds.length === 0) {
      return res.json({
        success : true,
        list : []
      })
    }

    var filter = {
      status : true,
      subject : {$in:subjectIds}
    };
    if(marks.length > 0) {
      filter.marks = {$in:marks};
    }

    return questionModel.find(filter, {_id:1,body:1,status:1,subject:1,marks:1})
      .sort({createdAt:-1})
      .then((questions)=>{
        return subjectModel.find({_id:{$in:subjectIds}}, {name:1})
          .then((subjects)=>{
            var subjectNames = new Map(
              subjects.map((subject)=>[subject._id.toString(),subject.name])
            );
            res.json({
              success : true,
              list : questions.map((question)=>{
                var subjectId = question.subject ? question.subject.toString() : '';
                return {
                  _id : question._id,
                  body : question.body,
                  status : question.status,
                  subjectId : subjectId,
                  subjectName : subjectNames.get(subjectId) || '',
                  marks : question.marks
                }
              })
            })
          })
        })
      .catch((err)=>{
        console.log(err);
        res.status(500).json({
          success : false,
          message : "Unable to get questions"
        })
      })
  }

  questionModel.find({createdBy:creator._id}, {_id:1,body:1,status:1}).sort({createdAt:-1})
    .then((questions)=>{
      res.json({
        success : true,
        list : questions
      })
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "Unable to get questions"
      })
    })
}

// search questions from body
var searchQuestion = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    return res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('query','Empty Query').notEmpty();
  var errors = req.validationErrors()

  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
  }
  else {
    questionModel.find({
      body : new RegExp(req.body.query),
      createdBy : creator._id
    }, {_id:1,body:1,status:1}).limit(20).then((questions)=>{
      var result = questions.map((que)=>({_id:que._id,body:que.body,status:que.status}));
      res.json({
        success : true,
        list : result
      })
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "error"
      })
    })
  }
}

var deleteQuestion = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || creator.usertype != 'TEACHER') {
    return res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('id','Id not found').notEmpty();
  var errors = req.validationErrors()
  if(errors) {
    return res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
  }

  questionModel.findOne({_id:req.body.id,createdBy:creator._id})
    .then((question)=>{
      if(!question) {
        return res.json({
          success : false,
          message : 'Question not found'
        })
      }

      return testModel.findOne({questions:question._id})
        .then((test)=>{
          if(test) {
            return res.json({
              success : false,
              message : 'This question is used in a test and cannot be deleted'
            })
          }

          return questionModel.deleteOne({_id:question._id,createdBy:creator._id})
            .then(()=>{
              res.json({
                success : true,
                message : 'Question deleted successfully'
              })
            })
        })
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : 'Unable to delete question'
      })
    })
}

//update question and ans
var updateQuestion = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }
  req.check('id','Id not found').notEmpty();
  req.check('body','Empty Question').notEmpty();
  req.check('marks','Invalid marks').isNumeric({min:1,max:4});
  req.check('options','Invalid length of list of options').isArray({min:1,max:4})
  req.check('options.*','Invalid Null option').isLength({min:1,max:256})
  req.check('subject','Invalid Subject').notEmpty()
  req.check('answer','Invalid Answer').notEmpty()
  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
    return;
  }
  if(req.body.options.includes(req.body.answer) == false) {
    res.json({
      success : false,
      message : 'Invalid inputs',
      error : 'Answer is not in list of options'
    })
    return;
  }
  var explanation = req.body.explanation || null;
  questionModel.findByIdAndUpdate({_id:req.body.id},{
    body : req.body.body,
    explanation : explanation,
    options : req.body.options,
    subject : req.body.subject,
    marks : req.body.marks,
    answer : req.body.answer,
    createdBy : creator._id
  }).then((result)=>{
    if(result) {
      res.json({
        success:true,
        message : 'success'
      })
    } else {
      res.json({
        success : false,
        message : 'not updated'
      })
    }
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).json({
      success : false,
      message : "server error"
    })
  })
}


// get question by id
var getQuestionById = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('id','ID not found').notEmpty();
  var errors = req.validationErrors()

  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
  }
  else {
    questionModel.findById({_id:req.body.id})
    .then((result)=>{
      if(result) {
        res.json({
          success:true,
          question: result
        })
      } else {
        res.json({
          success: false,
          message : 'not found'
        })
      }
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "error"
      })
    })
  }
}

var getQuestionAnswerById = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('id','ID not found').notEmpty();
  var errors = req.validationErrors()

  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
  }
  else {
    questionModel.findById({_id:req.body.id})
    .then((result)=>{
      if(result) {
            res.json({
              success:true,
              question : result,
              answer: result.answer
            })
      } else {
        res.json({
          success: false,
          message : 'not found'
        })
      }
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "error"
      })
    })
  }
}

// disable/enable question with ans
var changeQuestionStatus = (req,res,next)=> {
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }
  req.check('id','Id not found').notEmpty();
  req.check('status','Status not found').isBoolean();

  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid inputs',
      errors : errors
    })
  } else {
    questionModel.findByIdAndUpdate({_id:req.body.id},{
      status:req.body.status,
      createdBy : creator._id
    }).then((result)=>{
      if(result) {
        res.json({
          success:true,
          message : 'success'
        })
      }
    }).catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : 'Internal server error'
      })
    })
  }
}

var getAnsByQuestionId = (req,res,next)=>{
  var creator = req.user || null
  if(creator == null || req.user.usertype != 'TEACHER') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('id','ID not found').notEmpty();
  var errors = req.validationErrors()

  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
  } else {
    questionModel.findById({_id:req.body.id})
    .then((result)=> {
      if(result) {
        res.json({
          success:true,
          answer: result.answer
        })
      } else {
        res.json({
          success: false,
          message : 'not found'
        })
      }
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "error"
      })
    })
  }
}

var getQuestionAnswerByIds = (req,res,next) => {
  var creator = req.user || null
  if(creator == null) {
    res.json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  req.check('queids','no question ids').isArray({min:1});
  var errors = req.validationErrors();
  if(errors) {
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })
    return;
  }

  questionModel.find({_id:{$in:req.body.queids}})
  .then(ques=> {
    if(ques.length < req.body.queids) {
      res.json({
        success : false,
        message : 'not all question found'
      })
    } else {
      var questions = [];
      for(var id in req.body.queids) {
        for(var q in ques) {
          if(ques[q]._id.toString() === req.body.queids[id].toString()) {
            questions.push({
              _id : ques[q]._id,
              body : ques[q].body,
              options : ques[q].options,
              marks : ques[q].marks,
              answer : ques[q].answer,
              explanation : ques[q].explanation
            })
            break;
          }
        }
      }
      res.json({
        success : true,
        questions : questions
      })
    }
  })
  .catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'internal server error'
    })
  })
}

module.exports = {
  addQuestion,
  getAllQuestions,
  searchQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestionById,
  changeQuestionStatus,
  getAnsByQuestionId,
  getQuestionAnswerById,
  getQuestionAnswerByIds
}