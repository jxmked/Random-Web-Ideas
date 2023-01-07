
const canvas = <HTMLCanvasElement> document.getElementById("canvas")!;
const btn = {
    left: <HTMLButtonElement> document.getElementById("left")!,
    right: <HTMLButtonElement> document.getElementById("right")!,
    up: <HTMLButtonElement> document.getElementById("up")!,
    down: <HTMLButtonElement> document.getElementById("down")!,
    upLeft: <HTMLButtonElement> document.getElementById("up-left")!,
    upRight: <HTMLButtonElement> document.getElementById("up-right")!,
    downLeft: <HTMLButtonElement> document.getElementById("down-left")!,
    downRight: <HTMLButtonElement> document.getElementById("down-right")!
}

const ctx = canvas.getContext('2d')!
const currentPos = {
    w: 0,
    h: 0
}

const speed = 5
const size = 30
const rapidTrigger = 1
const isOutline = false

/**
 * My Old Hold Button Object.
 * Press and hold a button for rapid trigger
 * 
 * Link: https://github.com/jxmked/Random-Web-Ideas/tree/xio/Press%20%26%20Hold%20Button
 * */
class HoldButton {
    /**
     * Private Properties
     * */
    __has:{[id:string]:boolean};
    __callbacks:{[id:string]:Function};
    __setTimeout:number;
    __responseTime:number;
    __userdata:{[id:string]:any};
    __element:HTMLElement;
    
    /**
     * Require DOM element
     * */
     
    constructor(element:HTMLElement) {
        
       /* if(element instanceof Element)
            throw new TypeError("HoldButton requires DOM element")
        */
        this.__has = {
            "onhold" : false,
            "onunhold" : false
        };
        
        this.__callbacks = {
            "main" : () => {},
            "hold" : () => {},
            "unhold" : () => {}
        };
        
        this.__setTimeout = 0;
        this.__userdata = {
            "main" : () => {}
        };
        
        this.__responseTime = 1000; // Millisecond
        this.__element = element;
        
        this.__init__();
    }
    
    /**
     * Private Properties
     * */
    
    __init__():void {
        if('ontouchstart' in this.__element && 'ontouchend' in this.__element) {
            // For Mobile Devices
            this.__element.addEventListener("touchend", (e:Event) => this.__stop__(e), false);
            this.__element.addEventListener("touchstart", (e:Event) => this.__start__(e), false);
        } else if('onmousedown' in this.__element && 'onmouseup' in this.__element) {
            // For Desktop type devices
            
            /**
             * My best way of solving...mouseup did not fire if
             * the cursor is out of element.
             * 
             * Side Effect: If mouse leave the element
             *      while onclick it also stop
             * */
            this.__element.addEventListener('mouseleave', (e:Event) => this.__stop__(e), false);
            this.__element.addEventListener('mouseup', (e:Event) => this.__stop__(e), false);
            this.__element.addEventListener('mousedown', (e:Event) => this.__start__(e), false);
        } else {
            throw new Error("No Available Event Listener");
        }
    }
    
    /**
     * Events 
     * */
    __stop__(e:Event):void {
        if(e.cancelable) e.preventDefault();
        
        try {
            if(e.type != "mouseleave")
                this.click();
            
            this.__callbacks["unhold"](this.__userdata);
        } catch(TypeError){}
            
        /** Stop or Prevent Timeout to initiate **/
        clearTimeout(this.__setTimeout);
    }
    __start__(e:Event):void {
        if(e.cancelable) e.preventDefault();
        
        this.__setTimeout = window.setTimeout(() => {
            this.__callbacks["hold"](this.__userdata);
        }, this.__responseTime);
    }
    
    /**
     * Public Properties
     * */
    click():void {
        this.__callbacks["main"](this.__userdata);
    }
    
    onClick(callback:Function):this {
        this.__callbacks["main"] = callback;
        this.__userdata["main"] = callback;
        return this;
    }
    
    onHold(callback:Function, response?:number):this {
        if(response && typeof response === "number")
            this.__responseTime = response;
        
        if(this.__has["onhold"])
            throw new TypeError("onHold can be called only once");
        
        this.__has["onhold"] = true;
        this.__callbacks["hold"] = callback;
        
        return this;
    }
    
    onUnHold(callback:Function):this {
        if(this.__has["onunhold"])
            throw new TypeError("onUnHold can be called only once");
        
        this.__has["onunhold"] = true;
        this.__callbacks["unhold"] = callback;
        return this;
    }
}


function Start(data : {[id:string]:any}){
    // Click Every 100ms
    data["ival"] = setInterval(() => {
        data["main"]();
    }, rapidTrigger)
}

function Stop(data:{[id:string]:any}){
    clearInterval(data["ival"]);
}

/**   **  **/


/** Triangle Object */
function triangle(x:number, y:number) {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    
    let w = currentPos.w + x;
    let h = currentPos.h + y;
    
    // Lets add some boundaries
    if (w <= 0 + size)
        w = 0 + size
    else if (w >= width - size)
        w = width - size
    
    if (h <= 0)
        h = 0
    else if (h >= height - (size * 2))
        h = height - (size * 2)
    
    // Draw Our Triangle
    ctx.beginPath()
    
    // Start the cursor in x, y position
    ctx.moveTo(w, h)
    
    // From current cursor position to next x,y position
    ctx.lineTo(w + size, h + (size * 2))
    ctx.lineTo(w - size, h + (size * 2))
    
    // Put back our cursor into moveTo position
    ctx.closePath()
    
    // Styling
    if (isOutline) {
        ctx.strokeStyle = "blue" // Outline
        ctx.lineWidth = 2
        ctx.stroke() // Outline
    } else {
        ctx.fillStyle = "blue"
        ctx.fill()
    }
    
    // Save last position
    currentPos.w = w;
    currentPos.h = h;
}

// Always set canvas dimension into max window size
window.addEventListener("resize", () => {
    // Anti Alias
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    
    currentPos.w = Math.abs(canvas.width / 2)
    currentPos.h = Math.abs(canvas.height / 2)
    triangle(0,0)
});


// Trigger Resize Event 
window.dispatchEvent(new Event('resize'));

const factory = (e:HoldButton, x:number, y:number) => {
    e.onClick(() => triangle(x, y))
    e.onHold(Start, 400)
    e.onUnHold(Stop)
}

factory(new HoldButton(btn.up), 0, -speed)
factory(new HoldButton(btn.down), 0, speed)
factory(new HoldButton(btn.left), -speed, 0)
factory(new HoldButton(btn.right), speed, 0)
factory(new HoldButton(btn.upLeft), -speed, -speed)
factory(new HoldButton(btn.upRight), speed, -speed)
factory(new HoldButton(btn.downLeft), -speed, speed)
factory(new HoldButton(btn.downRight), speed, speed)
