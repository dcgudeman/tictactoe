$(document).ready ( function(){

var cellList = document.querySelectorAll("div.cell");
var resetButton = document.querySelectorAll("button.resetbtn");
var playerOutcome = document.querySelectorAll("div.playerReset");
var player = 0;
var yourTurn = true;

var cellListFirst = $('.cell');
console.log(cellListFirst);


for (var i = 0; i< cellList.length; i++)
{
	cellList[i].addEventListener("click",function(){

		var gameStatus = gameState();

		if ( gameStatus !== -1 || this.innerHTML !== "" || !yourTurn)
			return;

		if (player%2 === 0 && yourTurn)
		{
			this.innerHTML = "X";
			yourTurn = false;
			player++;
		}
		else if (yourTurn)
		{
			this.innerHTML == "O";
			yourTurn = false;
			player++;
		}


		gameStatus = gameState();

		if( gameStatus !== -1)
		{
			console.log("gameStatus: " + gameStatus);
			if(gameStatus === "X")
			{
				playerOutcome[0].classList.remove("playerReset");
				console.log("Player 1 won!");
			}
			else if (gameStatus === "O")
			{
				playerOutcome[1].classList.remove("playerReset");
				console.log("Player 2 won!");
			}
			else if (gameStatus === 0)
			{
				playerOutcome[2].classList.remove("playerReset");
				console.log("It was a draw.");
			}


			return;
		}

		if (!yourTurn )
			setTimeout(function(){computerChoice2();},700);

		setTimeout(function(){


			gameStatus = gameState();

			console.log(gameStatus);
			if(gameStatus !== -1)
			{
				console.log("gameStatus: " + gameStatus);
				if(gameStatus === "X")
				{
					playerOutcome[0].classList.remove("playerReset");
					console.log("Player 1 won!");
				}
				else if (gameStatus === "O")
				{
					playerOutcome[1].classList.remove("playerReset");
					console.log("Player 2 won!");
				}
				else if (gameStatus === 0)
				{
					playerOutcome[2].classList.remove("playerReset");
					console.log("It was a draw.");
				}


				return;
			}

		},750);


	});
}




function gameState() {


	var currentCellList = document.querySelectorAll("div.cell");


	for (var i = 0; i < 9; i+=3)
		if(currentCellList[i].innerHTML !== "" && currentCellList[i].innerHTML === currentCellList[i+1].innerHTML && currentCellList[i].innerHTML === currentCellList[i+2].innerHTML)
		{
			if(currentCellList[i].innerHTML === "X")
				return "X";
			else
				return "O";
		}

	for (var i = 0; i < 3; i++)
		if(currentCellList[i].innerHTML !== "" && currentCellList[i].innerHTML === currentCellList[i+3].innerHTML && currentCellList[i].innerHTML === currentCellList[i+6].innerHTML)
		{
			if(currentCellList[i].innerHTML === "X")
				return "X";
			else
				return "O";
		}


	if(currentCellList[0].innerHTML !== "" && currentCellList[0].innerHTML === currentCellList[4].innerHTML && currentCellList[0].innerHTML === currentCellList[8].innerHTML)
	{
			if(currentCellList[0].innerHTML === "X")
				return "X";
			else
				return "O";
	}

	if(currentCellList[2].innerHTML !== "" && currentCellList[2].innerHTML === currentCellList[4].innerHTML && currentCellList[2].innerHTML === currentCellList[6].innerHTML)
		return currentCellList[2].innerHTML;
/*	{
			if(currentCellList[2].innerHTML === "X")
				return "X";
			else
				return "O";
	}*/

	var count = 0;

	for (var i = 0; i<currentCellList.length; i++)
		if ( currentCellList[i].innerHTML !== "")
			count++;

	if (count === currentCellList.length)
		return 0;

	return -1;

}


for(var i = 0; i < 3; i++)
	resetButton[i].addEventListener("click",function() {

		console.log("button has been pressed!");

		for(var i=0; i < cellList.length; i++)
			cellList[i].innerHTML="";

		yourTurn = true;
		player = 0;

		this.parentNode.classList.add("playerReset");

	});

function computerChoice() {
	var cellListCurrent = document.querySelectorAll("div.cell");
	var openSquares = [];

	for (var i = 0; i < cellListCurrent.length; i++)
		if (cellListCurrent[i].innerHTML === "")
			openSquares.push(i);

	if(openSquares.length === 0)
		return;

	var openSlot = true;
	var randChoice;

	while(openSlot)
	{
		randChoice = Math.round(Math.random()*8);

		for(var i=0; i<openSquares.length;i++)
			if (openSquares[i] === randChoice)
				openSlot = false;
	}

	if(player%2 === 0)
	{
		cellListCurrent[randChoice].innerHTML = "X";
		player++;
		yourTurn = true;

	}
	else
	{
		cellListCurrent[randChoice].innerHTML = "O";
		player++;
		yourTurn = true;

	}

}

function computerChoice2() {
	var cellListCurrent = document.querySelectorAll("div.cell");
	var firstOpenSquares = [];
	var tempArrayOfValues = [];
	var firstXCount =0;
	var firstOCount =0;

	for (var i = 0; i < cellListCurrent.length; i++)
	{
		tempArrayOfValues.push(cellListCurrent[i].innerHTML);

		if (cellListCurrent[i].innerHTML === "")
			firstOpenSquares.push(i);
		else if(cellListCurrent[i].innerHTML === "X")
			firstXCount++;
		else
			firstOCount++;

	}

	console.log(firstOpenSquares.length);

	if(firstOpenSquares.length === 0)
		return;

	var openSlot = true;
	var randChoice;
	var bestChoice = firstOpenSquares[0];
	var rankedList = [];

	for (var i =0; i<firstOpenSquares.length;i++)
	{
		rankedList.push([choiceRanker(tempArrayOfValues,firstOpenSquares[i],firstXCount,firstOCount), firstOpenSquares[i]]);
		if (choiceRanker(tempArrayOfValues,firstOpenSquares[i],firstXCount,firstOCount) >= choiceRanker(tempArrayOfValues,bestChoice,firstXCount,firstOCount))
			bestChoice = firstOpenSquares[i];
	}

/*	for (var i =0; i<firstOpenSquares.length;i++)
	{
		rankedList.push([choiceRanker(tempArrayOfValues,firstOpenSquares[i],1), firstOpenSquares[i]]);
		if (choiceRanker(tempArrayOfValues,firstOpenSquares[i],1) <= choiceRanker(tempArrayOfValues,bestChoice,1))
			bestChoice = firstOpenSquares[i];
	}*/

	//for(var i =0;i<rankedList.length;i++)
		//console.log("Box " + rankedList[i][1] + " has a value of " + rankedList[i][0]);
	rankedList.sort(function(a, b){return b[0]-a[0]});


	/*console.log(rankedList);*/



	if(player%2 === 0)
	{
		cellListCurrent[bestChoice].innerHTML = "X";
		player++;
		yourTurn = true;

	}
	else
	{
		cellListCurrent[bestChoice].innerHTML = "O";
		player++;
		yourTurn = true;

	}

}




function choiceRanker (arrayOfValues, possChoice, Xcount, Ocount) {

	var newArrayOfValues = [];



	var newXcount = Xcount;

	var newOcount = Ocount;

	for (var i = 0; i<arrayOfValues.length;i++)
		newArrayOfValues.push(arrayOfValues[i]);

	if(newXcount === newOcount)
	{
		newArrayOfValues[possChoice]="X";
		newXcount++;
	}
	else
	{
		newArrayOfValues[possChoice]="O";
		newOcount++;
	}

	var game = detectWin(newArrayOfValues);

	if (game !== null)
	{
		//console.log(newArrayOfValues + " " + game);
		return game;
	}

	var openSquares = [];

	for (var i = 0; i < newArrayOfValues.length; i++)
		if (newArrayOfValues[i] === "")
			openSquares.push(i);

	var runningTotal = 0;

	for(var i = 0; i<openSquares.length; i++)
		runningTotal = runningTotal + choiceRanker(newArrayOfValues,openSquares[i],newXcount,newOcount);

	return runningTotal;




}

function choiceRanker2 (arrayOfValues, possChoice, depth) {

	var newArrayOfValues = [];
	var newXcount = 0;
	var newOcount = 0;
	var newDepth = depth;


	for (var i = 0; i<arrayOfValues.length;i++)
	{
		if(arrayOfValues[i] === "X")
			newXcount++;
		else if (arrayOfValues[i] === "O")
			newOcount++;

		newArrayOfValues.push(arrayOfValues[i]);
	}



	if(newXcount === newOcount)
	{
		newArrayOfValues[possChoice]="X";
		newXcount++;
		newDepth++;
	}
	else
	{
		newArrayOfValues[possChoice]="O";
		newOcount++;
		newDepth++;
	}

	var game = detectWin(newArrayOfValues);

	if (game !== null)
	{
		//console.log(newArrayOfValues + " " + game);
		return game/newDepth;
	}

	var openSquares = [];

	for (var i = 0; i < newArrayOfValues.length; i++)
		if (newArrayOfValues[i] === "")
			openSquares.push(i);

	var runningTotal = 0;

	for(var i = 0; i<openSquares.length; i++)
		runningTotal = runningTotal + choiceRanker(newArrayOfValues,openSquares[i],newDepth);

	return runningTotal;




}

function detectWin(arry)
{
	for (var i = 0; i < 9; i+=3)
		if(arry[i] !== "" && arry[i] === arry[i+1] && arry[i] === arry[i+2])
		{
			if(arry[i] === "X")
				return -1;
			else if (arry[i] === "O")
				return 1;
		}

	for (var i = 0; i < 3; i++)
		if(arry[i] !== "" && arry[i] === arry[i+3] && arry[i] === arry[i+6])
		{
			if(arry[i] === "X")
				return -1;
			else if (arry[i] === "O")
				return 1;
		}


	if(arry[0] !== "" && arry[0] === arry[4] && arry[0] === arry[8])
	{
			if(arry[0] === "X")
				return -1;
			else if (arry[i] === "O")
				return 1;
	}

	if(arry[2] !== "" && arry[2] === arry[4] && arry[2] === arry[6])
	{
			if(arry[2] === "X")
				return -1;
			else if (arry[i] === "O")
				return 1;
	}

	var count = 0;

	for (var i = 0; i< arry.length; i++)
		if ( arry[i] !== "")
			count++;

	if (count === arry.length)
		return 0;

	return null;

}




});







