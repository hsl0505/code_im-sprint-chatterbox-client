const puppeteer = require('puppeteer');
const { expect } = require('chai');
const global = {};
const path = require('path');

const opts = {
  headless: true,
  slowMo: 100,
  timeout: 20000,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

// expose variables
before(async function() {
  global.expect = expect;
  global.browser = await puppeteer.launch(opts);
  global.page = await global.browser.newPage();

  await global.page.goto(
    'file://' + path.dirname(__dirname) + '/SpecRunner.html'
  );
});

// close browser and reset global variables
after(async function() {
  await global.page.close();
  await global.browser.close();
});

describe('chatterbox client', async function() {
  before(async function() {
    var cases = await global.page.evaluate(() => {
      return Array.from(document.querySelectorAll('.test h2')).map(
        elT => elT.childNodes[0].nodeValue
      );
    });

    var passed = await global.page.evaluate(() => {
      return Array.from(document.querySelectorAll('.test')).map(elT =>
        elT.classList.contains('pass')
      );
    });

    var failed = await global.page.evaluate(() => {
      return Array.from(document.querySelectorAll('.test')).map(elT => {
        if (elT.classList.contains('fail')) {
          return elT.querySelector('pre.error').childNodes[0].nodeValue;
        } else {
          return null;
        }
      });
    });

    describe('here are some dynamic It() tests', function() {
      cases.forEach(function(test, i) {
        it(test, function() {
          expect(passed[i]).to.eql(true);
        });
      });
    });
  });

  describe('', async function() {
    it('무시하셔도 좋습니다.', async function() {});
  });
});
