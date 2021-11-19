module.exports = {
    board: {
        select: {
            list: `
            SELECT BS_BOARD.id, title, AUTH.name AS name, DATE_FORMAT(created, '%H:%i %m-%d-%y') AS created, views, good-bad AS hit 
            FROM BS_BOARD 
            LEFT JOIN AUTH ON BS_BOARD.auth=AUTH.id 
            ORDER BY BS_BOARD.id DESC 
            LIMIT ? OFFSET ?`,

            rows: `SELECT FOUND_ROWS() AS total`
        }
    },

    auth: {
        select:{
            userByEmail: `SELECT id, email, name, token FROM AUTH WHERE email=?`,
            userById: `SELECT id, email, name, token FROM AUTH WHERE id=?`
        },

        insert:{
            newUser: `INSERT INTO AUTH(email, token) VALUES(?, ?)`
        },

        update:{
            tokenById: `UPDATE AUTH SET token=? WHERE id=?`
        }
    }
}