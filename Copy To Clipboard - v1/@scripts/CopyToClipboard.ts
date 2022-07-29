
/**
 * Project Name: TypeScript - Copy To Clipboard
 * */
 
class CopyToClipboard {
    method : string;
    clickCallback : Function = () => {};
    thenCallback : Function = () => {};
    catchCallback : Function = () => {};
    
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
        
        const selections : {[id:string]:Function} = {
            "nav" : this.copyNavigator,
            "exec" : this.copyExec
        };
        
        let ival : ReturnType<typeof window.setTimeout>;
        let flag : boolean = false;
        
        element.addEventListener("click", (e) => {
            if(flag) return;
            
            ival = window.setTimeout(() => flag = false, 1000)
            flag = true;
            
            try {
                let str:string = this.clickCallback(element);
                str = this.__sanitizeString(str);
                
                selections[this.method](str, this.thenCallback, this.catchCallback);
            } catch(e) {
                this.catchCallback(e);
            }
        });
        
    }
    
    copyExec(str : string, s : Function, c : Function) : void{
        if(document.execCommand("copy")) s();
        else c();
    }
    
    copyNavigator(str : string, s : Function, c : Function) : void {
        // @ts-expect-error
        window.navigator.clipboard.writeText(str).then(s).catch(c);
    }
    
    /**
     * es3 doesn't support private property
     * */
    __sanitizeString(str: string) : string {
        return str.trim();
    }
    onClick(callback : Function) : this {
        this.clickCallback = callback;
        return this;
    }
    then(callback : Function) : this {
        this.thenCallback = callback;
        return this;
    }
    catch(callback : Function) : this {
        this.catchCallback = callback;
        return this;
    }
}

/**
 * Written By Jovan De Guia
 * Project Name: Copy To Clipboard
 * Github: jxmked
 * */