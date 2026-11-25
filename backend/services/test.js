var mongoose = require('mongoose');
var testModel = require('../models/test');
var questionModel = require('../models/question');
const testRegistrationModel = require('../models/testRegistration');

var getTestStatus = (test) => {
  if(test.status === 'CANCELLED')
    return test.status;
  var status = 'CREATED'
  var now = new Date();
  if(Date.parse(test.resultTime) < now) {
    status = 'RESULT_DECLARED';
  } else if(Date.parse(test.endTime) < now) {
    status = 'TEST_COMPLETE';
  } else if(Date.parse(test.startTime) < now) {
    status = 'TEST_STARTED';
  } else if(Date.parse(test.regEndTime) < now) {
    status = 'REGISTRATION_COMPLETE'
  } else if(Date.parse(test.regStartTime) < now) {
    status = 'REGISTRATION_STARTED';
  }


  return status;
}

var buildTestQuestionSelection = (questionIds, availableQuestions) => {
  if(!Array.isArray(questionIds) || questionIds.length === 0) {
    return {
      error : 'Please select at least one question'
    }
  }

  var orderedIds = questionIds.map((id)=>id.toString());
  if(new Set(orderedIds).size !== orderedIds.length) {
    return {
      error : 'A question cannot be selected more than once'
    }
  }

  var questionsById = new Map(
    availableQuestions.map((question)=>[question._id.toString(),question])
  );
  var questions = orderedIds.map((id)=>questionsById.get(id));
  if(questions.some((question)=>!question || question.status !== true)) {
    return {
      error : 'One or more selected questions are unavailable or inactive'
    }
  }

  if(questions.some((question)=>
    !question.subject ||
    !Number.isFinite(Number(question.marks)) ||
    Number(question.marks) <= 0
  )) {
    return {
      error : 'One or more selected questions have invalid subject or marks'
    }
  }

  var subjects = [];
  var queTypes = [];
  var totalMarks = 0;
  questions.forEach((question)=>{
    var subjectId = question.subject._id
      ? question.subject._id.toString()
      : question.subject.toString();
    var marks = Number(question.marks);
    if(!subjects.includes(subjectId)) {
      subjects.push(subjectId);
    }
    if(!queTypes.includes(marks)) {
      queTypes.push(marks);
    }
    totalMarks += marks;
  });

  return {
    questions : questions,
    questionIds : questions.map((question)=>question._id),
    subjects : subjects,
    queTypes : queTypes,
    maxmarks : totalMarks
  }
}

