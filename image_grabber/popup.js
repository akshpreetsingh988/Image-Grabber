const grabBtn = document.getElementById("grabBtn");
grabBtn.addEventListener("click",() => {    
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        if (tab) {
            execScript(tab);
        } else {
            alert("There are no active tabs") 
        }
    })
})

function execScript(tab) {
    chrome.scripting.executeScript(
        {
            target:{tabId: tab.id, allFrames: true},
            func:grabImages
        },
        onResult
    )
}

function grabImages() {
    const images = document.querySelectorAll("img"); 
    const pics=  document.getElementsByTagName("img") ; 
    for(let i=0 ; i<pics.length; i++) 
    {
        const button = document.createElement("button" ) ; 
        button.innerHTML = "U like this pic huh ? "   ; 
        button.style.position = "absolute" ; 
        button.style.bottom = "0"  ;  
        button.style.backgroundColor= "white" ;  
        button.style.color = "black" ;   
        button.style.zIndex = 1000; 
        button.addEventListener("click", function() {
            alert("Here's the image  :" + images[i].src);
          }); 
        pics[i].parentNode.appendChild(button);
    }
    return Array.from(images).map(image=>image.src);    
}

function onResult(frames) {
    if (!frames || !frames.length) { 
        alert("Could not retrieve images from specified page");
        return;
    }
    const imageUrls = frames.map(frame=>frame.result)
                            .reduce((r1,r2)=>r1.concat(r2));
    window.navigator.clipboard
          .writeText(imageUrls.join("\n"))
          .then(()=>{
             window.close();
          });
}