
 const request = require('supertest');
 const puppeteer = require('puppeteer');

// describe('Array', () => {
//   describe('#indexOf()', () => {
//     it('should return -1 when the value is not present', () => {
//       assert.equal(-1, [1,2,3].indexOf(4));
//     });
//   });
// });

describe('Testing on headless chrome', () => {
  it('should return true if it uses headless chrome', () => {
    const result = window.navigator.userAgent;
    result.includes('Chrome').should.be.equal(true);
  });
});

describe('Test projrct:', function () {
  let browser;
  let page;

  before(async function () {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  beforeEach(async function () {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  afterEach(async function () {
    await page.close();
  });

  after(async function () {
    await browser.close();
  });

  it('go to my homepage will be redirected', async function () {

    browser.get('/myhomepage');
    expect(browser.getCurrentUrl()).toContain('/login');
  });

  it('if username and password is correct, it shold redirect to /myhomepage', async function () {
    browser.get('/login');

    await page.type('#username', 'zbwn0527');
    await page.type('#password', 'pokemon123456');
    await page.click('#submit');

    expect(browser.getCurrentUrl()).toContain('/myhomepage');
  });

  it('after log in, click on add forum will go to /myhomepage/addForum', async function () {
    browser.get('/login');

    await page.type('#username', 'zbwn0527');
    await page.type('#password', 'pokemon123456');
    await page.click('#submit');
    browser.get('/myhomepage/addForum');
    expect(browser.getCurrentUrl()).toContain('/myhomepage/addForum');
  });
});
