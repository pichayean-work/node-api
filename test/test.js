const expect = require("chai").expect;
const request = require("request");
const config = require("./../src/config");
const BASE_URL = config.app.root_path;
describe('Status and content', function () {
    describe('api/v1/users', function () {
        it('Default', function (done) {
            request(BASE_URL, function (error, response, body) {
                expect(body).to.equal('Hello World');
                done();
            });
        });
        it('Get Users', function (done) {
            request(BASE_URL + '/api/v1/users', function (error, response, body) {
                expect(error).to.be.null;
                expect(response.statusCode).to.equal(200);
                expect(response.body).to.not.be.empty;
                done();
            });
        });
        it('Create Users', function (done) {
            request.post({ url: BASE_URL + '/api/v1/users', form: { username: (+new Date).toString(36).slice(-5), password:'1234' } }, 
            function (err, response, body) { 
                expect(response.statusCode).to.equal(201);
                done();
            });
        });
    });

    describe('api/v1/accounts', function () {
        it('Get Account', function (done) {
            request(BASE_URL + '/api/v1/accounts', function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

    });
});