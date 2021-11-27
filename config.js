//** Create and Export Configuration  */

const environments = {

    //Staging { default }
    staging:{
        'httpPort':5000,
        'httpsPort':5001,
        'envName':'Staging'
    },

    //Production
    production:{
        'httpPort':8000,
        'httpsPort':8001,
        'envName':'Production'
    }
}

// Current Enviroment
const currentEnv = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV.toLowerCase():'';

// checking if requested env is in the list of envs
const envToExport = typeof(environments[currentEnv]) === "object"? environments[currentEnv]:environments.staging;

// exports { envToExport }
module.exports = envToExport;