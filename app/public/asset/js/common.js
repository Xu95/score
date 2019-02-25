function operationData(myurl,method,data){
    return $.ajax({
                type:method,
                // url:"http://172.20.12.2:8888" + myurl,
                // url:"http://localhost:3000" + myurl, 
                url:"http://172.20.12.2:3000" + myurl,                                                           
                data:data,
            })
}