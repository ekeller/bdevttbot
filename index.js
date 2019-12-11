// @TODO REQUIRE BANNER
// @TODO .env to store user/pass

class BDevTTBot {

    static get CONFIG() {
        return {
            driverOptions: {
                desiredCapabilities: {
                    browserName: 'Chrome',
                    // acceptInsecureCerts: true,
                }
            },
        };
    }

    constructor() {
        // console.log(`
        //     ██████╗ ██████╗ ███████╗██╗   ██╗    ████████╗████████╗    ██████╗  ██████╗ ████████╗
        //     ██╔══██╗██╔══██╗██╔════╝██║   ██║    ╚══██╔══╝╚══██╔══╝    ██╔══██╗██╔═══██╗╚══██╔══╝
        //     ██████╔╝██║  ██║█████╗  ██║   ██║       ██║      ██║       ██████╔╝██║   ██║   ██║
        //     ██╔══██╗██║  ██║██╔══╝  ╚██╗ ██╔╝       ██║      ██║       ██╔══██╗██║   ██║   ██║
        //     ██████╔╝██████╔╝███████╗ ╚████╔╝        ██║      ██║       ██████╔╝╚██████╔╝   ██║
        //     ╚═════╝ ╚═════╝ ╚══════╝  ╚═══╝         ╚═╝      ╚═╝       ╚═════╝  ╚═════╝    ╚═╝
        //     Usage - all arguments are required:

        //     $ node index [Date] [Project] [Hours] [Assignment] [Description] [Client]

        //     [Date]        - dd/mm/yyyy || today
        //     [Project]     - One based index of your list of projects: only project = 2
        //     [Hours]       - Number of hours for the day, can be a "fraction" ('8,5', '8.5')
        //     [Assignment]  - One based index of your list of assignments.
        //     [Description] - Description of your activities
        //     [Client]      - One based index of your list of focal points
        //     `);

        this._init();
    }

    _init() {
        this.chromeDriver = require('chromedriver');

        const readline = require('readline');
        this.readLine = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        this.webDriver = require('selenium-webdriver');
        this.by = this.webDriver.By;
        this.until = this.webDriver.until;

        this.selectors = require('./selectors');

        this.userData = {
            date: null,
            project: null,
            hours: null,
            assignment: null,
            description: null,
            client: null,
        };

        this._askForData();
    }

    async _askForData() {
        // await this._askForDate();
        // await this._askForProject();
        // await this._askForHours();
        // await this._askForAssignment();
        // await this._askForDescription();
        // await this._askForClient();

        this.readLine.close();

        this._dataGathered();
    }

    _askForDate() {
        return new Promise((resolve, reject) => {
            try {
                this.readLine.question('Please enter the date in the format dd/mm/yyyy\n', (answer) => {
                    // @todo validate date format
                    this.userData.date = answer;
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    _askForProject() {
        return new Promise((resolve, reject) => {
            try {
                this.readLine.question('Please enter the index of your list of projects\n', (answer) => {
                    // @todo validate if isNan(Number())
                    this.userData.project = answer;
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    _askForHours() {
        return new Promise((resolve, reject) => {
            try {
                this.readLine.question('Please enter the number of hours (8, 8.5, 8,5)\n', (answer) => {
                    // @todo validate if isNan(Number())
                    this.userData.hours = answer;
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    _askForAssignment() {
        return new Promise((resolve, reject) => {
            try {
                this.readLine.question('Please enter the index of your list of assignments\n', (answer) => {
                    // @todo validate if isNan(Number())
                    this.userData.assignment = answer;
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    _askForDescription() {
        return new Promise((resolve, reject) => {
            try {
                this.readLine.question('Please enter the description of your activities\n', (answer) => {
                    this.userData.description = answer;
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    _askForClient() {
        return new Promise((resolve, reject) => {
            try {
                this.readLine.question('Please enter the index of your list of focal points\n', (answer) => {
                    this.userData.client = answer;
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    _dataGathered() {
        console.log(`Thanks, magic time...`);
        this.driver = new this.webDriver.Builder()
            .forBrowser('chrome')
            .build();

        // Login
        this.driver.get('https://timetracker.bairesdev.com/').then(() => {
            this.driver.findElement(this.by.id(this.selectors.userName)).sendKeys('erick.keller');
            this.driver.findElement(this.by.id(this.selectors.password)).sendKeys('!hS9v36yc2V3');
            this.driver.findElement(this.by.id(this.selectors.loginBtn)).click().then(() => {
                this._enterTrackHours();
            });
        });
    }

    _enterTrackHours() {
        this.driver.findElement(this.by.linkText(this.selectors.trackBtn)).click()
            .then(() => {
                this._fillUp();
                // this._fillUp().then(() => {
                //     console.log('then what');
                // });
            })
            .catch(err => {
                console.error(err);
            });
    }

    // async _fillUp() {
    //     console.log('fill up');
    //     await this._fillDate();
    //     await this._fillProject();
    //     await this._fillHours().then(() => {
    //         this.driver.sleep(10000);
    //     });
    //     console.log('end fill up');
    // }

    _fillUp() {
        console.log('fill up');
        this._fillDate()
            .then(() => {
                this._fillProject();
            })
            .then(() => {
                this._fillHours();
            })
            .then(() => {
                this._fillDescription();
            })
            .then(() => {
                this._fillAssignment();
            });
        // await
        // await this._fillHours().then(() => {
            // this.driver.sleep(20000);
        // });
        console.log('end fill up');
    }

    _fillDate() {
        return new Promise((resolve, reject) => {
            try {
                this.driver.findElement(this.by.id(this.selectors.date))
                    .then((input) => {
                        input.clear().then(() => {
                            input.sendKeys('12/12/2020')
                                .then(() => {
                                    resolve();
                                });
                        });
                    });
            } catch(err) {
                reject(err);
            }
        });
    }

    _fillProject() {
        return new Promise((resolve, reject) => {
            try {
                this.driver.findElement(this.by.id(this.selectors.project))
                    .then((select) => {
                        select.click();
                        select.findElement(this.by.css('option:nth-child(2)')).click()
                            .then(() => {
                                resolve();
                            });
                    });
            } catch(err) {
                reject(err);
            }
        });
    }

    _fillHours() {
        return new Promise((resolve, reject) => {
            try {
                this.driver.findElement(this.by.id(this.selectors.hours))
                    .then((input) => {
                        input.sendKeys('8');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } catch(err) {
                reject(err);
            }
        });
    }

    _fillAssignment() {
        return new Promise((resolve, reject) => {
            try {
                // this.driver.sleep(5000);
                this.driver.findElement(this.by.id(this.selectors.assignment))
                    .then((select) => {
                        this.driver.wait(this.until.elementLocated(this.by.css(`#${this.selectors.assignment} option`).size > 5));
                        select.click();
                        select.findElement(this.by.css('option:nth-child(29)')).click()
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    });
            } catch(err) {
                reject(err);
            }
        });
    }

    _fillDescription() {
        return new Promise((resolve, reject) => {
            try {
                this.driver.findElement(this.by.id(this.selectors.description))
                    .then((input) => {
                        input.sendKeys('8');
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } catch(err) {
                reject(err);
            }
        });
    }

    _fillClient() {
        return new Promise((resolve, reject) => {
            try {
                this.driver.findElement(this.by.id(this.selectors.client))
                    .then((select) => {
                        select.click();
                        select.findElement(this.by.css('option:nth-child(1)')).click()
                            .then(() => {
                                resolve();
                            });
                    });
            } catch(err) {
                reject(err);
            }
        });
    }
}

new BDevTTBot();