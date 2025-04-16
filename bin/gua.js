#!/usr/bin/env node

const command = process.argv.slice(2);
const username = command[0];
import fetchUserEvents from "../commands/base.js"; 

async function main() {
    const result = await fetchUserEvents(username);
    result.map( activity => console.log(activity));
}

main().catch((error) => {
    throw error;
});


