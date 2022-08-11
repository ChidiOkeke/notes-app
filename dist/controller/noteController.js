"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotes = exports.updateNotes = exports.getSingleNote = exports.getNotes = exports.getAllNotes = exports.Notes = void 0;
const uuid_1 = require("uuid");
const note_1 = require("../model/note");
const user_1 = require("../model/user");
const utils_1 = require("../utils/utils");
async function Notes(req, res, next) {
    const id = (0, uuid_1.v4)();
    // let note = {...req.body, id}
    try {
        const verified = req.user;
        const validationResult = utils_1.createNoteSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await note_1.NoteInstance.create({
            id,
            ...req.body,
            userId: verified.id,
        });
        req.session.message = "You have successfully created a note";
        req.session.messageType = "success";
        res.redirect('/');
        // res.status(201).json({
        //   msg: "You have successfully created a note",
        //   record,
        // });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed to create",
            route: "/create",
            error: error
        });
    }
}
exports.Notes = Notes;
async function getAllNotes(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await NoteInstance.findAll({where: {},limit, offset})
        const record = await note_1.NoteInstance.findAndCountAll({
            limit, offset,
            order: [
                ['updatedAt', 'DESC']
            ],
            include: [{
                    model: user_1.UserInstance,
                    attributes: ['id', 'firstname', 'lastname', 'email', 'phonenumber'],
                    as: 'user'
                },
            ]
        });
        res.render('notes', { notes: record.rows });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read"
        });
    }
}
exports.getAllNotes = getAllNotes;
async function getNotes(req, res, next) {
    try {
        // const user = req.session.user;
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await NoteInstance.findAll({where: {},limit, offset})
        const record = await note_1.NoteInstance.findAndCountAll({
            // where: { userId: user?.id},
            limit, offset,
            order: [
                ['updatedAt', 'DESC']
            ],
            include: [{
                    model: user_1.UserInstance,
                    attributes: ['id', 'firstname', 'lastname', 'email', 'phonenumber'],
                    as: 'user'
                },
            ]
        });
        // console.log("count:"+record.count);
        if (record.count === 0) {
            req.session.message = "No notes found. Add a note";
            req.session.messageType = "success";
            res.render('notes', { notes: record.rows, message: req.session.message });
            delete req.session.message;
            delete req.session.messageType;
        }
        else {
            res.render('notes', { notes: record.rows, message: req.session.message });
        }
        // res.render('notes', { notes: record.rows })
        // res.status(200).json({
        //   // msg: "You have successfully fetch all notes",
        //   // count: record.count,
        //   // record: record.rows,
        //   userdata: user.id
        // });
        // res.json(record.rows);
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read"
        });
    }
}
exports.getNotes = getNotes;
async function getSingleNote(req, res, next) {
    try {
        const { id } = req.params;
        const record = await note_1.NoteInstance.findOne({ where: { id } });
        res.render('read', { note: record });
        // return res.status(200).json({
        //   msg: "Successfully gotten user information",
        //   record,
        // });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read single note",
            route: "/read/:id",
        });
    }
}
exports.getSingleNote = getSingleNote;
async function updateNotes(req, res, next) {
    try {
        const { id } = req.params;
        const { title, status, description, DueDate } = req.body;
        const validationResult = utils_1.updateNoteSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message,
            });
        }
        const record = await note_1.NoteInstance.findOne({ where: { id } });
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
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const user = req.session.user;
        const noteRecords = await note_1.NoteInstance.findAndCountAll({
            where: { userId: user?.id },
            limit, offset,
            order: [
                ['updatedAt', 'DESC']
            ],
            include: [{
                    model: user_1.UserInstance,
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
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to update",
            route: "/update/:id",
        });
    }
}
exports.updateNotes = updateNotes;
async function deleteNotes(req, res, next) {
    try {
        const { id } = req.params;
        const record = await note_1.NoteInstance.findOne({ where: { id } });
        if (!record) {
            req.session.message = 'No notes found. Add a note';
            res.render('index', { message: req.session.message });
            delete req.session.message;
        }
        const deletedRecord = await record?.destroy();
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const user = req.session.user;
        const noteRecords = await note_1.NoteInstance.findAndCountAll({
            where: { userId: user?.id },
            limit, offset,
            order: [
                ['updatedAt', 'DESC']
            ],
            include: [{
                    model: user_1.UserInstance,
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
    }
    catch (error) {
        // res.status(500).json({
        //   msg: "failed to delete",
        //   route: "/delete/:id",
        //   error: error
        // });
    }
}
exports.deleteNotes = deleteNotes;
