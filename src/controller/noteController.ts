import { render } from "ejs";
import { Request, Response, NextFunction, response } from "express";
import { v4 as uuidv4 } from "uuid";
import { NoteInstance } from "../model/note";
import { UserInstance } from "../model/user";
import { createNoteSchema, options, updateNoteSchema } from "../utils/utils";
import { dashboard } from "./pageController";


export async function Notes(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
  // let note = {...req.body, id}
  try {
    const verified = req.user;
    const validationResult = createNoteSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const record = await NoteInstance.create({
      id,
      ...req.body,
      userId: verified.id,
    });


    req.session.message = "You have successfully created a note";
    req.session.messageType = "success"
    res.redirect('/')


    // res.status(201).json({
    //   msg: "You have successfully created a note",
    //   record,
    // });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "failed to create",
      route: "/create",
      error: error
    });
  }
}

export async function getAllNotes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    //  const record = await NoteInstance.findAll({where: {},limit, offset})
    const record = await NoteInstance.findAndCountAll({
      limit, offset,
      order: [
        ['updatedAt', 'DESC']
      ],
      include: [{
        model: UserInstance,

        attributes: ['id', 'firstname', 'lastname', 'email', 'phonenumber'],
        as: 'user'
      },
      ]
    });

    res.render('notes', { notes: record.rows })

  } catch (error) {
    res.status(500).json({
      msg: "failed to read",
      route: "/read"
    });
  }
}

export async function getNotes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // const user = req.session.user;
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    //  const record = await NoteInstance.findAll({where: {},limit, offset})
    const record = await NoteInstance.findAndCountAll({
      // where: { userId: user?.id},
      limit, offset,
      order: [
        ['updatedAt', 'DESC']
      ],
      include: [{
        model: UserInstance,
        attributes: ['id', 'firstname', 'lastname', 'email', 'phonenumber'],
        as: 'user'
      },
      ]
    });

    // console.log("count:"+record.count);

    if (record.count === 0) {
      req.session.message = "No notes found. Add a note";
      req.session.messageType = "success"
      res.render('notes', { notes: record.rows, message: req.session.message })
      delete req.session.message;
      delete req.session.messageType;
    } else {
      res.render('notes', { notes: record.rows, message: req.session.message })
    }



    // res.render('notes', { notes: record.rows })

    // res.status(200).json({
    //   // msg: "You have successfully fetch all notes",
    //   // count: record.count,
    //   // record: record.rows,
    //   userdata: user.id
    // });

    // res.json(record.rows);

  } catch (error) {
    res.status(500).json({
      msg: "failed to read",
      route: "/read"
    });
  }
}

export async function getSingleNote(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const record = await NoteInstance.findOne({ where: { id } });

    res.render('read', { note: record })

    // return res.status(200).json({
    //   msg: "Successfully gotten user information",
    //   record,
    // });
  } catch (error) {
    res.status(500).json({
      msg: "failed to read single note",
      route: "/read/:id",
    });
  }
}

export async function updateNotes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { title, status, description, DueDate } = req.body;
    const validationResult = updateNoteSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    const record = await NoteInstance.findOne({ where: { id } });
    if (!record) {
      return res.status(404).json({
        Error: "Cannot find existing note",
      });
    }
    const updatedrecord = await record.update({
      title: title,
      status: status,
      description: description,
      DueDate: DueDate
    });


    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    const user = req.session.user;
    const noteRecords = await NoteInstance.findAndCountAll({
      where: { userId: user?.id },
      limit, offset,
      order: [
        ['updatedAt', 'DESC']
      ],
      include: [{
        model: UserInstance,
        attributes: ['id', 'firstname', 'lastname', 'email', 'phonenumber'],
        as: 'user'
      },
      ]
    });
    req.session.message = 'Successfully updated a note';
    res.render('index', { notes: noteRecords.rows, message: req.session.message });
    delete req.session.message;

 

    // res.status(200).json({
    //   msg: "You have successfully updated your note",
    //   updatedrecord,
    // });
  } catch (error) {
    res.status(500).json({
      msg: "failed to update",
      route: "/update/:id",
    });
  }
}

export async function deleteNotes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const record = await NoteInstance.findOne({ where: { id } });

    if (!record) {

      req.session.message = 'No notes found. Add a note';
      res.render('index', { message: req.session.message });
      delete req.session.message;
    }

    const deletedRecord = await record?.destroy();

    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    const user = req.session.user;
    const noteRecords = await NoteInstance.findAndCountAll({
      where: { userId: user?.id },
      limit, offset,
      order: [
        ['updatedAt', 'DESC']
      ],
      include: [{
        model: UserInstance,
        attributes: ['id', 'firstname', 'lastname', 'email', 'phonenumber'],
        as: 'user'
      },
      ]
    });
    req.session.message = 'Successfully deleted';
    res.render('index', { notes: noteRecords.rows, message: req.session.message });
    delete req.session.message;

    // return res.status(200).json({
    //   msg: "Note deleted successfully",
    //   deletedRecord,
    // });
  } catch (error) {
    // res.status(500).json({
    //   msg: "failed to delete",
    //   route: "/delete/:id",
    //   error: error
    // });
  }
}
