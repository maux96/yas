
import type { YasConfig } from './types'

export enum AnimationState {
    IdleAnimation="idle-animation",
    StartAnimation="start-animation",
    EndAnimation="end-animation"
}

class YaSlider {
    private _containerNode: HTMLElement;
    
    private _currentAnimationDirection: 1 | -1 = 1;
    private _current: number=0;
    private _currentAnimation: AnimationState=AnimationState.IdleAnimation;
    private _intervalAnimationId: number=-1;
    
    private _elements: Node[];
    private _currentElements: Node[]=[];

    private _config: YasConfig = {
        amountElements:2,
        changeTime:5,
        startEndAnimationTime:0.5,
        initialAnimationDirection: 1,
        autoAnimation: true,
        slowMovementOffset: "80px",
        animation: "default",
        animEveryItem: false 
    }; 
    
    public constructor(
        node: HTMLElement,
        config: Partial<YasConfig> | undefined = undefined
    ){

        this._config = {...this._config, ...config};
         

        //save the children as elements of the slider
        this._elements=[];
        while(node.firstChild){
            if(node.firstChild.nodeType == Node.ELEMENT_NODE)
                this._elements.push(node.firstChild);
            node.removeChild(node.firstChild);
        }

        // Creating the internal "<div>" that will contain the elements.
        this._containerNode = document.createElement('div');
        this._containerNode.classList.add('sliderinnernode');
        node.appendChild(this._containerNode);

        // refreshing de css var values...
        this.SetSpeedValues(
            this._config.changeTime,this._config.startEndAnimationTime);
        this.setAnimationClass(AnimationState.IdleAnimation);
        this.setSlowMovementOffset(this._config.slowMovementOffset);
        this.setSpecificAnimationCSS();

        if(this._config.autoAnimation){
            this.BeginIdleAnimation();
        }
        this._current=this._elements.length;
        this.Slide(this._config.initialAnimationDirection)
    }

    private BeginIdleAnimation(){
        let self: YaSlider = this;

        self._config.autoAnimation=true;
        this._intervalAnimationId = setInterval(function(){
            self.Slide(self._currentAnimationDirection);
        }, this._config.changeTime*1000);

        this.setSlowMovementOffset(this._config.slowMovementOffset);
    }
    private RestartIdleAnimation(){
        clearInterval(this._intervalAnimationId);
        this.BeginIdleAnimation();
    }

    private NextElements(direction: number){
        if(direction>0)
            this._current= (
                this._current + this._config.amountElements 
                >= this._elements.length 
                ) ? 0 : this._current + this._config.amountElements;
        else 
            this._current= this._current - this._config.amountElements < 0 
                            ? this._elements.length -
                            (this._config.amountElements -
                            (this._elements.length %
                            this._config.amountElements))
                            : this._current - this._config.amountElements ;

        this._currentElements = this._elements.slice(
            this._current,
            Math.min(
                this._current+this._config.amountElements,
                this._elements.length
            )
        );

        while(this._containerNode.firstChild)
            this._containerNode.removeChild(this._containerNode.firstChild)
        this._containerNode.append(...this._currentElements)
    }

    public async Slide(direction: 1|-1){
        if(this._currentAnimation != AnimationState.IdleAnimation)
            return;

        this._containerNode.style.setProperty(
            "--animation-direction",direction.toString()
        );

        this._currentAnimationDirection=direction;
        this.setAnimationClass(AnimationState.EndAnimation);
        await YaSlider.waitForSeconds(this._config.startEndAnimationTime);
        
        this.NextElements(direction);
        this.setAnimationClass(AnimationState.StartAnimation);

        //await  maybe we can set a wait time in the middle of the end-start 
        //of the animation :D

        await YaSlider.waitForSeconds(this._config.startEndAnimationTime);

        if(this._config.autoAnimation)
            this.RestartIdleAnimation();
        this.setAnimationClass(AnimationState.IdleAnimation);
    }

