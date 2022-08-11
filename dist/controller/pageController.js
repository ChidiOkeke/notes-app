"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNote = exports.showRegister = exports.showLogin = exports.dashboard = void 0;
const note_1 = require("../model/note");
const user_1 = require("../model/user");
const utils_1 = require("../utils/utils");
async function dashboard(req, res, next) {
    try {
        const user = req.session.user;
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await NoteInstance.findAll({where: {},limit, offset})
        const record = await note_1.NoteInstance.findAndCountAll({
            where: { userId: user?.id },
            limit, offset,
            order: [
                ['updatedAt', 'DESC']
            ],
            include: [{
                    model: user_1.UserInstance,
                    attributes: ['id', 'firstname', 'lastname', 'email', 'phonenumber'],
                    as: 'user'
                }
            ]
        });
        if (record.count === 0) {
            req.session.message = `${user?.firstname} has no notes. Add a note.`;
            res.render('index', { notes: record.rows, message: req.session.message });
            delete req.session.message;
        }
        else {
            // req.session.message = "";
            res.render('index', { notes: record.rows, message: req.session.message });
        }
    }
    catch (error) {
        res.redirect('/login');
        // res.status(500).json({
        //     msg: "failed to read",
        //     route: "/read"
        // });
    }
}
exports.dashboard = dashboard;
// export function showIndex(req: Request, res: Response,next: NextFunction) {
//         res.render('index', { title: 'Express' });
// }
function showLogin(req, res, next) {
    res.render('login', { title: 'Login' });
}
exports.showLogin = showLogin;
function showRegister(req, res, next) {
    res.render('register', { title: 'Register' });
}
exports.showRegister = showRegister;
async function updateNote(req, res, next) {
    try {
        const { id } = req.params;
        const { title, status } = req.body;
        const validationResult = utils_1.updateNoteSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await note_1.NoteInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing todo",
            });
        }
        res.render('update', { formcontent: record, noteid: id });
    }
    catch (error) {
        res.redirect('/login');
        // res.status(500).json({
        //     msg: "failed to read",
        //     route: "/read"
        // });
    }
}
exports.updateNote = updateNote;
