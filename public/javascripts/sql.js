module.exports = {
    board: {
        select: {
            /** Read content by id. arg[1] BS_BOARD.id */
            contents:`
            SELECT BS_BOARD.id AS id, title, contents, auth, AUTH.name AS name, DATE_FORMAT(created, '%H:%i %m-%d-%y') AS created, views, good-bad AS hit, enabled
            FROM BS_BOARD
            LEFT JOIN AUTH ON BS_BOARD.auth=AUTH.id
            WHERE BS_BOARD.id=?
            LIMIT 1
            `,

            /** Read content by id, but re ID authentication. arg[2] id, auth */
            contentsAuth:`
            SELECT BS_BOARD.id AS id, title, contents, AUTH.name AS name, DATE_FORMAT(created, '%H:%i %m-%d-%y') AS created, views, good-bad AS hit
            FROM BS_BOARD
            LEFT JOIN AUTH ON BS_BOARD.auth=AUTH.id
            WHERE BS_BOARD.id=? AND BS_BOARD.auth=?
            LIMIT 1
            `,

            /** Read board list. arg[2] limit, offset */
            list: `
            SELECT BS_BOARD.id AS id, title, AUTH.name AS name, DATE_FORMAT(created, '%H:%i %m-%d-%y') AS created, views, good-bad AS hit 
            FROM BS_BOARD 
            LEFT JOIN AUTH ON BS_BOARD.auth=AUTH.id 
            WHERE enabled='Y'
            ORDER BY BS_BOARD.id DESC 
            LIMIT ? OFFSET ?`,

            /** Read rows */
            rows: `SELECT FOUND_ROWS() AS total`
        },

        insert: {
            /** Insert new contents arg[4] subject, title, contents, auth.id */
            contents:`
                INSERT INTO BS_BOARD(subject, title, contents, auth)
                VALUES(?, ?, ?, ?)
            `,

            comment:`
            
            `
        },

        update: {
            /** Update contents. arg[4] title, contents, board.id, auth.id */
            contents: `
                UPDATE BS_BOARD 
                SET title=?, contents=?, updated=CURRENT_TIMESTAMP
                WHERE id=? AND auth=?
            `,
            /** Disable contents. arg[2] board.id, board.auth */
            contentDisable: `
                UPDATE BS_BOARD
                SET enabled='N' 
                WHERE id=? AND auth=?
            `
        },

        delete: {
            /** Delete contents arg[2] board.id, auth.id */
            contents: `
                DELETE FROM BS_BOARD
                WHERE id=? AND auth=?
            `
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
            /** Signup new user. arg[3] email, name, token */
            signup: `INSERT INTO AUTH(email, name, token) VALUES(?, ?, ?)`
        },

        update:{
            /** Token update after login. arg[2] token, id */
            tokenById: `UPDATE AUTH SET token=? WHERE id=?`
        }
    }
}