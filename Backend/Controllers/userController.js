const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cons = require("../cons");
const logger = require("../logger/logger");

const generateSalt = async () => {
    return await bcrypt.genSalt(10);
};

const hashPassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};

const createToken = (userid, secret, expiresIn = "1h") => {
    return jwt.sign({ userid }, secret, { expiresIn });
};

const signup = async (req, res) => {
    try {
        const { email, password } = req?.body;
        const salt = await generateSalt();
        const hashedPassword = await hashPassword(password, salt);
        const user = new User({
            email,
            password: hashedPassword,
            salt,
        });
        await user.save();
        logger.info("User Created");
        res.status(cons.created).json({ message: "User Created" });
    } catch (err) {
        if (err.code === cons.mongoerror) {
            logger.error(cons.userexists);
            return res.status(cons.conflict).json({ error: cons.userexists });
        }
        clogger.error(err.message);
        res.status(cons.internalerror).json({ error: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            logger.error(cons.nouser);
            return res.status(cons.notfound).json({ error: cons.nouser });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const token = createToken(user._id, process.env.JWT_SECRET);
            logger.info(cons.success);
            res.status(cons.ok).json({ message: cons.success, token });
        } else {
            logger.error(cons.wrongpass);
            res.status(cons.unauthorized).json({ error: cons.wrongpass });
        }
    } catch (err) {
        logger.error(cons.invalidLogin);
        res.status(cons.unauthorized).json({ error: cons.invalidLogin });
    }
};

module.exports = { signup, login };
