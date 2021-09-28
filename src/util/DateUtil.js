module.exports = {
    getDateString: date => {
        date = new Date(date);

        return require('moment')(date).format('YYYY-MM-DD');
    }
};
