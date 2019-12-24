function check(number){
let history = [];
let bidObject = {
  type:'NO',
  isOrdered: false,

};
let theoryObject = {
  spring: 1,
  total : 100,
  previous : '',
  coefficient: 1
};


  for(let i = 0; i< number; i++){

    const rand = Math.random();
    const current = rand>0.5?'UP':'DOWN';
    theoryObject.current = current;
    theoryObject[current]=theoryObject[current]?++theoryObject[current]:1;

    checkUpdateSpring(theoryObject, current);

     checkForBid(theoryObject, bidObject, current);

  //update spring

  // make order

    makeOrder(theoryObject, bidObject, current)

    save(theoryObject, bidObject, history);
    

  //update last. do not call functions after this line

    updateToNext(theoryObject, bidObject, current);

  }
  return history;

}


function save(theory, bid, history){

 const copy = JSON.stringify(bid);
 const theoryCopy = JSON.stringify(theory);
 let response  = [copy,theoryCopy];
 if(bid.isOrdered){ 
   history.push(response)
 return {saved: true, message:'The data saved!'};
 } else {
   return {saved: false, message: 'Data does not need in saving'}
 }

}

function checkUpdateSpring(theory,current){

  if(theory.previous===current){
    theory.spring++;
  } else {
    theory.spring = 1;
  }

}

function checkForBid(theory, bidObject, current){
  
  if(current===bidObject.type&bidObject.isOrdered){
    theory.total +=(100*theory.coefficient);
    
  } else if(bidObject.isOrdered){
    theory.total -= (100*theory.coefficient);
  };

 
  bidObject.isOrdered = false;
  theory.coefficient = 1;
  


}




function makeOrder(theory, bidObject, current){
  const results = calculateRatio(theory);
  if(theory.spring >= 4){
    theory.coefficient = theory.spring - 3;
    bidObject.type = current === 'UP'?'DOWN':'UP';
    bidObject.isOrdered = true;
  } else {
    bidObject.type = 'NO';
  }

}


function makeBid(current,ratio){
  const directionOfBid = current === 'UP'?'DOWN':'UP';
  if(directionOfBid === "UP"&&ratio[0]<50){
    return true;
  } else if(directionOfBid === 'DOWN'&&ratio[1]<50){
    return true;
  } else {
    return false;
  }
}


function updateToNext(theory, bidObject, current){
  theory.previous = current;
}

function calculateRatio(inputs){
  const total = inputs['UP'] + inputs['DOWN'];
  const up = inputs['UP'];
  const down = inputs['DOWN'];
  const upRatio = up/total*100;
  const downRatio = down/total*100;
  return [upRatio,downRatio];
}


/*
function log(response){
  for(item of response){
    
    const orderObject = JSON.parse(item[0]);
    const theoryObject = JSON.parse(item[1]);
    const results = calculateRatio(theoryObject);
    console.log(item)
    console.log(`
    Is ordered      : ${orderObject.isOrdered}
    Vector of order : ${orderObject.type}
    Previous was    : ${theoryObject.previous}
    Current is      : ${theoryObject.current}
    Spring is       : ${theoryObject.spring}
    Total is        : ${theoryObject.total}
    UP to DOWN      : ${theoryObject['UP']+" : "+theoryObject['DOWN']}
    UPtoDOWN ratio  : ${results[0].toFixed(2)} : ${results[1].toFixed(2)}

    --------------------------------
    `)
  }
}
*/

const response = check(10000);
let arr = [];
for(let i = 0; i < 100; i++){
  arr.push(check(10000));
}

let wins = 0;
let losts = 0;

for(let item of arr){
   const response = JSON.parse(item[item.length - 1][1]);
   const show = response.total;
  // console.log(response)
  show>0?(wins+=1):(losts+=1);
  console.log(`
    here is total ${show}
  `)
}

console.log(` wins ${wins} vs ${losts}`)
