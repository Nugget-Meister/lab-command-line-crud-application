const {nanoid} = require("nanoid")
const chalk = require("chalk")

// console.log(chalk.blue("strisng"))


const purchases = require("./data/purchases")

function createPurchase (data, name, amount, donation) {
    data.push({
        'id' : nanoid(),
        "name": name || "unidentified item",
        "amount": Number(amount) || 1, 
        "donation": Number(donation) || 0
    })
    return data
}


function showPurchases(data) {
    return data.map(x => {
        return {id : x.id, name: x.name}
    })
}

function showDetailedPurchases(data){
    for(element of data) {
        console.log(
            chalk.green("id"),chalk.white(element.id),
            chalk.green("name"),chalk.white(element.name),
            chalk.green("amount"),chalk.white(element.amount),
            chalk.green("donation"),chalk.yellow(element.donation))
    }
    return data
}

function updatePurchase(data, inputObj){
    let newArr = inputObj || []
    let held = data.map(item => {
        return item.id
    })

    if(!inputObj){
        newArr = process.argv.slice(3).map(x => {
            return x.split("=")
        })
        newArr = Object.fromEntries(newArr)
    }

    let foundIndex = held.indexOf(newArr.id)

    if(newArr.id && foundIndex != -1) {
        //Overwrite relevant data, defaults to previous if not found
        data[foundIndex] = {
            id : data[foundIndex].id,
            name : newArr.name || data[foundIndex].name,
            amount: Number(newArr.amount) || data[foundIndex].amount,
            donation: Number(newArr.donation) || data[foundIndex].donation
        }
        console.log("Overwrote data with id of",chalk.italic(newArr.id))
    } else {
        console.log(chalk.redBright("ID not found or specified. Please enter correct info."))
    }
    
    return data
}

function deletePurchase(data, id){
    let held = data.map(item => {
        return item.id
    })
    let foundIndex

    if(id){
        foundIndex = held.indexOf(id)
    } else {
        foundIndex = held.indexOf(process.argv[3])
    }
    console.log(id)
    
    
    if (foundIndex != -1){
        console.log(`Deleted item with ID of ${chalk.blue(id)}`)
    } else {
        console.log(`Item with ID of ${chalk.blue(id)} ${chalk.red('not found')}.`)
    }
    return data.toSpliced(foundIndex,1)
}

function showDonationTotal(data){
    return data.map(x => {
        return x.donation
    }).reduce((sum, add) => sum+add,0)
}

function run(){
    switch(process.argv[2]){
        case "create":
            console.log(createPurchase(purchases,process.argv[3],process.argv[4],process.argv[5]))
            console.log(`Created an item ${process.argv[3]}`)
            break;
        case "show":
            console.log(showPurchases(purchases))
            break;
        case "details":
            console.log(showDetailedPurchases(purchases))
            break;
        case "update":
            console.log(updatePurchase(purchases))
            break;
        case "delete":
            deletePurchase(purchases)
            break;
        case "showDonations":
            console.log(`Total donations is ${chalk.bgCyan(showDonationTotal(purchases))}`)
            break;
        default:
            break;
    }   
}

run()

module.exports = {
    createPurchase,
    showPurchases,
    showDetailedPurchases,
    updatePurchase,
    deletePurchase,
    showDonationTotal
}