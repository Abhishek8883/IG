var storyData = 0;
var middleTop = document.querySelector("#middleTop")
var currentIndex = 0;
var overlay = document.querySelector("#overlay")
var temp = ``
var interval = null;




axios.get('/getdata')
.then(function(recievedData){
  storyData = recievedData.data.allStory
})


function show(){
    
    middleTop.addEventListener('click',function(val){
        var index = Number(val.target.id)
        currentIndex = index
        interval = setInterval(template,5000)    
        cancel()
    })
}

function template(){
    if(storyData.length>currentIndex){
        temp = `<div class="showStory">
            <div class="storyTop">
            <div class="userimg">
                <img src="../images/profilePics/${storyData[currentIndex].author.profilePic[0]}" alt="">
            </div>
            <div class="storyTopText">
            <h3>${storyData[currentIndex].author.username}</h3>
            <h6>${storyData[currentIndex].date}</h6>
            <span id="cancelButton"><i class="ri-close-line"></i></span>
        </div>
            </div>  
            <div class="mainimg">
                <img src="../images/story/${storyData[currentIndex].image[0]}" alt="">
            </div> 
        </div>`
        overlay.innerHTML = temp;
        overlay.style.display = "initial"
        currentIndex++
    }
    else{
        clearInterval(interval)
        overlay.style.display = "none"
    }
}


function cancel(){
var cancelButton = document.querySelector("#cancelButton")
    cancelButton.addEventListener('click',function(){
        overlay.style.display = "none"
    })
}


show()


