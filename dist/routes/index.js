"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pageController_1 = require("../controller/pageController");
const router = express_1.default.Router();
router.get('/', pageController_1.dashboard);
router.get('/login', pageController_1.showLogin);
router.get('/register', pageController_1.showRegister);
router.get('/update/:id', pageController_1.updateNote);
// router.post('/delete', deleteNote)
exports.default = router;
