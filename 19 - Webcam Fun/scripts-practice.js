
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// first we need to get video so we will create a function
function getVideo () {
// the way we get video off of user is we use navigator.mediaDevices.getUserMedia
// this returns a promise
//
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    // with promise we can call .then
    // .then gives us something calles localMediaStream and we will run a function
    .then(localMediaStream => {
      console.log(localMediaStream);
      // we will take our video and set the source to be localMedia stream
      // since this is an object, its not going to work automatically
      // for this to work, we need to convert the localMediaStream to an URL
      // URL is easy to read so we will wrap it with window.URL.createObjectURL
      // this will convert the media stream into something video player can understand

      // video.src = window.URL.createObjectURL(localMediaStream); // looks deprecated
      // https://stackoverflow.com/a/53821674
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error('Oh no!!!', err);
    });
}
// Take a frame from the video and paint it to the canvas
// we create a function and give it height and width
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  // when we console log and call the paintToCanvas function in the console
  // it gives us W & H coming from my video
  // console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  // now what we want to do is that every few millisecconds we want to take photo from the live video
  // and save it in the canvas
  // we are going to create a function setInterval which is going to take photo every 16 ms
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
  }, 16);
}
// we want to take photo
// we will work on audio first
function takePhoto() {
  // this will make sound when we call take photo function
  snap.currentTime = 0;
  snap.play();
  // now that we already played the sound
  // what we can do is take the data out of the canvas and we will pass the image
  // after this  we are going to add event listener in the last line
  const data = canvas.toDataURL('image/jpeg');
  // console.log(data);
  // we get lots of description which is called "Base64"
  // text based representation of the picture of me
  // what we can do is create a link and image to put it in our strip

  // this is creating an anchor link. "link.href is going to equal the data"
  const link = document.createElement('a');
  // we are setting href for the anchor tag
  // we are putting image in anchor tags href attribute
  link.href = data;
  // we are setting download attribute with value beautiful
  link.setAttribute('download', 'beautiful');
  // link.textContent = 'Download Image';
  // we will just add inner html in anchor tag
  link.innerHTML = `<img src="{data}" alt="pweety girl" />`;

  strip.insertBefore(link, strip.firstChild);
}

getVideo();

// right now we are calling paint to canvas manually
// we will add an event listener called 'canplay', then run the function 'painTocanvas'
// this will run the video.play() function,
// once the video is playing its going to emit an event called "canplay"
// then canvas will start to piantToCanvas

video.addEventListener('canplay', paintToCanvas);
