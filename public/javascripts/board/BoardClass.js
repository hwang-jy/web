const BOARD_CONFIG = require('../../../config/board.json');
const REGEX = require('../../regex/regex');

class Board{
    constructor(page, total, db_list){
        /** @type {number} request.params.page */
        this.page = (page == undefined ? 1 : page);

        /** @type {number} The number of rows found as a result of the SQL */
        this.total = total;

        /** @type {number} Number of posts per page */
        this.view = BOARD_CONFIG.PAGE_PER_POSTS;

        /** @type {number} Number of posts to find with SQL */
        this.unit = BOARD_CONFIG.PAGES_PER_UNIT;

        /** @type {number} Offset starting point when reading posts */
        this.offset = -1;

        /** @type {Array[number]} Page navigation buttons */
        this.pages = this.getPages();

        /** @type {Array[object]} */
        this.posts = this.getPosts(db_list);
    }

    pageCheck(request){
        var page = request.params.page;
        if(REGEX.number.page.test(page)){
            return Math.max(page, 1);
        }
        return -1;
    }

    getPages(){
        var numberOfButtons = 0;
        var offset = this.getOffset(this.view);

        var start = this.total - offset;
        //if(start % this.unit == 0){
        if(this.total == 0){
            numberOfButtons = 1;
        }else{
            numberOfButtons = Math.ceil(start % this.unit / this.view);
        }

        this.pages = this.makeNumberArray(1, numberOfButtons, offset);
        return this.pages;
    }

    getOffset(unit) {
        if(this.page - 1 > 0){
            return (Math.trunc((this.page - 1) / 10)) * unit;
        }
        return 0;
    }

    makeNumberArray(start, end, offset){
        var arr = [];
        for(var i=start; i<=end; i++){
            arr.push(i + offset);
        }
        return arr;
    }

    getPosts(data){
        var start = this.view * (this.page - 1);
        var end = Math.min((this.view * this.page) - 1, this.total - 1);
        var offset = this.getOffset(this.unit);
        var arr = this.makeNumberArray(start, end, -offset);
        this.posts = [];

        arr.forEach(element => {
            this.posts.push(data[element]);
        });

        return this.posts;
    }
}

module.exports = Board;