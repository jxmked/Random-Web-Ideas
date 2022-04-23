class CopyPaste {
    constructor(btn){
        this.cb = {}
        this.cb.then = () => {};
        this.cb.catch = () => {};
        this.cb.click = () => {};
        
        let nav = (window && window.navigator && window.navigator.clipboard);
        let exec = (document && document.execCommand);
        
        if(! nav && ! exec){
            btn.setAttribute("data-state", "unsupported")
            return {
                click : x => this,
                success : x => this,
                fail : x => this,
                then : x => this,
                'catch' : x => this
            }
        }
       
        this.btn = btn
        this.COPIED;
        
        /**
         * Take a break on copying
         **/
        this.pause = false
        this.interval = 1000
        
        this.btn.addEventListener("click", () => {
            if(this.pause) return
            
            /**
             * Incase we have logic on click event
             * that throws an error
             * */
            try {
                this.setText(this.cb.click(this.btn))
            } catch(e) {
                this.cb.catch(e)
                return
            }
            
            /**
             * Empty value does not have space on clipboard. =)
             * */
            if(this.COPIED == "" || this.COPIED == null){
                //Error
                this.cb.catch("empty-string")
                return
            }
            
            if(nav){
                this.useNavigator()
            }else if(exec){
                this.useExecute()
            }
            
            this.pause = true
            
            setTimeout(() => {
                this.pause = false
            }, this.interval)
        })
        
        return this
    }
    useNavigator(){
        window.navigator.clipboard
            .writeText(this.COPIED)
                .then(this.cb.then)
                .catch(this.cb.catch)
    }
    useExecute(){
        document.execCommand("copy") ? this.cb.then() : this.cb.catch("execcommand-unsupported");
    }
    setText(text){
        this.COPIED = String(text)
    }
    click(callback){
         if(callback) {
            this.cb.click = callback
            return this
         }
         
         this.btn.dispatchEvent("click")
    }
    success(callback){
        this.cb.then = callback
        return this
    }
    fail(callback){
        this.cb.catch = callback
        return this
    }
}