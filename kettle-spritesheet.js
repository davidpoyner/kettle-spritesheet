function SpriteSheet( options ){
  this.init( options );
};

SpriteSheet.prototype = {
  fps:20,
  framerate:1000/60,

  debug:false,

  width:null,
  height:null,

  currentFrame:1,
  scale:0.8,

  rows:null,
  columns:null,
  frames:null,
  src:null,
  cb:null,

  image:null,
  canvas:null,
  rAF:null,
  start:null,

  isForward:true,

  init : function( options ){
    this.canvas = options.canvas || document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.framerate = 1000/this.fps;

    if (!options) return;
    this.setupSpritesheet(options);
  },

  drawAtPercent : function(percent){
    this.currentFrame = Math.round(percent * this.frames);
    this.draw();
  },

  setupSpritesheet:function( options ){
    this.width = options.image.width / options.columns;
    this.height = options.image.height / options.rows;
    
    if (this.image) this.destroyImage();

    this.setRows(options.rows);
    this.setColumns(options.columns);
    this.setFrames(options.frames);
    this.setImage(options.image);
    this.cb = options.cb || null;
    this.currentFrame = 1;

    this.draw();
  },

  destroyImage: function(){
    this.image.onload = null;
    this.image = null;
  },

  setTime : function(){
    this.start = Date.now();
    this.currentTime = this.start;
    this.totalTime =  (this.frames/this.fps) * 1000;
    this.endTime = this.currentTime + (this.totalTime);

    if (this.debug){
      console.log("Frames = " + this.frames);
      console.log("Frames Per Second = " + this.fps);
      console.log("Total time in ms = " + this.totalTime);
      console.log("Start Time = " + this.start);
      console.log("End Time = " + this.endTime);
    }
  },
  
  play : function(){
    this.setTime();
    this.update();
  },

  draw : function(){
    var columnNumber = this.currentFrame % this.columns,
        rowNumber = Math.floor(this.currentFrame/this.columns);

    this.ctx.drawImage(this.image, this.width * columnNumber, this.height * rowNumber, this.width, this.height, 0, 0, this.canvas.width, this.canvas.width * (this.height/this.width) * this.scale);
  }, 
  time:Date.now(),

  update: function( timestamp ){
    var now = Date.now(),
    dt = now - (this.previousTime || now);
    
    dt = Math.min(16, dt);

    this.previousTime = now;

    this.currentTime += dt;


    var dist = Math.max((this.endTime - this.currentTime), 0);
    var perc = this.isForward - (dist /this.totalTime);
    var frameToDraw = Math.abs(Math.ceil(perc * this.frames));
    if (this.debug) console.log(frameToDraw);
       
    this.rAF = window.requestAnimationFrame( function(){this.update()}.bind(this) );

    if(this.currentTime > this.endTime){
      if(this.cb) this.cb();
      window.cancelAnimationFrame(this.rAF);
      
      if (this.debug) console.log("Elapsed time: " + Date.now() - this.start);
    }
    
    this.currentFrame = frameToDraw;
    this.draw(frameToDraw);

  },
  reverse:function(){
    this.isForward = !this.isForward;
  },
  setRows:function(rows){this.rows = rows;},
  setColumns:function(rows){this.columns = rows;},
  setCurrentFrame:function(currentFrame){this.currentFrame = currentFrame;},
  setWidth:function(width){this.width = width;},
  setHeight:function(height){this.height = height;},
  setImage:function(image){this.image = image;},
  setFrames:function(frames){this.frames = frames; this.setTime();}
};

module.exports = SpriteSheet;
