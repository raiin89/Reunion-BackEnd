const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const app = require ('../../app');
const sinon = require('sinon');
const event = require('../../models/events');
chai.use(chaiHttp);
chai.should();
chai.expect();


describe ('Testing events controller', () => {
    
    it('Should fetch approved events', (done) =>{
        chai.request(app)
        .get('/api/events/fetchapprovedevents')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');            
            done();
        });

    });

    it ('Should fetch event by id', (done) =>{
        
        chai.request(app)
        .get('/api/events/fetcheventbyid/5cffee59539c85221756a8ac')
        .end((err, res) => {
            
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
    });
});

    it ('Should add event', (done) => {
        eventToAdd = {
            
                "data": {
                    "location": {
                        "address": "Ternholm 3",
                        "zip": "6280",
                        "city": "Højer"
                    },
                    "arranger": {
                        "name": "Radwan Atassi",
                        "email": "rd.atassi@gmail.com",
                        "phone": ""
                    },
                    "timings": [
                        "2019-06-18T18:09:04.000Z",
                        "2019-06-21T18:09:04.000Z"
                    ],
                    "price": 0,
                    "links": [],
                    "images": [""],
                    "name": "this is from testing",
                    "description": "Nature ture i sønderborg",
                    "targetGroup": "Voksne",
                    "eventType": "Åbent",
                    "eventCatagory": "Natur",
                    "approvalStatus": "pending",
                    "rejectionReason": ""
                }
            }

              
                chai.request(app)
                .post('/api/events/addevent')
                .set('content-type', 'application/json')
                .send(eventToAdd.data)
                .end((err, res, body) => {

                 if (err) {
                done(err);
                  } else {
                done();
                  }
            res.should.have.status(200);
            res.should.have.a('object');
            
    });

});

        it ('Should delete an event', (done) =>{
            
            var eventId = {"eventId":"5cffee59539c85221756a8ac"}
            chai.request(app)
            .post('/api/events/deleteevent')
            .set('content-type', 'application/json')

            .send(eventId)
            .end((err, res, body) => {
    
                if (err) {
                    done(err);
                } else {
                    done();
                }
                res.should.have.status(200);
     });
                

           
});
});






