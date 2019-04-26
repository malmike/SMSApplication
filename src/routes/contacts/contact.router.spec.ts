import { expect } from 'chai';
import agent from '../../tests/setup_tests';
import { UserModel } from '../../models/user.model';
import { SharedTestProperties } from '../../tests/shared_test_properties';

describe('ContactRoutes', function () {
  let token = '';
  let mockContactData = {
    contact_name: "Unknown",
    contact_phone_number: "0794243073"
  }

  describe('addContact', ()=> {
    describe('add contact when contact does not exist as a user', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        token = await SharedTestProperties.addTestUser();
      })
      it('should not add user', (done)=> {
        agent.post('/addContact')
        .send(mockContactData)
        .set('x-access-token', token)
        .expect(400)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.message).to.equal('No user exists with this phone number');
          done();
        })
      })
    });

    describe('add contact that does not contain existing connection', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        token = await SharedTestProperties.addTestUser();
        await SharedTestProperties.addTestContact();
      })
      it('should add contact with existing message thread', (done) => {
        agent.post('/addContact')
        .send(mockContactData)
        .set('x-access-token', token)
        .expect(201)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.message_thread).to.not.equal('thisshouldwork');
          expect(response.body.message_thread).to.not.equal('');
          done();
        })
      })
    })

    describe('add contact that contains existing connection', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        token = await SharedTestProperties.addTestUser();
        await SharedTestProperties.addTestExistingConnection();
      })
      it('should add contact with existing message thread', (done) => {
        agent.post('/addContact')
        .send(mockContactData)
        .set('x-access-token', token)
        .expect(201)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.message_thread).to.equal('thisshouldwork');
          done();
        })
      })
    })

    describe('add existing contact', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, ()=> {});
        token = await SharedTestProperties.addTestUserWithContact();
      })
      it('should not add contact if it already exists', (done) => {
        agent.post('/addContact')
          .send(mockContactData)
          .set('x-access-token', token)
          .expect(400)
          .end((err, response) => {
            expect(err).to.be.null;
            expect(response.body.message).to.equal('Contact already exist for this user');
            done();
          })
      });
    })
  })

  describe('getContacts', () => {
    beforeEach(async ()=>{
      await UserModel.deleteMany({}, ()=> {});
      token = await SharedTestProperties.addTestUserWithContact();
    })
    it('should return the contacts', (done) => {
      agent.get('/getContacts')
        .set('x-access-token', token)
        .expect(200)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.length).to.equal(1);
          done();
        })
    });
  })

  describe('deleteContact', () => {
    describe('delete contact when it is not part of the contact list', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        token = await SharedTestProperties.addTestUser();
      })
      it('should not be able to delete contact', (done)=> {
        agent.delete('/deleteContact/0794243072')
        .set('x-access-token', token)
        .expect(400)
        .end((err, response) => {
          expect(err).to.be.null;
          expect(response.body.message).to.equal('The number 0794243072 does not exist in your contacts');
          done();
        })
      })
    });

    describe('delete contact when it is part of the contact list', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        token = await SharedTestProperties.addTestUserWithContact();
      })
      it('should not be able to delete contact', (done)=> {
        agent.delete('/deleteContact/0794243073')
        .set('x-access-token', token)
        .expect(204, done)
      })
    });
  })
});