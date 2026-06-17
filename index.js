// user
// organisation
// board
// issue

// 1.Design your databse schema
// 2.Backend
//   a.design your all routes
//   b.implement your routes
//   c.protected middleware (protect the routes)
// 3.Tests for the backend 
// 4.frontend

const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { authMiddleware } = require("./middleware");
const app = express();
// IN MEMORY DATABASE 
const userlist = [{
    id: 1,
    username: 'raj',
    password: 'raj@2004'
},
{
    id: 2,
    username: 'ujjwal',
    password: 'ujjwal@2004'
},

]

const organizations = [
    {
        id: 1,
        name:"zomato frontend",
        title: '100xdev',
        description: 'learning coding',
        admin: 1,
        members: [2]
    },
    {
        id: 2,
        name:"zomato backend",
        title: 'personal',
        description: 'daily personal task',
        admin: 2,
        members: []
    }
]

const board = [
    {
        id: 1,
        title: '100x ev backend',
        organizations: 1
    },
    {
        id: 2,
        title: '100x ev forntend',
        organizations: 1
    },
    {
        id: 3,
        title: 'daily task',
        organizations: 2
    },
];

const issues = [
    {
        id: 1,
        titile: "add dark mode",
        board: 1,
        state: "In progress" //next //done// archived
    },
    {
        id: 2,
        title: "remove light mode",
        board: 1
    },
    {
        id: 3,
        title: 'going to gym',
        board: 2
    },
]
app.use(express.json());
app.use(cookieParser());
// CREATE APIS
app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const checkexist = userlist.find(user => user.username === username);
    if (checkexist) {
        res.status(403).json({
            message: "User is already Exist ! Please Signin"
        })
        return;
    }
    const id = userlist.length + 1;

    userlist.push({
        id,
        username,
        password
    })
    res.json({
        mnessage: "User Signup successfully!",
        userlist
    })
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // check user signup or not 
    const checkuser = userlist.find(user => user.username === username && user.password === password);
    // console.log("current user", checkuser);
    if (!checkuser) {
        res.status(403).json({
            message: "Incorrect Credentials! Please Signup!"
        })
    }

    // token
    const token = jwt.sign({
        // username: username
        id: checkuser.id
    }, "raj@2004");

    res.cookie("cookiesToken", token);
    res.json({
        message: "user signin successfully",
        userlist
    });
})

app.post("/organization", authMiddleware, (req, res) => {
    const orgName = req.body.orgName;
    const orgDescription = req.body.orgDescription;
    const orgTitle = req.body.orgTitle;
    const adminid = req.id;

    
    // console.log('checkuser', checkuser);
    const id = organizations.length + 1;
    organizations.push({
        id: id,
        name:orgName,
        title: orgTitle,
        description: orgDescription,
        admin: adminid,
        members: []
    })
    res.json({
        message: "Organization creted successfully",
        organizations
    })
})

//same use at the time of delete member
app.post("/add-member-to-organization", authMiddleware, (req, res) => {
    const username = req.body.username;
    const adminid = req.id;
    const organizationid = parseInt(req.query.organizationid);

    const checkuser = userlist.find(user => user.username === username);
    if (!checkuser) {
        res.status(403).json({
            message: "This user not exist!"
        });
        return;
    }

    // check organization is exist and you are admin to send the request to member  ?
    // console.log(organizations)
    const checkorganization = organizations.find(org => org.id == organizationid);
    // console.log("admin id",adminid);
    console.log("orgnization",checkorganization)
    if (!checkorganization || checkorganization.admin !== adminid) {
        res.status(403).json({
            message: "Organization not exist ! or you are not admin of that organization "
        })
        return;
    }
    const check_user_already_exist = checkorganization.members.find(i => i === checkuser.id);
    if (check_user_already_exist) {
        res.status(403).json({
            message: "User already having access"
        });
        return;
    }
    checkorganization.members.push(checkuser.id);

    res.send({
        message: "Access Request send",
        checkorganization
    })

})

app.listen(4000);
