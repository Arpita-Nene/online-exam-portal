jest.mock('../models/question', () => ({
  find: jest.fn(),
}));
jest.mock('../models/subject', () => ({
  find: jest.fn(),
}));

const questionModel = require('../models/question');
const subjectModel = require('../models/subject');
const questionService = require('../services/question');

describe('getAllQuestions filtered listing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns active questions for selected subjects and marks with subject names', async () => {
    const subjectId = '507f1f77bcf86cd799439011';
    const question = {
      _id: '507f1f77bcf86cd799439012',
      body: 'What is Java?',
      status: true,
      subject: subjectId,
      marks: 2,
    };
    const subject = {
      _id: subjectId,
      name: 'Java',
    };
    const sort = jest.fn().mockResolvedValue([question]);
    questionModel.find.mockReturnValue({ sort });
    subjectModel.find.mockResolvedValue([subject]);

    const req = {
      user: { usertype: 'TEACHER' },
      query: { subjects: subjectId, marks: '1,2' },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await questionService.getAllQuestions(req, res);

    expect(questionModel.find).toHaveBeenCalledWith(
      { status: true, subject: { $in: [subjectId] }, marks: { $in: [1, 2] } },
      { _id: 1, body: 1, status: 1, subject: 1, marks: 1 }
    );
    expect(subjectModel.find).toHaveBeenCalledWith(
      { _id: { $in: [subjectId] } },
      { name: 1 }
    );
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      list: [
        {
          _id: question._id,
          body: question.body,
          status: true,
          subjectId,
          subjectName: 'Java',
          marks: 2,
        },
      ],
    });
  });
});
