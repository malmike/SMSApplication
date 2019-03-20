import { expect } from 'chai';
import agent from './setup_tests';
import { UserModel } from '../models/user.model';

describe('UserAuthentication', function () {
  const testUser = {name: 'Mal Mike', phone_number: '0784435088'}
  beforeEach(async ()=> {
    const user = new UserModel(testUser);
    await user.save();
  })

  it('user sign up', (done) => {
    const userPost = testUser;
    agent.post('/registerUser')
      .send(userPost)
      .expect(201)
      .end((err, response) => {
        expect(response.body).to.have.property('_id');
        done();
      })
  });

  it('get users', (done) => {
    agent.get('/getUser')
      .expect(200)
      .end((err, response) => {
        expect(response.body.length).to.equal(1);
        done()
      })
  })

  afterEach(async ()=>{
    await UserModel.deleteMany({}, ()=> {});
  })
});