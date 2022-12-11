
$(document).ready(function(){
    var activehref=localStorage.activehref; 
    // localStorage.removeItem("activehref")
    // localStorage.removeItem("score")
    // localStorage.removeItem("allcountries")

    if(localStorage.getItem("score") === null){
        localStorage.score=0;
    }
  
    if(localStorage.getItem("activehref") === null){
        $('.nav-pills li:first .nav-link').addClass("active");
        activehref="#1";
        get_data(activehref);
    }
    else if(localStorage.getItem("activehref")){
        get_data(activehref);
    }
    $('[data-toggle="tabajax"]').click(function(e) {
        var $this = $(this);
        $(".nav-link").removeClass("active");
        $this.addClass("active");
        $(".tab-pane").removeClass("show active");
        $($(this).attr('href')).addClass("show active");
        get_data($(this).attr('href'));
    });
});

function  get_data(id){
    $('.tab-content').empty();
    localStorage.activehref=id; 
    $('.nav-link').removeClass("active");
    $('.nav-link[href='+"'"+id+"'"+']').addClass("active");
    $('.nav-link').addClass("disabled");
    const hrefid=id.replace("#","");
    $('.nav-link[href='+"'"+id+"'"+']').removeClass("disabled");
    const nexttab=(parseInt(hrefid)+ +1);
    $('.nav-link[href='+"'#"+nexttab+"'"+']').removeClass("disabled");
    if(hrefid==10){
        $('.tab-content').append('<div class="row justify-content-center align-items-center p-3 h-75 "><div class="col-md-12"><h4 class="text-center">You have '+ localStorage.score+' correct  answers!</h4></div><div class="col-md-12 text-center"><button type="button" class="btn btn-primary" onclick="startover()">Start Over</button></div></div>');
    }
    else {
    let url="https://restcountries.com/v3.1/region/europe";
    let $arr = new Array;
    var all = (localStorage.getItem("allcountries")===null)? new Array: JSON.parse(localStorage.allcountries);
   
    $.getJSON(url, function(json) {
        $.each(json, function(index, value) {
            const newOption ={"country":value.name.common,"capital":value.capital?.[0],'id':value.cca2}; 
            $arr.push(newOption);
        });
        //to avoid duplication of countries
        $arr = $arr.filter( function( el ) {
            return all.indexOf( el ) < 0;
        });
        //get 1 random country
        let countries= getMultipleRandom($arr, 1);
        let cities = getMultipleRandom($arr, 3);
        //get unique city
        cities = cities.filter( function( el ) {
          return countries.indexOf( el ) < 0;
        });

        all.push(countries);
        localStorage.setItem('allcountries', JSON.stringify(all));
        $.each(countries, function(index, value) { 
            cities  = cities.concat(value);
            cities.sort((a, b) =>
            ("" + a.capital).localeCompare(b.capital)
             );
                let stringarray='<div class="tab-pane fade" role="tabpanel" aria-labelledby="home-tab">';

                stringarray="<h4 class='h4 pt-3' style='margin-left:20px'>What is the capital city of "+value.country+"? </h4>";

                stringarray+='<div class="row mt-2 p-4" style="margin-left:50px"><div class="col-md-12 ml-5">';
                $.each(cities, function(indexc, valuec) {
                    let checktrueanswer=(valuec.capital==value.capital)?1:0;

                    stringarray+='<div class="form-check"><input class="form-check-input" id='+valuec.id+'  onclick="checktrue('+checktrueanswer+','+"'"+$(this).attr('id')+"'"+','+"'"+value.id+"'"+','+nexttab+');" type="checkbox" value="" id="flexCheckChecked" ><label class="form-check-label" for="flexCheckChecked">'+valuec.capital+'</label></div>';
                });
                stringarray+='</div></div></div>';
                $('.tab-content').prepend(stringarray);
        });
    });
    }
}
function checktrue(checktrueanswer,id,trueanswerid,nexttab){
    let successalert='<div class="row justify-content-end align-items-end p-3"><div class="col-md-6 text-start"><div class="alert alert-success fw-bold" role="alert">This is correct answer, You have one more score!</div></div></div>';

    let erroralert='<div class="row justify-content-end align-items-end p-3 "><div class="col-md-6 text-start"><div class="alert alert-danger fw-bold" role="alert">This is incorrect answer!</div></div></div>';

    let nextbutton='<div class="row justify-content-end text-end p-3"><div class="col-md-2"><button type="button" class="btn btn-primary" onclick="get_data('+"'#"+nexttab+"'"+')">Next</button></div></div>';

    $('.tab-content').append(nextbutton);

    $(".form-check-input").attr("disabled",true);
    if(checktrueanswer==1){
        localStorage.score=parseInt(localStorage.score)+1;
        $("#"+id).parent().css('border','1px solid green');
        $('.tab-content').append(successalert);
    }
    else{
        if(trueanswerid) $("#"+trueanswerid).parent().css('border','1px solid green');
        $("#"+id).parent().css('border','1px solid red');
        $("#"+id).prop( "checked", false);
        $("#"+trueanswerid).prop( "checked", true);
        $('.tab-content').append(erroralert);
   }
}
function getMultipleRandom(arr, num) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
}

function startover(){
        localStorage.removeItem("activehref");
        localStorage.removeItem("score");
        localStorage.removeItem("allcountries")
        $('.nav-pills li:first .nav-link').addClass("active");
        activehref="#1";
        get_data(activehref);
}