module.exports = {
    number:{
        /** request page is int type. n>=1 */
        page: RegExp(/^[1-9][0-9]*$/),

        /** request board id is int type. n>=1 */
        id: RegExp(/^[1-9][0-9]*$/)
    }
}