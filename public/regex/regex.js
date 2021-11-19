module.exports = {
    number:{
        //시작이 0이 아닌 1이상의 정수 문자열 체크 
        //ex) 요청한 페이지의 값이 "01"이면 index페이지로 리디렉션 처리
        page: RegExp(/^[1-9][0-9]*$/)
    }
}