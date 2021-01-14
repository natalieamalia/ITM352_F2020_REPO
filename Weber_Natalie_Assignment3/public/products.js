var surfboards_array = [
        {
            "name": "The Blaze",
            "price": 500.00,
            "image": "the blaze.png",
            "brand": "Minami Surfboards"
        },
        {
            "name": "Ghost",
            "price": 650.00,
            "image": "ghost.jpg",
            "type": "Pyzel Surfboards"
        },
        {
            "name": "No Brainer",
            "price": 875.00,
            "image": "nobrainer.jpg",
            "type": "Firewire Surfboards x Slater Designs"
        },
        {
            "name": "Rad Ripper",
            "price": 850.00,
            "image": "radripper.jpg",
            "type": "Lost Surfboards"
        },
        {
        "name": "X-1",
        "price": 645.00,
        "image": "x-1.jpg",
        "type": "Tokoro Surfboards" 
        }
    ];
    var deckpads_array = [
        {
            "name": "Griffin Colapinto Deckpad",
            "price": 46.00,
            "image": "griffincola.jpg",
            "type": "Creatures of Leisure"
        },
        {
            "name": "Jack Freestone Deckpad",
            "price": 42.00,
            "image": "jack.jpg",
            "type": "Creatures of Leisure"
        },
        {
            "name": "Ethan Ewing 2020 Deckpad",
            "price": 40.00,
            "image": "ethanewing.jpg",
            "type": "Creatures of Leisure"
        }
    ];
    var surfwax_array = [
        {
            "name": "Sexwax Tropic Basecoat",
            "price": 3.00,
            "image": "sexwaxtropic.jpeg",
            "type": "Mr. Zogs Sexwax"
        },
        {
            "name": "Sexwax Tropic Topcoat",
            "price": 2.50,
            "image": "sexwaxtopcoat.jpg",
            "type": "Mr. Zogs Sexwax"
        },
        {
            "name": "Sticky Bumps",
            "price": 2.00,
            "image": "stickybumps.jpg",
            "type": "Sticky Bumps"
        },
    ];
    var store_products = {
        "surfboards": surfboards_array,
        "deckpads": deckpads_array,
        "surfwax": surfwax_array
    }

    if(typeof module != 'undefined') {
        module.exports.store_products = store_products;
      }