# all the apis needed for dev tinder

- authRouter
- POST/signup
- POST/login
- POST/logout

- profileRouter
- GET/profile
- PATCH/profile/edit
- PATCH/profile/password

- connectionRequestRouter
- POST/request/sent/interested/:userID
- POST/request/sent/ignored/:userID
- POST/request/review/accepted/:requestID
- POST/request/review/rejected/:requestID

- coreApi
- GET /connections
- GET/request/received
- GET/feed
