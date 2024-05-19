const ApiError = require('../error/ApiError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../migrations/20240513065044_user_table');
const {sendEmail} = require('./emailService');

//функция по генерации токена
const generateJwt = (id, email, name) => {

    return jwt.sign({
            id,
            email,
            name
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.EXPIRE_JWT
        });
}


class UserController {
    //регистрация
    async registration(req, res, next) {

        const {name,email,password} = req.body;
        //условие на проверку данных и вывод ошибки
        if (!name || !email || !password) {
            return next(ApiError.badRequest('Некоректный E-mail или Пароль'))
        }
        //проверка существует ли пользователь или нет
        const candidate = await User.findOne({
            where: {
                email
            }
        });
        //выброс ошибки
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким E-mail уже существует'))
        }
        //хеширование пароля пользователя
        const hashPassword = await bcrypt.hash(password, 5);

        if (hashPassword) {
            const user = await User.create({
                email,
                password: hashPassword,
                name: name
            });
            //генерация токена с данными пользователя
            const token = generateJwt(user.id, user.email, user.name);
            //тут указать текст письма и заголовок
            await sendEmail(email, 'Регистрация', 'Вы успешно зарегистрированы!');

            return res.json(token);

        } else {
            return next(ApiError.badRequest('Ошибка регистрации'))
        }

    }
    //авторизация
    async login(req, res, next) {
        try {
            const {email,password} = req.body;
            const user = await User.findOne({where:{email}});
    
            if(!user){
                return next(ApiError.internal('Пользователь не найден'));
            }
            //ввод и проверка пароля
            let comparePassword = bcrypt.compareSync(password,user.password);
    
    
            if(!comparePassword){
                return next(ApiError.internal('Неверный пароль'));
            }
            //генерация токена пользователя
            const token = generateJwt(user.id, user.email, user.roles);
                 //тут указать текст письма и заголовок
                await sendEmail(email, 'Вход в аккаунт', 'Вы успешно авторизовались !');
            
                return res.json({token});
    
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Не удалось зарегистрировать пользователя'));
        }

    }
    //проверка авторизации
    async checkAuthorization(req, res, next) {

        const token = generateJwt(req.user.id, req.user.email);

        return res.json(token);

    }
    //поиск по почте
    async findByEmail(req, res, next) {
        const { email } = req.body;
        
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
            return res.json(user);
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Ошибка поиска пользователя'));
        }
    }
    // Обновление данных пользователя
    async update(req, res, next) {
        const userId = req.user.id; 
        const { name, email, password } = req.body;
    
        try {
            // Поиск пользователя по id
            const user = await User.findOne({ where: { id: userId } });
    
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
            // Хеширование пароля, если он предоставлен
            let updatedFields = { name, email };
            if (password) {
                const hashPassword = await bcrypt.hash(password, 5);
                updatedFields.password = hashPassword;
            }
            // Обновление пользователя
            await user.update(updatedFields);
    
            return res.json(user);
        } catch (error) {
            console.error(error);
            return next(ApiError.internal('Ошибка обновления пользователя'));
        }
    }
}

module.exports = new UserController();