const imageList = images;
const duration = 3000; //the interval between the image to start the transition
const pictures = [];

var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = raf;


// variables for controlling the canvas animation
var start, previousTimeStamp, running = true, pause = false, currentPicture = 0;


/**
 * The callback function of the window.requestAnimationFrame
 * @param  {timestamp} microseconds 
 * @return {null} loop until the end
 * @References
 * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 * https://ithelp.ithome.com.tw/articles/10186735 
 */
function step(timestamp) {
    if(running){
        // restore the start time of the image transition
        if (start === undefined){
            start = timestamp;
        }
        const elapsed = timestamp - start;

        if (previousTimeStamp !== timestamp) {
            // To ensure the progress will not larger than 100%
            const progress = Math.min(elapsed / duration, 1);
            // call the draw function along with the prgress
            draw(progress)
        }
        if ((elapsed / duration) < 1) { 
            previousTimeStamp = timestamp
            window.requestAnimationFrame(step);
        }else {
            // reset the transition after the image finish the transition
            start = undefined;
            if (++currentPicture == imageList.length){
                currentPicture = 0
            }
            running = false
            // awake the transition animation after 3 seconds if there is no other external interfere (canvas event)
            setTimeout(() => {
                console.log(pause)
                if(running == false & pause == false){
                    running = true
                    window.requestAnimationFrame(step)
                }
            }, 3000);
        }
    }
}




/**
 * Draw function of the canvas and will update base on the progress
 * @param  {progress} float the percentage for transiting the image  
 * @return {null} loop until the end
 * @References
 * https://cloud.tencent.com/developer/ask/78516 get the image to the canvas size ratio 
 * https://stackoverflow.com/questions/16317971/draw-images-on-in-the-middle-of-a-canvas/16318071 
 */
const draw = (progress) => {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = `rgba(255, 255, 255, ${progress == 1 ? 1 : progress - 0.4})`
    ctx.fillRect(canvas.width - canvas.width * progress, 0, canvas.width, canvas.height);
    ratioX = canvas.width / pictures[currentPicture].naturalWidth;
    ratioY = canvas.height / pictures[currentPicture].naturalHeight;
    ratio = Math.min(ratioX, ratioY);
    offsetX = pictures[currentPicture].naturalWidth * ratio < canvas.width ? ((canvas.width - pictures[currentPicture].naturalWidth * ratio) / 2) : 0;
    offsetY = pictures[currentPicture].naturalHeight * ratio < canvas.height ? ((canvas.height - pictures[currentPicture].naturalHeight * ratio) / 2) : 0;
    ctx.drawImage(pictures[currentPicture],  offsetX + canvas.width - canvas.width * progress, offsetY, pictures[currentPicture].naturalWidth * ratio, pictures[currentPicture].naturalHeight * ratio)
}



/**
 * Preloading all the image into picture array and then start the transition animation
 * @param  {imageList} StringArray the name list of the image  
 * @return {null} 
 * @References
 * //https://stackoverflow.com/questions/3032299/checking-for-multiple-images-loaded
 */
const loadImages = (imageList) => {
    var imagesLoaded = 0;
    for(var i = 0; i < imageList.length; i++){
        pictures[i] = new Image()
        pictures[i].onload = () =>{
            imagesLoaded++;
            if(imagesLoaded == imageList.length){
                window.requestAnimationFrame(step);
            }
        }
        pictures[i].src = `images/${imageList[i]}`
    }
}

document.getElementById("myCanvas").addEventListener(`click`, () => {
    // only allow to start a new animation when the transition animationis not running 
    if(running == false){
        // told the previous step function that there will have a new step function operating 
        // and don't start another step function after the setTimeOut
        running = true
        window.requestAnimationFrame(step)
    }
})

document.getElementById("myCanvas").addEventListener(`mouseover`, () => {
    // tell the step function don't start a new step function after the whole transition progress is done
    pause = true
})

document.getElementById("myCanvas").addEventListener('mouseout', () => {
    if(running == false){
        // the animation is pause in the setTimeOut period
        pause = false
        running = true
        window.requestAnimationFrame(step)
    }else{
        // the animation is still in the operation period, just reset the pause to false for the mouseover
        pause = false
    }
})

loadImages(imageList)
