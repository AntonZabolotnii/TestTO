const { intersectionWith } = require("lodash");

const users = require("./users");
const venues = require("./venues");

const venuesToGo = [];
const venuesToAvoid = [];

venues.forEach( currentVenue => {
    const {food: venueFood, drinks: venueDrinks, name} = currentVenue;

    const venue = {
        name,
        messages: [],
        isGood: true
    };

    users.forEach( user => {
        const comparator = (arrItem1, arrItem2) => {
            return arrItem1.toLowerCase() === arrItem2.toLowerCase();
        };
        const incompatibleDishes = intersectionWith(user.wont_eat, venueFood, comparator);

        const isGoodByFood = incompatibleDishes.length === 0;
        const isGoodByDrinks = intersectionWith(user.drinks, venueDrinks, comparator).length > 0;

        if (!isGoodByFood) {
            venue.messages.push(`${user.name} doesn't eat ${incompatibleDishes}`);
        }
        if (!isGoodByDrinks) {
            venue.messages.push(`${user.name} doesn't drink ${venueDrinks}`);
        }
        if (!isGoodByDrinks || !isGoodByFood) {
            venue.isGood = false;
        }
    });

    if (venue.isGood) {
        venuesToGo.push(venue);
    } else {
        venuesToAvoid.push(venue);
    }
});

console.log(`Places to go:`);
venuesToGo.forEach( venue => {
    console.log(`\t${venue.name}`);
});
console.log(`Places to avoid:`);
venuesToAvoid.forEach( venue => {
    console.log(`\t${venue.name}`);
    venue.messages.forEach( message => {
        console.log(`\t\t${message}`);
    });
});
