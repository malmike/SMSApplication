# SMSApplication

[![CircleCI](https://circleci.com/gh/malmike/SMSApplication.svg?style=svg)](https://circleci.com/gh/malmike/SMSApplication)
[![Maintainability](https://api.codeclimate.com/v1/badges/fcb2d0ac168ba2dadf5c/maintainability)](https://codeclimate.com/github/malmike/SMSApplication/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/fcb2d0ac168ba2dadf5c/test_coverage)](https://codeclimate.com/github/malmike/SMSApplication/test_coverage)


SMS Application is an API that allows for the sending and receiving of messages. It is built using NodeJS, express, mongodb and typescript.

## Requirements
In order to run this project locally you would need to have:
- [Node](https://nodejs.org/en/) (Best to install v10.4.0). You can use [NVM](https://github.com/nvm-sh/nvm) to install and manage node versions on your machine
- [MongoDB](https://www.mongodb.com/) (For this project I used a docker image of mongoDB.)
- [Docker](https://www.docker.com) (if you plan to setup mongoDB to run in a docker image)
- [Yarn](https://yarnpkg.com/) - After installing node install Yarn globally by running
```
npm -g install yarn
```

### Setting up MongoDB to run in docker
You can run a docker image of mongo DB using `docker run -p 27017:27017  mongo:3.4.20-jessie`
This command will download the specified mongo image if it does not exist locally and run the image. For this case am running the image `mongo:3.4.20-jessie` but you can get a list of mongo images [here](https://hub.docker.com/_/mongo). The `-p 27017:27017` specifies that the running image is being exposed on port `27017`


## Setup
1. Clone the repository
    ```
    git clone https://github.com/malmike/SMSApplication.git
    ```
2. Enter the directory and install the project dependencies
    ```
    cd SMSApplication
    yarn install
    ```
3. Rename sample.env to .env
    ```
    mv sample.env .env
    ```
4. Start mongodb service.
    - If you install mongodb locally run
      ```
      mongod
      ```
      If you require authentication
      ```
      sudo mongod
      ```
    - If you setup mongodb to run in docker then just ensure that the image is running
      ```
      docker container ls
      ```
      If the image is not running then run the command
      ```
      docker run -p 27017:27017  mongo:3.4.20-jessie
      ```
    Ensure that the .env file contains the value `DB_URI=mongodb://localhost:27017/smsapplication`
5. Starting the application
    ```
    yarn start-dev
    ```
    The development environment is setup to allow live reloading using [nodemon](https://nodemon.io/)
6. You can access the application in the browser
    ```
    http://localhost:1337
    ```
    The API uses swagger for documentation and this can be accessed at
    ```
    http://localhost:1337/api-docs/
    ```

## Testing
To execute the applications tests run
```
yarn test
```
To execute tests with coverage run
```
yarn test-coverage
```

## Endpoints
<table>
  <tr>
    <th>TYPE</th>
    <th>API ENDPOINT</th>
    <th>DESCRIPTION</th>
    <th>HEADERS</th>
    <th>PAYLOAD</th>
  </tr>
  <tr>
    <td>POST</td>
    <td>/registerUser</td>
    <td>Creates a user or signs in a existing user</td>
    <td>content-type: applicaton/json</td>
    <td>
      <pre>
      {
        "name": "string",
        "phone_number": "string
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/getUser</td>
    <td>Gets logged in user</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td><pre></pre></td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/addContact</td>
    <td>Adds a contact to signed in user</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td>
      <pre>
      {
        "contact_name": "string",
        "contact_phone_number": "string"
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/getContacts</td>
    <td>Gets all contacts for signed in user</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td><pre></pre></td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/deleteContact/{phone_number}</td>
    <td>Delete contact from signed in user</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td><pre></pre></td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/sendSms</td>
    <td>Send sms from signed in user to contact</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td>
      <pre>
      {
        "receiver_phone_number": "string",
        "message": "string"
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/getSms/{phone_number}</td>
    <td>Get SMSs sent from contact to signed in user</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td><pre></pre></td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/updateStatus</td>
    <td>Update the read status of an SMS message thread</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td>
      <pre>
      {
        "message_thread": "string"
      }
      </pre>
    </td>
  </tr>
</table>
