import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  registerSchema,
  options,
  loginSchema,
  generateToken,
} from "../utils/utils";
import { UserInstance } from "../model/user";
import bcrypt from "bcryptjs";
import { NoteInstance } from "../model/note";

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any },
    loggedIn: boolean,
    authorization: unknown,
    message: string,
    error: string,
    messageType: string;
  }
}

export async function RegisterUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
  try {
    const validationResult = registerSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const duplicatEmail = await UserInstance.findOne({
      where: { email: req.body.email },
    });

    if (duplicatEmail) {
      return res.status(409).json({
        msg: "Email is taken, please change email",
      });
    }

    const duplicatePhone = await UserInstance.findOne({
      where: { phonenumber: req.body.phonenumber },
    });

    if (duplicatePhone) {
      return res.status(409).json({
        msg: "Phone number is taken",
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);

    const record = await UserInstance.create({
      id: id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      password: passwordHash,
    });


    req.session.message = `Successfully registered... Login`;
    req.session.messageType = "success"
    res.render('register', { message: req.session.message })
    delete req.session.message;
    delete req.session.messageType;

    // res.status(201).json({
    //   msg: "You have successfully created a user",
    //   record,
    // });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: "failed to register",
      route: "/register",
    });
  }
}

export async function LoginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
  try {
    const validationResult = loginSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const User = (await UserInstance.findOne({
      where: { email: req.body.email },
    })) as unknown as { [key: string]: string };

    const { id } = User;
    const token = generateToken({ id });
    const validUser = await bcrypt.compare(req.body.password, User.password);

    if (!validUser) {
      res.status(401).json({
        message: "Password do not match",
      });
    }

    if (validUser) {


      req.session.user = User
      req.session.loggedIn = true
      req.session.authorization = token;

      res.redirect('/');
      // res.status(200).json({
      //   message: "Successfully logged in",
      //   session: req.session,
      //   token,
      //   User
      // });
    }
  } catch (err) {
    res.status(500).json({
      msg: "failed to login",
      route: "/login",
    });
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    //  const record = await TodoInstance.findAll({where: {},limit, offset})
    const record = await UserInstance.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: NoteInstance,
          as: "note",
        },
      ],
    });
    // res.render('login', {title: record.count})
    res.status(200).json({
      msg: "You have successfully fetched all users and notes",
      count: record.count,
      record: record.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "failed to read",
      route: "/read",
    });
  }
}
