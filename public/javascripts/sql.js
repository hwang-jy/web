module.exports = {
    board: {
        select: {
            list: `
            SELECT BS_BOARD.id, title, auth.name AS name, DATE_FORMAT(created, '%H:%i %m-%d-%y') AS created, views, good-bad AS hit 
            FROM BS_BOARD 
            LEFT JOIN auth ON BS_BOARD.auth=auth.id 
            ORDER BY BS_BOARD.id DESC 
            LIMIT ? OFFSET ?`,

            rows: `SELECT FOUND_ROWS() AS total`
        }
    },

    auth: {
        select:{
            userByEmail: `SELECT id, email, name, token FROM auth WHERE email=?`,
            userById: `SELECT id, email, name, token FROM auth WHERE id=?`
        },

        insert:{
            newUser: `INSERT INTO auth(email, token) VALUES(?, ?)`
        },

        update:{
            tokenById: `UPDATE auth SET token=? WHERE id=?`
        }
    }
}