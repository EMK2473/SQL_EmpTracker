const inquirer = require('inquirer');
const mySQL = require('mysql2');
const cFonts = require('cfonts');

const connection = mySQL.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'mentos',
    database: "empTracker_database"
});

connection.connect((err) =>{
    if (err) throw err;
    console.log('Connected!');
    prompt();
})

cFonts.say('Welcome|Business|Owner', {
    font: 'block',              // define the font face
	align: 'left',              // define text alignment
	colors: ['system'],         // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 1,           // define letter spacing
	lineHeight: 1,              // define the line height
	space: true,                // define if the output text should have empty lines on top and on the bottom
	maxLength: '0',             // define how many character can be on one line
	gradient: false,            // define your two gradient colors
	independentGradient: false, // define if you want to recalculate the gradient for each new line
	transitionGradient: false,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment cfonts is being executed in
});

function prompt(){
    inquirer.prompt({
        type: 'list',
        name: 'initQ',
        message: "Business Operations:",
        choices: [
            'View all dept',
            'View all emp roles',
            'View all employees',
            'Add department',
            'Add role',
            'Add employee',
            'Add manager',
            'Update emp role',
            'Exit app',
        ]
    })
    .then((answers) =>{
        switch (answers.initQ){
            case 'View all dept':
                viewAllDept();
                break;
            case 'View all emp roles':
                viewAllEmpRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Add employee':
                addEmployee();
                break;
            case 'Add manager':
                addManager();
                break;
            case 'Update emp role':
                updateEmpRole();
                break;
            case 'Exit app':
                exit();
                break;
        }
    })
};

function viewAllDept(){

};

function viewAllEmpRoles(){

}

function viewAllEmployees(){

}

function addDepartment(){

}

function addRole(){

}

function addEmployee(){

}

function addManager(){

}

function updateEmpRole(){

}

function exit(){
    
}




