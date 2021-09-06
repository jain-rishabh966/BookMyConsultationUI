module.exports = {
    getDateString: date => {
        date = new Date(date);

        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        if (day <= 9) day = '0' + day;
        if (month <= 9) month = '0' + month;

        return year + '-' + month + '-' + day;
    }
};
