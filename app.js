const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');


app.get('/', (req,res) => res.write('index.html'));
app.all('/getRate', function(req,res) {
    const mailType = req.body.mailType;
    const weight = req.body.weight;
    const rate = calculateRate(mailType,weight);

    res.render('pages/rates.ejs', {
        rate: rate,
        weight: weight,
        mailType: mailType
    });
});
app.listen(port, () => console.log(`Listening on Port ${ port }`));

function calculateRate(mailType, weight) {
    const wholeWeight = Math.round(weight);
    switch (mailType) {
        case 'Letter (Stamped)':
            if(weight <= 1)
                return 0.50;
            else if(weight <= 2)
                return 0.71;
            else if(weight <= 3)
                return 0.92;
            else if(weight <= 3.5)
                return 1.13;
            break;
        case 'Letter (Metered)':
            if(weight <= 1)
                return 0.47;
            else if(weight <= 2)
                return 0.68;
            else if(weight <= 3)
                return 0.89;
            else if(weight <= 3.5)
                return 1.10;
            break;
        case 'Large Envelope (Flat)':
            if (wholeWeight !== 1)
                return (((wholeWeight -1) * .21) + 1.00).toFixed(2);
            else
                return 1.00;
            break;
        case 'First-Class Package Service—Retail':
            if(weight <= 4)
                return 3.50;
            else if(weight <= 8)
                return 3.75;
            else if (weight <= 13)
                return(((wholeWeight - 9) * .35) + 4.10).toFixed(2);
            break;
    }
    return -1;

}
