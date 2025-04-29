const rect = require('./rectangle');
// {
//     perimeter: (x, y) => 2 * (x + y),
//     area: (x, y) => x * y
// };

function solveRect(l, w) {
    console.log(`Solving for rectangle with dimensions: ${l}, ${w}`);

    rect(l, w, (err, result) => {
        if (err) {
            console.log('ERROR:', err.message);
        } else {
            console.log(`Area of rectangle with dimensions: ${l}, ${w} is ${result.area()}.`);
            console.log(`Perimeter of rectangle with dimensions: ${l}, ${w} is ${result.perimeter()}.`);
        }
    });
    console.log('This statement is logged after the call to rect()');
}

solveRect(2, 4);
solveRect(3, 5);
solveRect(0, 5);
solveRect(-3, 5);