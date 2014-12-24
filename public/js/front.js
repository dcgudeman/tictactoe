$(document).ready ( function(){

  var gamestate = function(){
    var serialized = "";
    $('.cell').each(function(index,element){

      if($(element).val()==="")
        serialized = serialized + " ";
      else
        serialized = serialized + $(element).val();

    });
    return serialized;
  };


  $('.cell').each(function(index, element){
    console.log("index is", index);
    $(element).on('click',function(event){
      $.ajax({
        type: "POST",
        url:"http://localhost:3000",
        dataType: "json",
        data: {
          index: index,
          gamestate: gamestate()
        }
      }).then(
      function(data, textStatus, jqXHR){
        console.log(data);
        console.log("success");
      },
      function(jqXHR, textStatus, errorThrown){
        console.log(errorThrown);
        console.log("error");
      });
    });
  });




});
