"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const noteController_1 = require("../controller/noteController");
router.post('/create', auth_1.auth, noteController_1.Notes);
router.post('/readall', noteController_1.getAllNotes);
router.get('/read', noteController_1.getNotes);
router.get('/read/:id', noteController_1.getSingleNote);
// router.patch('/update/:id', updateNotes)
router.post('/update/:id', auth_1.auth, noteController_1.updateNotes);
router.get('/delete/:id', auth_1.auth, noteController_1.deleteNotes);
exports.default = router;