var createTest = async (req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'TEACHER') {
    return res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  if (typeof req.body.duration === 'string' && req.body.duration.includes(':')) {
    const parts = req.body.duration.split(':');
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    req.body.duration = Number.isInteger(hours) && Number.isInteger(minutes) &&
      hours >= 0 && minutes >= 0 && minutes < 60
      ? (hours * 60 + minutes) * 60
      : '';
  }

  req.check('title','Empty Title').notEmpty();
  req.check('questionIds','Select at least one question').isArray({min:1});
  req.check('questionIds.*','Invalid question id').notEmpty();
  req.check('duration','Invalid duration').notEmpty();
  req.check('startTime','Invalid Start Time').notEmpty();
  req.check('endTime','Invalid End Time').notEmpty();
  req.check('regStartTime','Invalid registration start time').notEmpty();
  req.check('regEndTime','Invalid registration end time').notEmpty();
  req.check('resultTime','Invalid result time').notEmpty();


  var errors = req.validationErrors()
  if(errors) {
    console.log(errors);
    res.json({
      success:false,
      message: 'Invalid inputs',
      errors : errors
    })
    return;
  }

  var questionIds = req.body.questionIds.map((id)=>id.toString());
  if(questionIds.some((id)=>!mongoose.Types.ObjectId.isValid(id))) {
    return res.json({
      success : false,
      message : 'One or more selected question IDs are invalid'
    })
  }

  var questionResult;
  try {
    var uniqueQuestionIds = Array.from(new Set(questionIds));
    var availableQuestions = await questionModel.find({
      _id : {$in:uniqueQuestionIds},
      status : true
    });
    questionResult = buildTestQuestionSelection(questionIds, availableQuestions);
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      success : false,
      message : 'Unable to validate selected questions'
    })
  }

  if(questionResult.error) {
    return res.json({
      success : false,
      message : questionResult.error
    })
  }

  var regStartTime = Date.parse(req.body.regStartTime);
  var regEndTime = Date.parse(req.body.regEndTime);
  var startTime = Date.parse(req.body.startTime);
  var endTime = Date.parse(req.body.endTime);
  var resultTime = Date.parse(req.body.resultTime);
  var duration = Number(req.body.duration);

  if([regStartTime,regEndTime,startTime,endTime,resultTime].some((time)=>!Number.isFinite(time))) {
    return res.json({
      success : false,
      message : 'Invalid date and time values'
    })
  }
  if(regEndTime <= regStartTime) {
    return res.json({
      success : false,
      message : 'Registration end time must be after registration start time'
    })
  }
  if(startTime <= regEndTime) {
    return res.json({
      success : false,
      message : 'Test start time must be after registration ends'
    })
  }
  if(endTime <= startTime) {
    return res.json({
      success : false,
      message : 'Test end time must be after test start time'
    })
  }
  if(resultTime <= endTime) {
    return res.json({
      success : false,
      message : 'Result time must be after test end time'
    })
  }
  if(!Number.isFinite(duration) || duration <= 0 || duration * 1000 > endTime - startTime) {
    return res.json({
      success : false,
      message : 'Test duration must be positive and fit within the test window'
    })
  }

  var tempdata = new testModel({
    title : req.body.title,
    subjects : questionResult.subjects,
    maxmarks : questionResult.maxmarks,
    queTypes : questionResult.queTypes,
    questions : questionResult.questionIds,
    startTime : req.body.startTime,
    endTime : req.body.endTime,
    duration : duration,
    regStartTime : req.body.regStartTime,
    regEndTime : req.body.regEndTime,
    resultTime : req.body.resultTime,
    createdBy : creator._id
  })
  tempdata.save((err)=>{
    if (err){
      console.log(err);
      res.status(500).json({
        success : false,
        message : "Unable to create test"
      })
    } else {
      res.json({
        success : true,
        message : 'Test created successfully!'
      })
     
    }
  })
}

var updateStatus = (test,correctStatus) => {
  
  if(correctStatus !== test.status) {
    console.log(correctStatus + " "+ test.status)

    testModel.findByIdAndUpdate({_id:test._id},{status : correctStatus})
    .then((updated)=>{
      console.log("updated status of test "+updated._id+" to "+correctStatus);
    }).catch((err)=>{
      console.log('Error in status update');
      console.log(err);
    })
  }
}

var getAllTest = (req,res,next) => {
  var creator = req.user || null;
  if(creator == null) {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  }

  try {
    testModel.find().sort({startTime:-1})
    .then((result)=>{
      for(x in result) {
        var correctStatus = getTestStatus(result[x]);
        if (correctStatus !== result[x].status) {
          updateStatus(result[x],correctStatus);
          result[x].status = correctStatus;
        }
      }
      res.json({
        success : true,
        testlist : result.map(v=>({_id:v._id,title:v.title,status: v.status}))
      })
    })

  } catch(err) {
    console.log(err);
    res.json({
      success : false,
      testlist : []
    })
  }
  
}

var testRegistration = (req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
  } 

  req.check('testid','empty test id').notEmpty();

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

    testModel.findById({_id:req.body.testid})
    .then(result => {
      var correctStatus = getTestStatus(result);
      if(correctStatus !== result.status) {
        updateStatus(result,correctStatus);
        result.status = correctStatus;
      }
      if(result.status !== 'REGISTRATION_STARTED') {
        res.json({
          success : false,
          message : 'Test Registration are not open'
        })
      } else {
        testRegistrationModel.find({user:creator._id,test:req.body.testid})
        .then(testRegFind=>{
          if(testRegFind.length > 0) {
            console.log(testRegFind);
            res.json({
              success : false,
              message : 'your registration for test is done'
            })
          } else {
            var tempdata = new testRegistrationModel({
              test : req.body.testid,
              user : creator._id
            })
            tempdata.save().then(()=>{
              res.json({
                success : true,
                message : 'Test Registration success'
              })})
              .catch(err=>{
                res.json({
                  success : false,
                  message : 'Test Registration failed'
                })
              })
            
          }
        })
      }

    }).catch(err=> {
      console.log(err);
      res.json({
        success : false
      })
    })
}

