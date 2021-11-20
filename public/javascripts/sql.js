module.exports = {
    board: {
        select: {
            /** Read content by id. arg[1] BS_BOARD.id */
            content:`
            SELECT BS_BOARD.id AS id, title, contents, AUTH.name AS name, DATE_FORMAT(created, '%H:%i %m-%d-%y') AS created, views, good-bad AS hit
            FROM BS_BOARD
            LEFT JOIN AUTH ON BS_BOARD.auth=AUTH.id
            WHERE BS_BOARD.id=?
            LIMIT 1
            `,

            /** Read board list. arg[2] limit, offset */
            list: `
            SELECT BS_BOARD.id AS id, title, AUTH.name AS name, DATE_FORMAT(created, '%H:%i %m-%d-%y') AS created, views, good-bad AS hit 
            FROM BS_BOARD 
            LEFT JOIN AUTH ON BS_BOARD.auth=AUTH.id 
            ORDER BY BS_BOARD.id DESC 
            LIMIT ? OFFSET ?`,

            /** Read rows */
            rows: `SELECT FOUND_ROWS() AS total`
        }
    },

    auth: {
        select:{
            /** Find user by email. arg[1] email */
            userByEmail: `SELECT id, email, name, token FROM AUTH WHERE email=?`,

            /** Find user by id. arg[1] id */
            userById: `SELECT id, email, name, token FROM AUTH WHERE id=?`
        },

        insert:{
            /** Signup new user. arg[2] email, token */
            signup: `INSERT INTO AUTH(email, token) VALUES(?, ?)`
        },

        update:{
            /** Token update after login. arg[2] token, id */
            tokenById: `UPDATE AUTH SET token=? WHERE id=?`
        }
    }
}