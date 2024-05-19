const {Type} = require('../migrations/20240513065044_user_table');
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req,res,next){
        try{
            //ввод данных и запрос на создание ячейки
            const {name} = req.body;
            const type = await Type.create({name});

                 return res.json(type);
        }catch(e){
            next(ApiError.badRequest('Ошибка при создании типа'))
        }
    }
    //получени типов - для вывода в хедер и постранично
    async getAll(req,res,next){
        try {
            const types = await Type.findAll();
             return res.json(types);
        } catch (error) {
            next(ApiError.badRequest('Ошибка при получении типов'))
            
        }
    }
    //получение одного типа для динамического роутинга и заголовков
    async getOneType(req,res,next){
          try {
            const {name} = req.params;
            //ввод информации и поиск
            const type = await Type.findOne(
                {
                    where:{name},
                }
            )
                return res.json(type);
        
          } catch (error) {
            return next(ApiError.badRequest('Ошибка при получении типа'))

          }
    }

}

module.exports = new TypeController();