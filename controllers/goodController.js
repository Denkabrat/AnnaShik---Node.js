const uuid = require('uuid');
const path = require('path');
const {Good} = require('../migrations/20240513065044_user_table');
const ApiError = require('../error/ApiError');


class GoodController {
  //добавление товара - функция для админки
  async create(req, res, next) {
    try {
      // Добавление данных для создания карточки товара
      const {
        name,
        price,
        typeId,
        description
      } = req.body;
      const {
        img
      } = req.files;
      //Картинки будут сохраняться в массив
      let allImages = [];

      if (img instanceof Array) {
        // Если img - это массив файлов, например, при загрузке нескольких файлов
        allImages = await Promise.all(
          img.map(async (item) => {
            const fileName = uuid.v4() + '.jpg';
            item.mv(path.resolve(__dirname, '..', 'static', fileName));
            return fileName;
          })
        );
      } else {
        // Если img - это один файл
        const fileName = uuid.v4() + '.jpg';
        img.mv(path.resolve(__dirname, '..', 'static', fileName));
        allImages.push(fileName);
      }

      // Создание карточки
      const good = await Good.create({
        name,
        price,
        img: allImages,
        description,
        typeId
      });

      return res.json(good);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  //получение всех товаров
  async getAll(req, res, next) {
    try {
      //простая логика получение по typeId
      let {
        typeId,
        limit,
        page
      } = req.query;

      page = page || 1;
      limit = limit || 9;
      let offset = page * limit - limit;

      let goods;

      if (!typeId) {
        goods = await Good.findAndCountAll({limit,offset});
      } else {
        goods = await Good.findAndCountAll({
          where: {
            typeId,
          },
          limit,
          offset
        });
      }

      return res.json(goods);
    } catch (error) {
      return next(ApiError.badRequest('Ошибка получения'));
    }
  }
  //получение одного товара для роутинга
  async getOneGood(req, res, next) {
    try {
      const {
        id
      } = req.params;

      const good = await Good.findOne({
        where: {
          id
        },
      });

      if (!good) {
        return next(ApiError.badRequest('Ресурс не найден'));
      }

      return res.json(good);

    } catch (error) {
      return next(ApiError.internal('Ошибка'));
    }
  }
}

module.exports = new GoodController();