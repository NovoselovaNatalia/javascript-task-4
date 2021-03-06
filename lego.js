'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var priorityFunctions = ['filterIn', 'sortBy', 'select', 'limit', 'format'];

function getCopyCollection(collection) {
    return collection.slice();
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var copyCollection = getCopyCollection(collection);
    var functions = [].slice.call(arguments, 1);
    functions.sort(function (a, b) {
        return priorityFunctions.indexOf(a.name) - priorityFunctions.indexOf(b.name);
    })
    .forEach (function (query) {
        copyCollection = query(copyCollection);
    });

    return copyCollection;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */

exports.select = function () {
    var fieldsCollection = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (element) {
            return fieldsCollection.reduce(function (newCollection, field) {
                if (element.hasOwnProperty(field)) {
                    newCollection[field] = element[field];
                }

                return newCollection;
            }, {});
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (note) {
            return values.indexOf(note[property]) >= 0;
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        var copyCollection = getCopyCollection(collection);

        return copyCollection.sort(function (first, second) {
            var result = order === 'asc' ? 1 : -1;
            if (first[property] > second[property]) {
                return result;
            }
            if (first[property] > second[property]) {
                return -result;
            }

            return 0;
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.slice().map(function (element) {
            element[property] = formatter(element[property]);

            return element;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    return function limit(collection) {
        return collection.slice(0, count);
    };
};
