import moment from 'moment';



class Todos {
    constructor(title, description, dueDate, priority, projectName) {
        this.title = title;
        this.description = description;
        this.dueDate = moment(dueDate, 'YYYY-MM-DD');
        this.priority = priority;
        this.projectName = projectName;
    }

    getFormattedDueDate() {
        if (this.dueDate.isValid()) {
            return this.dueDate.format('DD MMMM YYYY');
        } else {
            return "Not specified";
        }
    }

}

export { Todos };
