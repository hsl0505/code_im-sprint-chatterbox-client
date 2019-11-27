const studentData = require('../student.json');
var chai = require('chai');
var expect = chai.expect;

describe('student', () => {
  it('put correct name on student.json', () => {
    const rawName = '성함을 입력 해주세요';
    expect(studentData.student).not.to.equal(rawName);
  });

  it('put correct class on student.json', () => {
    const rawClass = '기수를 입력 해주세요 ex) 15';
    expect(studentData.theClass).not.to.equal(rawClass);
  });
});
