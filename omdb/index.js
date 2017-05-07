"use strict";
const request = require('request');
const createResponse = require('../utils');

const getInfo = data => {
    let intent = data.entities.intent && data.entities.intent[0].value || null;
    let movie = data.entities.movie && data.entities.movie[0].value || null;
    let releaseYear = data.entities.releaseYear && data.entities.releaseYear[0].value || null;

    return new Promise((resolve, reject) => {
        if (movie) {
            request({
                uri: 'http://www.omdbapi.com',
                qs: {
                    t: movie,
                    plot: 'short',
                    y: releaseYear,
                    r: 'json'
                },
                method: 'GET'
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(createResponse(intent, JSON.parse(body)));
                } else {
                    reject(error);
                }
            })
        } else {
            reject(`Movies not found.`);
        }
    })
}

module.exports = getInfo;