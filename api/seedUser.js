// 사용자 생성
// 사용자 네트워크에 인롤

const db = require('./models')
const EnrollUser = require('./services/EnrollUser')

const users = [
  {
    email: 'user1@example.com',
    password: 'example!2#',
    nickname: 'user1',
    address: '서울시 강남구 논현동 ...',
    phone: '01000000000'
  },
  {
    email: 'user2@example.com',
    password: 'example!2#',
    nickname: 'user2',
    address: '서울시 강남구 논현동 ...',
    phone: '01000000000'
  },
  {
    email: 'user3@example.com',
    password: 'example!2#',
    nickname: 'user3',
    address: '서울시 강남구 논현동 ...',
    phone: '01000000000'
  },
  {
    email: 'user4@example.com',
    password: 'example!2#',
    nickname: 'user4',
    address: '서울시 강남구 논현동 ...',
    phone: '01000000000'
  },
  {
    email: 'user5@example.com',
    password: 'example!2#',
    nickname: 'user5',
    address: '서울시 강남구 논현동 ...',
    phone: '01000000000'
  },
]

users.forEach((user) => {
  let u;
  db.User.findOne({where: { email: user.email }}).
    then((response) => { 
      u = response 
    }).
    then((response) => {
      if ( u === null ) {
        db.User.create(user).then((response) => {
          console.log(response)
        })
      }
      const enrollUser = new EnrollUser({ email: u.email }, 'Org1')
      enrollUser.enroll().then((response) => { console.log(response)})
    })
  
})