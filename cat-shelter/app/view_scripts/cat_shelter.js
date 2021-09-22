const urlParams = new URLSearchParams(location.search);         

function getCatData(){    
                   
    fetch(`/apiGetCatDataById?id=${urlParams.get('id')}`).then(function(response){
        response.json().then(function(data){  
            console.log(data);
            document.getElementById('name').value = data.name;
            document.getElementById('description').value = data.description;
            document.getElementById('breed').value = data.breed; 
            document.getElementById('image').src = `content/images/${data.image}`;            
        });            
    });      
}
       
getCatData()