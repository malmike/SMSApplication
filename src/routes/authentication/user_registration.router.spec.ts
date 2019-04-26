import { expect } from 'chai';
import agent from '../../tests/setup_tests';
import { UserModel } from '../../models/user.model';
import { SharedTestProperties } from '../../tests/shared_test_properties';

describe('UserRegistrationRoutes', function () {
  beforeEach(async ()=>{
    await UserModel.deleteMany({}, ()=> {});
  })

  describe('user sign up', ()=> {
    it('should sign up new user', (done) => {
      const userPost = SharedTestProperties.testUser;
      agent.post('/registerUser')
        .send(userPost)
        .expect(201)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.user).to.have.property('_id');
          expect(response.body).to.have.property('token');
          done();
        })
    });
  })

  describe('user sign in', () => {
    let token = '';
    beforeEach(async ()=> {
      token = await SharedTestProperties.addTestUser();
    })

    it('should sign existing user', (done) => {
      const userPost = SharedTestProperties.testUser;
      agent.post('/registerUser')
        .send(userPost)
        .expect(201)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body).to.have.property('token');
          done();
        })
    });

    it('should get signed in user get user', (done) => {
      agent.get('/getUser')
        .set('x-access-token', token)
        .expect(200)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.phone_number).to.equal('0784435088');
          done()
        })
    })
  })
});