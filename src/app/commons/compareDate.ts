function compareDateNow(date1: Date) {
    date1 = new Date(date1);
    const date2 = new Date();

    if (date1.getTime() > date2.getTime()) {
        return 1
    } else if (date1.getTime() < date2.getTime()) {
        return -1
    } else {
        return 0;
    }
}

function compareTwoDate(date1: Date, date2: Date) {
    date1 = new Date(date1);
    date2 = new Date(date2);

    if (date1.getTime() > date2.getTime()) {
        return 1
    } else if (date1.getTime() < date2.getTime()) {
        return -1
    } else {
        return 0;
    }
}

export { compareDateNow, compareTwoDate }