var getAllTestWithStudentRegisterCheck = async(req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
    return;
  }

  var tests = await testModel.find().sort({startTime:1}).catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });

  var testlist = new Array(tests.length);
  var registeredList = await testRegistrationModel.find({user:creator._id},{test:1}).catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });


  for(x in tests) {
    var correctStatus = getTestStatus(tests[x]);
    if (correctStatus !== tests[x].status) {
      updateStatus(tests[x],correctStatus);
      tests[x].status = correctStatus;
    }
    var isReg = registeredList.find((test,index)=>(test.test.toString() == tests[x]._id.toString()));
    testlist[x] = {
      _id : tests[x]._id,
      title : tests[x].title,
      status : tests[x].status,
      isRegistered : (isReg!==undefined),
      startTime : tests[x].startTime,
      endTime : tests[x].endTime,
      regStartTime : tests[x].regStartTime,
      regEndTime : tests[x].regEndTime,
      resultTime : tests[x].resultTime,
      maxmarks : tests[x].maxmarks,
      duration : tests[x].duration
    };
  }

  
  res.json({
    success : true,
    testlist : testlist
  })
  
}

var getUpcomingTestforStudent = async(req,res,next) => {
  var creator = req.user || null;
  if(creator == null || req.user.usertype != 'STUDENT') {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
    return;
  }

  var tests = await testModel.find({endTime:{$gt:Date.now()}}).sort({startTime:1}).catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });

  var testlist = [];
  var registeredList = await testRegistrationModel.find({user:creator._id},{test:1}).catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });


  for(x in tests) {
    var correctStatus = getTestStatus(tests[x]);
    if (correctStatus !== tests[x].status) {
      updateStatus(tests[x],correctStatus);
      tests[x].status = correctStatus;
    }
    var isReg = registeredList.find((test,index)=>(test.test.toString() == tests[x]._id.toString()));
    if(isReg) {
      testlist.push({
        _id : tests[x]._id,
        title : tests[x].title,
        status : tests[x].status,
        startTime : tests[x].startTime,
        endTime : tests[x].endTime,
        resultTime : tests[x].resultTime,
        maxmarks : tests[x].maxmarks,
        duration : tests[x].duration
      });
    }
  }

  
  res.json({
    success : true,
    upcomingtestlist : testlist
  })
  
}

var getTestDetailsFromId = (req,res,next) => {
  var creator = req.user || null;
  if(creator == null) {
    res.status(401).json({
      success : false,
      message : "Permissions not granted!"
    })
    return;
  }

  req.check('testid','empty test id').notEmpty();
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

  testModel.findById({_id:req.body.testid})
  .then(test => {
    if(test) {
      var correctStatus = getTestStatus(test);
      if(correctStatus !== test.status) {
        updateStatus(test,correctStatus);
        test.status = correctStatus;
      }
      if(req.user.usertype == 'STUDENT') {
        res.json({
          success : true,
          test : {
            _id : test._id,
            title : test.title,
            status : test.status,
            startTime : test.startTime,
            endTime : test.endTime,
            regStartTime : test.regStartTime,
            regEndTime : test.regEndTime,
            resultTime : test.resultTime,
            maxmarks : test.maxmarks,
            duration : test.duration
          }
        })
      } else {
        res.json({
          success : true,
          test : {
            _id : test._id,
            title : test.title,
            status : test.status,
            startTime : test.startTime,
            endTime : test.endTime,
            regStartTime : test.regStartTime,
            regEndTime : test.regEndTime,
            resultTime : test.resultTime,
            maxmarks : test.maxmarks,
            duration : test.duration,
            subjects : test.subjects,
            queTypes : test.queTypes
          }
        })
      }
    } else {
      res.json({
        success : false,
        message : 'test id not found'
      })
    }
  })
  .catch(err=>{
    console.log(err);
    res.json({
      success : false,
      message : 'Internal server error'
    });
    return;
  });

  
}



module.exports = {
  createTest,
  getAllTest,
  testRegistration,
  getAllTestWithStudentRegisterCheck,
  getUpcomingTestforStudent,
  getTestDetailsFromId,
  getTestStatus,
  updateStatus,
  buildTestQuestionSelection
}