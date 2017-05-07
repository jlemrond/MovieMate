"use strict";

const createResponse = (intent, movie) => {

    if (movie.Response === 'True') {
        let {
            Title,
            Year,
            Plot,
            Director,
            Actors,
            Poster
        } = movie;

        switch (intent) {
            case 'movieInfo': {
                let text = `${Title} (${Year}).\n\nThis film was directed by ${Director} and starred ${Actors}. ${Plot}`.substring(0, 320);
                return {
                    text: text,
                    image: Poster
                }
            }

            case 'releaseYear': {
                let text = `${Title} was released in ${Year}`;
                return {
                    text: text,
                    image: null
                }
            }

            case 'director': {
                let text = `${Director} directed ${Title}`;
                return {
                    text: text,
                    image: null
                }
            }

            default: {
                return {
                    text: "Umm... what now?",
                    image: null
                }
            }


        }

    } else {
        return {
            text: `I don't understand your question.`,
            image: null
        };
    }
}

module.exports = createResponse;