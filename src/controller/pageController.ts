import { Request, Response, NextFunction } from "express";
import { NoteInstance } from "../model/note";
import { UserInstance } from "../model/user";
import { createNoteSchema, options, updateNoteSchema } from "../utils/utils";



export async function dashboard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = req.session.user;
        const limit = req.query?.limit as number | undefined;
        const offset = req.query?.offset as number | undefined;
        //  const record = await NoteInstance.findAll({where: {},limit, offset})
        const record = await NoteInstance.findAndCountAll({
            where: { userId: user?.id },
            limit, offset,
            order: [
                ['updatedAt', 'DESC']
            ],
            include: [{
                model: UserInstance,
                attributes: ['id', 'firstname', 'lastname', 'email', 'phonenumber'],
                as: 'user'
            }
            ]
        });


        if (record.count === 0) {
            req.session.message = `${user?.firstname} has no notes. Add a note.`;
            res.render('index', { notes: record.rows, message: req.session.message })
            delete req.session.message;
        } else {
            // req.session.message = "";
            res.render('index', { notes: record.rows, message: req.session.message })
        }

       

    } catch (error) {


        res.redirect('/login');

        // res.status(500).json({
        //     msg: "failed to read",
        //     route: "/read"
        // });
    }
}

// export function showIndex(req: Request, res: Response,next: NextFunction) {


//         res.render('index', { title: 'Express' });

// }

export function showLogin(req: Request, res: Response, next: NextFunction) {

    res.render('login', { title: 'Login' });

}

export function showRegister(req: Request, res: Response, next: NextFunction) {

    res.render('register', { title: 'Register' });

}

export async function updateNote(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.params;
        const { title, status } = req.body;
        const validationResult = updateNoteSchema.validate(req.body, options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }

        const record = await NoteInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing todo",
            });
        }

        
        res.render('update', { formcontent: record , noteid: id})
     
        



    } catch (error) {


        res.redirect('/login');

        // res.status(500).json({
        //     msg: "failed to read",
        //     route: "/read"
        // });
    }
}

