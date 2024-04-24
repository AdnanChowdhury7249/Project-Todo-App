// Define the projects array to store instances of Project
const projects = [];


class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }
}


export { Project, projects };
