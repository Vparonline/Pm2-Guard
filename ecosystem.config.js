const DatabaseName = "chavobu"

module.exports = {
    apps: [{
            name: `${DatabaseName}-guard1`,
            script: "./Guard1/elchavopy.js",
            watch: false
        },
        {
            name: `${DatabaseName}-guard2`,
            script: "./Guard2/elchavopy.js",
            watch: false
        },
    ]
};