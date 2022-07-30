
/**
 * Project Name: TypeScript - Copy To Clipboard
 * */
 
class CopyToClipboard {
    
    method : string;
    element : HTMLButtonElement;
    
    __clickCallback : Function = () => {};
    __thenCallback : Function = () => {};
    __catchCallback : Function = () => {};
    
    // Time to re-interact again
    __interval : number;
    
    __selections : {[id:string]:Function};
    
    constructor(element : HTMLButtonElement) {
        
        // Check Available Method For Copying
        if (window.navigator && window.navigator.clipboard) {
            this.method = "nav";
        
        // @ts-expect-error
        } else if(document.execCommand) {
            this.method = "exec";
        } else {
            throw new Error("No Available Method To Use CopyToClipboard");
        }
        
        this.element = element;
        
        // Private
        this.__interval = 1000;
        this.__selections = {
            "nav" : this.__copyNavigator,
            "exec" : this.__copyExec
        };
        
        // Prevent Spamming Buttons
        const clickEvent : EventListenerOrEventListenerObject = () => {
            window.setTimeout(() => this.element.addEventListener("click", clickEvent), this.__interval);
            this.element.removeEventListener("click", clickEvent);
            
            this.click()
        }
        
        element.addEventListener("click", clickEvent, false);
    }
    
    __copyExec(str : string, s : Function) : void {
        if(document.execCommand("copy")) s();
        else throw new Error("Error While Copying");
    }
    
    __copyNavigator(str : string, s : Function) : void {
        // @ts-expect-error
        window.navigator.clipboard.writeText(str).then(s).catch((e:Event) => { throw e });
    }
    
    /**
     * es3 doesn't support private property
     * */
    __sanitizeString(str: string) : string {
        return str.trim();
    }
    
    click() : void {
        try {
            let str:string = this.__clickCallback(this.element);
            str = this.__sanitizeString(str);
           
            this.__selections[this.method](str, this.__thenCallback);
        } catch(e) {
            this.__catchCallback(e);
        }
    }
    
    onClick(callback : Function) : this {
        this.__clickCallback = callback;
        return this;
    }
    
    then(callback : Function) : this {
        this.__thenCallback = callback;
        return this;
    }
    
    catch(callback : Function) : this {
        this.__catchCallback = callback;
        return this;
    }
}

/**
 * Written By Jovan De Guia
 * Project Name: Copy To Clipboard
 * Github: jxmked
 * */