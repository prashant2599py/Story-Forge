import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from "@plodhi/medium-common";
import { setCookie }  from 'hono/cookie'

export const userRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string;
        JWT_SECRET : string;
    }
}>();

userRouter.post('/signup', async (c) => {  
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    if(!success){
      c.status(411);
      return c.json({
        message : "Inputs are not correct"
      })
    }


    try{
      const user = await prisma.user.create({
        data : {
          name : body.name,
          username : body.username,
          password :body.password
        }
      })
      const jwt = await sign({
        id : user.id
      }, c.env.JWT_SECRET)

      return setCookie(c, 'token', jwt);

    }catch(err){
      console.log(err);
      
      c.status(411);
      return c.text('User already exists with this email');
    }  
})


userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);

  if(!success){
    c.status(411);
    return c.json({
      message : "Credentials are not correct"
    })
  }

    try{
      const user = await prisma.user.findFirst({
        where : {
          username : body.username,
          password :body.password
        }
      })

      if(!user){
        c.status(403);
        return c.json({
          message : "Incorrect credentials"
        });
      }

      const jwt = await sign({
        id : user.id
      }, c.env.JWT_SECRET)

      return setCookie(c,'token', jwt);

    }catch(err){
      console.error("Error during signin:", err);
      c.status(500)
      return c.text('Internal Server Error');
      
      // c.status(411);
      // return c.text('User already exists with this email');
    } 
})
//   userRouter.post('/auth0-signin', async (c) => {
//     const body = await c.req.json();
//     const auth0User = body.auth0User;
//     console.log(auth0User);

//     if(!auth0User  || !auth0User.sub || !auth0User.email){
//       c.status(400);
//       return c.json({
//         message : "Invalid auth0 user"
//       })
//     }

//     try{
//       let user = await prisma.user.findUnique({
//         where : {auth0ID : auth0User.sub},
//       });


//       if (!user) {
//         // If user doesn't exist, create a new one
//         user = await prisma.user.create({
//           data: {
//             name: auth0User.name,
//             username: auth0User.email, 
//             auth0ID: auth0User.sub,    
//           },
//         });
//       }
//       // console.log(user);

//       // Generate JWT for user
//       const jwt = await sign({
//         id : user.id,
//         email : user.username,
//       }, c.env.JWT_SECRET);

//       // console.log(jwt);

//       return c.text(jwt);
//     } catch(error){
//       console.log(error);
//       c.status(500);
//       return c.text("Error during authentication");
//     }
// });