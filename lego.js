'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var PRIORITET = ['filterIn', 'sortBy', 'select', 'limit', 'format'];

function copyCollection(array) {
    return array.map(function (element) {
        return Object.assign({}, element);
    });
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var copy = copyCollection(collection);
    var func = [].slice.call(arguments, 1);
    func.sort(function (a, b) {
        return PRIORITET.indexOf(a.name) - PRIORITET.indexOf(b.name);
    });
    for (var i = 1; i < func.length; i++) {
        copy = func[i](copy);
    }

    return copy;
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
        var newCollection = copyCollection(collection);

        return newCollection.sort(function (first, second) {
            if (order === 'asc') {
                return first[property] > second[property];
            }

            return first[property] < second[property];
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
        return collection.map(function (element) {
            var copy = Object.assign({}, element);
            if (property in element) {
                copy[property] = formatter(copy[property]);
            }

            return copy;
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