    public SlideRight(){
        this.Slide(1);
    }
    public SlideLeft(){
        this.Slide(-1);
    }

    public SetSpeedValues(changeTime:number, startEndAnimationTime: number){
        this._config.changeTime = changeTime;
        this._config.startEndAnimationTime = startEndAnimationTime;
        this._containerNode.style.setProperty(
            "--animation-time",changeTime.toString()+'s');
        this._containerNode.style.setProperty(
            "--end-animation-time",startEndAnimationTime.toString()+'s');

        return this;
    }
    public SetAmountOfElements(amount: number){
        this._config.amountElements=amount;
        return this; 
    }
    public SetAutoAnimationOff(){
        clearInterval(this._intervalAnimationId)
        this.setSlowMovementOffset("0px")
        this._config.autoAnimation = false;
        return this;
    }
    public ToogleAutoAnimation(){
        if(this._config.autoAnimation)
            this.SetAutoAnimationOff();
        else{ 
            this.Slide(this._currentAnimationDirection);
            this.BeginIdleAnimation();
        }
    }
    public SetAutoAnimation (ok:boolean) {
        if(!ok){
            this.SetAutoAnimationOff();
        }else{
            this.RestartIdleAnimation();
        }
        return this;
    }

    public SetSlowMovementOffset(offset: string){
        this._config.slowMovementOffset = offset;
        this.setSlowMovementOffset(offset)
        return this;
    }
    private setSlowMovementOffset(offset: string){
        this._containerNode.style.setProperty("--animation-offset",offset);
    }


    public SetSpecificAnimation(animationName:string){
        this._config.animation=animationName;
        this.setSpecificAnimationCSS();
        return this;
    }
    private setSpecificAnimationCSS(){
        this._containerNode.style.setProperty(
            "--slider-idleanimation",
            "slider-idleanimation-"+this._config.animation);
        this._containerNode.style.setProperty(
            "--slider-startanimation",
            "slider-startanimation-"+this._config.animation);
        this._containerNode.style.setProperty(
            "--slider-endanimation",
            "slider-endanimation-"+this._config.animation);
    }


    public SetAnimationToEveryItem(ok: boolean){
       if(ok){
            this.removeAllAnimations(this._containerNode);
       } else {
            this._elements.forEach(
                (item)=>this.removeAllAnimations(item as HTMLElement))
       }
       this._config.animEveryItem = ok;
       return this;
    }

    private setAnimationClassToNode(node: HTMLElement,animation: AnimationState){
        if (!node.classList.replace(
                this._currentAnimation,animation
        )){ node.classList.add(animation); }
    }

    private removeAllAnimations(node: HTMLElement){
        node.classList.remove(AnimationState.EndAnimation,
                                             AnimationState.StartAnimation,
                                             AnimationState.IdleAnimation) 
    }

    private setAnimationClassToItems(animation: AnimationState){
        for( let i=0;i< this._currentElements.length;i++){
            this.setAnimationClassToNode(this._currentElements[i] as HTMLElement,
                                   animation);
        }
    }

    private setAnimationClass(animation: AnimationState){
        if(this._config.animEveryItem){
            this.setAnimationClassToItems(animation);
        } else {
            this.setAnimationClassToNode(this._containerNode, animation);
        }

        this._currentAnimation = animation;
    }



    private static waitForSeconds(seconds: number){
        return new Promise(
            (resolve)=>setTimeout(resolve,seconds*1000)
        );
    }
}

const AddYasToID = (
    id: string,
    config: Partial<YasConfig> | undefined = undefined
):YaSlider | null => {

    const node = document.getElementById(id);
    if (node === null){
        console.error(`Node with id ${id} not found!`)
        return null
    }
    return AddYasToHTMLElement(node, config);
}

const AddYasToHTMLElement = (
    node: HTMLElement,
    config: Partial<YasConfig> | undefined = undefined
):YaSlider => new YaSlider(node, config);




export {
    AddYasToID,
    AddYasToHTMLElement,
    YaSlider
}
