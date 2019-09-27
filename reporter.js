const mocha = require('mocha');
const fs = require('fs');
require('colors');
module.exports = MyReporter;

function MyReporter(runner) {
  mocha.reporters.Base.call(this, runner);
  let passed = 0;
  let failed = 0;

  runner.on('pass', function(test) {
    const { title } = test;
    console.log('\n');
    console.log('----------------------------------------------'.green);
    console.log('통과 했어요 축하해요!!!!'.bgGreen.black);
    console.log(`테스트 이름: ${title}`.bgGreen.black);
    console.log('----------------------------------------------'.green);
    console.log('\n');
    passed++;
  });

  runner.on('fail', function(test) {
    const {
      title,
      err: { message, stack }
    } = test;
    console.log('----------------------------------------------'.red);
    console.log('실패했네요.. 분발해요! ㅠ.ㅠ'.bgRed.black);
    console.log(`테스트 이름: ${title}`.bgRed);
    console.log('\n');
    console.log('실패 메세지 : '.rainbow);
    console.log(
      `
    ${message}

    ${stack}`.bgRed
    );
    console.log('----------------------------------------------'.red);

    failed++;
  });

  runner.on('end', function() {
    const result = {
      passed,
      failed
    };
    console.log('-----------------------------');
    console.log(`* 통과 한 갯수 ${passed}개 *`.bgGreen);
    console.log('\n');
    console.log(`* 실패 한 갯수 ${failed}개 *`.bgRed);
    console.log('-----------------------------');
    if (!failed) {
      console.log(
        `
      **************************************
      **************************************
      ****축하합니다 모두 통과 했어요!!!!***
      **************************************
      **************************************
      `.rainbow
      );
    }
    fs.writeFileSync('result.json', JSON.stringify(result));
  });
}
