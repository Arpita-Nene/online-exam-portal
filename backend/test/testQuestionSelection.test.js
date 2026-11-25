const mongoose = require('mongoose');
const { buildTestQuestionSelection } = require('../services/test');

const createQuestion = (subject, marks, status = true) => ({
  _id: new mongoose.Types.ObjectId(),
  subject,
  marks,
  status,
});

describe('buildTestQuestionSelection', () => {
  test('preserves selected order and calculates test metadata from database questions', () => {
    const javaSubject = new mongoose.Types.ObjectId();
    const webSubject = new mongoose.Types.ObjectId();
    const first = createQuestion(javaSubject, 1);
    const second = createQuestion(webSubject, 2);

    const selection = buildTestQuestionSelection(
      [second._id, first._id],
      [first, second]
    );

    expect(selection.questionIds).toEqual([second._id, first._id]);
    expect(selection.subjects).toEqual([
      webSubject.toString(),
      javaSubject.toString(),
    ]);
    expect(selection.queTypes).toEqual([2, 1]);
    expect(selection.maxmarks).toBe(3);
  });

  test('rejects empty or duplicate question selections', () => {
    const question = createQuestion(new mongoose.Types.ObjectId(), 1);

    expect(buildTestQuestionSelection([], [question]).error).toMatch(/select/i);
    expect(
      buildTestQuestionSelection(
        [question._id, question._id],
        [question]
      ).error
    ).toMatch(/more than once/i);
  });

  test('rejects questions that are missing or inactive', () => {
    const active = createQuestion(new mongoose.Types.ObjectId(), 1);
    const inactive = createQuestion(new mongoose.Types.ObjectId(), 2, false);
    const missingId = new mongoose.Types.ObjectId();

    expect(
      buildTestQuestionSelection([missingId], [active]).error
    ).toMatch(/unavailable or inactive/i);
    expect(
      buildTestQuestionSelection([inactive._id], [inactive]).error
    ).toMatch(/unavailable or inactive/i);
  });
});
