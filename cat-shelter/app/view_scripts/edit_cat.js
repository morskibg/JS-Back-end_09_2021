const urlParams = new URLSearchParams(location.search);
const allBreedsOptions = document.getElementById('group'); 

function getCatData(){
    
    fetch('/apiGetAllBreeds').then(function(response){
        response.json().then(function(breeds){ 
            
            fetch(`/apiGetCatDataById?id=${urlParams.get('id')}`).then(function(response){
                response.json().then(function(data){  
                    
                    document.getElementById('name').value = data.name;
                    document.getElementById('description').value = data.description;
                    
                    for(breed in breeds){
                        allBreedsOptions.add( new Option(breeds[breed] ) );
                    }                        
                    allBreedsOptions.value = data.breed;                     
                });            
            });
        });
    });        
}
getCatData()
