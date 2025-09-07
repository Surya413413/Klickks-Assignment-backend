const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const jwt = require("jsonwebtoken")
const app = express()
app.use(express.json())
app.use(cors());

const dbpath = path.join(__dirname,"klickks.db")

let db = null;

// initialization db and connection port
const initialization = async () => {
    try{
        db= await open({
            filename:dbpath,
            driver:sqlite3.Database
        })
        app.listen(3000,()=> {
            console.log("server running on 3000 port")
        })
    }catch(error){
        console.log(`error occur in db: ${error.message}`)
        process.exit(1)
    }
}
initialization()


// register 
app.post("/register", async (request,response)=> {
    const {name,email,password} = request.body
    const hashedPassword = await bcrypt.hash(password,10)
    const userQuery = `
    SELECT * FROM usertable WHERE email = ?`;
    const dbUser = await db.get(userQuery,[email])
    if (dbUser === undefined){
        //create user in userdetails
        const createUser = `
         INSERT INTO usertable (name,email,password) VALUES (?,?,?)
        `;
        await db.run(createUser,[name,email,hashedPassword])
        response.status(201).json({message: "user created sucessfully"})
    }
    else{
        response.status(400)
        response.send("Email Id is already Registered")
    }
})




// login user
app.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const userEmailQurey = `SELECT * FROM usertable WHERE email = ?;`;
  const dbUser = await db.get(userEmailQurey, [email]);

  if (!dbUser) {
    return response.status(400).json({ error_msg: "Invalid user Login" });
  }

  const ispasswordMatch = await bcrypt.compare(password, dbUser.password);
  if (ispasswordMatch) {
    const payload = { id: dbUser.id };
    const jwtToken = jwt.sign(payload, "klickks123", { expiresIn: "1h" });
    return response.json({ token: jwtToken });
  } else {
    return response.status(400).json({ error_msg: "Invalid Password" });
  }
});

//middleWare
const actunticationjwtToken = (request,response,next) => {
    let jwtToken;
    const autherHeader = request.headers["authorization"]
    if(autherHeader !== undefined){
       jwtToken=  autherHeader.split(" ")[1];
    }
    if(jwtToken === undefined){
        return response.status(401).send("user Unathorized");
    }else{
        jwt.verify(jwtToken,"klickks123", async (error,payload)=> {
            if (error){
                return response.status(401).send("Invalid access token")
            }else{
                console.log("playload:",payload)
                if(!payload || !payload.id){
                    response.status(401).send("User id Missing")
                }
                // request.userId = playload.id
                request.userId = payload.id;
                console.log("user id:",request.userId)
                next()
            }
        })
    }
}


// profile route
app.get("/profile", actunticationjwtToken, async (req, res) => {
  try {
    const user = await db.get(
      `SELECT id, name, email FROM usertable WHERE id = ?`,
      [req.userId]
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email
      

    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});





module.exports = app

