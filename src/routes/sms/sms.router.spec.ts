import { expect } from 'chai';
import agent from '../../tests/setup_tests';
import { UserModel } from '../../models/user.model';
import { SharedTestProperties } from '../../tests/shared_test_properties';
import { SmsModel } from '../../models/sms.model';

describe('SmsRoutes', function () {
  let token = '';
  let mockSmsData = {
    receiver_phone_number : "0794243073",
    message : "This message should go through"
  }

  describe('sendSms', () => {
    describe('send sms to contact not part of the contact list', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        await SmsModel.deleteMany({}, ()=>{});
        token = await SharedTestProperties.addTestUser();
      })
      it('should not be able to send sms', (done)=> {
        agent.post('/sendSms')
          .send({
            receiver_phone_number : "0794243072",
            message : "This message should go through"
          })
          .set('x-access-token', token)
          .expect(400)
          .end((err, response) => {
            expect(err).to.be.null;
            expect(response.body.message).to.equal('The number 0794243072 does not exist in your contacts');
            done();
          })
      })
    });

    describe('send sms to contact in contact list', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        await SmsModel.deleteMany({}, ()=>{});
        token = await SharedTestProperties.addTestUserWithContact();
      })
      it('should send sms', (done)=> {
        agent.post('/sendSms')
          .send(mockSmsData)
          .set('x-access-token', token)
          .expect(201)
          .end((err, response) => {
            expect(err).to.be.null;
            expect(response.body).to.have.property('_id')
            expect(response.body.message_thread).to.equal('thisshouldwork')
            expect(response.body.readStatus).to.equal(false)
            done();
          })
      })
    });
  })

  describe('getSmsThread', () => {
    describe('get sms thread for contact not part of the contact list', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        await SmsModel.deleteMany({}, ()=>{});
        token = await SharedTestProperties.addTestUser();
      })
      it('should not be able to send sms', (done)=> {
        agent.get('/getSms/0784435088')
          .set('x-access-token', token)
          .expect(400)
          .end((err, response) => {
            expect(err).to.be.null;
            expect(response.body.message).to.equal('The number 0784435088 does not exist in your contacts');
            done();
          })
      })
    });

    describe('get sms message', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        await SmsModel.deleteMany({}, ()=>{});
        token = await SharedTestProperties.addTestUserWithSms();
      })
      it('should return all sms associated to the contact', (done)=> {
        agent.get('/getSms/0794243073')
          .set('x-access-token', token)
          .expect(200)
          .end((err, response) => {
            expect(err).to.be.null;
            expect(response.body.length).to.equal(1)
            done();
          })
      })
    });
  })

  describe('updateReadStatus', () => {
    describe('update sms read status', () => {
      beforeEach(async ()=>{
        await UserModel.deleteMany({}, () => {});
        await SmsModel.deleteMany({}, ()=>{});
        await SharedTestProperties.addTestUserWithSms();
        token = SharedTestProperties.testContactToken;
      })
      it('should return all sms associated to the contact', (done)=> {
        agent.put('/updateStatus')
          .send({
            message_thread: 'thisshouldwork'
          })
          .set('x-access-token', token)
          .expect(201)
          .end((err, response) => {
            expect(err).to.be.null;
            expect(response.body.message).to.equal("SMS status updated successfully")
            done();
          })
      })
    });
  })
});