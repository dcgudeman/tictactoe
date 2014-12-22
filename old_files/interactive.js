var styleListElements = function(){

	var list_items = document.querySelectorAll("div#essentials > ul > li");

	for (var i = list_items.length - 1; i >= 0; i--) {
		list_items[i].style.backgroundColor = "yellow";
	}
};

var liRed = function() {

	var el = document.querySelectorAll("li");

	for ( i=0 ; i < el.length ; i++ )
	{
		el[i].style.backgroundColor ="red";
	}

};

function resetButtonHandler () {
	alert("Click!");
	liRed(); 
}

function changeGreeting () {
	var greeting_div = document.getElementById('greeting');
	greeting_div.innerHTML = "Hello Planet Earth!";
}


var initialize = function () {

	changeGreeting();
	styleListElements();
	// liRed();
	document.querySelector("#reset").onclick = resetButtonHandler;
	document.getElementById("myDiv").addEventListener("click",resetButtonHandler);
};





















window.onload = initialize;
console.log("JavaScript is alive");











































