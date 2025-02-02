const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = 3000;
//Post a receipt



var receiptIdList = [];

//create receipt
app.post('/receipts/process', async (req, res) => {
//total points for the receipt to be added at the end
var points = 0
var{retailer, purchaseDate,purchaseTime,items,total} = req.body

if(retailer == null || purchaseDate == null || purchaseTime == null || items == null || total == null)
{
    res.status(400).send("Bad Request")
}

//convert the retailer name into a non alpha-numeric version, and add the legnth of the string into points
var nonAlphaRetailer = retailer.replace(/[^a-zA-Z0=9]/g,"")
points += nonAlphaRetailer.length

//check if the day of purchase is even by checking the last digit inside of the purchaseDate string
var trimmedDate = purchaseDate[purchaseDate.length -1]
//finding if there is a remainder when divided by 2,if there is then it is odd and we add points
if(trimmedDate % 2){
points +=6
}

//check if the purchase time is inbetween 2:00pm and 4:00pm or 14:00 and 16:00 in military time, so I look at just the hours to determine this
purchaseHour = purchaseTime.substring(0,purchaseTime.indexOf(":"))
if(purchaseHour >= 14 && purchaseHour < 16)
{
    points += 10
    
}
//check the amount of items in the receipt so I can add points for every 2nd item
var itemAmountByTwo = (items.length / 2)
itemAmountByTwo = Math.floor(itemAmountByTwo)
points += (itemAmountByTwo * 5)
for(let currentItem in items){
//takes the length of each item description and divides it by 3, looking for a remainder to determine if it is a multiple
if(!(((items[currentItem].shortDescription).trim().length) % 3)){
    points += Math.ceil((items[currentItem].price * 0.2))
}
}
//find if the total is a round dollar amount, do this just getting the cents, and seeing if it is equal to 0
if(total.substring(total.indexOf(".") + 1) == 0)
{
    points += 50
}
//next determine if total is a multiple of 0.25
if(Number.isInteger((total / 0.25))){
    points += 25
}
receiptIdList.push(
    {
        id:receiptIdList.length + 1,
        points: points
    }
)
res.status(200).send({id:receiptIdList.length});
});



app.get('/receipts/:id/points', async (req, res) => {
    try{
    for(var receiptId in receiptIdList)
    {
        if(parseInt(req.params.id) === receiptIdList[receiptId].id)
        {
            res.status(200).send({points: receiptIdList[receiptId].points});
        }
    }}catch{
        res.status(404).send("Receipt not found")
    }
    
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});